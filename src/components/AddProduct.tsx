import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../services/productService";
import type { Product } from "../types/type";

const categories = ["Electronics", "Clothes", "Books", "Shoes"];

const AddProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
    category: "",
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  const [toastOpen, setToastOpen] = useState(false);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setFormData({
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        category: "",
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      setToastOpen(true);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Box
      maxWidth={500}
      mx="auto"
      mt={4}
      p={3}
      border="1px solid #ddd"
      borderRadius={2}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }} color="primary">
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">Add New Product</Typography>
      </Box>

      {isError && <Alert severity="error">{(error as Error)?.message}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          margin="normal"
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            startIcon={isPending && <CircularProgress size={18} />}
          >
            {isPending ? "Saving..." : "Add Product"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="success"
          sx={{ width: "100%" }}
        >
          Product successfully added!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProduct;
