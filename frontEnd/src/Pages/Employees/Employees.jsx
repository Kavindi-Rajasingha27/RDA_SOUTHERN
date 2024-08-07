import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Typography,
  Modal,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Form, Field, FieldArray } from "formik";

const Employees = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      mobile: "123-456-7890",
      address: "123 Main St, New York, NY",
      designation: "Engineer",
      age: 30,
      birthday: "1994-05-21",
      corporateTitle: "Senior Engineer",
      joinDate: "2018-07-16",
      etfNumber: "ET123456",
      dependents: [
        { name: "Jane Doe", relationship: "Spouse", birthdate: "1990-02-11" },
      ],
      qualifications: [
        {
          qualificationName: "B.Sc. Engineering",
          institute: "MIT",
          obtainedDate: "2016-05-10",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      mobile: "987-654-3210",
      address: "456 Elm St, San Francisco, CA",
      designation: "Marketing Manager",
      age: 28,
      birthday: "1996-08-15",
      corporateTitle: "Marketing Director",
      joinDate: "2020-09-23",
      etfNumber: "ET654321",
      dependents: [
        { name: "John Smith", relationship: "Spouse", birthdate: "1992-06-25" },
      ],
      qualifications: [
        {
          qualificationName: "MBA",
          institute: "Harvard",
          obtainedDate: "2018-09-15",
        },
      ],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setTabIndex(0);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const handleAddEmployee = (values) => {
    setEmployees([...employees, values]);
    handleClose();
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    handleOpen();
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    display: "flex",
    flexDirection: "column",
    maxHeight: "95vh",
    overflow: "hidden",
  };

  const tabsStyle = {
    borderBottom: 1,
    borderColor: "divider",
    marginBottom: 2,
  };

  const tabContentStyle = {
    padding: 3,
  };

  return (
    <>
      <br></br>
      <Typography
        variant="h6"
        component="div"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "black",
          marginBottom: 2,
        }}
      >
        Employees Management
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ margin: "auto", width: "80%", padding: 2, borderRadius: 2 }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 2 }}>
          <Button
            sx={{
              backgroundColor: "#FFC107",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#FFC107",
              },
            }}
            variant="contained"
            onClick={handleOpen}
          >
            Add Employee
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
              >
                Emp No
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
              >
                Mobile No
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
              >
                Address
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
              >
                Designation
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
              >
                More
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#FFC107", fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.mobile}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>
                  <Button
                    sx={{
                      backgroundColor: "#FFC107",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                      },
                    }}
                    variant="contained"
                    onClick={() => handleView(employee)}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(employee.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", marginBottom: -1 }}
          >
            {selectedEmployee ? "View Employee" : "Add Employee"}
          </Typography>
          <Formik
            initialValues={
              selectedEmployee || {
                id: "",
                name: "",
                mobile: "",
                address: "",
                designation: "",
                age: "",
                birthday: "",
                corporateTitle: "",
                joinDate: "",
                etfNumber: "",
                dependents: [{ name: "", relationship: "", birthdate: "" }],
                qualifications: [
                  { qualificationName: "", institute: "", obtainedDate: "" },
                ],
              }
            }
            onSubmit={(values, { resetForm }) => {
              if (selectedEmployee) {
                setEmployees(
                  employees.map((employee) =>
                    employee.id === selectedEmployee.id ? values : employee
                  )
                );
              } else {
                handleAddEmployee(values);
              }
              resetForm();
              handleClose();
            }}
          >
            {({ values, handleSubmit }) => (
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  aria-label="employee details tabs"
                  sx={tabsStyle}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Employee Details" />
                  <Tab label="Dependents" />
                  <Tab label="Qualifications" />
                </Tabs>
                <Box sx={{ flex: 1, overflowY: "auto", mt: 1, pr: 2 }}>
                  {tabIndex === 0 && (
                    <Box sx={tabContentStyle}>
                      <Field
                        name="id"
                        as={TextField}
                        label="Emp ID"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Field
                        name="name"
                        as={TextField}
                        label="Name"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Field
                        name="mobile"
                        as={TextField}
                        label="Mobile No"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Field
                        name="address"
                        as={TextField}
                        label="Address"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Field
                        name="designation"
                        as={TextField}
                        label="Designation"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Field
                        name="age"
                        as={TextField}
                        label="Age"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Field
                        name="birthday"
                        as={TextField}
                        label="Birthday"
                        fullWidth
                        sx={{ mb: 2 }}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                      <Field
                        name="corporateTitle"
                        as={TextField}
                        label="Corporate Title"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Field
                        name="joinDate"
                        as={TextField}
                        label="Join Date"
                        fullWidth
                        sx={{ mb: 2 }}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                      />
                      <Field
                        name="etfNumber"
                        as={TextField}
                        label="ETF Number"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}
                  {tabIndex === 1 && (
                    <Box sx={tabContentStyle}>
                      <FieldArray name="dependents">
                        {({ push, remove }) => (
                          <>
                            {values.dependents.map((_, index) => (
                              <Box key={index} sx={{ mb: 2 }}>
                                <Field
                                  name={`dependents.${index}.name`}
                                  as={TextField}
                                  label="Name"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                />
                                <Field
                                  name={`dependents.${index}.relationship`}
                                  as={TextField}
                                  label="Relationship"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                />
                                <Field
                                  name={`dependents.${index}.birthdate`}
                                  as={TextField}
                                  label="Birthdate"
                                  type="date"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                                <Button onClick={() => remove(index)}>
                                  Remove
                                </Button>
                              </Box>
                            ))}
                            <Button
                              onClick={() =>
                                push({
                                  name: "",
                                  relationship: "",
                                  birthdate: "",
                                })
                              }
                            >
                              Add Dependent
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </Box>
                  )}
                  {tabIndex === 2 && (
                    <Box sx={tabContentStyle}>
                      <FieldArray name="qualifications">
                        {({ push, remove }) => (
                          <>
                            {values.qualifications.map((_, index) => (
                              <Box key={index} sx={{ mb: 2 }}>
                                <Field
                                  name={`qualifications.${index}.qualificationName`}
                                  as={TextField}
                                  label="Qualification Name"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                />
                                <Field
                                  name={`qualifications.${index}.institute`}
                                  as={TextField}
                                  label="Institute"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                />
                                <Field
                                  name={`qualifications.${index}.obtainedDate`}
                                  as={TextField}
                                  label="Obtained Date"
                                  type="date"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                                <Button onClick={() => remove(index)}>
                                  Remove
                                </Button>
                              </Box>
                            ))}
                            <Button
                              onClick={() =>
                                push({
                                  qualificationName: "",
                                  institute: "",
                                  obtainedDate: "",
                                })
                              }
                            >
                              Add Qualification
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#FFC107",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                      },
                    }}
                  >
                    {selectedEmployee ? "Update Employee" : "Add Employee"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default Employees;
