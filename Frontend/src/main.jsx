import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SmoothScroll } from "./components/common/SmoothScroll";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <WishlistProvider>
          <SmoothScroll>
            <App />
          </SmoothScroll>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
