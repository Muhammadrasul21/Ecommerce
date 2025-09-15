import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import OrderTable from "../../components/OrderTable";
import type { TabPanelProps, Order } from "../../types/type";
import { Link } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAppSelector } from "../../store/hooks";
import SearchBar from "../../components/SearchBar";
import { getOrders } from "../../services/orderService";

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Orders() {
  const [value, setValue] = React.useState(0);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [search, setSearch] = React.useState("");
  const [emailSearch, setEmailSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const auth = useAppSelector((s) => s.auth);
  const isAdmin = auth.user?.role === "admin";

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    getOrders(page, rowsPerPage, "orderDate", "desc")
      .then((data) => {
        setOrders(data.content);
        setTotalCount(data.totalElements);
      })
      .catch((err) => console.error("Xatolik:", err));
  }, [page, rowsPerPage]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const emailFilteredOrders = orders.filter((order) =>
    order.customerEmail.toLowerCase().includes(emailSearch.toLowerCase())
  );

  return (
    <div className="mt-4 max-w-[1100px]">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Barcha buyurtmalar" {...a11yProps(0)} />
            <Tab label="Mijoz buyurtmalari" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              marginBottom: 2,
            }}
          >
            <SearchBar
              placeholder="Search..."
              value={search}
              onChange={(v) => setSearch(v)}
            />

            <FormControl sx={{ minWidth: 180, marginTop: 2 }} size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
              </Select>
            </FormControl>

            {isAdmin && (
              <Link to="/admin/ordersnew">
                <Fab color="primary" aria-label="add" sx={{ mt: 2 }}>
                  <AddIcon />
                </Fab>
              </Link>
            )}
          </Box>
          {filteredOrders.length > 0 ? (
            <>
              <OrderTable orders={filteredOrders} />
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          ) : (
            <p>Yuklanmoqda...</p>
          )}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              marginBottom: 2,
            }}
          >
            <SearchBar
              placeholder="Email bo‘yicha qidirish..."
              value={emailSearch}
              onChange={(v) => setEmailSearch(v)}
            />

            <FormControl sx={{ minWidth: 180, marginTop: 2 }} size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
              </Select>
            </FormControl>

            {isAdmin && (
              <Link to="/admin/ordersnew">
                <Fab color="primary" aria-label="add" sx={{ mt: 2 }}>
                  <AddIcon />
                </Fab>
              </Link>
            )}
          </Box>

          {emailFilteredOrders.length > 0 ? (
            <>
              <OrderTable orders={emailFilteredOrders} />
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          ) : (
            <p>Ma’lumot topilmadi</p>
          )}
        </CustomTabPanel>
      </Box>
    </div>
  );  
}
