import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { PackagesPage } from "./pages/PackagesPage";
import { TripPlannerPage } from "./pages/TripPlannerPage";
import { DestinationDetailPage } from "./pages/DestinationDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { FaqPage } from "./pages/FaqPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ExplorePage />} path="/destinations" />
        <Route element={<PackagesPage />} path="/packages" />
        <Route element={<TripPlannerPage />} path="/plan" />
        <Route element={<DestinationDetailPage />} path="/destinations/:slug" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<FaqPage />} path="/faq" />
        <Route element={<ContactPage />} path="/contact" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<AdminPage />} path="/admin" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </SiteLayout>
  );
}
