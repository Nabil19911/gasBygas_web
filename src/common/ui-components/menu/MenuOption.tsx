import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router";
import { Button } from "../form-fields";

interface DropdownItem {
  label: string;
  action?: () => void;
  to?: string;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  icon?: React.ReactNode;
}

const DropdownMenu = ({ items, icon }: DropdownMenuProps) => {
  return (
    <Menu as="div" className="relative">
      <div>
        <MenuButton className="flex items-center space-x-2 text-gray-500">
          {icon || <UserCircleIcon className="w-10 h-10" />}
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-48 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1">
            {items.map((item, index) => (
              <MenuItem key={index}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className="block my-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Button onClick={item.action}>{item.label}</Button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
