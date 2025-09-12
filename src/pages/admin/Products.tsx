import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/type";
import noImage from "../../assets/noimage.png";

const Products = () => {
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total Products: {productsData?.totalElements || 0}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <Card sx={{ width: 250, mx: "auto" }}>
              <CardMedia
                component="img"
                height="180"
                image={noImage}
                alt={product.name}
              />
              <CardContent>
                <CardHeader
                  title={product.name}
                  subheader={new Date(product.createdAt).toLocaleDateString()}
                />

                <Chip
                  label={product.category}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
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
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Products;
