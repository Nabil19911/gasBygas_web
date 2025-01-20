import useGetStock from "../../../../hooks/useGetStock";
import { useModal } from "../../../../hooks/useModal";
import StockModal from "../../../StockModal";
import HeadOfficeStock from "../../../headOfficeStock";

const Dispatcher = () => {
  const { openModal, isOpen, closeModal } = useModal();
  const { data: stock } = useGetStock();
  return (
    <main className="container mx-auto px-4 py-8">
      <HeadOfficeStock stock={stock} openModal={openModal} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <StockModal stock={stock} isOpen={isOpen} closeModal={closeModal} />
        {/* <OutletManager />
      <OrganizationApprovals /> */}
      </div>
    </main>
  );
};

export default Dispatcher;
