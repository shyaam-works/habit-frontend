import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AllHabitsPage from "./pages/AllHabitsPage";
import AddHabitPage from "./pages/AddHabitPage";
import SingleHabitPage from "./pages/SingleHabitPage";
import AllHabitsHeatPage from "./pages/AllHabitsHeatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LandingPage from "./pages/Landing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Required!
import TestHeatmapPage from "./pages/TestHeatmapPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/habits" element={<AllHabitsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/add" element={<AddHabitPage />} />
          <Route path="/habit/:id" element={<SingleHabitPage />} />
          <Route path="/all-habits-heat" element={<AllHabitsHeatPage />} />
        </Route>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<TestHeatmapPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>

      {/* Clean ToastContainer - styling done via CSS */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
