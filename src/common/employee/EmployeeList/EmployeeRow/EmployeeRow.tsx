import IEmployee from "../../../../type/IEmployee";
import Table from "../../../ui-components/table";

interface IEmployeeRowProps {
  user: IEmployee;
}

const EmployeeRow = ({ user }: IEmployeeRowProps) => {
  return (
    <Table.Row key={user.email}>
      <Table.Cell>
        <span className="font-medium text-gray-900">
          {user?.first_name ?? "--"}
        </span>
      </Table.Cell>
      <Table.Cell>{user?.email ?? "--"}</Table.Cell>
      <Table.Cell>{user?.contact ?? "--"}</Table.Cell>
      <Table.Cell>{user?.role ?? "--"}</Table.Cell>
      <Table.Cell>{user?.status ?? "--"}</Table.Cell>
      <Table.Cell>Action</Table.Cell>
    </Table.Row>
  );
};

export default EmployeeRow;
