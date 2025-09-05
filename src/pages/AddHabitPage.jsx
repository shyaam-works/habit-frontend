import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HexColorPicker } from "react-colorful";

const AddHabitPage = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FF6347"); // Default to Tomato
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !/^#([0-9A-F]{6})$/i.test(color)) {
      setError("Please enter a valid habit name and hex color (e.g., #FF6347)");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/habits",
        { name, color },
        { withCredentials: true }
      );
      setError("");
      navigate("/");
    } catch (err) {
      console.error("Error adding habit", err);
      const errorMsg = err.response?.data?.error || "Failed to add habit";
      setError(errorMsg);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const getLighterShades = (color) => {
    const lighten = (hex, percent) => {
      hex = hex.replace(/^#/, "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const factor = 1 + percent / 100;
      const newR = Math.min(255, Math.round(r * factor));
      const newG = Math.min(255, Math.round(g * factor));
      const newB = Math.min(255, Math.round(b * factor));
      return `#${newR.toString(16).padStart(2, "0")}${newG
        .toString(16)
        .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
    };
    return [
      lighten(color, 10),
      lighten(color, 20),
      lighten(color, 30),
      lighten(color, 40),
      color,
    ];
  };

  return (
    <main className="w-full min-h-screen pt-24 px-4 bg-gray-100 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Habit</h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-1">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read 10 pages"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">
              Pick a Color
            </label>
            <HexColorPicker
              color={color}
              onChange={setColor}
              className="mb-4 rounded shadow"
            />
            <div className="flex gap-2">
              {getLighterShades(color).map((shade, index) => (
                <div
                  key={index}
                  className="w-7 h-7 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: shade }}
                  onClick={() => setColor(shade)}
                  title={`Shade ${index + 1}`}
                ></div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600">Selected: {color}</p>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white text-lg rounded-md hover:bg-green-700 transition"
          >
            Add Habit
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddHabitPage;
