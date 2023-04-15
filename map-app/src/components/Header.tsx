import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function Header() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
      }}
    >
      <AppBar sx={{ backgroundColor: "statusColor.retrofit" }}>
        <Container maxWidth="lg">
          <Toolbar><Box sx={{flexGrow: 1, flexDirection: "column", gap: 0}}><Typography variant="h6" fontWeight={'700'}>Los Angeles Buildings </Typography>
          <Typography variant="caption"> Identified and Retrofitted Soft Stories</Typography></Box></Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default Header;
