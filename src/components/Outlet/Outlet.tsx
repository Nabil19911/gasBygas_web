import { useNavigate } from "react-router";
import OutletList from "../../common/outlet/OutletList";
import Banner from "../../common/ui-components/banner";
import { Button } from "../../common/ui-components/form-fields";
import LoadingSpinner from "../../common/ui-components/loadingSpinner";
import PathsEnum from "../../constant/pathsEnum";
import useGetOutlets from "../../hooks/useGetOutlets";

const Outlet = () => {
  const navigate = useNavigate();
  const { error, data, isLoading } = useGetOutlets();

  return (
    <div className="flex flex-col">
      {error && <Banner type="error">{error}</Banner>}
      {isLoading && <LoadingSpinner />}
      <div className="self-end mb-2 w-fit">
        <Button
          onClick={() => navigate(`${PathsEnum.OUTLET}/${PathsEnum.CREATE}`)}
        >
          Add new Outlet
        </Button>
      </div>
      <OutletList outlets={data} />
    </div>
  );
};

export default Outlet;
