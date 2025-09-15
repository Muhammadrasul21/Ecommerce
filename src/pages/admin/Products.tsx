import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Chip,
  TextField,
  Fab,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/type";
import noImage from "../../assets/noimage.png";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../services/productService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";

const Products = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [addToCartToastOpen, setAddToCartToastOpen] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");
  const [disabledButtons, setDisabledButtons] = useState<Set<number>>(
    new Set()
  );
  const rowsPerPage = 12;
  const auth = useAppSelector((s) => s.auth);
  const isAdmin = auth.user?.role === "admin";

  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { mutate: deleteProductMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      setToastOpen(true);
    },
  });

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

  if (isError) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Error loading products: {error?.message || "Unknown error"}
        </Alert>
      </Box>
    );
  }

  const products: Product[] = productsData?.content || [];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProductMutation(productToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleAddToCart = (product: Product) => {
    setDisabledButtons((prev) => new Set(prev).add(product.id));

    dispatch(addToCart(product));
    setAddedProductName(product.name);
    setAddToCartToastOpen(true);

    setTimeout(() => {
      setDisabledButtons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 1000);
  };

  const handleCloseAddToCartToast = () => {
    setAddToCartToastOpen(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total Products: {filteredProducts.length}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            border: 1,
            width: "700px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 3,
            marginTop: 2,
            paddingX: 1,
          }}
        >
          <TextField
            id="outlined-search"
            placeholder="Search..."
            variant="outlined"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              flex: 1,
              "& fieldset": { border: "none" },
              "& .MuiOutlinedInput-root": {
                outline: "none",
                height: "50px",
              },
            }}
          />
          <SearchIcon sx={{ color: "gray", ml: 1 }} />
        </Box>
        {isAdmin && (
          <Link to="/admin/addproducts">
            <Fab color="primary" aria-label="add" sx={{ mt: 2 }}>
              <AddIcon />
            </Fab>
          </Link>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
          mt: 2,
        }}
      >
        {paginatedProducts.map((product) => (
          <Box key={product.id}>
            <Card
              sx={{
                width: 380,
                mx: "auto",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={noImage}
                alt={product.name}
              />
              <CardContent>
                <CardHeader title={product.name} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price.toFixed(2)}
                  </Typography>

                  <Chip
                    label={`Stock: ${product.stock}`}
                    color={
                      product.stock > 10
                        ? "success"
                        : product.stock > 0
                        ? "warning"
                        : "error"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Chip
                  label={product.category}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    gap: 1,
                  }}
                >
                  <Link to={`/admin/productdetail/${product.id}`}>
                    <IconButton color="info" size="small" title="View Details">
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  {isAdmin && (
                    <>
                      <Link to={`/admin/editproduct/${product.id}`}>
                        <IconButton
                          color="primary"
                          size="small"
                          title="Edit Product"
                        >
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        size="small"
                        title="Delete Product"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Box>

                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(product)}
                    disabled={
                      product.stock === 0 || disabledButtons.has(product.id)
                    }
                    sx={{
                      backgroundColor:
                        product.stock === 0 || disabledButtons.has(product.id)
                          ? "grey.400"
                          : "primary.main",
                      "&:hover": {
                        backgroundColor:
                          product.stock === 0 || disabledButtons.has(product.id)
                            ? "grey.400"
                            : "primary.dark",
                      },
                    }}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : disabledButtons.has(product.id)
                      ? "Added!"
                      : "Add to Cart"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {filteredProducts.length > rowsPerPage && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filteredProducts.length / rowsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {filteredProducts.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{productToDelete?.name}"? This
            action cannot be undone.
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
          Product successfully deleted!
        </Alert>
      </Snackbar>

      <Snackbar
        open={addToCartToastOpen}
        autoHideDuration={3000}
        onClose={handleCloseAddToCartToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAddToCartToast}
          severity="success"
          sx={{ width: "100%" }}
        >
          "{addedProductName}" added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
