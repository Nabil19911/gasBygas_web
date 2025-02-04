import CustomerRequestGasByOutlet from "../../../customerRequestGasByOutlet";
import VerifyToken from "../../../VerifyToken";
import AllowGasRequest from "./AllowGasRequest";
import GasRequest from "./GasRequest";
import OutletScheduleView from "./OutletScheduleView";
import OutletStock from "./OutletStock/OutletStock";

const OutletManager = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <CustomerRequestGasByOutlet />
      <OutletStock />
      <VerifyToken />
      <GasRequest />
      <OutletScheduleView />
      <AllowGasRequest />
    </div>
  );
};

export default OutletManager;
