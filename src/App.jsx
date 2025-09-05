import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AllHabitsPage from "./pages/AllHabitsPage";
import AddHabitPage from "./pages/AddHabitPage";
import SingleHabitPage from "./pages/SingleHabitPage";
import AllHabitsHeatPage from "./pages/AllHabitsHeatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AllHabitsPage />} />
          <Route path="/add" element={<AddHabitPage />} />
          <Route path="/habit/:id" element={<SingleHabitPage />} />
          <Route path="/all-habits-heat" element={<AllHabitsHeatPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
