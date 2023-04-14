import React from 'react';
import styles from "./styles/Home.module.css"
import MaplibreMap from "./components/Map";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </header>
      <main className={styles.main}>
        <MaplibreMap />
      </main>
    </div>
  );
}

export default App;
