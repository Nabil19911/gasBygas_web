import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
import RootRoutes from "./RootRoutes.tsx";
import "./index.css";
// import { store } from "./store/store.ts";
import { BrowserRouter } from "react-router";
import { AuthContext } from "./contexts/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <BrowserRouter>
      <AuthContext>
        <RootRoutes />
      </AuthContext>
    </BrowserRouter>
    {/* </Provider> */}
  </StrictMode>
);
