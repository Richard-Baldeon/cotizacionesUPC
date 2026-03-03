import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Calculator, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    const success = login(email, password);
    if (success) {
      toast.success("Inicio de sesión exitoso", {
        description: "Bienvenido de vuelta",
      });
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl inline-block mb-2">
            <Calculator className="size-8" />
          </div>
          <h1 className="text-3xl font-bold">Sistema de Cotizaciones</h1>
          <p className="text-muted-foreground">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede con tu correo electrónico y contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <LogIn className="size-4 mr-2" />
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
              <p className="text-muted-foreground mt-2">
                ¿Olvidaste tu contraseña?{" "}
                <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                  Recupérala aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Cuentas de demostración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div>
              <p className="font-medium">Administrador:</p>
              <p className="text-muted-foreground">
                admin@cotizaciones.com / admin123
              </p>
            </div>
            <div>
              <p className="font-medium">Vendedor:</p>
              <p className="text-muted-foreground">
                vendedor@cotizaciones.com / vendedor123
              </p>
            </div>
            <div>
              <p className="font-medium">Cliente:</p>
              <p className="text-muted-foreground">
                cliente@empresa.com / cliente123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}