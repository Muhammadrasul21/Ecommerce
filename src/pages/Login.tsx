import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from "@mui/material";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      dispatch(loginUser({ email, password }));
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" p={2}>
      <Card sx={{ width: 380, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Kirish
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField label="Parol" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Akkauntingiz yo‘qmi? <Link to="/register">Ro‘yxatdan o‘tish</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

