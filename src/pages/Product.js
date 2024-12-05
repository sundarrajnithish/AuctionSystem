import React, { useEffect, useState } from "react";

import ProductCard from "../components/Cards/ProductCard";

import {
  filterProdcut as filterProduct,
  getCategory,
  getProducts,
} from "../Services/GetProducts";
import { Box, Container, Grid, Typography } from "@mui/material";
import Loader from "../components/Loader/Loader";
import FilteringBar from "../components/FilterBar/FilterBar";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(
      (res) => {
        setProducts(res.data);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
  }, []);

  const onFilterChange = (filter) => {
    setLoading(true);
    filterProduct(filter).then(
      (res) => {
        console.log(res.data);
        setProducts(res.data);
        setLoading(false);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  return (
    <Container maxWidth="lg">
      <FilteringBar onFilterChange={onFilterChange} />
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ my: 5 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Item Listed For Bidding
          </Typography>
          <Grid container spacing={4}>
            <ProductCard products={products} />
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Product;
