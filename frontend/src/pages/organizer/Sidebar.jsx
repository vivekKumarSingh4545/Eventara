import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, List, Ticket, Star } from 'lucide-react';

const Sidebar = () => (
  <aside className="w-64 glass-dark p-6 shadow-2xl flex flex-col border-r border-white/5 h-screen sticky top-0">
    <div className="flex items-center gap-3 mb-10">
      <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
        <LayoutDashboard className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-white tracking-wide">Organizer</h2>
    </div>
    
    <nav className="flex-1">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/organizer/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium transition-all duration-300 px-4 py-3 rounded-xl border border-transparent ${isActive ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-inner' : 'text-blue-100/70 hover:text-white hover:bg-white/5'}`
            }
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/organizer/add-event"
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium transition-all duration-300 px-4 py-3 rounded-xl border border-transparent ${isActive ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-inner' : 'text-blue-100/70 hover:text-white hover:bg-white/5'}`
            }
          >
            <CalendarPlus className="w-4 h-4" /> Add Event
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/organizer/list-shows"
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium transition-all duration-300 px-4 py-3 rounded-xl border border-transparent ${isActive ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-inner' : 'text-blue-100/70 hover:text-white hover:bg-white/5'}`
            }
          >
            <List className="w-4 h-4" /> List Shows
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/organizer/list-bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium transition-all duration-300 px-4 py-3 rounded-xl border border-transparent ${isActive ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-inner' : 'text-blue-100/70 hover:text-white hover:bg-white/5'}`
            }
          >
            <Ticket className="w-4 h-4" /> List Bookings
          </NavLink>
        </li>        
        <li>
          <NavLink
            to="/organizer/reviews"
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium transition-all duration-300 px-4 py-3 rounded-xl border border-transparent ${isActive ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-inner' : 'text-blue-100/70 hover:text-white hover:bg-white/5'}`
            }
          >
            <Star className="w-4 h-4" /> Reviews
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;