import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import HeatmapNew from "../components/HeatmapNew.jsx";
import "../styles/LoadingKeys.css";

const AllHabitsHeatPage = () => {
  const calRef = useRef(null);
  const [habits, setHabits] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching habits...");
      const habitsRes = await api.get("/api/habits/all");
      console.log("Habits response:", habitsRes.data);
      const datesRes = await api.get("/api/habits/all/dates");
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [year]);

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col items-center">
      <style>{`
        .ch-domain-text {
          font-size: 14px !important;
          white-space: nowrap !important;
        }
      `}</style>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="loader">
            <div className="justify-content-center jimu-primary-loading"></div>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
          {habits.length === 0 && !error ? (
            <p className="text-sm md:text-lg text-center mt-20">
              No habits found. Create one!
            </p>
          ) : (
            habits.map((habitData) => (
              <div key={habitData.habit._id} className="w-full mt-12">
                {/* Header */}
                <div className="flex flex-col items-center mb-8 mt-14 md:mt-8">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-center">
                      {habitData.habit.name}
                    </h1>
                    <button
                      onClick={() => navigate(`/habit/${habitData.habit._id}`)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Streak Info */}
                <div className="text-center text-sm md:text-lg mb-8">
                  Longest Streak: {habitData.habit.longestStreak} days | Current
                  Streak: {habitData.habit.currentStreak} days
                </div>

                {/* Heatmap - Perfectly centered like SingleHabitPage */}
                <div className="flex justify-center">
                  <div className="w-[90vw] sm:w-full overflow-x-auto sm:overflow-x-visible pb-6">
                    <HeatmapNew
                      habit={habitData.habit}
                      dates={habitData.dates}
                      year={year}
                      onPrevYear={() => setYear((y) => y - 1)}
                      onNextYear={() => setYear((y) => y + 1)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default AllHabitsHeatPage;
