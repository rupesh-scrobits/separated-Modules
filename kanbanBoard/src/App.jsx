import { useState } from "react";
import "./App.css";
import RouteConfig from "./routes/RouteConfig";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RouteConfig />
    </>
  );
}

export default App;
