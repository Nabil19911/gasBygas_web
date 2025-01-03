import { XMarkIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 p-4">
          <Link to="/" className="text-lg font-semibold text-white">
            Dashboard
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-white rounded-md lg:hidden hover:text-gray-200 focus:outline-none focus:ring"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-5">
          <Link
            to="/"
            className="flex items-center px-6 py-2 text-gray-100 hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="flex items-center px-6 py-2 mt-3 text-gray-100 hover:bg-gray-700"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-6 py-2 mt-3 text-gray-100 hover:bg-gray-700"
          >
            Settings
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
