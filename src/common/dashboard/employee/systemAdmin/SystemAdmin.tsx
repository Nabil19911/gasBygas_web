import OrganizationApprovals from "./organizationApprovals";
import OutletManager from "./outletActivities";
import DashboardStats from "./outletStats";

const SystemAdmin = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* <h1 className="text-2xl text-center lg:text-left lg:text-3xl font-bold mb-8">
        System Admin Dashboard
      </h1> */}
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <OutletManager />
        <OrganizationApprovals />
      </div>
    </main>
  );
};

export default SystemAdmin;
