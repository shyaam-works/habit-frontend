import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import HeatmapNew from "../components/HeatmapNew.jsx";
import "../styles/LoadingKeys.css";

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchHabit = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/habits/${id}`);
      setHabit(res.data);
      setEditName(res.data.name);
      setEditColor(res.data.color || "#000000");
      setError("");
    } catch (err) {
      console.error("Error fetching habit", err);
      const errorMsg = err.response?.data?.error || "Failed to fetch habit";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDates = async (yearToFetch) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/habits/${id}/dates`);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await api.post(`/api/habits/${id}/toggle`, { date: selectedDate });
      await Promise.all([fetchHabit(), fetchDates(year)]);
      setError("");
    } catch (err) {
      console.error("Error toggling habit completion", err);
      const errorMsg =
        err.response?.data?.error || "Failed to toggle completion";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        setIsLoading(true);
        await api.delete(`/api/habits/${id}`);
        navigate("/");
        setError("");
      } catch (err) {
        console.error("Error deleting habit", err);
        const errorMsg = err.response?.data?.error || "Failed to delete habit";
        setError(errorMsg);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      await api.put(`/api/habits/${id}`, { name: editName, color: editColor });
      setIsEditing(false);
      await fetchHabit();
      setError("");
    } catch (err) {
      console.error("Error editing habit", err);
      const errorMsg = err.response?.data?.error || "Failed to edit habit";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
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
      {isLoading ? (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative">
          <div className="loader">
            <div className="justify-content-center jimu-primary-loading"></div>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
          {habit && (
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
              <h1 className="font-bold text-3xl mb-3 text-center md:text-3xl">
                {habit.name}
              </h1>
              <div className="text-lg mb-3 text-center md:text-lg">
                Longest Streak: {habit.longestStreak} days | Current Streak:{" "}
                {habit.currentStreak} days
              </div>
              {isEditing ? (
                <div className="flex flex-col items-center gap-3 mb-3 w-full max-w-[90%] md:max-w-sm">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-1.5 text-xs md:text-sm border border-gray-300 rounded w-full"
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="p-1.5 border border-gray-300 rounded w-full"
                  />
                  <button
                    onClick={handleEdit}
                    className="p-1.5 text-xs md:text-sm text-white rounded w-full min-w-[80px]"
                    style={{ backgroundColor: editColor || "#007bff" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 bg-gray-300 text-black rounded w-full text-xs md:text-sm min-w-[80px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 mb-3 w-full max-w-[90%] md:max-w-sm">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-1.5 text-xs md:text-sm border border-gray-300 rounded w-full"
                  />
                  <button
                    onClick={handleToggle}
                    className="p-1.5 text-xs md:text-sm text-white rounded w-full min-w-[80px]"
                    style={{ backgroundColor: habit.color || "#007bff" }}
                  >
                    Toggle Completion
                  </button>
                  <div className="flex justify-around w-full md:w-1/2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 bg-gray-300 text-black rounded text-xs md:text-sm min-w-[80px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1.5 bg-red-500 text-white rounded text-xs md:text-sm min-w-[80px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <div className="w-[90vw] sm:w-full overflow-x-auto sm:overflow-x-visible pb-6">
                  <HeatmapNew habit={habit} dates={dates} year={year} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleHabitPage;
