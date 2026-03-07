import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const getSetupStatus = () => API.get("/auth/setup-status");
export const setupFirstAdmin = (data) => API.post("/auth/setup", data);
export const loginAdmin = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updateAdminProfile = (data) => API.put("/auth/profile", data);
export const changeAdminPassword = (data) => API.put("/auth/password", data);

// ========== ADMIN MANAGEMENT ==========
export const getAdmins = () => API.get("/admins");
export const createAdmin = (data) => API.post("/admins", data);
export const deleteAdmin = (id) => API.delete(`/admins/${id}`);
export const getAdminActivity = () => API.get("/admins/activity");
export const deleteActivityLog = (type, id) => API.delete(`/admins/activity/log/${type}/${id}`);
export const clearAllActivityLogs = () => API.delete("/admins/activity/logs");

// ========== DESTINATIONS ==========
export const getDestinations = (params) => API.get("/destinations", { params });
export const getDestinationsAdmin = () => API.get("/destinations/all");
export const getDestination = (id) => API.get(`/destinations/${id}`);
export const getDestinationStates = () => API.get("/destinations/states");
export const createDestination = (data) => API.post("/destinations", data);
export const updateDestination = (id, data) => API.put(`/destinations/${id}`, data);
export const deleteDestination = (id) => API.delete(`/destinations/${id}`);

// ========== PACKAGES ==========
export const getPackages = (params) => API.get("/packages", { params });
export const getPackagesAdmin = () => API.get("/packages/all");
export const getPackage = (id) => API.get(`/packages/${id}`);
export const createPackage = (data) => API.post("/packages", data);
export const updatePackage = (id, data) => API.put(`/packages/${id}`, data);
export const deletePackage = (id) => API.delete(`/packages/${id}`);

// ========== GLOBAL SEARCH ==========
export const globalSearch = (params) => API.get("/search", { params });
export const getSearchSuggestions = (q) => API.get("/search/suggestions", { params: { q } });

// ========== TESTIMONIALS ==========
export const getTestimonials = () => API.get("/testimonials");
export const getTestimonialsAdmin = () => API.get("/testimonials/all");
export const createTestimonial = (data) => API.post("/testimonials", data);
export const updateTestimonial = (id, data) => API.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => API.delete(`/testimonials/${id}`);
export const submitReview = (data) => API.post("/testimonials/submit", data);

// ========== BLOGS ==========
export const getBlogs = (params) => API.get("/blogs", { params });
export const getBlogsAdmin = () => API.get("/blogs/all");
export const getBlog = (id) => API.get(`/blogs/${id}`);
export const createBlog = (data) => API.post("/blogs", data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

// ========== CONTACTS ==========
export const submitContact = (data) => API.post("/contacts", data);
export const getContacts = () => API.get("/contacts");
export const updateContact = (id, data) => API.put(`/contacts/${id}`, data);
export const deleteContact = (id) => API.delete(`/contacts/${id}`);
export const replyContact = (id, data) => API.post(`/contacts/${id}/reply`, data);

// ========== BOOKINGS ==========
export const submitBooking = (data) => API.post("/bookings", data);
export const getBookings = () => API.get("/bookings");
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);
export const replyBooking = (id, data) => API.post(`/bookings/${id}/email`, data);

// ========== STATS ==========
export const getStats = () => API.get("/stats");
export const getPublicStats = () => API.get("/stats/public");

// ========== SUBSCRIBERS ==========
export const subscribeNewsletter = (data) => API.post("/subscribers", data);
export const getSubscribers = () => API.get("/subscribers");
export const deleteSubscriber = (id) => API.delete(`/subscribers/${id}`);
export const toggleSubscriber = (id) => API.put(`/subscribers/${id}/toggle`);
export const sendSubscriberEmail = (data) => API.post("/subscribers/send-email", data);

// ========== IMAGE UPLOAD ==========
export const uploadImage = (file, folder) => {
  const formData = new FormData();
  formData.append("image", file);
  if (folder) formData.append("folder", folder);
  return API.post("/upload", formData);
};

export default API;
