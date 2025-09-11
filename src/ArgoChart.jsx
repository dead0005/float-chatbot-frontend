import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ArgoChart = ({ darkMode, floats }) => {
  if (!floats || floats.length === 0) return <p>No profile data available.</p>;

  return (
    <div className={`h-full p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
        ARGO Profile Chart
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="time" stroke={darkMode ? "#fff" : "#333"} />
          <YAxis type="number" dataKey="value" stroke={darkMode ? "#fff" : "#333"} />
          <Tooltip />
          <Legend />
          {floats.map((f, i) => (
            <>
              <Scatter
                key={`${f.id}-temp`}
                name={`${f.id} Temperature`}
                data={f.profiles.map(p => ({ time: p.time, value: p.temperature }))}
                fill={["#3b82f6", "#10b981", "#ef4444"][i % 3]}
              />
              <Scatter
                key={`${f.id}-sal`}
                name={`${f.id} Salinity`}
                data={f.profiles.map(p => ({ time: p.time, value: p.salinity }))}
                fill={["#f59e0b", "#8b5cf6", "#ec4899"][i % 3]}
              />
            </>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ArgoChart;
