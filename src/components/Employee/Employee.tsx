import { useNavigate } from "react-router";
import EmployeeList from "../../common/employee/EmployeeList";
import Banner from "../../common/ui-components/banner";
import { Button } from "../../common/ui-components/form-fields";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import PathsEnum from "../../constant/pathsEnum";
import useGetEmployees from "../../hooks/useGetEmployees";

const Employee = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetEmployees();

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
      <EmployeeList employees={data} />
    </div>
  );
};

export default Employee;
