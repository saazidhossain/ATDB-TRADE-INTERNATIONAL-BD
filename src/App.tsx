import { useState, useCallback } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { LoadingScreen } from "@/components/atdb/LoadingScreen";

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const [loading, setLoading] = useState(true);
  const handleDone = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <LoadingScreen onDone={handleDone} />}
      <RouterProvider router={router} />
    </>
  );
}
