import { Building2, UserCheck, Users } from "lucide-react";
import { useMemo } from "react";
import ActiveStatus from "../../../../../constant/activeStatusOptions";
import useGetCustomers from "../../../../../hooks/useGetCustomers";
import useGetEmployees from "../../../../../hooks/useGetEmployees";
import useGetOutlets from "../../../../../hooks/useGetOutlets";
import StatCard from "../../../../ui-components/starCard/StarCard";

export const OutletStats = () => {
  const { data: customers } = useGetCustomers();
  const { data: outlets } = useGetOutlets();
  const { data: employees } = useGetEmployees();

  const activeOutlets = useMemo(() => {
    return String(
      outlets.filter((outlet) => outlet.status === ActiveStatus.ACTIVE).length
    );
  }, [outlets]);

  const activeEmployees = useMemo(() => {
    return String(
      employees.filter((employee) => employee.status === ActiveStatus.ACTIVE)
        .length
    );
  }, [employees]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Customers"
        value={String(customers.length || 0)}
        icon={<Users className="h-6 w-6" />}
      />
      <StatCard
        title="Active Outlets"
        value={activeOutlets}
        icon={<Building2 className="h-6 w-6" />}
      />
      <StatCard
        title="Active Employees"
        value={activeEmployees}
        icon={<UserCheck className="h-6 w-6" />}
      />
    </div>
  );
};

export default OutletStats;
