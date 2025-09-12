import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../services/productService";
import type { Product } from "../types/type";
import noImage from "../assets/noimage.png";

const ProductDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const productsData = await getProducts();
        const foundProduct = productsData.content.find(
          (p) => p.id === parseInt(id || "0"),
        );
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error loading product");
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate("/admin/products");
  };

  const handleEditClick = () => {
    navigate(`/admin/editproduct/${id}`);
  };

  const { mutate: deleteProductMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteDialogOpen(false);
      setToastOpen(true);
      navigate("/admin/products");
    },
  });

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (product) {
      deleteProductMutation(product.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
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

  if (error || !product) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || "Product not found"}</Alert>
        <Box mt={2}>
          <IconButton onClick={handleBackClick} color="primary">
            <ArrowBack />
            Back to Products
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }} color="primary">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Product Details</Typography>
      </Box>

       <Grid container spacing={3}>
         <Grid item xs={12} md={6}>
           <Card>
             <CardMedia
               component="img"
               height="400"
               image={noImage}
               alt={product.name}
               sx={{ objectFit: "cover" }}
             />
           </Card>
         </Grid>

         <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Box display="flex" gap={1}>
                <IconButton
                  onClick={handleEditClick}
                  color="primary"
                  size="small"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={handleDeleteClick}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box mb={2}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Price
              </Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">
                ${product.price.toFixed(2)}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Stock
              </Typography>
               <Chip
                 label={`${product.stock} units available`}
                 color={
                   product.stock > 10
                     ? "success"
                     : product.stock > 0
                       ? "warning"
                       : "error"
                 }
                 size="medium"
               />
            </Box>

            <Box mb={2}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Category
              </Typography>
               <Chip
                 label={product.category}
                 color="primary"
                 variant="outlined"
                 size="medium"
               />
            </Box>

            <Box mb={2}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Status
              </Typography>
               <Chip
                 label={product.isActive ? "Active" : "Inactive"}
                 color={product.isActive ? "success" : "error"}
                 size="medium"
               />
            </Box>

            <Box mb={2}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Product ID
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                #{product.id}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Created Date
              </Typography>
              <Typography variant="body1">
                {new Date(product.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
            {product.description && (
              <Box mb={2}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{product.description}</Typography>
              </Box>
            )}

            {product.updatedAt && (
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {new Date(product.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{product?.name}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting && <CircularProgress size={18} />}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
          Product successfully deleted! 🗑️
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetail;
