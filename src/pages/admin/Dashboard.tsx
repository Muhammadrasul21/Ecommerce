import { useQuery } from "@tanstack/react-query";
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from "@mui/material";

type OrdersApiResponse = {
  data: {
    content: unknown[];
    totalElements: number;
  };
};

const fetchOrdersSummary = async (): Promise<number> => {
  const response = await fetch(
    "https://api-e-commerce.tenzorsoft.uz/orders?page=0&size=1&sortBy=orderDate&sortDir=desc",
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch orders summary: ${response.status}`);
  }
  const json: OrdersApiResponse = await response.json();
  return json.data.totalElements ?? 0;
};

const Dashboard = () => {
  const {
    data: totalOrders,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["orders-summary"], queryFn: fetchOrdersSummary });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">{(error as Error)?.message || "Failed to load dashboard data"}</Alert>
      )}

      {!isLoading && !isError && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Umumiy buyurtmalar
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {totalOrders}
              </Typography>
            </CardContent>
          </Card>

          {/* Optional: Add more stat cards here, like revenue or users */}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
