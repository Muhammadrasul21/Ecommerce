import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, getProducts } from "../services/productService";
import type { Product } from "../types/type";

const categories = ["Electronics", "Clothes", "Books", "Shoes"];

const EditProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
    category: "",
    isActive: true,
    createdAt: "",
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productsData = await getProducts();
        const product = productsData.content.find(
          (p) => p.id === parseInt(id || "0"),
        );
        if (product) {
          setFormData(product);
        } else {
          navigate("/admin/products");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        navigate("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, navigate]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setToastOpen(true);
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
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
    navigate("/admin/products");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

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
        <Typography variant="h5">Edit Product</Typography>
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
            {isPending ? "Updating..." : "Update Product"}
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
          Product successfully updated! 🎉
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProduct;
