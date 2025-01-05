import { XMarkIcon } from "@heroicons/react/16/solid";
import { useMemo } from "react";
import { Link, useLocation } from "react-router";
import links from "../../../../constant/links";
import { getUserProfile } from "../../../../store/selectors/profileSelector";
import { useAppSelector } from "../../../../store/store";
import clsx from "clsx";

interface ISidebarLinksProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SidebarLinks = ({ isOpen, setIsOpen }: ISidebarLinksProps) => {
  const profileData = useAppSelector(getUserProfile);
  const location = useLocation();

  const hasActive = (activeRoute: string) => {
    console.log(location.pathname, activeRoute);
    return location.pathname === activeRoute;
  };

  const filteredLinks = useMemo(() => {
    if (profileData?.data?.role) {
      return links.filter((link) =>
        link.roles.includes(profileData?.data?.role || "")
      );
    }
    return [];
  }, [profileData]);

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
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                "flex items-center px-6 py-2 text-gray-100 hover:bg-gray-700",
                {
                  "bg-gray-500 pointer-events-none": hasActive(link.to),
                  "hover:bg-gray-700": !hasActive(link.to),
                }
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SidebarLinks;
