import PathsEnum from "./pathsEnum";
import RolesEnum from "./rolesEnum";

interface LinkItem {
  to: string;
  label: string;
  roles: string[]; // Roles allowed to see this link
}

const links: LinkItem[] = [
  {
    to: PathsEnum.DASHBOARD,
    label: "Dashboard",
    roles: [
      RolesEnum.ADMIN,
      RolesEnum.BRANCH_MANAGER,
      RolesEnum.CUSTOMER,
      RolesEnum.DISPATCH_OFFICER,
    ],
  },
  // {
  //   to: PathsEnum.STOCK,
  //   label: "Stock",
  //   roles: [RolesEnum.ADMIN, RolesEnum.DISPATCH_OFFICER],
  // },
  {
    to: PathsEnum.OUTLET,
    label: "Outlet",
    roles: [
      RolesEnum.ADMIN,
      RolesEnum.BRANCH_MANAGER,
      RolesEnum.DISPATCH_OFFICER,
    ],
  },
  { to: PathsEnum.EMPLOYEE, label: "Employee", roles: [RolesEnum.ADMIN] },
  { to: PathsEnum.CUSTOMER, label: "Customer", roles: [RolesEnum.ADMIN] },
  { to: PathsEnum.REPORT, label: "Report", roles: [RolesEnum.ADMIN] },
];

export default links;
