import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import RootRoutes from "./RootRoutes.tsx";
import { AuthContext } from "./contexts/AuthContext.tsx";
import "./index.css";
import { presistStore, store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense>
        <PersistGate
          loading={<div>Loading persisted state...</div>}
          persistor={presistStore}
        >
          <Provider store={store}>
            <AuthContext>
              <RootRoutes />
            </AuthContext>
          </Provider>
        </PersistGate>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
