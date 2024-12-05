import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { getCategory } from "../../Services/GetProducts";

const sortOptions = [
  { data: "Ascending", value: "asc" },
  { data: "Descending", value: "desc" },
];

const FilteringBar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "All",
    sort: "asc",
    search: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategory().then(
      (res) => {
        console.log(res.data);
        setCategories(["All", ...res.data]);
        setLoading(false);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onFilterChange(filters);
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
        mb: 4,
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* Title */}
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
              mb: 1,
            }}
          >
            Filter Products
          </Typography>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={6} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={filters.category}
              onChange={handleChange}
              sx={{ fontWeight: 600 }}
            >
              {!loading
                ? categories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </Grid>

        {/* Sorting Filter */}
        <Grid item xs={6} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>
            <Select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              sx={{ fontWeight: 600 }}
            >
              {!loading
                ? sortOptions.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.data}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilteringBar;
