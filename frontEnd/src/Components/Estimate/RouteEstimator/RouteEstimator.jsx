import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const RoutingControl = ({ routes, onSelectRoute }) => {
  const map = useMap();
  const routingControlsRef = useRef([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    // Clean up previous routing controls and markers
    routingControlsRef.current.forEach((control) =>
      control
        ?.getPlan()
        .getWaypoints()
        .forEach(
          (waypoint) => waypoint.latLng && map.removeLayer(waypoint.latLng)
        )
    );
    routingControlsRef.current.forEach((control) => map.removeControl(control));
    routingControlsRef.current = [];

    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

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
      marker.getElement().style.cursor = "pointer";
      //  marker.on("click", () => {
      //    if (
      //      window.confirm(
      //        `Do you want to delete the route "${
      //          route.name || "Unnamed Route"
      //        }"?`
      //      )
      //    ) {
      //      onDeleteRoute(route.id); // Call the parent component's function to handle deletion
      //    }
      //  });

      routingControlsRef.current.push(routingControl);
      markersRef.current.push(marker);
    });

    return () => {
      routingControlsRef.current.forEach((control) =>
        control
          ?.getPlan()
          .getWaypoints()
          .forEach(
            (waypoint) => waypoint.latLng && map.removeLayer(waypoint.latLng)
          )
      );
      routingControlsRef.current.forEach((control) =>
        map.removeControl(control)
      );
      routingControlsRef.current = [];

      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];
    };
  }, [routes]);

  return null;
};

const RouteEstimator = ({ center, zoom }) => {
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState("");
  const [rate, setRate] = useState(0);
  const [area, setArea] = useState(0);
  const [amount, setAmount] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [open, setOpen] = useState(false);
  const featureGroupRef = useRef(null);

  const roadRates = useMemo(
    () => ({
      CONCRETE: 50,
      CARPET: 30,
      THARA: 20,
      GRANITE: 40,
    }),
    []
  );

  const MapEventHandler = () => {
    const map = useMapEvent("click", (e) => {
      if (!startPoint) {
        setStartPoint(e.latlng);
      } else if (!endPoint) {
        setEndPoint(e.latlng);
        addRoute(map, startPoint, e.latlng);
      } else {
        setStartPoint(e.latlng);
        setEndPoint(null);
      }
    });
    return null;
  };

  const addRoute = async (map, start, end) => {
    if (start && end) {
      const routeName = prompt("Enter a name for this route:");
      if (routeName) {
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng),
          ],
          createMarker: () => null,
        }).addTo(map);

        routingControl.on("routesfound", async function (e) {
          const routes = e.routes;
          const summary = routes[0].summary;
          const routeData = {
            name: routeName,
            start: start,
            end: end,
            distance: summary.totalDistance,
            time: summary.totalTime,
            type: selectedRoad,
            rate: rate,
            estimate: summary.totalDistance * rate,
            waypoints: routes[0].waypoints.map((wp) => ({
              lat: wp.latLng.lat,
              lng: wp.latLng.lng,
            })),
          };

          setRouteData(routeData);
          handleClick(summary.totalDistance);
          // saveEstimate(routeData);
          setOpen(false);
        });
      }
    }
  };

  const saveEstimate = async (routeData) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit the estimate?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Submit it!",
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

      const response = await axios.post(
        `${API_BASE_URL}/save-estimate`,
        routeData,
        axiosConfig
      );

      if (response.status === 201) {
        const savedRoute = response.data;
        setRoutes((prevRoutes) => [...prevRoutes, savedRoute]);
        toast.success("Estimate updated successfully!", {
          position: "top-right",
        });
      } else {
        toast.error("Error saving the route. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error saving the route:", error);
      toast.error("Error saving the route. Please try again.", {
        position: "top-right",
      });
    }
  };

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

  const handleRoadChange = (e) => {
    const roadType = e.target.value;
    setSelectedRoad(roadType);
    setRate(roadRates[roadType]);
    setAmount(area * roadRates[roadType]);
    selectedRoad == "" && setOpen(true);
  };

  const handleClick = (routeDistance) => {
    setArea(routeDistance);
    setAmount(routeDistance * rate);
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

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reset?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reset it!",
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
    setStartPoint(null);
    setEndPoint(null);
    setSelectedRoad("");
    setRate(0);
    setArea(0);
    setAmount(0);
    // setRoutes([]);
    setRouteData(null);
    setSelectedArea(null);
    setOpen(false);
  };

  return (
    <Container
      maxWidth="none"
      sx={{ padding: 3, bgcolor: "#000000", height: "100vh" }}
    >
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#FFD700", fontWeight: 600 }}
        >
          Road Cost Estimator
        </Typography>
      </Box>
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ color: "#FFD700" }}
        >
          Select Road Type
        </Typography>
        <Select
          value={selectedRoad}
          onChange={handleRoadChange}
          fullWidth
          sx={{
            bgcolor: "#000000",
            color: "#FFD700",
            borderColor: "#FFD700",
            "& .MuiSelect-select": {
              bgcolor: "#000000",
              color: "#FFD700",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFD700",
            },
          }}
        >
          <MenuItem value="" sx={{ color: "#000000" }}>
            Select Road Type
          </MenuItem>
          <MenuItem value="CONCRETE">Concrete</MenuItem>
          <MenuItem value="CARPET">Carpet</MenuItem>
          <MenuItem value="THARA">Thara</MenuItem>
          <MenuItem value="GRANITE">Granite</MenuItem>
        </Select>
      </Box>
      <Box sx={{ marginBottom: 3, color: "#FFD700" }}>
        <Typography variant="body1" component="p">
          Estimated Area: {area} m
        </Typography>
        <Typography variant="body1" component="p">
          Estimated Amount: Rs. {amount}
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={() => saveEstimate(routeData)}
        sx={{
          bgcolor: "#FFD700",
          color: "#000000",
          "&:hover": {
            bgcolor: "#FFC107",
          },
          marginTop: 2,
        }}
      >
        Submit Estimate
      </Button>
      <Button
        variant="contained"
        onClick={handleReset}
        sx={{
          bgcolor: "#FF5722",
          color: "#FFFFFF",
          "&:hover": {
            bgcolor: "#E64A19",
          },
          marginTop: 2,
          marginLeft: 1,
        }}
      >
        Reset
      </Button>
      {/* <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "#FFD700",
          color: "#000000",
          "&:hover": {
            bgcolor: "#FFC107",
          },
          marginTop: 2,
          marginLeft: 1,
        }}
      >
        Open Map
      </Button> */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#000000", color: "#FFD700" }}>
          Map View
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          {selectedRoad && (
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: "60vh", width: "100%", cursor: "pointer" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapEventHandler />
              <RoutingControl routes={routes} onSelectRoute={handleClick} />
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
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              handleReset();
            }}
            sx={{
              backgroundColor: "#FFC107",
              border: "#FFC107 solid 1px",
              color: "black",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#FFC107",
                color: "black",
              },
            }}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RouteEstimator;
