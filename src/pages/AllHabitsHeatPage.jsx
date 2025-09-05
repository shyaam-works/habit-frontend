import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeatmapNew from "../components/HeatmapNew.jsx";

const AllHabitsHeatPage = () => {
  const calRef = useRef(null);
  const [habits, setHabits] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchHabits = async () => {
    try {
      console.log("Fetching habits...");
      const habitsRes = await axios.get(
        "http://localhost:5000/api/habits/all",
        {
          withCredentials: true,
        }
      );
      console.log("Habits response:", habitsRes.data);
      const datesRes = await axios.get(
        "http://localhost:5000/api/habits/all/dates",
        { withCredentials: true }
      );
      console.log("Dates response:", datesRes.data);

      const habitsData = habitsRes.data;
      const datesData = datesRes.data;

      if (!habitsData.length || !datesData.length) {
        setHabits([]);
        setError("");
        return;
      }

      const habitsWithData = habitsData.map((habit) => {
        const habitDates =
          datesData.find((d) => d._id.toString() === habit._id.toString())
            ?.completedDays || [];
        console.log(`Habit ${habit._id} dates:`, habitDates);
        const logs = habitDates
          .filter((d) => {
            const date = new Date(d.date);
            return date.getFullYear() === year;
          })
          .map(({ date, streak }) => ({
            date,
            value: streak >= 7 ? 3 : streak >= 4 ? 2 : 1,
          }));
        // Add dummy entry for January 1, 2025, to anchor the start
        if (
          logs.length === 0 ||
          new Date(logs[0].date) > new Date(year, 0, 1)
        ) {
          logs.unshift({ date: `${year}-01-01`, value: 0 });
        }
        return {
          habit: {
            _id: habit._id,
            name: habit.name,
            color: habit.color,
            shades: habit.shades,
            longestStreak: habit.longestStreak,
            currentStreak: habit.currentStreak,
          },
          dates: logs,
        };
      });
      setHabits(habitsWithData);
      setError("");
    } catch (err) {
      console.error(
        "Error fetching habits or dates",
        err.message,
        err.response?.data
      );
      const errorMsg =
        err.response?.data?.error || "Failed to fetch habits or dates";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const handlePrevYear = () => {
    setYear((prevYear) => prevYear - 1);
    fetchHabits();
  };

  const handleNextYear = () => {
    setYear((prevYear) => prevYear + 1);
    fetchHabits();
  };

  useEffect(() => {
    fetchHabits();
  }, [year]);

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center max-w-5xl mb-4 mx-4">
      <style>{`
             .ch-domain-text {
               font-size: 14px !important;
             }
           `}</style>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {habits.length === 0 && !error ? (
        <p className="text-lg">No habits found. Create one!</p>
      ) : (
        habits.map((habitData) => (
          <div key={habitData.habit._id} className="w-full mt-4">
            <div className="flex items-center justify-center mb-2 w-screen">
              <h1 className="text-3xl font-bold">{habitData.habit.name}</h1>
              <button
                onClick={() => navigate(`/habit/${habitData.habit._id}`)}
                className="ml-4 px-2 py-1 text-sm font-normal text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
              >
                View Details
              </button>
            </div>
            <div className="text-lg mb-2 text-center w-screen justify-center">
              Longest Streak: {habitData.habit.longestStreak} days | Current
              Streak: {habitData.habit.currentStreak} days
            </div>
            <div className="flex mb-8">
              <HeatmapNew
                habit={habitData.habit}
                dates={habitData.dates}
                year={year}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllHabitsHeatPage;
