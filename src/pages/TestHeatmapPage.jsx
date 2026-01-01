import React from "react";
import HeatmapNew from "../components/HeatmapNew.jsx";

// Sample data for testing — replace with your real data if needed
const mockHabit = {
  _id: "test123",
  name: "Test Habit",
  color: "#10b981", // emerald-600
};

const mockDates = [
  { date: "2025-01-05", value: 1 },
  { date: "2025-01-06", value: 2 },
  { date: "2025-01-07", value: 3 },
  { date: "2025-01-15", value: 2 },
  { date: "2025-02-01", value: 3 },
  { date: "2025-03-10", value: 1 },
  { date: "2025-12-25", value: 3 },
  // Add more dates as needed for testing
];

const TestHeatmapPage = () => {
  return (
    <div className="w-full flex justify-center bg-black border-blue-950">
      <HeatmapNew
        habit={mockHabit}
        dates={mockDates}
        year={2025} // Change to test different years
      />
    </div>
  );
};

export default TestHeatmapPage;
