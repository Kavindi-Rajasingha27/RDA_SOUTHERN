import axios from "axios";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { FeatureGroup, MapContainer, TileLayer, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

const API_BASE_URL = "http://127.0.0.1:8000/api";
// GeocoderControl component for searching places
const GeocoderControl = () => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.Geocoder.nominatim();
    const control = L.Control.geocoder({
      geocoder,
      defaultMarkGeocode: true,
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

// Custom hook to handle routing control
const RoutingControl = ({ routes, onDeleteRoute }) => {
  const map = useMap();
  const routingControlsRef = useRef([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    // Clean up previous routing controls
    routingControlsRef.current.forEach((control) => {
      if (control) {
        control
          .getPlan()
          .getWaypoints()
          .forEach((waypoint) => {
            if (waypoint.latLng && waypoint.latLng != null) {
              map.removeLayer(waypoint.latLng);
            }
          });
        map.removeControl(control);
      }
    });
    routingControlsRef.current = [];

    // Clean up previous markers
    markersRef.current.forEach((marker) => {
      if (marker && marker != null) {
        map.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add new routing controls and markers
    routes.forEach((route) => {
      const waypoints = route.waypoints.map((wp) => L.latLng(wp.lat, wp.lng));
      const routingControl = L.Routing.control({
        waypoints,
        createMarker: () => null,
        routeWhileDragging: false,
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      }).addTo(map);

      const startPoint = waypoints[0];
      const marker = L.marker(startPoint, {
        icon: L.divIcon({
          className: "route-label",
          html: `<div>${route.name || "Unnamed Route"}</div>`,
          iconSize: [100, 40],
        }),
      }).addTo(map);

      // Add click event listener to the label
      marker.on("click", () => {
        if (
          window.confirm(
            `Do you want to delete the route "${route.name || "Unnamed Route"
            }"?`
          )
        ) {
          onDeleteRoute(route.id); // Call the parent component's function to handle deletion
        }
      });

      routingControlsRef.current.push(routingControl);
      markersRef.current.push(marker);
      routingControlsRef.current.push(routingControl);
    });

    return () => {
      routingControlsRef.current.forEach((control) => {
        if (control) {
          control
            .getPlan()
            .getWaypoints()
            .forEach((waypoint) => {
              if (waypoint.latLng && waypoint.latLng != null) {
                map.removeLayer(waypoint.latLng);
              }
            });
          map.removeControl(control);
        }
      });
      routingControlsRef.current = [];

      markersRef.current.forEach((marker) => {
        if (marker && marker != null) {
          map.removeLayer(marker);
        }
      });
      markersRef.current = [];
    };
  }, [map, routes, onDeleteRoute]);

  return null;
};

const RoutesMap = ({ center, zoom }) => {
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [routes, setRoutes] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const featureGroupRef = useRef(null);

  useEffect(() => {
    const fetchRoutes = async (area) => {
      try {
        const query = area ? { area: JSON.stringify(area) } : {};
        const response = await axios.get(`${API_BASE_URL}/estimated-routes`, {
          ...axiosConfig,
          params: query,
        });

        const data = response.data;
        setRoutes(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
        toast.error("Error fetching routes. Please try again later.", {
          position: "top-right",
        });
      }
    };

    fetchRoutes(selectedArea);
  }, [selectedArea]);

  const handleDeleteRoute = async (routeId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, cancel!",
        width: "500px",
        customClass: {
          icon: "swal-icon",
          title: "swal-title",
          content: "swal-text",
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
      });

      if (!result.isConfirmed) {
        toast.info("Operation canceled.", {
          position: "top-right",
        });
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/estimated-routes/${routeId}`,
        axiosConfig
      );

      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.id !== routeId)
      );

      toast.success("Estimate deleted successfully!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Error deleting routes. Please try again later.", {
        position: "top-right",
      });
    }
  };

  const handleCreated = (e) => {
    const layer = e.layer;
    if (layer instanceof L.Polygon) {
      const area = layer
        .getLatLngs()[0]
        .map((latLng) => [latLng.lat, latLng.lng]);
      setSelectedArea(area);
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Geocoder Control for searching locations */}
      <GeocoderControl />

      {/* Routing Control to display routes */}
      <RoutingControl routes={routes} onDeleteRoute={handleDeleteRoute} />

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topleft"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default RoutesMap;
