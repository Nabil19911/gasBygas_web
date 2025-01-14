import { useNavigate } from "react-router";
import CustomerList from "../../common/customer/CustomerList";
import Banner from "../../common/ui-components/banner";
import { Button } from "../../common/ui-components/form-fields";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import useFetch from "../../hooks/useFetch";
import ICustomerProfile from "../../type/ICustomerProfile";
import PathsEnum from "../../constant/pathsEnum";

const Customer = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading: isGetCustomerLoading,
    error,
  } = useFetch<ICustomerProfile[]>({
    url: "/user",
    initialLoad: true,
  });

  const isLoading = isGetCustomerLoading;

  return (
    <div className="flex flex-col">
      {error && <Banner type="error">{error}</Banner>}
      {isLoading && <LoadingSpinner />}
      <div className="self-end mb-2 w-fit">
        <Button
          onClick={() => navigate(`${PathsEnum.CUSTOMER}/${PathsEnum.CREATE}`)}
        >
          Add new Customer
        </Button>
      </div>
      <CustomerList users={data} />
    </div>
  );
};

export default Customer;
