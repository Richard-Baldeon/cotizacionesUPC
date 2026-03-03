import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AuthUser, User } from "../types/user";
import { users } from "../data/users";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, "id" | "createdAt">) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        phone: foundUser.phone,
        company: foundUser.company,
      };
      setUser(authUser);
      localStorage.setItem("currentUser", JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, "id" | "createdAt">): boolean => {
    // Verificar si el email ya existe
    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    // En una aplicación real, esto se enviaría al backend
    // Por ahora, solo simulamos el registro y login automático
    const newUser: User = {
      ...userData,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Agregar al array de usuarios (solo en memoria)
    users.push(newUser);

    // Login automático
    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      company: newUser.company,
    };
    setUser(authUser);
    localStorage.setItem("currentUser", JSON.stringify(authUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
