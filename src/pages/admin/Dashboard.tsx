import { LineChart } from "@mui/x-charts/LineChart";

const Dashboard = () => {
  return (
    <div>
      <p>Dashboard</p>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            label: "Line A",
          },
          {
            data: [1, 4, 3, 7, 2, 6],
            label: "Line B",
          },
          {
            data: [3, 2, 6, 4, 7, 8],
            label: "Line C",
          },
        ]}
        height={300}
      />
    </div>
  );
};

export default Dashboard;