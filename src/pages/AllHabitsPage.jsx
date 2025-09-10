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
          color: habit.color,
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
    <main className="w-full pt-24 px-8 bg-gray-100 min-h-screen">
      <div className="mt-16 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md relative md:mt-8">
        {isLoading ? (
          <div className="loader">
            <div className="justify-content-center jimu-primary-loading"></div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">All Habits</h1>
            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}
            {habits.length === 0 && !error ? (
              <p className="text-gray-500 text-center">No habits yet.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {habits.map((habit) => (
                  <li key={habit._id}>
                    <Link
                      to={`/habit/${habit._id}`}
                      className="block p-6 rounded-lg shadow hover:shadow-md transition-all border hover:border-blue-500 min-w-[80px]"
                    >
                      <p className="text-sm md:text-xl font-semibold text-gray-800">
                        {habit.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default AllHabitsPage;
