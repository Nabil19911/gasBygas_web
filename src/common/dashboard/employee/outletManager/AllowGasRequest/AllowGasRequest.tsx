import { ArrowDownCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../ui-components/card/Card";
import { Button } from "../../../../ui-components/form-fields";
import OutletGasRequestAllowModal from "../../../../modal/OutletGasRequestAllowModal";
import { useState } from "react";

const AllowGasRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card>
      <OutletGasRequestAllowModal
        isOpen={isOpen}
        // fetchData={fetchData}
        closeModal={() => setIsOpen(false)}
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="flex items-center flex-initial w-full">
            {/* <Route className="mr-2 h-5 w-5" /> */}
            <ArrowDownCircle className="mr-2 h-5 w-5" />
            Allow Gas Request
          </div>
          <Button
            size="sm"
            className="flex-initial w-1/4"
            onClick={() => setIsOpen(true)}
          >
            Allow
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Active Request</p>
        {/* <ul className="space-y-4">{renderOutletGasRequest()}</ul> */}
      </CardContent>
    </Card>
  );
};

export default AllowGasRequest;
