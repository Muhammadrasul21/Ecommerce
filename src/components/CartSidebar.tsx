import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  Chip,
  TextField,
  Alert,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import noImage from '../assets/noimage.png';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector((state) => state.cart);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    alert('Checkout functionality will be implemented soon!');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          boxSizing: 'border-box',
          padding: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6">
            Shopping Cart ({itemCount})
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add some products to get started
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearCart}
              startIcon={<DeleteIcon />}
              fullWidth
            >
              Clear Cart
            </Button>
          </Box>

          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {items.map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }}>
                <Paper elevation={1} sx={{ p: 2, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.imageUrl || noImage}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" noWrap>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {item.category}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            handleUpdateQuantity(item.id, Math.max(1, newQuantity));
                          }}
                          inputProps={{
                            min: 1,
                            style: { textAlign: 'center', width: 50 }
                          }}
                          variant="outlined"
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                          sx={{ ml: 'auto' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`Total: $${(item.price * item.quantity).toFixed(2)}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Total ({itemCount} items):
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{ mb: 1 }}
            >
              Proceed to Checkout
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartSidebar;
