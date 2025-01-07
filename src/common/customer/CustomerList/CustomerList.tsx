import { useCallback } from "react";
import ICustomerProfile from "../../../type/ICustomerProfile";
import Table from "../../ui-components/table";
import CustomerRow from "./CustomerRow";
interface IECustomerListProps {
  users?: ICustomerProfile[];
}

const CustomerList = ({ users }: IECustomerListProps) => {
  const renderEmployeeRow = useCallback(() => {
    if (users) {
      return users.map((user) => <CustomerRow key={user._id} user={user} />);
    }
    return [];
  }, [users]);

  return (
    <Table>
      <Table.Header>
        <Table.Column>Business Type</Table.Column>
        <Table.Column>Address</Table.Column>
        <Table.Column>Email</Table.Column>
        <Table.Column>Contact</Table.Column>
        <Table.Column>Createdby</Table.Column>
        <Table.Column>Action</Table.Column>
      </Table.Header>
      <Table.Body>{renderEmployeeRow()}</Table.Body>
    </Table>
  );
};

export default CustomerList;
