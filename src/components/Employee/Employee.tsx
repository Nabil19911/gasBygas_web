import { useNavigate } from "react-router";
import EmployeeList from "../../common/employee/EmployeeList";
import Banner from "../../common/ui-components/banner";
import { Button } from "../../common/ui-components/form-fields";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import useFetch from "../../hooks/useFetch";
// TODO: make this employee interface
import ICustomerProfile from "../../type/ICustomerProfile";
import PathsEnum from "../../constant/pathsEnum";

const Employee = () => {
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
          onClick={() => navigate(`${PathsEnum.EMPLOYEE}/${PathsEnum.CREATE}`)}
        >
          Add new Employee
        </Button>
      </div>
      <EmployeeList users={data} />
    </div>
  );
};

export default Employee;
