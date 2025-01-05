import ICustomerProfile from "../../../../type/ICustomerProfile";

interface IndividualProps {
  profile: ICustomerProfile;
}
const Individual = ({ profile }: IndividualProps) => {
  return <div>Individual</div>;
};

export default Individual;
