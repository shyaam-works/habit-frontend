import React, { useEffect, useRef, useState } from "react";
import CalHeatmap from "cal-heatmap";
import TooltipPlugin from "cal-heatmap/plugins/Tooltip"; // Import tooltip plugin
import "cal-heatmap/cal-heatmap.css";

// Function to darken a hex color by reducing lightness
const darkenColor = (hex, percent) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  l = Math.max(0, Math.min(1, l - percent / 100));
  let m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s;
  let m1 = 2 * l - m2;

  const hueToRgb = (m1, m2, h) => {
    if (h < 0) h += 1;
    if (h > 1) h -= 1;
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
    return m1;
  };

  const rNew = hueToRgb(m1, m2, h + 1 / 3) * 255;
  const gNew = hueToRgb(m1, m2, h) * 255;
  const bNew = hueToRgb(m1, m2, h - 1 / 3) * 255;

  return `#${Math.round(rNew).toString(16).padStart(2, "0")}${Math.round(gNew)
    .toString(16)
    .padStart(2, "0")}${Math.round(bNew).toString(16).padStart(2, "0")}`;
};

const HeatmapNew = ({ habit, dates }) => {
  const calRef = useRef(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!habit || !dates || dates.length === 0) return;

    const cal = new CalHeatmap();

    // Filter dates for the current year
    const yearDates = dates.filter(
      (d) => new Date(d.date).getFullYear() === currentYear
    );

    // Use habit.color or fallback
    const baseColor = habit?.color || "#16a34a";
    const color1 = baseColor;
    const color2 = darkenColor(baseColor, 20);
    const color3 = darkenColor(baseColor, 40);

    cal.paint(
      {
        itemSelector: calRef.current,
        date: {
          start: new Date(currentYear, 1, 1), // Starts Jan 1 of selected year
        },
        range: 12, // Full 12 months
        domain: {
          type: "month",
          gutter: 16,
          label: {
            position: "bottom",
            text: (timestamp) =>
              new Date(timestamp).toLocaleString("default", { month: "short" }),
            offset: { x: 0, y: 16 },
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        subDomain: {
          type: "day",
          width: 18,
          height: 18,
          radius: 2,
          label: "",
        },
        data: {
          source: yearDates,
          type: "json",
          x: "date",
          y: "value",
        },
        scale: {
          color: {
            type: "threshold",
            domain: [1, 2, 3],
            range: ["#eeeeee", color1, color2, color3],
          },
        },
        theme: "light",
      },
      [
        [
          TooltipPlugin,
          {
            enabled: true,
            text: (ts, value, dayjsDate) => {
              const formattedDate = dayjsDate.format("MMM D, YYYY");
              return formattedDate;
            },
          },
        ],
      ]
    );

    return () => {
      cal.destroy();
    };
  }, [habit, dates, currentYear]);

  const handlePrevYear = () => setCurrentYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setCurrentYear((prevYear) => prevYear + 1);

  return (
    <div className="w-full flex flex-col">
      <style>{`
        .ch-domain-text {
          font-size: 14px !important;
        }
      `}</style>
      <div className="flex gap-4 mb-4 ml-4 ">
        <button
          onClick={handlePrevYear}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Prev Yr
        </button>
        <p className="px-2 py-1 bg-gray-200 rounded text-sm">{currentYear}</p>
        <button
          onClick={handleNextYear}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Next Yr
        </button>
      </div>
      <div className="w-full flex justify-center items-center">
        <div ref={calRef} className="w-full max-w-full" />
      </div>
    </div>
  );
};

export default HeatmapNew;
