import links from "../../../constant/links";
import { getProfileDetails } from "../../../store/selectors/profileSelector";
import { useAppSelector } from "../../../store/store";
import SidebarLinks from "./sidebar-links";

interface ISidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: ISidebarProps) => {
  const value = useAppSelector(getProfileDetails);
  const filteredLinks = links.filter((link) =>
    link.roles.includes(value.data.role)
  );
  console.log(value.data.role, filteredLinks, links);
  return (
    <>
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <SidebarLinks
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        role={value.data.role}
      />
    </>
  );
};

export default Sidebar;
