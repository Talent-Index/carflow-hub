// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID!, // set this in .env
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider client={client} activeChain={avalancheFuji}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
);
