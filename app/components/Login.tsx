import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useAuthCodeFlow } from "~/hooks/auth-hooks";

export default function Login() {
  const onLogin = useAuthCodeFlow();

  return (
    <Card>
      <CardContent>
        <Typography color="primary" variant="h5" gutterBottom>
          Login to your account
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Login into your account to access the dashboard and manage your
          courses, view grades, and more.
        </Typography>
        <Button onClick={onLogin} variant="contained">
          Login
        </Button>
      </CardContent>
    </Card>
  );
}
