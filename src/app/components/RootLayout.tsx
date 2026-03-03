import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "./ui/sonner";

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}