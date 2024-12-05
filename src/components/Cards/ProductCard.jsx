import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductCard = (props) => {
  const navigate = useNavigate();

  const viewProduct = (id) => {
    navigate(`${id}`);
  };
  return (
    <>
      {props.products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={Math.random()}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{
                height: 200, // Fixed height for consistent card appearance
                objectFit: "cover", // Ensures images fill the container while maintaining aspect ratio
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1, // Limit lines displayed
                }}
              >
                {product.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3, // Limit lines displayed
                }}
              >
                {product.description}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                {product.price}$
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                  viewProduct(product.id);
                }}
              >
                View
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default ProductCard;
