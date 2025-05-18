import React from 'react';
import {
    BarChart, 
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

const CustomBarChart = ({data}) => {
    // Function to alternate colors
    const getBarColor = (entry) => {
        switch (entry?.priority) {
            case "Baixo":
                return "#00BC7D";
            case "Médio":
                return "#FE9900";
            case "Alto":
                return "#00BC7D";
            default:
                return "#8884d8"; // Cor padrão caso não encontre
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                    <p className='text-xs font-semibold text-purple-800 mb-1'>
                        {payload[0].payload.priority}
                    </p>
                    <p className='text-sm text-gray-600'>
                        Contador:{" "}
                        <span className='text-sm font-medium text-gray-900'>
                            {payload[0].payload.count}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='bg-white mt-6'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    
                    <XAxis
                        dataKey="priority"
                        tick={{ fontSize: 12, fill: "#555" }}
                        stroke="none"
                    />
                    <YAxis 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        stroke="none" 
                    />
                    
                    <Tooltip 
                        content={CustomTooltip} 
                        cursor={{ fill: "transparent" }} 
                    />
                    
                    <Bar
                        dataKey="count"
                        nameKey="priority"
                        radius={[10, 10, 0, 0]}
                        activeBar={{ fill: "#82ca9d" }}
                    >
                        {data?.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={getBarColor(entry)} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;