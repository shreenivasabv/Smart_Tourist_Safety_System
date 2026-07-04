import React from "react";

function RecentAlertsTable() {

  const alerts = [

    {
      id: "ALT001",
      tourist: "John",
      type: "SOS",
      location: "North Entry Gate",
      status: "Pending",
    },

    {
      id: "ALT002",
      tourist: "David",
      type: "Theft",
      location: "Heritage Walkway",
      status: "Investigating",
    },

    {
      id: "ALT003",
      tourist: "Rahul",
      type: "Medical",
      location: "Lake View Trail",
      status: "Resolved",
    },

    {
      id: "ALT004",
      tourist: "Amit",
      type: "Missing",
      location: "Temple Corridor",
      status: "Critical",
    },

  ];

  return (

    <div className="bg-white shadow-lg rounded-xl p-5 mt-8">

      <h2 className="text-2xl font-bold mb-4">

        Recent Area Alerts

      </h2>

      <table className="w-full">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-3 text-left">Alert ID</th>

            <th className="p-3 text-left">Tourist</th>

            <th className="p-3 text-left">Alert Type</th>

            <th className="p-3 text-left">Zone</th>

            <th className="p-3 text-left">Status</th>

          </tr>

        </thead>

        <tbody>

          {alerts.map((alert) => (

            <tr
              key={alert.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-3">{alert.id}</td>

              <td className="p-3">{alert.tourist}</td>

              <td className="p-3">{alert.type}</td>

              <td className="p-3">{alert.location}</td>

              <td className="p-3">

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    alert.status === "Resolved"
                      ? "bg-green-500"
                      : alert.status === "Pending"
                      ? "bg-yellow-500"
                      : alert.status === "Critical"
                      ? "bg-red-600"
                      : "bg-blue-500"
                  }`}
                >
                  {alert.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RecentAlertsTable;
