import { Bars3Icon } from "@heroicons/react/16/solid";
import useAuth from "../../../hooks/useAuth";
import DropdownMenu from "../../ui-components/menu";

interface HeaderProps {
  openSidebar: () => void;
}

const Header = ({ openSidebar }: HeaderProps) => {
  const { signout } = useAuth();

  const menuItems = [
    { label: "Profile", to: "/profile" },
    { label: "Logout", action: signout },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-1 border-gray-200">
      <div className="flex items-center">
        <button
          onClick={openSidebar}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-medium">Welcome, User!</h2>

        <DropdownMenu items={menuItems} />
      </div>
    </header>
  );
};

export default Header;
