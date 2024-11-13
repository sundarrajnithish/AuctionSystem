import React, { useEffect, useState } from "react";

import ProductCard from "../components/Cards/ProductCard";

import { getProducts } from "../Services/GetProducts";
import { Grid2 } from "@mui/material";

const Home = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts().then((res) => {
      console.log(res.data);
      setProducts(res.data);
    });
  }, []);
  return (
    <Grid2 container>
      <ProductCard products={products} />
    </Grid2>
  );
};

export default Home;
