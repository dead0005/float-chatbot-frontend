import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const ArgoChart = ({ darkMode }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = [];
    for (let day = 1; day <= 7; day++) {
      data.push({
        day: `Day ${day}`,
        Temperature: +(28 + Math.random() * 2 - 1).toFixed(2),
        Salinity: +(36 + Math.random() * 0.5 - 0.25).toFixed(2)
      });
    }
    setChartData(data);
  }, []);

  return (
    <div className={`h-full p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        ARGO Data Chart
      </h3>
      {chartData.length === 0 ? (
        <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke={darkMode ? '#fff' : '#333'} />
            <YAxis stroke={darkMode ? '#fff' : '#333'} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Temperature"
              stroke="#3b82f6"
              name="Temperature"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Salinity"
              stroke="#f59e0b"
              name="Salinity"
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ArgoChart;
