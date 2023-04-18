import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const desiredFields = new Set([
  "status",
  "zone",
  "permit_category",
  "permit_sub_type",
  "work_description",
  "council_district",
  "contractors_business_name",
  "issue_date",
  "status_date",
  "log_id",
]);

const getStatus = (dbStatus: string) => {
  if (dbStatus === "retrofit") {
    return "Retrofit in progress / completed";
  }
  if (dbStatus === "not retrofit") {
    return "No retrofit permit found in LADBS";
  }
  if (dbStatus === "retrofit not required") {
    return "Retrofit assessed and not required";
  }
};

const HUD = ({ rawData }) => {
  const data = JSON.parse(rawData.data);

  const formattedEntry = (item: any) => {
    return (
      <>
        {Object.entries(item).map(([key, value], i) => {
          const formattedKey = key.split("_").join(" ");
          if (desiredFields.has(key)) {
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
          }
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
            minWidth: "50vw",
            maxWidth: { md: "50vw", sm: "80vw" },
            top: 80,
            left: 56,
            right: 56,
          }}
        >
          <Paper square sx={{ opacity: 0.8, px: 2, py: 2, maxHeight: "80vh" }}>
            <div>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontVariant: "small-caps" }}
              >
                {rawData.address.split(/\d\d\d\d\d/)[0].toLowerCase()}
              </Typography>{" "}
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {rawData.address.match(/\d\d\d\d\d/)[0]}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontVariant: "small-caps" }}
              >
                Status: {getStatus(rawData.retrofit_status)}
              </Typography>
            </div>
            <div style={{ "padding-bottom": 8 }}>
              <Typography
                variant="h6"
                sx={{ fontVariant: "small-caps", fontWeight: 700 }}
              >
                Database Entries
              </Typography>
            </div>
            <Box
              sx={{
                maxHeight: "30vh",
                overflowY: "auto",
              }}
            >
              {data.map((item, i) => {
                return (
                  <>
                    {formattedEntry(item)}
                    {!(i === data.length - 1) && <Divider />}
                  </>
                );
              })}
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HUD;
