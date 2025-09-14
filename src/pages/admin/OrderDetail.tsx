import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface OrderDetail {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  shippingAddress?: string;
  paymentMethod?: string;
  items?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get(`https://api-e-commerce.tenzorsoft.uz/orders/${id}`);
        setOrder(response.data.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/admin/orders');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || 'Order not found'}</Alert>
        <Box mt={2}>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back to Orders
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4">
          Order Details #{order.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Order Summary</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  #{order.id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  UZS {order.totalAmount.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Order Items */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={2}>
                        <Box
                          component="img"
                          src={item.imageUrl || '/noimage.png'}
                          alt={item.name}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" color="text.secondary">
                          Quantity
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" color="text.secondary">
                          Unit Price
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          UZS {item.price.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          UZS {(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No items found for this order.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Customer & Payment Info */}
        <Grid item xs={12} md={4}>
          {/* Customer Information */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Customer Information</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {order.customerName}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {order.customerEmail}
              </Typography>
            </Box>
            
            {order.customerPhone && (
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {order.customerPhone}
                </Typography>
              </Box>
            )}
            
            {order.shippingAddress && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Shipping Address
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {order.shippingAddress}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Payment Information */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PaymentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Payment Information</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {order.paymentMethod || 'Not specified'}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                UZS {order.totalAmount.toLocaleString()}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Order Status
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status) as any}
                sx={{ mt: 1 }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetail;
