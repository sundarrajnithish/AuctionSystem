import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Rating,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getProductById } from "../Services/GetProducts";
import Loader from "../components/Loader/Loader";

const ProductPage = () => {
  const params = useParams();
  const [Product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(params).then(
      (res) => {
        console.log(res.data);
        setProduct(res.data);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
  }, []);

  return (
    <Container maxWidth="lg">
      {!loading ? (
        <>
          <Box sx={{ my: 5 }}>
            <Grid container spacing={4}>
              {/* Product Image */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia
                    component="img"
                    image={Product.image}
                    alt={Product.name}
                    sx={{ objectFit: "contain", height: 300 }}
                  />
                </Card>
              </Grid>

              {/* Product Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  {Product.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {Product.description}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                  {Product.price}$
                </Typography>
                <Button variant="contained" color="primary" size="large">
                  Add to Cart
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 10 }}>
            <Typography variant="h5" gutterBottom>
              Product Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Rating
                    </Typography>
                    <Rating
                      name="read-only"
                      value={Product.rating.rate}
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary">
                      {Product.rating.rate}/5
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Category
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Product.category}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Feature 3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lightweight design for comfortable wear.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default ProductPage;
