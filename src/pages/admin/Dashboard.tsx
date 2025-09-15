import { useQuery } from "@tanstack/react-query";
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from "@mui/material";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";

type OrdersApiResponse = {
  data: {
    content: Array<{
      id: number;
      customerName: string;
      customerEmail: string;
      totalAmount: number;
      status: string;
      orderDate: string;
    }>;
    totalElements: number;
  };
};

const fetchOrdersSummary = async (): Promise<number> => {
  const response = await fetch(
    "https://api-e-commerce.tenzorsoft.uz/orders?page=0&size=1&sortBy=orderDate&sortDir=desc"
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch orders summary: ${response.status}`);
  }
  const json: OrdersApiResponse = await response.json();
  return json.data.totalElements ?? 0;
};

const fetchRecentOrders = async (): Promise<
  OrdersApiResponse["data"]["content"]
> => {
  const response = await fetch(
    "https://api-e-commerce.tenzorsoft.uz/orders?page=0&size=50&sortBy=orderDate&sortDir=desc"
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch recent orders: ${response.status}`);
  }
  const json: OrdersApiResponse = await response.json();
  return json.data.content || [];
};

type ProductsApiResponse = {
  data: {
    content: Array<{ id: number; name: string; sold?: number }>;
    totalElements: number;
  };
};

const fetchProductsSummary = async (): Promise<{
  total: number;
  top: Array<{ id: number; name: string; sold?: number }>;
}> => {
  const response = await fetch(
    "https://api-e-commerce.tenzorsoft.uz/products?page=0&size=10&sortBy=id&sortDir=asc"
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch products summary: ${response.status}`);
  }
  const json: ProductsApiResponse = await response.json();
  const content = json.data.content || [];
  const top = [...content]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);
  return { total: json.data.totalElements ?? content.length, top };
};

const Dashboard = () => {
  const {
    data: totalOrders,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["orders-summary"], queryFn: fetchOrdersSummary });

  const {
    data: productsSummary,
    isLoading: loadingProducts,
    isError: errorProducts,
  } = useQuery({
    queryKey: ["products-summary"],
    queryFn: fetchProductsSummary,
  });

  const {
    data: recentOrders = [],
    isLoading: loadingOrders,
    isError: errorRecent,
  } = useQuery({ queryKey: ["recent-orders"], queryFn: fetchRecentOrders });

  const computeStats = () => {
    if (!recentOrders || recentOrders.length === 0)
      return { totalRevenue: 0, growthRate: 0 };

    const byDate: Record<string, number> = {};
    for (const o of recentOrders) {
      const day = o.orderDate.slice(0, 10);
      byDate[day] = (byDate[day] || 0) + (Number(o.totalAmount) || 0);
    }
    const days = Object.keys(byDate).sort();
    const last14 = days.slice(-14);
    const recent7 = last14.slice(-7);
    const prev7 = last14.slice(0, Math.max(0, last14.length - 7)).slice(-7);

    const sum = (arr: string[]) =>
      arr.reduce((acc, d) => acc + (byDate[d] || 0), 0);
    const recentSum = sum(recent7);
    const prevSum = sum(prev7);
    const growthRate =
      prevSum === 0
        ? recentSum > 0
          ? 100
          : 0
        : ((recentSum - prevSum) / prevSum) * 100;
    const totalRevenue = recentOrders.reduce(
      (acc, o) => acc + (Number(o.totalAmount) || 0),
      0
    );

    return { totalRevenue, growthRate };
  };

  const { totalRevenue, growthRate } = computeStats();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {(error as Error)?.message || "Failed to load dashboard data"}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Box sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          alignItems: "stretch",
        }}>
          <Box>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                p: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Umumiy buyurtmalar
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  <ShoppingCartIcon
                    sx={{ width: 50, height: 50, color: "#2B7FFF" }}
                  />
                  {totalOrders}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                p: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography color="text.secondary">
                  Umumiy mahsulotlar
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  <InventoryIcon
                    sx={{ width: 40, height: 40, color: "#DC004E" }}
                  />
                  {loadingProducts || errorProducts
                    ? "-"
                    : productsSummary?.total ?? "-"}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                p: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Growth Rate (7d)
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    color: growthRate >= 0 ? "success.main" : "error.main",
                  }}
                >
                  {growthRate.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                p: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Total Revenue (UZS)
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {totalRevenue.toLocaleString("uz-UZ")}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {!loadingOrders && !errorRecent && (
        <Box sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 2,
          mt: 1,
        }}>
          <Box>
            <Card
              sx={{
                borderRadius: 3,
                p: 2,
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Eng ko‘p sotilganlar (top 5)
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {loadingProducts && "Yuklanmoqda..."}
                  {!loadingProducts &&
                    productsSummary?.top?.length === 0 &&
                    "Ma’lumot yo‘q"}
                </Typography>
                {!loadingProducts &&
                  productsSummary?.top?.map((p, idx) => (
                    <Typography key={p.id} variant="body2">
                      {idx + 1}. {p.name}{" "}
                      {typeof p.sold === "number" ? `(x${p.sold})` : ""}
                    </Typography>
                  ))}
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card
              sx={{
                borderRadius: 3,
                p: 2,
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Recent Orders
                </Typography>
                <Table size="small" sx={{ mt: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.slice(0, 5).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>#{o.id}</TableCell>
                        <TableCell>{o.customerName}</TableCell>
                        <TableCell align="right">
                          UZS{" "}
                          {Number(o.totalAmount || 0).toLocaleString("uz-UZ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
