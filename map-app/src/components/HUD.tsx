import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function HUD() {
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <Container maxWidth="lg">
        <Box sx={{ position: "absolute", top: 80, pl: 3 }}>
          <Card sx={{ maxWidth: 300, opacity: 0.8 }}>
            <CardContent>
              <Typography variant="h6">Test Card</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default HUD;
