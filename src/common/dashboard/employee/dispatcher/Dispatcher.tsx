import { useState } from "react";
import useGetStock from "../../../../hooks/useGetStock";
import StockModal from "../../../modal/StockModal";
import HeadOfficeStock from "../../../headOfficeStock";

const Dispatcher = () => {
  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const { data: stock } = useGetStock();
  return (
    <main className="container mx-auto px-4 py-8">
      <HeadOfficeStock stock={stock} openModal={() => setStockModalOpen(true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <StockModal stock={stock} isOpen={isStockModalOpen} closeModal={() => setStockModalOpen(false)} />
        {/* <OutletManager />
      <OrganizationApprovals /> */}
      </div>
    </main>
  );
};

export default Dispatcher;
