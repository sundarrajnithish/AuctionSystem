// import React, { useState } from "react";
// import { ErrorMessage, Formik } from "formik";
// import {
//   Box,
//   Button,
//   Grid2,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";
// // import "./RegisterAuction.css";
// import * as Yup from "yup";
// import { Grid } from "@aws-amplify/ui-react";
// import Swal from "sweetalert2";
// import bgimage from "../Assets/Images/auctioncreate.webp";
// import AddIcon from "@mui/icons-material/Add";

// function RegisterAuction() {
//   const [imagePreview, setImagePreview] = useState(null);

//   const formSchema = Yup.object().shape({
//     auctionName: Yup.string()
//       .min(2, "Too Short!")
//       .max(70, "Too Long!")
//       .required("This field is required!"),
//     category: Yup.string().required("Please Provide atlease One Category"),
//     startingBid: Yup.number()
//       .min(0, "Bid Can't start at 0")
//       .required("Please Provide Starting Value for the bid"),
//     description: Yup.string()
//       .min(2, "Too Short!")
//       .max(1000, "Too long!")
//       .required("This field is required!"),
//     image: Yup.mixed()
//       .required("An image is required")
//       .test(
//         "fileFormat",
//         "Unsupported Format",
//         (value) =>
//           value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
//       ),
//   });

//   const initialValues = {
//     auctionName: "",
//     category: "",
//     startingBid: "",
//     description: "",
//     image: null,
//   };

//   const menuItems = [
//     { id: 1, field: "Electronics" },
//     { id: 1, field: "Furniture" },
//     { id: 1, field: "Art" },
//     { id: 1, field: "Fashion" },
//     { id: 1, field: "Collectibles" },
//   ];

//   //   const handleImageUpload = (e) => {
//   //     const file = e.target.files[0];
//   //     if (file) {
//   //       setImage(file);
//   //       setPreview(URL.createObjectURL(file));
//   //     }
//   //   };

//   const handleImageChange = (event, setFieldValue) => {
//     const file = event.target.files[0];
//     console.log(file);
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//       setFieldValue("image", file);
//     } else {
//       setImagePreview(null);
//       setFieldValue("image", null);
//     }
//   };

//   const handleCreateAuction = (value, setSubmitting, resetForm) => {
//     console.log(value);
//     Swal.fire({
//       title: "Success",
//       text: "Auction Created!",
//       icon: "success",
//       confirmButtonText: "Done",
//     });
//     setSubmitting(false);
//   };

