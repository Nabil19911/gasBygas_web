import { useNavigate } from "react-router";
import OutletList from "../../common/outlet/OutletList";
import Banner from "../../common/ui-components/banner";
import { Button } from "../../common/ui-components/form-fields";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import PathsEnum from "../../constant/pathsEnum";
import useFetch from "../../hooks/useFetch";
import ICustomerProfile from "../../type/ICustomerProfile";

const Outlet = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading: isGetCustomerLoading,
    error,
  } = useFetch<ICustomerProfile[]>({
    url: "/employee",
    initialLoad: true,
  });

  const isLoading = isGetCustomerLoading;
  
  return (
    <div className="flex flex-col">
      {error && <Banner type="error">{error}</Banner>}
      {isLoading && <LoadingSpinner />}
      <div className="self-end mb-2 w-fit">
        <Button
          onClick={() => navigate(`${PathsEnum.OUTLET}/${PathsEnum.CREATE}`)}
        >
          Add new Employee
        </Button>
      </div>
      <OutletList users={data} />
    </div>
  );
};

export default Outlet;
