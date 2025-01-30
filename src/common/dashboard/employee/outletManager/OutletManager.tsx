import VerifyToken from "../../../VerifyToken";
import GasRequest from "./GasRequest";
import OutletScheduleView from "./OutletScheduleView";

const OutletManager = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <VerifyToken />
      <GasRequest />
      <OutletScheduleView/>
    </div>
  );
};

export default OutletManager;
