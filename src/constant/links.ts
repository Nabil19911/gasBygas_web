import RolesEnum from "./rolesEnum";

interface LinkItem {
  to: string;
  label: string;
  roles: string[]; // Roles allowed to see this link
}

const links: LinkItem[] = [
  { to: "/", label: "Dashboard", roles: [RolesEnum.ADMIN] },
  { to: "/outlet", label: "Outlet", roles: [RolesEnum.ADMIN] },
  { to: "/employee", label: "Employee", roles: [RolesEnum.ADMIN] },
  { to: "/customer", label: "Customer", roles: [RolesEnum.ADMIN] },
  { to: "/report", label: "Report", roles: [RolesEnum.ADMIN] },
];

export default links;
