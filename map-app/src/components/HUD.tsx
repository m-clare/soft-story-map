import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const HUD= ({rawData}) => {

  const data = JSON.parse(rawData.data)

  const formattedEntry = (item: any) => {
    return (
      <>
    {Object.entries(item).map((entry) => {
      return <Typography key={entry[0]} variant="body1">{entry[0]}: {entry[1]}</Typography>
    })}</>
    )
  }
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <Container maxWidth="lg">
        <Box sx={{ position: "absolute", top: 80, pl: 3, maxHeight: "50%" }}>
          <Card sx={{ maxWidth: 300, opacity: 0.8, maxHeight: 300, overflow: "scroll" }}>
            <CardContent>
              <Typography variant="h6">Test Card</Typography>
              {data.map((item) => formattedEntry(item))}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default HUD;
