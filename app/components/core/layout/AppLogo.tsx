import { Box, Typography } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';

export default function AppLogo() {
    return (
        <Box>
            <Box display="flex" textAlign="left">
                <Box mr={1}>
                    <SchoolIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5">
                        EduPortal
                    </Typography>
                    <Typography component="small" variant="subtitle2">College Management System</Typography>
                </Box>
            </Box>
            <Box textAlign="right">
                <Typography component="small" variant="caption">by Metahorizon</Typography>
            </Box>
        </Box>
    )
}
