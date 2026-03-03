import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { QuotationPage } from "./pages/QuotationPage";
import { DashboardHomePage } from "./pages/DashboardHomePage";
import { UsersManagementPage } from "./pages/UsersManagementPage";
import { QuotationsListPage } from "./pages/QuotationsListPage";
import { QuotationDetailPage } from "./pages/QuotationDetailPage";
import { ReportsPage } from "./pages/ReportsPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardHomePage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <UsersManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/quotations",
        element: (
          <ProtectedRoute allowedRoles={["admin", "seller"]}>
            <DashboardLayout>
              <QuotationsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/my-quotes",
        element: (
          <ProtectedRoute allowedRoles={["client"]}>
            <DashboardLayout>
              <QuotationsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/quotation/:id",
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <QuotationDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/reports",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/new-quote",
        element: (
          <ProtectedRoute allowedRoles={["seller", "client"]}>
            <DashboardLayout>
              <QuotationPage />
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);