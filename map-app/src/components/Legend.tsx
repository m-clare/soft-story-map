import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import Card from "@mui/material/Card";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Legend() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Box sx={{ position: "fixed", right: 8, bottom: 108 }}>
        <Card
          sx={{
            padding: 0.75,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "8px",
          }}
        >
          <div>
            <Typography
              variant="overline"
              sx={{ paddingLeft: 1, fontWeight: 700 }}
            >
              Legend
            </Typography>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div style={{ position: "relative" }}>
              <CircleIcon
                sx={{
                  color: "statusColor.retrofit",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              <Typography
                variant="overline"
                sx={{ paddingLeft: 1, fontWeight: 700 }}
              >
                LADBS retrofit
              </Typography>
            </div>

            <div style={{ position: "relative" }}>
              <CircleIcon
                sx={{
                  color: "statusColor.unretrofit",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              <Typography
                variant="overline"
                sx={{ paddingLeft: 1, fontWeight: 700 }}
              >
                No retrofit found
              </Typography>
            </div>
            <div style={{ position: "relative" }}>
              <CircleIcon
                sx={{
                  color: "statusColor.retrofitNR",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              <Typography
                variant="overline"
                sx={{ paddingLeft: 1, fontWeight: 700 }}
              >
                Retrofit verification
              </Typography>
            </div>
          </Collapse>
        </Card>
      </Box>
    </>
  );
}

export default Legend;
