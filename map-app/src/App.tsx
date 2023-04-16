import React from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import { CssBaseline } from "@mui/material";
import styles from "./styles/Home.module.css";
import MaplibreMap from "./components/Map";
import Header from "./components/Header";

const theme = createTheme({
  palette: {
    background: {
      paper: "#fff",
    },
    statusColor: {
      unretrofit: "#fe4a49",
      retrofit: "#2ab7ca",
      retrofitNR: "#fed766",
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans"',
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </header>
        <main className={styles.main}>
          <Header />
          <MaplibreMap />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
