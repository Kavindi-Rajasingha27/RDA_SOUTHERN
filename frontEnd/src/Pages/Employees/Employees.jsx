import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import * as Yup from "yup";
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

const API_BASE_URL = "http://127.0.0.1:8000/api";

const validationSchema = Yup.object().shape({
  employee_number: Yup.string()
    .typeError("Employee ID must be a string")
    .required("Employee ID is required"),
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name must only contain letters")
    .required("Name is required"),
  contact_details: Yup.string()
    .matches(/^\d{1,10}$/, "Mobile number must be at most 10 digits")
    .required("Mobile number is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .max(100, "Age must be at most 100")
    .required("Age is required"),
  birthday: Yup.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Must be at least 18 years old"
    )
    .required("Birthday is required"),
  address: Yup.string().required("address is required"),
  designation: Yup.string().required("Designation is required"),
  join_date: Yup.date().required("Join date is required"),
  etf_number: Yup.string().required("ETF number is required"),
  dependents: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required("Dependent name is required")
        .matches(/^[A-Za-z\s]+$/, "Name must only contain letters"),
      relationship: Yup.string()
        .required("Relationship is required")
        .matches(/^[A-Za-z\s]+$/, "Name must only contain letters"),
      birth_date: Yup.date().required("Birth date is required"),
    })
  ),

  qualifications: Yup.array().of(
    Yup.object().shape({
      qualification_name: Yup.string().required(
        "Qualification name is required"
      ),
      institute: Yup.string().required("Institute is required"),
      obtained_date: Yup.date().required("Obtained date is required"),
    })
  ),
});

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/employees`,
          axiosConfig
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleRemoveDependent = async (
    employeeId,
    dependentId,
    index,
    remove
  ) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/employees/${employeeId}/dependents/${dependentId}`,
        axiosConfig
      );
      const updatedEmployee = (
        await axios.get(`${API_BASE_URL}/employees/${employeeId}`, axiosConfig)
      ).data;
      setEmployees(
        employees.map((employee) =>
          employee.id === employeeId ? updatedEmployee : employee
        )
      );
      setSelectedEmployee(updatedEmployee);
    } catch (error) {
      console.error("Error removing dependent:", error);
    }
  };

  const handleRemoveQualification = async (employeeId, qualificationId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/employees/${employeeId}/qualifications/${qualificationId}`,
        axiosConfig
      );
      const updatedEmployee = (
        await axios.get(`${API_BASE_URL}/employees/${employeeId}`, axiosConfig)
      ).data;
      setEmployees(
        employees.map((employee) =>
          employee.id === employeeId ? updatedEmployee : employee
        )
      );
      setSelectedEmployee(updatedEmployee);
    } catch (error) {
      console.error("Error removing qualification:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setTabIndex(0);
  };

  const handleDelete = async (id) => {
    try {
      // Firstshow a confirmatoin dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FFC107",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      // If the user confirms the deletion
      if (result.isConfirmed) {
        await axios.delete(`${API_BASE_URL}/employees/${id}`, axiosConfig);
        setEmployees(employees.filter((employee) => employee.id !== id));

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#FFC107",
        });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      // Show error message
      Swal.fire({
        title: "Error!",
        text: "Failed to delete user. Please try again",
        icon: "error",
        confirmButtonColor: "#FFC107",
      });
    }
  };

  const handleAddEmployee = async (values) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/employees`,
        values,
        axiosConfig
      );
      const newEmployee = response.data;

      await Promise.all([
        ...values.dependents.map((dependent) =>
          axios.post(
            `${API_BASE_URL}/employees/${newEmployee.id}/dependents`,
            dependent,
            axiosConfig
          )
        ),
        ...values.qualifications.map((qualification) =>
          axios.post(
            `${API_BASE_URL}/employees/${newEmployee.id}/qualifications`,
            qualification,
            axiosConfig
          )
        ),
      ]);

      setEmployees((prev) => [...prev, newEmployee]);
      handleClose();

      //success alert
      Swal.fire({
        title: "Success!",
        text: "User added successfully",
        icon: "success",
        confirmButtonColor: "#FFC107",
      });
    } catch (error) {
      console.error("Error adding employee:", error);

      //error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to add user. Please try again",
        icon: "error",
        confirmButtonColor: "#FFC107",
      });
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    handleOpen();
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  //   try {
  //     const response = await axios.put(
  //       `${API_BASE_URL}/employees/${selectedEmployee.id}`,
  //       values,
  //       axiosConfig
  //     );

  //     await Promise.all([
  //       ...values.dependents.map((dependent) =>
  //         dependent.id
  //           ? axios.put(
  //               `${API_BASE_URL}/employees/${selectedEmployee.id}/dependents/${dependent.id}`,
  //               dependent,
  //               axiosConfig
  //             )
  //           : axios.post(
  //               `${API_BASE_URL}/employees/${selectedEmployee.id}/dependents`,
  //               dependent,
  //               axiosConfig
  //             )
  //       ),
  //       ...values.qualifications.map((qualification) =>
  //         qualification.id
  //           ? axios.put(
  //               `${API_BASE_URL}/employees/${selectedEmployee.id}/qualifications/${qualification.id}`,
  //               qualification,
  //               axiosConfig
  //             )
  //           : axios.post(
  //               `${API_BASE_URL}/employees/${selectedEmployee.id}/qualifications`,
  //               qualification,
  //               axiosConfig
  //             )
  //       ),
  //     ]);

  //     setEmployees(
  //       employees.map((employee) =>
  //         employee.id === selectedEmployee.id ? response.data : employee
  //       )
  //     );
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error updating employee:", error);
  //   }
  // };

  const handleUpdateEmployee = async (values) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/employees/${selectedEmployee.id}`,
        values,
        axiosConfig
      );

      await Promise.all([
        ...values.dependents.map((dependent) =>
          dependent.id
            ? axios.put(
                `${API_BASE_URL}/employees/${selectedEmployee.id}/dependents/${dependent.id}`,
                dependent,
                axiosConfig
              )
            : axios.post(
                `${API_BASE_URL}/employees/${selectedEmployee.id}/dependents`,
                dependent,
                axiosConfig
              )
        ),
        ...values.qualifications.map((qualification) =>
          qualification.id
            ? axios.put(
                `${API_BASE_URL}/employees/${selectedEmployee.id}/qualifications/${qualification.id}`,
                qualification,
                axiosConfig
              )
            : axios.post(
                `${API_BASE_URL}/employees/${selectedEmployee.id}/qualifications`,
                qualification,
                axiosConfig
              )
        ),
      ]);

      const updatedEmployee = (
        await axios.get(
          `${API_BASE_URL}/employees/${selectedEmployee.id}`,
          axiosConfig
        )
      ).data;

      setEmployees(
        employees.map((employee) =>
          employee.id === selectedEmployee.id ? updatedEmployee : employee
        )
      );
      setSelectedEmployee(updatedEmployee);

      Swal.fire({
        title: "Success!",
        text: "User update successfully",
        icon: "success",
        confirmButtonColor: "#FFC107",
      });
    } catch (error) {
      console.error("Error updating employee:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to update user. Please try again",
        icon: "error",
        confirmButtonColor: "#FFC107",
      });
    }
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
        Employee Management
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
                Mobile No/ Email
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
                <TableCell>{employee.employee_number}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.contact_details}</TableCell>
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
            enableReinitialize
            initialValues={
              selectedEmployee || {
                id: "",
                employee_number: "",
                name: "",
                contact_details: "",
                address: "",
                designation: "",
                age: "",
                birthday: "",
                corporate_title: "",
                join_date: "",
                etf_number: "",
                dependents: [],
                qualifications: [],
              }
            }
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                if (selectedEmployee) {
                  await handleUpdateEmployee(values);
                } else {
                  await handleAddEmployee(values);
                }
                resetForm();
                handleClose();
              } catch (error) {
                console.error("Error submitting form:", error);
              }
            }}
          >
            {({ values, errors, touched, handleSubmit }) => (
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
                        name="employee_number"
                        as={TextField}
                        label="Emp ID"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={
                          touched.employee_number && errors.employee_number
                        }
                        helperText={
                          touched.employee_number && errors.employee_number
                        }
                      />
                      <Field
                        name="name"
                        as={TextField}
                        label="Name"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name}
                      />
                      <Field
                        name="contact_details"
                        as={TextField}
                        label="Mobile No/ Email"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={
                          touched.contact_details && errors.contact_details
                        }
                        helperText={
                          touched.contact_details && errors.contact_details
                        }
                      />
                      <Field
                        name="address"
                        as={TextField}
                        label="Address"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={touched.address && errors.address}
                        helperText={touched.address && errors.address}
                      />
                      <Field
                        name="designation"
                        as={TextField}
                        label="Designation"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={touched.designation && errors.designation}
                        helperText={touched.designation && errors.designation}
                      />
                      <Field
                        name="age"
                        as={TextField}
                        label="Age"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={touched.age && errors.age}
                        helperText={touched.age && errors.age}
                      />
                      <Field
                        name="birthday"
                        as={TextField}
                        label="Birthday"
                        fullWidth
                        sx={{ mb: 2 }}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={touched.birthday && errors.birthday}
                        helperText={touched.birthday && errors.birthday}
                      />
                      <Field
                        name="corporate_title"
                        as={TextField}
                        label="Corporate Title"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={
                          touched.corporate_title && errors.corporate_title
                        }
                        helperText={
                          touched.corporate_title && errors.corporate_title
                        }
                      />
                      <Field
                        name="join_date"
                        as={TextField}
                        label="Join Date"
                        fullWidth
                        sx={{ mb: 2 }}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={touched.join_date && errors.join_date}
                        helperText={touched.join_date && errors.join_date}
                      />
                      <Field
                        name="etf_number"
                        as={TextField}
                        label="ETF Number"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={touched.etf_number && errors.etf_number}
                        helperText={touched.etf_number && errors.etf_number}
                      />
                    </Box>
                  )}
                  {tabIndex === 1 && (
                    <Box sx={tabContentStyle}>
                      <FieldArray name="dependents">
                        {({ push, remove }) => (
                          <>
                            {values.dependents.map((dependentItem, index) => (
                              <Box key={index} sx={{ mb: 2 }}>
                                <Field
                                  name={`dependents.${index}.name`}
                                  as={TextField}
                                  label="Name"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                  error={
                                    touched.dependents?.[index]?.name &&
                                    errors.dependents?.[index]?.name
                                  }
                                  helperText={
                                    touched.dependents?.[index]?.name &&
                                    errors.dependents?.[index]?.name
                                  }
                                />
                                <Field
                                  name={`dependents.${index}.relationship`}
                                  as={TextField}
                                  label="Relationship"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                  error={
                                    touched.dependents?.[index]?.relationship &&
                                    errors.dependents?.[index]?.relationship
                                  }
                                  helperText={
                                    touched.dependents?.[index]?.relationship &&
                                    errors.dependents?.[index]?.relationship
                                  }
                                />
                                <Field
                                  name={`dependents.${index}.birth_date`}
                                  as={TextField}
                                  label="Birthdate"
                                  type="date"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    touched.dependents?.[index]?.birth_date &&
                                    errors.dependents?.[index]?.birth_date
                                  }
                                  helperText={
                                    touched.dependents?.[index]?.birth_date &&
                                    errors.dependents?.[index]?.birth_date
                                  }
                                />
                                <Button
                                  onClick={async () => {
                                    if (
                                      selectedEmployee &&
                                      values.dependents[index].id
                                    ) {
                                      await handleRemoveDependent(
                                        selectedEmployee.id,
                                        values.dependents[index].id,
                                        index,
                                        remove
                                      );
                                    } else {
                                      remove(index);
                                    }
                                  }}
                                >
                                  Remove
                                </Button>
                              </Box>
                            ))}
                            <Button
                              onClick={() =>
                                push({
                                  name: "",
                                  relationship: "",
                                  birth_date: "",
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
                                  name={`qualifications.${index}.qualification_name`}
                                  as={TextField}
                                  label="Qualification Name"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                  error={
                                    touched.qualifications?.[index]
                                      ?.qualification_name &&
                                    errors.qualifications?.[index]
                                      ?.qualification_name
                                  }
                                  helperText={
                                    touched.qualifications?.[index]
                                      ?.qualification_name &&
                                    errors.qualifications?.[index]
                                      ?.qualification_name
                                  }
                                />
                                <Field
                                  name={`qualifications.${index}.institute`}
                                  as={TextField}
                                  label="Institute"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                  error={
                                    touched.qualifications?.[index]
                                      ?.institute &&
                                    errors.qualifications?.[index]?.institute
                                  }
                                  helperText={
                                    touched.qualifications?.[index]
                                      ?.institute &&
                                    errors.qualifications?.[index]?.institute
                                  }
                                />
                                <Field
                                  name={`qualifications.${index}.obtained_date`}
                                  as={TextField}
                                  label="Obtained Date"
                                  type="date"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  error={
                                    touched.qualifications?.[index]
                                      ?.obtained_date &&
                                    errors.qualifications?.[index]
                                      ?.obtained_date
                                  }
                                  helperText={
                                    touched.qualifications?.[index]
                                      ?.obtained_date &&
                                    errors.qualifications?.[index]
                                      ?.obtained_date
                                  }
                                />
                                <Button
                                  onClick={() => {
                                    if (
                                      selectedEmployee &&
                                      values.qualifications[index].id
                                    ) {
                                      handleRemoveQualification(
                                        selectedEmployee.id,
                                        values.qualifications[index].id
                                      );
                                    }
                                    remove(index);
                                  }}
                                >
                                  Remove
                                </Button>
                              </Box>
                            ))}
                            <Button
                              onClick={() =>
                                push({
                                  qualification_name: "",
                                  institute: "",
                                  obtained_date: "",
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