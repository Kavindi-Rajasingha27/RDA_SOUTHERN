import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewIcon from "@mui/icons-material/Preview";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { GeneratePDF } from "../../Components/PDFFormModal/GeneratePDF";
import PDFFormModal from "../../Components/PDFFormModal/PDFFormModal";
import TilePage from "../../Components/TilePage/TilePage";
import "./Estimate.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const Estimate = () => {
  const [estimates, setEstimates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const roleStatusToFilter = {
    AE: "pending",
    CE: "level1",
    ACC: "level2",
  };

  const roleStatusToUpdate = {
    AE: "level1",
    CE: "level2",
    ACC: "level3",
  };

  const role_id = localStorage.getItem("role_id");

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/estimates`,
          axiosConfig
        );

        const data = response.data;

        const filteredByStatus = data.filter(
          (item) => item.status === roleStatusToFilter[role_id]
        );

        setEstimates(filteredByStatus);
      } catch (error) {
        toast.error("Error fetching estimate.", {
          position: "top-right",
        });
        console.error("Error fetching estimates:", error);
      }
    };

    fetchEstimates();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to delete the estimate?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
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
        toast.info("Ok, Try again latter !", {
          position: "top-right",
        });
        // If the user cancels, exit the function
        return;
      }

      await axios.delete(`${API_BASE_URL}/estimates/${id}`, axiosConfig);
      setEstimates(estimates.filter((estimate) => estimate.id !== id));
    } catch (error) {
      toast.error("Error deleting estimate.", {
        position: "top-right",
      });
      console.error("Error deleting estimate:", error);
    }
  };

  async function handleFileUpload(estimateId) {
    try {
      const formData = new FormData();

      const status = roleStatusToUpdate[role_id];

      if (status) {
        formData.append("status", status);
      }

      const fileInput = document.createElement("input");
      fileInput.type = "file";

      fileInput.onchange = async (event) => {
        const document = event.target.files[0];

        if (document) {
          formData.append("document", document);
        }

        try {
          const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to upload a new file and update the estimate?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
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
            `${API_BASE_URL}/estimates/update-status/${estimateId}`,
            formData,
            axiosConfig
          );
          if (response.status === 200) {
            if (role_id === "ACC") {
              setEstimates((prevEstimates) =>
                prevEstimates.map((estimate) =>
                  estimate.id === estimateId
                    ? { ...estimate, status: "level3" }
                    : estimate
                )
              );
            } else {
              setEstimates((prevEstimates) =>
                prevEstimates.filter((estimate) => estimate.id !== estimateId)
              );
            }
            console.log("EstimatesEstimates", estimates);

            toast.success("Estimate updated successfully!", {
              position: "top-right",
            });
          }
        } catch (error) {
          toast.error("Failed to update estimate.", {
            position: "top-right",
          });
          console.error("Error response:", error.response);
          if (error.response) {
            console.error("Server response:", error.response.data);
            console.error("Status code:", error.response.status);
          } else {
            console.error("Error message:", error.message);
          }
        }
      };

      fileInput.click();
    } catch (error) {
      console.error("Error in file upload process:", error);
      toast.error("An unexpected error occurred.", {
        position: "top-right",
      });
    }
  }

  async function handlePreview(estimateId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/estimates/${estimateId}/document`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.data.text();
        const errorJson = JSON.parse(errorData);
        toast.error(`Error: ${errorJson.message}`, {
          position: "top-right",
        });
        return;
      }

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );

      window.open(fileURL);
    } catch (error) {
      toast.error("Error downloading document.", {
        position: "top-right",
      });
      console.error("Error downloading document:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        toast.error("Failed to download document.", {
          position: "top-right",
        });
      } else {
        toast.error("An unexpected error occurred.", {
          position: "top-right",
        });
      }
    }
  }

  const handlePDFGenerate = (roadName, roadType, estId) => {
    setSelectedEstimate({ roadName, roadType, estId });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleGeneratePDF = async (
    roadName,
    roadType,
    estId,
    myNo,
    region,
    regionalEngineer,
    officerInCharge,
    recipientName,
    recipientAddress,
    paidDate
  ) => {
    console.log("roadType", roadType);

    await GeneratePDF(
      roadName,
      roadType,
      estId,
      myNo,
      region,
      regionalEngineer,
      officerInCharge,
      recipientName,
      recipientAddress,
      paidDate
    );
  };

  return (
    <>
      <div className="estimate-page">
        <TilePage
          title={"Apply for Water Supply"}
          linkName1={"Estimate"}
          linkName2={"Estimated Routes"}
          link1={"/estimator"}
          link2={"/estimated-routes"}
        />

        <TableContainer
          component={Paper}
          sx={{
            margin: "20px",
            width: "auto",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
                >
                  Est ID
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
                >
                  Distance
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
                >
                  Rate
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
                >
                  Estimated Cost
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#FFC107",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Upload Approval
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#FFC107",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell>{estimate.id}</TableCell>
                  <TableCell>{estimate.name}</TableCell>
                  <TableCell>{estimate.type}</TableCell>
                  <TableCell>{estimate.distance} m</TableCell>
                  <TableCell>RS. {estimate.rate}</TableCell>
                  <TableCell>RS. {estimate.estimate}</TableCell>
                  <TableCell
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {estimate.status}{" "}
                    {estimate.status !== "pending" && "approved"}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <IconButton onClick={() => handleFileUpload(estimate.id)}>
                      <UploadFileIcon />
                    </IconButton>
                    {role_id !== "AE" && (
                      <IconButton onClick={() => handlePreview(estimate.id)}>
                        <PreviewIcon />
                      </IconButton>
                    )}
                    {role_id === "ACC" && (
                      <IconButton
                        onClick={() =>
                          handlePDFGenerate(
                            estimate.name,
                            estimate.type,
                            estimate.id
                          )
                        }
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <IconButton onClick={() => handleDelete(estimate.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {console.log("selectedEstimate", selectedEstimate)}
      {selectedEstimate && (
        <PDFFormModal
          estId={selectedEstimate.estId}
          open={isModalOpen}
          onClose={handleModalClose}
          onSubmit={(formData) => {
            handleGeneratePDF(
              selectedEstimate.roadName,
              selectedEstimate.roadType,
              selectedEstimate.estId,
              formData.myNo,
              formData.region,
              formData.regionalEngineer,
              formData.officerInCharge,
              formData.recipientName,
              formData.recipientAddress,
              formData.paidDate
            );
            handleModalClose();
          }}
        />
      )}
    </>
  );
};

export default Estimate;
