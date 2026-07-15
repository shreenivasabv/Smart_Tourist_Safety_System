import React from "react";

const STATUS_STYLES = {
  Safe: "bg-green-100 text-green-700",
  Monitoring: "bg-amber-100 text-amber-700",
  "Support Needed": "bg-red-100 text-red-700",
};

function TouristTable({ tourists = [], onDelete, loading = false, error = "" }) {
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Registered Tourists</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          Total: {tourists.length}
        </span>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">Zone</th>
              <th className="border p-3">Purpose</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {tourists.map((tourist) => (
              <tr key={tourist._id}>
                <td className="border p-3">
                  {tourist.fullName}
                </td>

                <td className="border p-3">
                  {tourist.email}
                </td>

                <td className="border p-3">
                  {tourist.phone}
                </td>

                <td className="border p-3">
                  {tourist.zone}
                </td>

                <td className="border p-3">
                  {tourist.visitPurpose}
                </td>

                <td className="border p-3">
                  <span
                    className={`rounded px-3 py-1 ${
                      STATUS_STYLES[tourist.status] || STATUS_STYLES.Safe
                    }`}
                  >
                    {tourist.status}
                  </span>
                </td>

                <td className="border p-3">
                  <button
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={() => onDelete?.(tourist._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!loading && tourists.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center"
                >
                  No Tourists Registered
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-slate-500"
                >
                  Loading tourists...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TouristTable;
