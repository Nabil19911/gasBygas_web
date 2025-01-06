import { useCallback } from "react";
import Table from "../../ui-components/table";
import EmployeeRow from "./EmployeeRow";
import ICustomerProfile from "../../../type/ICustomerProfile";

interface IEmployeeListProps {
  users?: ICustomerProfile[];
}

const EmployeeList = ({ users }: IEmployeeListProps) => {
  const renderEmployeeRow = useCallback(() => {
    if (users) {
      return users.map((user) => <EmployeeRow key={user._id} user={user} />);
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

export default EmployeeList;
