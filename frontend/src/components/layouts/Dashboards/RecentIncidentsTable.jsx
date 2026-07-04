import React from "react";

function RecentIncidentsTable() {

  const incidents = [

    {
      id: "INC001",
      tourist: "John Smith",
      incident: "Theft",
      location: "Heritage Plaza",
      priority: "Medium",
      status: "Investigating",
    },

    {
      id: "INC002",
      tourist: "Rahul Kumar",
      incident: "Missing Tourist",
      location: "Lake View Trail",
      priority: "High",
      status: "Searching",
    },

    {
      id: "INC003",
      tourist: "David",
      incident: "Medical Emergency",
      location: "Temple Corridor",
      priority: "Critical",
      status: "Hospital Assigned",
    },

    {
      id: "INC004",
      tourist: "Amit",
      incident: "Suspicious Activity",
      location: "North Entry Gate",
      priority: "Low",
      status: "Under Review",
    },

  ];

  const getPriorityColor = (priority) => {

    switch (priority) {

      case "Critical":
        return "bg-red-600";

      case "High":
        return "bg-orange-500";

      case "Medium":
        return "bg-yellow-500";

      default:
        return "bg-green-500";

    }

  };

  return (

    <div className="bg-white shadow-lg rounded-xl p-5 mt-8">

      <h2 className="text-2xl font-bold mb-4">

        Recent Area Incidents

      </h2>

      <table className="w-full">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-3 text-left">Incident ID</th>

            <th className="p-3 text-left">Tourist</th>

            <th className="p-3 text-left">Incident</th>

            <th className="p-3 text-left">Zone</th>

            <th className="p-3 text-left">Priority</th>

            <th className="p-3 text-left">Status</th>

          </tr>

        </thead>

        <tbody>

          {incidents.map((item) => (

            <tr
              key={item.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-3">{item.id}</td>

              <td className="p-3">{item.tourist}</td>

              <td className="p-3">{item.incident}</td>

              <td className="p-3">{item.location}</td>

              <td className="p-3">

                <span
                  className={`text-white px-3 py-1 rounded-full ${getPriorityColor(
                    item.priority
                  )}`}
                >
                  {item.priority}
                </span>

              </td>

              <td className="p-3">{item.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RecentIncidentsTable;
