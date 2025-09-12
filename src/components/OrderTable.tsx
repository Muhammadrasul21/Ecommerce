import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import type { OrderTableProps } from "../types/type";

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
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
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="center">{order.customerName}</TableCell>
              <TableCell align="center">{order.customerEmail}</TableCell>
              <TableCell align="center">UZS {order.totalAmount}</TableCell>
              <TableCell align="center">{order.status}</TableCell>
              <TableCell align="center">
                {order.orderDate.slice(0, 10)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
