import React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid2 } from "@mui/material";

const ProductCard = (props) => {
  return (
    <Grid2
      container
      spacing={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
      columns={{ xl: 50, lg: 40, md: 30, sm: 20, xs: 10 }}
      marginBlock={1}
    >
      {props.products.map((product) => (
        <Grid2 size={{ xl: 10, lg: 10, md: 10, sm: 10, xs: 10 }}>
          <Card
            key={product.id}
            sx={{ maxWidth: 345, ":hover": { cursor: "pointer" } }}
            raised={false}
          >
            <Grid2 sx={{ alignItems: "center" }}>
              <CardMedia
                sx={{ height: 140 }}
                image={product.image}
                title={product.title}
              />
            </Grid2>

            <Grid2 container>
              <CardContent>
                <Grid2 container>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                </Grid2>
                <Grid2
                  height={100}
                  container
                  sx={{
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {product.description}
                  </Typography>
                </Grid2>
              </CardContent>
            </Grid2>
            <Grid2 container>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Grid2>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductCard;
