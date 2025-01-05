import ICustomerProfile from "../../../../type/ICustomerProfile";

interface IOrganizationProps {
  profile: ICustomerProfile;
}
const Organization = ({ profile }: IOrganizationProps) => {
  if (!profile?.is_approved) {
    return (
      <div className="h-1/2 flex flex-col items-center justify-center bg-gray-100">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold text-gray-800">
          Your account is not approved yet.
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 mt-2">
          Your documents are under review, and the approval process may take up
          to 1 week. Once approved, you will be notified, and you can proceed
          with requesting gas.
        </p>
      </div>
    );
  }
  return <div>Organization</div>;
};

export default Organization;
