import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import GitHubIcon from '@mui/icons-material/GitHub';
import FeedIcon from '@mui/icons-material/Feed';

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
          <Toolbar>
            <Box sx={{ flexGrow: 1, flexDirection: "column", gap: 0 }}>
              <Typography variant="h5" fontWeight="700">
                Los Angeles Buildings
              </Typography>
              <div style={{ position: "relative" }}>
                <Link
                  underline="none"
                  href="https://graphics.latimes.com/soft-story-apartments-needing-retrofit/"
                >
                  <LinkIcon
                    sx={{
                      color: "white",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ paddingLeft: 1, color: "white" }}
                  >
                    Soft-Story Retrofits
                  </Typography>
                </Link>
              </div>
            </Box>
            <Link href="https://mclare.blog/posts/mapping-los-angeles-soft-story-retrofit-program/" underline="none" style={{display: "inline-block"}}>
              <div style={{position: "relative", paddingRight: 12}}>
              <InfoIcon
                sx={{
                  color: "white",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              </div>
            </Link>
            <Link href="https://github.com/m-clare/soft-story-map" underline="none" style={{display: "inline-block"}}>
              <div style={{position: "relative", paddingRight: 12}}>
              <GitHubIcon
                sx={{
                  color: "white",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              </div>
            </Link>
            <Link href="https://mclare.dev" underline="none" style={{display: "inline-block"}}>
              <div style={{position: "relative"}}>
              <FeedIcon
                sx={{
                  color: "white",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              </div>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default Header;