//   return (
//     <Grid2
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         flexDirection: "row",
//         backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${bgimage})`,
//         boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
//         backdropFilter: "blur(10px)",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <Formik
//         initialValues={initialValues}
//         validationSchema={formSchema}
//         onSubmit={(values, { setSubmitting, resetForm }) => {
//           console.log(values);
//           handleCreateAuction(values, setSubmitting, resetForm);
//         }}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           isSubmitting,
//           setFieldValue,
//           /* and other goodies */
//         }) => (
//           <Grid2 marginBlock={1} margin={1} columns={12}>
//             <Box
//               sx={{
//                 display: "flex",
//                 height: "100vh",
//                 background: "rgba(255, 255, 255, 0.5)",
//                 boxShadow: 5,
//                 borderRadius: 2,
//                 padding: 2,
//                 margin: 2,
//               }}
//             >
//               <Grid2
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   "@media (min-width:600px)": {
//                     flexDirection: "column",
//                   },
//                   "@media (min-width:900px)": {
//                     flexDirection: "row",
//                   },
//                 }}
//                 columns={12}
//               >
//                 <Grid2
//                   container
//                   spacing={2}
//                   columns={6}
//                   marginBlock={2}
//                   sx={{
//                     alignItems: "center",
//                     justifyContent: "center",

//                     borderRadius: 5,
//                     margin: 2,
//                   }}
//                 >
//                   <Typography variant="h3" gutterBottom color="#000">
//                     Create Your Auction
//                   </Typography>
//                 </Grid2>

//                 <Grid2
//                   container
//                   spacing={2}
//                   columns={6}
//                   marginBlock={1}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <form onSubmit={handleSubmit}>
//                     <Grid2 size={6} marginBlock={2}>
//                       <TextField
//                         fullWidth
//                         required
//                         id="auctionName"
//                         color="dark"
//                         name="auctionName"
//                         label="Enter auction name"
//                         variant="filled"
//                         value={values.auctionName}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={errors.auctionName && touched.auctionName}
//                       />
//                       <ErrorMessage
//                         name="auctionName"
//                         render={(msg) => (
//                           <Typography color="error">{msg}</Typography>
//                         )}
//                       />
//                     </Grid2>
//                     <Grid2 size={6} marginBlock={2}>
//                       <TextField
//                         fullWidth
//                         required
//                         id="category"
//                         name="category"
//                         label="Category"
//                         color="dark"
//                         select
//                         variant="filled"
//                         value={values.category}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={errors.category && touched.category}
//                       >
//                         {menuItems.map((data) => (
//                           <MenuItem
//                             value={data.field}
//                             key={data.id}
//                             divider={true}
//                           >
//                             {data.field}
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                       <ErrorMessage
//                         name="category"
//                         render={(msg) => (
//                           <Typography color="error">{msg}</Typography>
//                         )}
//                       />
//                     </Grid2>
//                     <Grid2 size={6} marginBlock={2}>
//                       <TextField
//                         fullWidth
//                         required
//                         type="number"
//                         color="dark"
//                         id="startingBid"
//                         name="startingBid"
//                         label="Enter starting bid"
//                         variant="filled"
//                         value={values.startingBid}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={errors.startingBid && touched.startingBid}
//                       />
//                       <ErrorMessage
//                         name="startingBid"
//                         render={(msg) => (
//                           <Typography color="error">{msg}</Typography>
//                         )}
//                       />
//                     </Grid2>
//                     <Grid2 size={6} marginBlock={2}>
//                       <TextField
//                         fullWidth
//                         required
//                         id="description"
//                         color="dark"
//                         name="description"
//                         label="Describe the item"
//                         variant="filled"
//                         multiline
//                         value={values.description}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={errors.description && touched.description}
//                       />
//                       <ErrorMessage
//                         name="description"
//                         render={(msg) => (
//                           <Typography color="error">{msg}</Typography>
//                         )}
//                       />
//                     </Grid2>
//                     <Grid2 size={6} marginBlock={2}>
//                       <TextField
//                         fullWidth
//                         required
//                         type="file"
//                         name="image"
//                         id="Upload Image"
//                         label="Upload Image"
//                         variant="standard"
//                         accept="image/*"
//                         onChange={(event) => {
//                           handleImageChange(event, setFieldValue);
//                         }}
//                         error={errors.image || touched.image}
//                         sx={{ display: "none" }}
//                       />
//                       <label htmlFor="Upload Image">
//                         <Button
//                           variant="outlined"
//                           component="span"
//                           startIcon={<AddIcon />}
//                           color="dark"
//                         >
//                           {!imagePreview ? "Choose File" : imagePreview}
//                         </Button>
//                       </label>

//                       <Typography color="error">{errors.image}</Typography>

//                       {imagePreview && (
//                         <Grid>
//                           <h3>Image Preview:</h3>
//                           <img
//                             src={imagePreview}
//                             alt="Preview"
//                             style={{ width: "200px", height: "auto" }}
//                           />
//                         </Grid>
//                       )}
//                     </Grid2>
//                     <Grid2
//                       size={6}
//                       marginBlock={2}
//                       sx={{
//                         justifyContent: "center",
//                         display: "flex",
//                       }}
//                     >
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         disabled={isSubmitting}
//                         onClick={handleSubmit}
//                       >
//                         submit
//                       </Button>
//                     </Grid2>
//                   </form>
//                 </Grid2>
//               </Grid2>
//             </Box>
//           </Grid2>
//         )}
//       </Formik>
//     </Grid2>

//   );
// }

// export default RegisterAuction;
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { formSchema } from "../Schema/AuctionRegistrationSchema";
import Swal from "sweetalert2";
import { ErrorMessage, Formik } from "formik";
import AddIcon from "@mui/icons-material/Add";
import bgimage from "../Assets/Images/auctioncreate.webp";

const RegisterAuction = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const initialValues = {
    auctionName: "",
    category: "",
    startingBid: "",
    description: "",
    image: null,
  };

  const menuItems = [
    { id: 1, field: "Electronics" },
    { id: 1, field: "Furniture" },
    { id: 1, field: "Art" },
    { id: 1, field: "Fashion" },
    { id: 1, field: "Collectibles" },
  ];

  const handleCreateAuction = (value, setSubmitting, resetForm) => {
    console.log(value);
    Swal.fire({
      title: "Success",
      text: "Auction Created!",
      icon: "success",
      confirmButtonText: "Done",
    });
    setSubmitting(false);
    resetForm();
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFieldValue("image", file);
    } else {
      setImagePreview(null);
      setFieldValue("image", null);
    }
  };

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${bgimage})`,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Create New Auction
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log(values);
              handleCreateAuction(values, setSubmitting, resetForm);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
            }) => (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Product Name */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      id="auctionName"
                      color="dark"
                      name="auctionName"
                      label="Enter auction name"
                      variant="filled"
                      value={values.auctionName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.auctionName && touched.auctionName}
                    />
                    <ErrorMessage
                      name="auctionName"
                      render={(msg) => (
                        <Typography color="error">{msg}</Typography>
                      )}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      onChange={handleChange}
                      multiline
                      rows={4}
                      required
                      id="description"
                      color="dark"
                      name="description"
                      label="Describe the item"
                      variant="filled"
                      value={values.description}
                      onBlur={handleBlur}
                      error={errors.description && touched.description}
                    />
                    <ErrorMessage
                      name="description"
                      render={(msg) => (
                        <Typography color="error">{msg}</Typography>
                      )}
                    />
                  </Grid>

                  {/* Price */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      required
                      color="dark"
                      id="startingBid"
                      name="startingBid"
                      label="Enter starting bid"
                      variant="filled"
                      value={values.startingBid}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.startingBid && touched.startingBid}
                    />
                    <ErrorMessage
                      name="startingBid"
                      render={(msg) => (
                        <Typography color="error">{msg}</Typography>
                      )}
                    />
                  </Grid>

                  {/* Category */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={errors.category && touched.category}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        onChange={handleChange}
                        required
                        id="category"
                        name="category"
                        label="Category"
                        select
                        variant="filled"
                        value={values.category}
                        onBlur={handleBlur}
                      >
                        {menuItems.map((category, index) => (
                          <MenuItem key={Math.random()} value={category.field}>
                            {category.field}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <ErrorMessage
                      name="category"
                      render={(msg) => (
                        <Typography color="error">{msg}</Typography>
                      )}
                    />
                  </Grid>

                  {/* Image URL */}
                  <Grid item xs={12}>
                    <TextField
                      // onChange={handleChange}
                      required
                      fullWidth
                      type="file"
                      name="image"
                      id="Upload Image"
                      label="Upload Image"
                      variant="standard"
                      accept="image/*"
                      onChange={(event) => {
                        handleImageChange(event, setFieldValue);
                      }}
                      error={errors.image || touched.image}
                      sx={{ display: "none" }}
                    />
                    <label htmlFor="Upload Image">
                      <Button
                        fullWidth
                        variant="outlined"
                        component="span"
                        startIcon={<AddIcon />}
                        color={!imagePreview ? "dark" : "success"}
                      >
                        {!imagePreview ? "Choose File" : "change file"}
                      </Button>
                    </label>
                    <ErrorMessage
                      name="image"
                      render={(msg) => (
                        <Typography color="error">{msg}</Typography>
                      )}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      color="primary"
                      size="large"
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      Create Auction
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Formik>
        </Box>
      </Container>
    </Grid>
  );
};

export default RegisterAuction;
