import { api } from "@/lib/utils";
import { useState } from "react";
import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  settings: {
    theme: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      budgetAlerts: boolean;
    };
  };
}

const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem("authUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

const useAuthStore = create<{
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}>((set) => ({
  user: getStoredUser(),
  login: (userData) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem("authUser");
    set({ user: null });
  },
}));

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, login, logout } = useAuthStore();

  const authenticate = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("users");
      const users: User[] = await response.json();
      console.log(users); // Verifique os dados recebidos
      const foundUser = users.find((u) => u.email === email);

      if (foundUser) {
        login(foundUser);
      } else {
        setError("Usuário não encontrado");
      }
    } catch (err) {
      setError("Erro ao buscar usuário");
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, authenticate, logout };
}
