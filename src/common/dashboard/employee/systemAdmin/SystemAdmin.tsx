import { useState } from "react";
import useGetStock from "../../../../hooks/useGetStock";
import HeadOfficeStock from "../../../headOfficeStock";
import Schedule from "../../../schedule";
import StockModal from "../../../modal/StockModal";
import OrganizationApprovals from "./organizationApprovals";
import DashboardStats from "./outletStats";
import ScheduleModal from "../../../modal/ScheduleModal";
import useGetSchedule from "../../../../hooks/useGetSchedule";
import RequestGas from "../../../requestGas";
import OutletGasRequestView from "../../../OutletGasRequestView";

const SystemAdmin = () => {
  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { data: stock, fetchData } = useGetStock();
  const { data: schedules } = useGetSchedule();
  return (
    <main className="container mx-auto px-4 py-8">
      <StockModal
        stock={stock}
        isOpen={isStockModalOpen}
        closeModal={() => setStockModalOpen(false)}
        fetchStock={fetchData}
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        closeModal={() => setScheduleModalOpen(false)}
      />
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <RequestGas />
        <HeadOfficeStock
          openModal={() => setStockModalOpen(true)}
          stock={stock}
        />
        <OrganizationApprovals />
        <OutletGasRequestView />
        <Schedule
          schedules={schedules}
          openModal={() => setScheduleModalOpen(true)}
        />
      </div>
    </main>
  );
};

export default SystemAdmin;
