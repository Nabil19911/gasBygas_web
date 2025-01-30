import ActiveStatus from "./activeStatusOptions";
import CustomerTypeEnum from "./customerTypeEnum";
import DeliveryStatusEnum from "./DeliveryStatusEnum";
import DistrictsEnum from "./districtsEnum";
import GasRequestTypeEnum from "./gasRequestTypeEnum";
import RequestStatusEnum from "./requestStatusEnum";
import RolesEnum from "./rolesEnum";

export const roleOptions = Object.values(RolesEnum)
  .filter((role) => role !== RolesEnum.CUSTOMER)
  .map((role) => ({ value: role, label: role }));

export const statusOptions = Object.values(ActiveStatus).map((status) => ({
  value: status,
  label: status,
}));

export const requestTypeOptions = Object.values(GasRequestTypeEnum).map(
  (status) => ({
    value: status,
    label: status,
  })
);

export const requestStatusOptions = Object.values(RequestStatusEnum).map(
  (status) => ({
    value: status,
    label: status,
  })
);

export const deliveryStatusOptions = Object.values(DeliveryStatusEnum).map(
  (status) => ({
    value: status,
    label: status,
  })
);

export const districtsOptions = Object.values(DistrictsEnum).map((status) => ({
  value: status,
  label: status,
}));

export const customerOptions = Object.values(CustomerTypeEnum).map(
  (status) => ({
    value: status,
    label: status,
  })
);
