import useGetStock from "../../../../hooks/useGetStock";
import { useModal } from "../../../../hooks/useModal";
import HeadOfficeStock from "../../../headOfficeStock";
import StockModal from "../../../StockModal";
import OrganizationApprovals from "./organizationApprovals";
import DashboardStats from "./outletStats";

const SystemAdmin = () => {
  const { openModal, isOpen, closeModal } = useModal();
  const { data: stock } = useGetStock();
  return (
    <main className="container mx-auto px-4 py-8">
      <StockModal stock={stock} isOpen={isOpen} closeModal={closeModal} />
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <HeadOfficeStock openModal={openModal} stock={stock}/>
        <OrganizationApprovals />
      </div>
    </main>
  );
};

export default SystemAdmin;
