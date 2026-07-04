import React from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function TopNavbar() {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
            Pilot Safety Command Center
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-800">
            Single-Area Administration Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Smart Tourist Safety System for focused area deployment
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitors or zones..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white sm:w-64"
            />
          </label>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
            <FaBell />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
              4
            </span>
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <FaUserCircle className="text-3xl text-slate-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Department Admin</p>
              <p className="text-xs text-slate-500">Pilot Area Operations</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
