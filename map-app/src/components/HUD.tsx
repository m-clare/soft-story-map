import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const HUD = ({ rawData }) => {
  const data = JSON.parse(rawData.data);

  const formattedEntry = (item: any) => {
    return (
      <>
        {Object.entries(item).map(([key, value], i) => {
          const formattedKey = key.split("_").join(" ");
          return (
            <>
              <div>
                <Typography
                  key={`${key}_${i}`}
                  display="inline"
                  fontWeight="700"
                  variant="button"
                >
                  {formattedKey}:
                </Typography>
                <span>{` `}</span>
                <Typography
                  key={`${value}_${i}`}
                  display="inline"
                  variant="body2"
                >
                  {value}
                </Typography>
              </div>
            </>
          );
        })}
      </>
    );
  };
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "absolute",
            minWidth: 300,
            maxWidth: { md: "50%", sm: "80%" },
            minWidth: 300,
            maxHeight: "50%",
            overflowY: "auto",
            top: 80,
          }}
        >
          <Card square sx={{ opacity: 0.8, px: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {rawData.address.split(/\d\d\d\d\d/)[0]}
              </Typography>
              <Typography variant="h7" sx={{ fontWeight: 700 }}>
                {rawData.address.match(/\d\d\d\d\d/)[0]}
              </Typography>
              {data.map((item) => {
                return (
                  <>
                    <Divider />
                    {formattedEntry(item)}
                  </>
                );
              })}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default HUD;
