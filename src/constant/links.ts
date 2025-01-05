import RolesEnum from "./rolesEnum";

interface LinkItem {
  to: string;
  label: string;
  roles: string[]; // Roles allowed to see this link
}

const links: LinkItem[] = [
  { to: "/", label: "Dashboard", roles: [RolesEnum.CUSTOMER] },
  { to: "/profile", label: "Profile", roles: [RolesEnum.CUSTOMER] },
  { to: "/settings", label: "Settings", roles: [RolesEnum.CUSTOMER] },
];

export default links;
