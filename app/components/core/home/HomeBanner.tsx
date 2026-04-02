import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function HomeBanner() {
    return (
        <Box>
            <Typography variant="h3" gutterBottom>
                Metahorizon
            </Typography>
            <Typography color="primary" variant="h4" gutterBottom>
                College Management System
            </Typography>
            <Typography variant='body2'>
                Welcome to the Metahorizon College Management System. This secure portal provides students and staff access to academic records, course management, and administrative services. Please enter your credentials to continue.
            </Typography>
        </Box>
    );
}
