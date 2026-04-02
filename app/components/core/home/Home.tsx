import { Container, Grid } from '@mui/material';
import HomeBanner from './HomeBanner';
import Login from './Login';

export default function Home() {
    return (
        <Container>
            <Grid sx={{ paddingTop: 25, paddingBottom: 30, w: '100%' }} container spacing={5}>
                <Grid size={6}>
                    <HomeBanner />
                </Grid>
                <Grid size={6}>
                    <Login />
                </Grid>
            </Grid>
        </Container>
    );
}
