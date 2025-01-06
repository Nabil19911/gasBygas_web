import EmployeeList from "../../common/employee/EmployeeList";
import Banner from "../../common/ui-components/banner";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import useFetch from "../../hooks/useFetch";
import ICustomerProfile from "../../type/ICustomerProfile";

const Employee = () => {
  const {
    data,
    isLoading: isGetCustomerLoading,
    error,
  } = useFetch<ICustomerProfile[]>({
    url: "/customer",
    initialLoad: true,
    options: {
      method: "get",
    },
  });

  const isLoading = isGetCustomerLoading;

  return (
    <div>
      {error && <Banner type="error">{error}</Banner>}
      {isLoading && <LoadingSpinner />}
      <EmployeeList users={data} />
    </div>
  );
};

export default Employee;
