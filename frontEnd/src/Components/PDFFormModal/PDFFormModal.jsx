import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const PDFFormModal = ({ estId, open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    myNo: `DPA/MASANAA/EL/${estId}/${new Date().toLocaleDateString("en-GB")}`,
    region: "",
    regionalEngineer: "",
    officerInCharge: "",
    recipientName: "",
    recipientAddress: "",
    paidDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    // Convert paidDate string to Date object if necessary
    const { paidDate, ...rest } = formData;
    const formattedPaidDate = paidDate ? new Date(paidDate) : new Date();

    onSubmit({
      ...rest,
      paidDate: formattedPaidDate,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Generate PDF</DialogTitle>
      <DialogContent>
        <TextField
          label="My Number"
          name="myNo"
          value={formData.myNo}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Region"
          name="region"
          value={formData.region}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Regional Engineer"
          name="regionalEngineer"
          value={formData.regionalEngineer}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Officer In Charge"
          name="officerInCharge"
          value={formData.officerInCharge}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Recipient Name"
          name="recipientName"
          value={formData.recipientName}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Recipient Address"
          name="recipientAddress"
          value={formData.recipientAddress}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Paid Date"
          name="paidDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.paidDate}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions style={{ padding: "10px 25px 20px 10px" }}>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#FFC10705",
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
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
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PDFFormModal;
