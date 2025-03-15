import { useState } from "react";
import useGetStock from "../../../../hooks/useGetStock";
import StockModal from "../../../modal/StockModal";
import HeadOfficeStock from "../../../headOfficeStock";
import ScheduleModal from "../../../modal/ScheduleModal";
import useGetSchedule from "../../../../hooks/useGetSchedule";
import OutletGasRequestView from "../../../OutletGasRequestView";
import Schedule from "../../../schedule";
import CustomerRequestGasByOutlet from "../../../customerRequestGasByOutlet";

const Dispatcher = () => {
  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const { data: stock, fetchData } = useGetStock();
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <CustomerRequestGasByOutlet />
        <HeadOfficeStock
          openModal={() => setStockModalOpen(true)}
          stock={stock}
        />
        <OutletGasRequestView />
        <Schedule
          schedules={schedules}
          openModal={() => setScheduleModalOpen(true)}
        />
      </div>
    </main>
  );
};

export default Dispatcher;
