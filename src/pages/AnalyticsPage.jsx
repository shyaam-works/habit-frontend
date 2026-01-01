import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/LoadingKeys.css";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [overallGraphType, setOverallGraphType] = useState("weekly");
  const [individualGraphType, setIndividualGraphType] = useState("weekly");
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/analytics/all");
      setAnalytics(res.data);
      setError("");
    } catch (err) {
      console.error(
        "Error fetching analytics:",
        err.message,
        err.response?.data
      );
      const errorMsg = err.response?.data?.error || "Failed to fetch analytics";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Auto yearly view on Dec 31, 2025 + auto-select first habit
  useEffect(() => {
    if (!analytics) return;

    const today = new Date();
    const isYearEnd =
      today.getMonth() === 11 &&
      today.getDate() === 31 &&
      today.getFullYear() === 2025;

    if (isYearEnd) {
      setOverallGraphType("yearly");
      setIndividualGraphType("yearly");
    }

    if (!selectedHabitId && analytics.habitStats.length > 0) {
      setSelectedHabitId(analytics.habitStats[0]._id);
    }
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="loader">
          <div className="justify-content-center jimu-primary-loading"></div>
        </div>
      </div>
    );
  }

  if (error)
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  if (!analytics) return <div className="text-center mt-20">Loading...</div>;

  // Data preparation
  const overallData = Object.entries(
    analytics.graphData[overallGraphType] || {}
  )
    .map(([period, completed]) => ({ period, completed }))
    .sort((a, b) => a.period.localeCompare(b.period));

  const individualData = (() => {
    if (!selectedHabitId || !analytics.habitGraphData?.[selectedHabitId])
      return [];
    const data =
      analytics.habitGraphData[selectedHabitId][individualGraphType] || {};
    return Object.entries(data)
      .map(([period, completed]) => ({ period, completed }))
      .sort((a, b) => a.period.localeCompare(b.period));
  })();

  const selectedHabit = analytics.habitStats.find(
    (h) => h._id === selectedHabitId
  );

  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto mb-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100 mt-8">
        Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Overall Consistency",
            value: `${analytics.overallConsistency}%`,
          },
          {
            label: "Current Streak",
            value: `${analytics.overallCurrentStreak} days`,
          },
          {
            label: "Longest Streak",
            value: `${analytics.overallLongestStreak} days`,
          },
          { label: "Missed Days", value: analytics.missedDays },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-3xl font-bold mt-3 text-emerald-600 dark:text-emerald-400">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Best / Worst Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Best Day</p>
          <p className="text-2xl font-bold mt-3">
            {analytics.bestDay || "N/A"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Worst Day</p>
          <p className="text-2xl font-bold mt-3">
            {analytics.worstDay || "N/A"}
          </p>
        </div>
      </div>

      {/* Habit Summary Cards (Clickable) */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Your Habits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics.habitStats.map((habit) => (
            <Link
              key={habit._id}
              to={`/habit/${habit._id}`}
              className={`block p-6 rounded-xl shadow-lg border-2 transition hover:shadow-2xl hover:-translate-y-1 ${
                selectedHabitId === habit._id
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300"
              }`}
            >
              <h3 className="text-xl font-bold">{habit.name}</h3>
              <p className="text-2xl font-semibold mt-3 text-emerald-600 dark:text-emerald-400">
                {habit.consistency}% consistency
              </p>
              <div className="mt-5 grid grid-cols-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Longest: {habit.longestStreak} days</span>
                <span>Current: {habit.currentStreak} days</span>
              </div>
              <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Today: {habit.completedToday ? "✅ Completed" : "❌ Missed"}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* CHARTS + SELECTOR: Perfect parallel layout */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-10">
          Progress Over Time
        </h2>

        {/* Habit Selector in the middle top */}
        <div className="max-w-2xl mx-auto mb-10">
          <label className="block text-lg font-medium text-center mb-3 text-gray-700 dark:text-gray-300">
            Select Habit for Detailed View
          </label>
          <select
            value={selectedHabitId || ""}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-800 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 transition"
          >
            {analytics.habitStats.map((habit) => (
              <option key={habit._id} value={habit._id}>
                {habit.name} — {habit.consistency}% consistency
              </option>
            ))}
          </select>
        </div>

        {/* Two Charts Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: Individual Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-6">
              {selectedHabit?.name || "Habit"} Progress
            </h3>

            <div className="flex justify-center gap-4 mb-8">
              {["weekly", "monthly", "yearly"].map((type) => (
                <button
                  key={type}
                  onClick={() => setIndividualGraphType(type)}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    individualGraphType === type
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={individualData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="period"
                  angle={individualGraphType === "weekly" ? -45 : 0}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v} completions`} />
                <Bar
                  dataKey="completed"
                  fill="#10b981"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="text-center mt-8">
              <p className="text-lg">
                {individualGraphType.charAt(0).toUpperCase() +
                  individualGraphType.slice(1)}{" "}
                completions for{" "}
                <Link
                  to={`/habit/${selectedHabitId}`}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition"
                >
                  {selectedHabit?.name}
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT: Overall Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-6">
              Overall Progress
            </h3>

            <div className="flex justify-center gap-4 mb-8">
              {["weekly", "monthly", "yearly"].map((type) => (
                <button
                  key={type}
                  onClick={() => setOverallGraphType(type)}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    overallGraphType === type
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={overallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="period"
                  angle={-30}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v} completions`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ fill: "#10b981", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <p className="text-center mt-6 text-lg">
              Total completions across all habits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
