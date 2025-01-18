// TDOD: this compnenet needs to fix
import { useCallback } from "react";
import IEmployee from "../../../type/IEmployee";
import Table from "../../ui-components/table";
import EmployeeRow from "./EmployeeRow";

interface IEmployeeListProps {
  employees?: IEmployee[];
}

const EmployeeList = ({ employees }: IEmployeeListProps) => {
  const renderEmployeeRow = useCallback(() => {
    if (employees) {
      return employees.map((user) => (
        <EmployeeRow key={user._id} user={user} />
      ));
    }
    return [];
  }, [employees]);

  return (
    <Table>
      <Table.Header>
        <Table.Column>First name</Table.Column>
        <Table.Column>Email</Table.Column>
        <Table.Column>Contact</Table.Column>
        <Table.Column>Role</Table.Column>
        <Table.Column>Status</Table.Column>
        <Table.Column>Action</Table.Column>
      </Table.Header>
      <Table.Body>{renderEmployeeRow()}</Table.Body>
    </Table>
  );
};

export default EmployeeList;
