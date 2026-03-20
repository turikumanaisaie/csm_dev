// import { Link } from 'react-router-dom';

// const Sidebar = () => (
//   <aside className="w-64 bg-white shadow-md">
//     <div className="p-4 text-2xl font-bold text-sky-600">CSMS</div>
//     <nav className="mt-8">
//       <Link to="/dashboard" className="block py-2 px-4 hover:bg-sky-50">Dashboard</Link>
//       <Link to="/dashboard/analytics" className="block py-2 px-4 hover:bg-sky-50">Analytics</Link>
//       <Link to="/dashboard/users" className="block py-2 px-4 hover:bg-sky-50">Users</Link>
//       <Link to="/dashboard/departments" className="block py-2 px-4 hover:bg-sky-50">Departments</Link>
//       <Link to="/dashboard/devices" className="block py-2 px-4 hover:bg-sky-50">Devices</Link>
//       <Link to="/dashboard/attendance" className="block py-2 px-4 hover:bg-sky-50">Attendance</Link>
//       <Link to="/dashboard/settings" className="block py-2 px-4 hover:bg-sky-50">Settings</Link>
//     </nav>
//   </aside>
// );

// export default Sidebar; 

import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  ClockIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Departments', href: '/dashboard/departments', icon: BuildingOfficeIcon },
  { name: 'Devices', href: '/dashboard/devices', icon: ComputerDesktopIcon },
  { name: 'Attendance', href: '/dashboard/attendance', icon: ClockIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="mt-5 px-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${
                isActive
                  ? 'bg-sky-100 text-sky-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-sky-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}