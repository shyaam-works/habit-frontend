import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/LoadingKeys.css";

const AllHabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/habits/all");
      setHabits(
        res.data.map((habit) => ({
          _id: habit._id,
          name: habit.name,
          color: habit.color || "#10b981", // fallback to emerald-500
          longestStreak: habit.longestStreak,
          currentStreak: habit.currentStreak,
        }))
      );
      setError("");
    } catch (err) {
      console.error("Error fetching habits", err);
      const errorMsg = err.response?.data?.error || "Failed to fetch habits";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-24 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 md:p-10">
          <h1 className="text-4xl font-extrabold text-center text-gray-600 mb-10 ">
            All Habits
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loader">
                <div className="justify-content-center jimu-primary-loading"></div>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center font-medium">
                  {error}
                </div>
              )}

              {habits.length === 0 && !error ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-5xl">📅</span>
                  </div>
                  <p className="text-xl text-gray-600 font-medium">
                    No habits yet.
                  </p>
                  <p className="text-gray-500 mt-3">
                    Start building your streak by adding your first habit!
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {habits.map((habit) => (
                    <li key={habit._id}>
                      <Link
                        to={`/habit/${habit._id}`}
                        className="block relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 group"
                      >
                        {/* Colored accent bar at top */}
                        <div
                          className="h-2 w-full"
                          style={{ backgroundColor: habit.color }}
                        />

                        <div className="p-8 text-center">
                          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 mb-6">
                            {habit.name}
                          </h3>

                          <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold text-emerald-600">
                                Current Streak:
                              </span>{" "}
                              <span className="font-bold text-lg text-gray-900">
                                {habit.currentStreak}{" "}
                                {habit.currentStreak === 1 ? "day" : "days"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Longest:{" "}
                              <span className="font-semibold">
                                {habit.longestStreak}
                              </span>{" "}
                              days
                            </div>
                          </div>
                        </div>

                        {/* Subtle hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default AllHabitsPage;
