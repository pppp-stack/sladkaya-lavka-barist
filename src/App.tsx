import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
