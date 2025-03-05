import { useNavigate, useParams } from "react-router";
import RequestStatusEnum from "../../constant/requestStatusEnum";
import useFetch from "../../hooks/useFetch";
import ICustomer from "../../type/ICustomer";
import Banner from "../ui-components/banner";
import { Button } from "../ui-components/form-fields";
import LoadingSpinner from "../ui-components/loadingSpinner";
import useApiFetch from "../../hooks/useApiFetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui-components/card/Card";

const OrganizationApprovalView = () => {
  const navigator = useNavigate();
  const { id } = useParams();
  const {
    data: user,
    isLoading: isUserLoading,
    error,
  } = useFetch<ICustomer>({
    url: `/user/${id}`,
    initialLoad: true,
  });

  const { postData: updateNewUser, isLoading: isUpdateNewUserLoading } =
    useApiFetch<Partial<ICustomer>>({
      url: `/user/${id}`,
      options: {
        method: "patch",
      },
    });

  const handleUpdate = (value: RequestStatusEnum) => {
    updateNewUser({
      organization_details: {
        ...user?.organization_details,
        approval_status: value,
        approval_date: new Date().toISOString(),
      },
    });

    if (!isLoading && !error) {
      navigator(-1);
    }
  };

  const fileUrl = user?.business_registration_certification_path
    ? `${import.meta.env.VITE_API_URL}/${
        user.business_registration_certification_path
      }`
    : "";
  const isLoading = isUpdateNewUserLoading || isUserLoading;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      {isLoading && <LoadingSpinner />}
      {error && <Banner type="error">{error}</Banner>}
      <CardHeader>
        <CardTitle>Approve Organization</CardTitle>
        <CardDescription>Organization details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Business Name:</p>
            <p>{user?.organization_details?.business_name}</p>
          </div>
          <div>
            <p className="font-semibold">Registration Number:</p>
            <p>{user?.organization_details?.business_registration_number}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{user?.email}</p>
          </div>
          <div>
            <p className="font-semibold">Contact:</p>
            <p>{user?.contact}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">Address:</p>
            <p>{`${user?.full_address.address}, ${user?.full_address.district}, ${user?.full_address.post_code}`}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">
            Business Registration Certificate:
          </p>

          {fileUrl && (
            <iframe
              src={fileUrl}
              width="100%"
              height="500px"
              title="Business Registration Certificate"
              frameBorder="0"
            ></iframe>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            onClick={() => handleUpdate(RequestStatusEnum.APPROVED)}
            disabled={
              isLoading ||
              user?.organization_details?.approval_status !==
                RequestStatusEnum.PENDING
            }
          >
            Approve
          </Button>
          <Button
            onClick={() => handleUpdate(RequestStatusEnum.REGECTED)}
            disabled={
              isLoading ||
              user?.organization_details?.approval_status !==
                RequestStatusEnum.PENDING
            }
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Reject
          </Button>
        </div>

        {user?.organization_details?.approval_status !==
          RequestStatusEnum.PENDING && (
          <p className="mt-4 text-center font-semibold">
            Status: {user?.organization_details?.approval_status}
            {user?.organization_details?.approval_date && (
              <span>
                (Approved on:
                {new Date(
                  user?.organization_details?.approval_date ?? ""
                ).toLocaleDateString()}
                )
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationApprovalView;
