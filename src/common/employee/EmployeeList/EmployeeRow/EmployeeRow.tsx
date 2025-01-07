import ICustomerProfile from "../../../../type/ICustomerProfile";
import Table from "../../../ui-components/table";

interface IEmployeeRowProps {
  user: ICustomerProfile;
}

const EmployeeRow = ({ user }: IEmployeeRowProps) => {
  return (
    <Table.Row key={user.email}>
      <Table.Cell>
        <span className="font-medium text-gray-900">{user?.business_type}</span>
      </Table.Cell>
      <Table.Cell>{user?.full_address?.address}</Table.Cell>
      <Table.Cell>{user?.email}</Table.Cell>
      <Table.Cell>{user?.contact}</Table.Cell>
      <Table.Cell>{user?.createdBy}</Table.Cell>
      <Table.Cell>Action</Table.Cell>
    </Table.Row>
  );
};

export default EmployeeRow;
