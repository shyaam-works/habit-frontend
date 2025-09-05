import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api"; // Updated to use Axios instance
import HeatmapNew from "../components/HeatmapNew.jsx";

const HabitHeatmapCard = ({ habitId }) => {
  const calRef = useRef(null);
  const [habit, setHabit] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchHabit = async () => {
    try {
      const res = await api.get(`/api/habits/${habitId}`); // Updated URL
      setHabit(res.data);
      console.log(`Fetched habit ${habitId}:`, res.data);
    } catch (err) {
      console.error("Error fetching habit", err);
    }
  };

  const fetchDates = async () => {
    try {
      const res = await api.get(`/api/habits/${habitId}/dates`); // Updated URL
      const logs = res.data.map(({ date, streak }) => ({
        date,
        value: streak >= 7 ? 3 : streak >= 4 ? 2 : 1,
      }));
      console.log(`Fetched dates logs for ${habitId}:`, logs);
      setDates(logs);
    } catch (err) {
      console.error("Error fetching habit logs", err);
    }
  };

  useEffect(() => {
    fetchHabit();
    fetchDates();
  }, [habitId]);

  const handleToggle = async () => {
    try {
      if (habit) {
        await api.post(`/api/habits/${habitId}/toggle`, {
          // Updated URL
          date: selectedDate,
        });
        await Promise.all([fetchDates(), fetchHabit()]);
      }
    } catch (err) {
      console.error("Error toggling habit completion", err);
      alert("Failed to toggle completion");
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {habit && (
        <>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            {habit.name}
          </h1>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={handleToggle}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                backgroundColor: habit.color || "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Toggle Completion
            </button>
            <Link
              to={`/habit/${habitId}`}
              style={{
                fontSize: "1rem",
                color: "#007bff",
                textDecoration: "underline",
              }}
            >
              View Details
            </Link>
          </div>
        </>
      )}
      <div
        ref={calRef}
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <HeatmapNew habit={habit} dates={dates} />
      </div>
    </div>
  );
};

export default HabitHeatmapCard;
