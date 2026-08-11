import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

import "./MedicineChart.css";


const medicineData = [
  {
    name: "Taken",
    value: 82
  },
  {
    name: "Missed",
    value: 12
  },
  {
    name: "Skipped",
    value: 6
  }
];


const COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444"
];


export default function MedicineChart() {

  const compliance = medicineData[0].value;


  return (
    <div className="medicine-card">

      <div className="medicine-header">

        <div>
          <h3>Medicine Adherence</h3>
          <p>Medication Compliance Overview</p>
        </div>

        <div className="medicine-score">
          {compliance}%
        </div>

      </div>


      <ResponsiveContainer width="100%" height={320}>

        <PieChart>

          <Pie
            data={medicineData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={4}
            dataKey="value"
            label
          >

            {medicineData.map((entry,index)=>(
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}

          </Pie>


          <Tooltip />

          <Legend />


        </PieChart>


      </ResponsiveContainer>


      <div className="medicine-summary">


        <div className="medicine-box success">
          <h4>Taken</h4>
          <span>82%</span>
        </div>


        <div className="medicine-box warning">
          <h4>Missed</h4>
          <span>12%</span>
        </div>


        <div className="medicine-box danger">
          <h4>Skipped</h4>
          <span>6%</span>
        </div>


      </div>


    </div>
  );
}