import React from "react";

import DashboardCard from "./DashboardCard";

import {
  FaUsers,
  FaUserCheck,
  FaShieldAlt,
  FaBell,
  FaUserSecret,
  FaExclamationTriangle,
  FaSearchLocation,
  FaGavel,
  FaHospital
} from "react-icons/fa";

function DashboardGrid() {

  const dashboardData = [

    {
      title: "Pilot Area Registrations",
      value: "1,246",
      description: "+126 this week",
      icon: <FaUsers />,
      color: "border-blue-500",
    },

    {
      title: "Active Visitors On Site",
      value: "824",
      description: "66% currently checked in",
      icon: <FaUserCheck />,
      color: "border-green-500",
    },

    {
      title: "Visitors in Covered Zones",
      value: "790",
      description: "Ready for future geo-fence coverage",
      icon: <FaShieldAlt />,
      color: "border-cyan-500",
    },

    {
      title: "SOS Alerts Today",
      value: "5",
      description: "2 pending escalation",
      icon: <FaBell />,
      color: "border-red-500",
    },

    {
      title: "Visitors Requiring Follow-Up",
      value: "4",
      description: "High priority cases",
      icon: <FaUserSecret />,
      color: "border-yellow-500",
    },

    {
      title: "Incident Reports",
      value: "9",
      description: "3 under investigation",
      icon: <FaExclamationTriangle />,
      color: "border-orange-500",
    },

    {
      title: "Risk Signals Logged",
      value: "8",
      description: "Prepared for AI prediction",
      icon: <FaSearchLocation />,
      color: "border-purple-500",
    },

    {
      title: "Police Coordination Cases",
      value: "6",
      description: "4 active",
      icon: <FaGavel />,
      color: "border-indigo-500",
    },

    {
      title: "Medical Response Partners",
      value: "3",
      description: "All online",
      icon: <FaHospital />,
      color: "border-pink-500",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {dashboardData.map((card, index) => (

        <DashboardCard
          key={index}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          color={card.color}
        />

      ))}

    </div>

  );

}

export default DashboardGrid;
