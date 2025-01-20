import ActiveStatus from "./activeStatusOptions";
import GasRequestTypeEnum from "./gasRequestTypeEnum";
import RolesEnum from "./rolesEnum";

export const roleOptions = Object.values(RolesEnum)
  .filter((role) => role !== RolesEnum.CUSTOMER)
  .map((role) => ({ value: role, label: role }));

export const statusOptions = Object.values(ActiveStatus).map((status) => ({
  value: status,
  label: status,
}));

export const requestTypeOptions = Object.values(GasRequestTypeEnum).map((status) => ({
  value: status,
  label: status,
}));
