import React from "react";

function DashboardCard({
  title,
  value,
  icon,
  color,
  description,
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-l-8 ${color} p-5 hover:shadow-xl transition`}
    >
      <div className="flex justify-between items-center">

        <div>

          <h4 className="text-gray-500 text-sm font-semibold">
            {title}
          </h4>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-gray-400 text-sm mt-3">
            {description}
          </p>

        </div>

        <div
          className="text-5xl text-gray-300"
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default DashboardCard;