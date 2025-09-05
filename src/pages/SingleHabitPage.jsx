import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api"; // Updated to use Axios instance
import HeatmapNew from "../components/HeatmapNew.jsx";

const SingleHabitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#000000");
  const [error, setError] = useState("");

  const fetchHabit = async () => {
    try {
      const res = await api.get(`/api/habits/${id}`); // Updated URL
      setHabit(res.data);
      setEditName(res.data.name);
      setEditColor(res.data.color || "#000000");
      setError("");
    } catch (err) {
      console.error("Error fetching habit", err);
      const errorMsg = err.response?.data?.error || "Failed to fetch habit";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const fetchDates = async (yearToFetch) => {
    try {
      const res = await api.get(`/api/habits/${id}/dates`); // Updated URL
      const logs = res.data
        .map(({ date, streak }) => ({
          date,
          value: streak >= 7 ? 3 : streak >= 4 ? 2 : 1,
        }))
        .filter((log) => new Date(log.date).getFullYear() === yearToFetch);
      setDates(logs);
      setError("");
    } catch (err) {
      console.error("Error fetching habit logs", err);
      const errorMsg =
        err.response?.data?.error || "Failed to fetch habit logs";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handleToggle = async () => {
    try {
      await api.post(`/api/habits/${id}/toggle`, { date: selectedDate }); // Updated URL
      await Promise.all([fetchHabit(), fetchDates(year)]);
      setError("");
    } catch (err) {
      console.error("Error toggling habit completion", err);
      const errorMsg =
        err.response?.data?.error || "Failed to toggle completion";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await api.delete(`/api/habits/${id}`); // Updated URL
        navigate("/"); // Redirect to habits list
        setError("");
      } catch (err) {
        console.error("Error deleting habit", err);
        const errorMsg = err.response?.data?.error || "Failed to delete habit";
        setError(errorMsg);
        if (err.response?.status === 401) navigate("/login");
      }
    }
  };

  const handleEdit = async () => {
    try {
      await api.put(`/api/habits/${id}`, { name: editName, color: editColor }); // Updated URL
      setIsEditing(false);
      await fetchHabit(); // Refresh habit data
      setError("");
    } catch (err) {
      console.error("Error editing habit", err);
      const errorMsg = err.response?.data?.error || "Failed to edit habit";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handlePrevYear = () => {
    setYear((prevYear) => prevYear - 1);
    fetchDates(year - 1);
  };

  const handleNextYear = () => {
    setYear((prevYear) => prevYear + 1);
    fetchDates(year + 1);
  };

  useEffect(() => {
    fetchHabit();
    fetchDates(year);
  }, [id, year]);

  return (
    <div className="min-h-screen pt-16 px-4 flex flex-col items-center justify-center bg-white">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {habit && (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="font-bold text-3xl mb-3 text-center">{habit.name}</h1>
          <div className="text-lg mb-3 text-center">
            Longest Streak: {habit.longestStreak} days | Current Streak:{" "}
            {habit.currentStreak} days
          </div>
          {isEditing ? (
            <div className="flex flex-col items-center gap-3 mb-3 w-full max-w-sm">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="p-1.5 text-sm border border-gray-300 rounded w-full"
              />
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                className="p-1.5 border border-gray-300 rounded w-full"
              />
              <button
                onClick={handleEdit}
                className="p-1.5 text-sm text-white rounded w-full"
                style={{ backgroundColor: editColor || "#007bff" }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 bg-gray-300 text-black rounded w-full text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 mb-3 w-full max-w-sm">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-1.5 text-sm border border-gray-300 rounded w-full"
              />
              <button
                onClick={handleToggle}
                className="p-1.5 text-sm text-white rounded w-full"
                style={{ backgroundColor: habit.color || "#007bff" }}
              >
                Toggle Completion
              </button>
              <div className="flex justify-around w-1/2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 bg-gray-300 text-black rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <HeatmapNew habit={habit} dates={dates} year={year} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleHabitPage;
