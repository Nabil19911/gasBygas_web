import SidebarLinks from "./sidebar-links";

interface ISidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: ISidebarProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <SidebarLinks isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Sidebar;
