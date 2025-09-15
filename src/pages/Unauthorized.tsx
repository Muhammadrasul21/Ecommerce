import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <Box p={3} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Unauthorized
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        You do not have permission to view this page.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Back to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;

