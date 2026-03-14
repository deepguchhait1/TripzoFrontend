import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";

// Lazy-loaded public pages
const Home = lazy(() => import("./pages/Home"));
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationDetails = lazy(() => import("./pages/DestinationDetails"));
const Packages = lazy(() => import("./pages/Packages"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Booking = lazy(() => import("./pages/Booking"));
const PackageDetails = lazy(() => import("./pages/PackageDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminSetup = lazy(() => import("./pages/admin/AdminSetup"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminDestinations = lazy(() => import("./pages/admin/AdminDestinations"));
const AdminPackages = lazy(() => import("./pages/admin/AdminPackages"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers"));
const AdminSubscribers = lazy(() => import("./pages/admin/AdminSubscribers"));

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  return admin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
          <ScrollToTop />
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/*"
              element={
                <div id="app-public" className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/destinations" element={<Destinations />} />
                      <Route path="/destinations/:id" element={<DestinationDetails />} />
                      <Route path="/packages" element={<Packages />} />
                      <Route path="/packages/:id" element={<PackageDetails />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/booking" element={<Booking />} />
                      <Route path="/booking/:packageId" element={<Booking />} />
                      <Route path="/search" element={<SearchResults />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="destinations" element={<AdminDestinations />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="team" element={<AdminMembers />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Routes>
          </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
