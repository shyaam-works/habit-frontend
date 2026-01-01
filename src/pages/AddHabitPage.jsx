import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { HexColorPicker } from "react-colorful";

const AddHabitPage = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#10b981");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !/^#([0-9A-F]{6})$/i.test(color)) {
      setError("Valid name and hex color required");
      return;
    }
    try {
      await api.post("/api/habits", { name, color });
      navigate("/habits");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add habit");
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const getLighterShades = (hex) => {
    const lighten = (h, percent) => {
      let r = parseInt(h.slice(1, 3), 16);
      let g = parseInt(h.slice(3, 5), 16);
      let b = parseInt(h.slice(5, 7), 16);
      r = Math.min(255, Math.round(r * (1 + percent / 100)));
      g = Math.min(255, Math.round(g * (1 + percent / 100)));
      b = Math.min(255, Math.round(b * (1 + percent / 100)));
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    };
    return [
      lighten(hex, 90), // Lightest - Day 1
      lighten(hex, 60), // Day 3
      lighten(hex, 30), // Medium
      hex, // Darkest - Longer streaks
    ];
  };

  const shades = getLighterShades(color);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
            Add New Habit
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Left: Color Picker + Preview */}
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Pick a Base Color
                </h2>

                <div className="mb-6">
                  <HexColorPicker color={color} onChange={setColor} />
                </div>

                {/* Streak Preview - Darkens left to right */}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Your streak will darken:
                  </p>
                  <div className="flex justify-center items-end gap-3">
                    <div
                      className="w-10 h-10 rounded-lg shadow"
                      style={{ backgroundColor: shades[0] }}
                    />
                    <div
                      className="w-12 h-12 rounded-lg shadow-md"
                      style={{ backgroundColor: shades[1] }}
                    />
                    <div
                      className="w-14 h-14 rounded-lg shadow-lg border-2 border-white"
                      style={{ backgroundColor: shades[2] }}
                    />
                    <div
                      className="w-12 h-12 rounded-lg shadow-md opacity-90"
                      style={{ backgroundColor: shades[3] }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Day 1 → Day 3 → Longer
                  </p>
                </div>

                <p className="mt-5 text-center text-sm font-medium text-gray-700">
                  Selected:{" "}
                  <span className="font-mono text-emerald-600">
                    {color.toUpperCase()}
                  </span>
                </p>
              </div>

              {/* Right: Name Input + Tip */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <label className="block text-xl font-medium text-gray-800 mb-3">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Meditate, Read, Exercise"
                    className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    required
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <p className="text-sm font-medium text-emerald-800 leading-relaxed">
                    💡 <strong>Tip:</strong> Choose a{" "}
                    <strong>light or medium</strong> color (like pastels or soft
                    tones) so the darkening effect on longer streaks looks rich
                    and satisfying!
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Habit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddHabitPage;
