import Categories from "@/app/pages/categories";
import Dashboard from "@/app/pages/dashboard";
import Login from "@/app/pages/login";
import Transactions from "@/app/pages/transactions";
import { Route, Routes } from "react-router";

export default function RoutesApp() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
}
