import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { OrderTableProps } from "../types/type";
import { useAppSelector } from "../store/hooks";

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);
  const isAdmin = auth.user?.role === "admin";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewDetails = () => {
    if (selectedOrder) {
      navigate(`/admin/order-detail/${selectedOrder.id}`);
    }
    handleMenuClose();
  };

  const handleUpdateStatus = () => {
    setNewStatus(selectedOrder?.status || "");
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const handleCancelOrder = () => {
    setCancelDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusUpdate = () => {
    console.log(`Updating order ${selectedOrder?.id} status to ${newStatus}`);
    setSnackbarMessage(`Order status updated to ${newStatus}`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setStatusDialogOpen(false);
  };

  const handleConfirmCancel = () => {
    console.log(`Cancelling order ${selectedOrder?.id}`);
    setSnackbarMessage(`Order ${selectedOrder?.id} has been cancelled`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setCancelDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="orders table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#2B7FFF" }}>
            <TableCell sx={{ width: 8, color: "white" }}>N/:</TableCell>
            <TableCell sx={{ color: "white" }} align="center">
              Customer Name
            </TableCell>
            <TableCell sx={{ color: "white" }} align="center">
              Customer Email
            </TableCell>
            <TableCell sx={{ color: "white" }} align="center">
              Total Amount
            </TableCell>
            <TableCell sx={{ color: "white" }} align="center">
              Status
            </TableCell>
            <TableCell sx={{ color: "white" }} align="center">
              Order Date
            </TableCell>
            {isAdmin && (
              <TableCell sx={{ color: "white" }} align="center">
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row" sx={{color:"#2B7FFF"}}>
                #{order.id}
              </TableCell>
              <TableCell align="center">{order.customerName}</TableCell>
              <TableCell align="center" sx={{opacity:"80%"}}>{order.customerEmail}</TableCell>
              <TableCell align="center" sx={{ color: "green" }}>
                UZS {order.totalAmount}
              </TableCell>
              <TableCell align="center">{order.status}</TableCell>
              <TableCell align="center">
                {order.orderDate.slice(0, 10)}
              </TableCell>
              {isAdmin && (
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, order)}
                    size="small"
                    sx={{ color: "#2B7FFF" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAdmin && (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUpdateStatus}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update Status</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCancelOrder}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cancel Order</ListItemText>
        </MenuItem>
      </Menu>
      )}

      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the status for order #{selectedOrder?.id}
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="New Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel order #{selectedOrder?.id}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

export default OrderTable;
