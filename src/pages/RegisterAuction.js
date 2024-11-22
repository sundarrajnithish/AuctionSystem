import React, { useState } from "react";
import { ErrorMessage, Formik } from "formik";
import {
  Box,
  Button,
  Grid2,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
// import "./RegisterAuction.css";
import * as Yup from "yup";
import { Grid } from "@aws-amplify/ui-react";
import Swal from "sweetalert2";
import bgimage from "../Assets/Images/auctioncreate.webp";
import AddIcon from "@mui/icons-material/Add";

function RegisterAuction() {
  const [imagePreview, setImagePreview] = useState(null);

  const formSchema = Yup.object().shape({
    auctionName: Yup.string()
      .min(2, "Too Short!")
      .max(70, "Too Long!")
      .required("This field is required!"),
    category: Yup.string().required("Please Provide atlease One Category"),
    startingBid: Yup.number()
      .min(0, "Bid Can't start at 0")
      .required("Please Provide Starting Value for the bid"),
    description: Yup.string()
      .min(2, "Too Short!")
      .max(1000, "Too long!")
      .required("This field is required!"),
    image: Yup.mixed()
      .required("An image is required")
      .test(
        "fileFormat",
        "Unsupported Format",
        (value) =>
          value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
      ),
  });

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

  //   const handleImageUpload = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       setImage(file);
  //       setPreview(URL.createObjectURL(file));
  //     }
  //   };

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

  const handleCreateAuction = (value, setSubmitting, resetForm) => {
    console.log(value);
    Swal.fire({
      title: "Success",
      text: "Auction Created!",
      icon: "success",
      confirmButtonText: "Done",
    });
    setSubmitting(false);
  };

  return (
    <Grid2
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
          <Grid2 marginBlock={1} margin={1} columns={12}>
            <Box
              sx={{
                display: "flex",
                height: "100vh",
                background: "rgba(255, 255, 255, 0.5)",
                boxShadow: 5,
                borderRadius: 2,
                padding: 2,
                margin: 2,
              }}
            >
              <Grid2
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  "@media (min-width:600px)": {
                    flexDirection: "column",
                  },
                  "@media (min-width:900px)": {
                    flexDirection: "row",
                  },
                }}
                columns={12}
              >
                <Grid2
                  container
                  spacing={2}
                  columns={6}
                  marginBlock={2}
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: 5,
                    margin: 2,
                  }}
                >
                  <Typography variant="h3" gutterBottom color="#000">
                    Create Your Auction
                  </Typography>
                </Grid2>

                <Grid2
                  container
                  spacing={2}
                  columns={6}
                  marginBlock={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <form onSubmit={handleSubmit}>
                    <Grid2 size={6} marginBlock={2}>
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
                    </Grid2>
                    <Grid2 size={6} marginBlock={2}>
                      <TextField
                        fullWidth
                        required
                        id="category"
                        name="category"
                        label="Category"
                        color="dark"
                        select
                        variant="filled"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.category && touched.category}
                      >
                        {menuItems.map((data) => (
                          <MenuItem
                            value={data.field}
                            key={data.id}
                            divider={true}
                          >
                            {data.field}
                          </MenuItem>
                        ))}
                      </TextField>
                      <ErrorMessage
                        name="category"
                        render={(msg) => (
                          <Typography color="error">{msg}</Typography>
                        )}
                      />
                    </Grid2>
                    <Grid2 size={6} marginBlock={2}>
                      <TextField
                        fullWidth
                        required
                        type="number"
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
                    </Grid2>
                    <Grid2 size={6} marginBlock={2}>
                      <TextField
                        fullWidth
                        required
                        id="description"
                        color="dark"
                        name="description"
                        label="Describe the item"
                        variant="filled"
                        multiline
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.description && touched.description}
                      />
                      <ErrorMessage
                        name="description"
                        render={(msg) => (
                          <Typography color="error">{msg}</Typography>
                        )}
                      />
                    </Grid2>
                    <Grid2 size={6} marginBlock={2}>
                      <TextField
                        fullWidth
                        required
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
                          variant="outlined"
                          component="span"
                          startIcon={<AddIcon />}
                          color="dark"
                        >
                          {!imagePreview ? "Choose File" : imagePreview}
                        </Button>
                      </label>

                      <Typography color="error">{errors.image}</Typography>

                      {imagePreview && (
                        <Grid>
                          <h3>Image Preview:</h3>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: "200px", height: "auto" }}
                          />
                        </Grid>
                      )}
                    </Grid2>
                    <Grid2
                      size={6}
                      marginBlock={2}
                      sx={{
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                      >
                        submit
                      </Button>
                    </Grid2>
                  </form>
                </Grid2>
              </Grid2>
            </Box>
          </Grid2>
        )}
      </Formik>
    </Grid2>
    //   <div className="new-auction-page">
    //     <div className="auction-card">
    //       <h2>Create New Auction</h2>
    //       {errorMessage && <p className="error-message">{errorMessage}</p>}
    //       <form onSubmit={handleCreateAuction}>
    //         <label>Auction Name</label>
    //         <input
    //           type="text"
    //           value={auctionName}
    //           onChange={(e) => setAuctionName(e.target.value)}
    //           placeholder="Enter auction name"
    //           required
    //         />

    //         <label>Category</label>
    //         <select
    //           value={category}
    //           onChange={(e) => setCategory(e.target.value)}
    //           required
    //         >
    //           <option value="">Select a category</option>
    //           <option value="Electronics">Electronics</option>
    //           <option value="Furniture">Furniture</option>
    //           <option value="Art">Art</option>
    //           <option value="Fashion">Fashion</option>
    //           <option value="Collectibles">Collectibles</option>
    //         </select>

    //         <label>Starting Bid ($)</label>
    //         <input
    //           type="number"
    //           value={startingBid}
    //           onChange={(e) => setStartingBid(e.target.value)}
    //           placeholder="Enter starting bid"
    //           required
    //         />

    //         <label>Description</label>
    //         <textarea
    //           value={description}
    //           onChange={(e) => setDescription(e.target.value)}
    //           placeholder="Describe the item"
    //           required
    //         />

    //         <label>Upload Image</label>
    //         <input
    //           type="file"
    //           accept="image/*"
    //           onChange={handleImageUpload}
    //           required
    //         />
    //         {preview && (
    //           <img src={preview} alt="Preview" className="image-preview" />
    //         )}

    //         <button type="submit" className="btn-create-auction">
    //           Create Auction
    //         </button>
    //       </form>
    //     </div>
    //   </div>
  );
}

export default RegisterAuction;
