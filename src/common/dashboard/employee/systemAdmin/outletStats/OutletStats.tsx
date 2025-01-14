import { Users, Building2, UserCheck, UserX } from "lucide-react";
import StatCard from "../../../../ui-components/starCard/StarCard";

export const OutletStats = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <StatCard
        title="Total Customers"
        value="1,234"
        icon={<Users className="h-6 w-6" />}
      />
      <StatCard
        title="Active Outlets"
        value="42"
        icon={<Building2 className="h-6 w-6" />}
      />
      <StatCard
        title="Active Employees"
        value="156"
        icon={<UserCheck className="h-6 w-6" />}
      />
      <StatCard
        title="Inactive Employees"
        value="23"
        icon={<UserX className="h-6 w-6" />}
      />
    </div>
  );
};

export default OutletStats;
