import React, { useCallback } from "react";
import Table from "../../ui-components/table";
import OutletRow from "./OutletRow";
import ICustomerProfile from "../../../type/ICustomerProfile";

interface IOutletListProps {
  users?: ICustomerProfile[];
}

const OutletList = ({ users }: IOutletListProps) => {
  const renderEmployeeRow = useCallback(() => {
    if (users) {
      return users.map((user) => <OutletRow key={user._id} user={user} />);
    }
    return [];
  }, [users]);

  return (
    <Table>
      <Table.Header>
        <Table.Column>Role</Table.Column>
        <Table.Column>Frist Name</Table.Column>
        <Table.Column>Email</Table.Column>
        <Table.Column>Contact</Table.Column>
        <Table.Column>Createdby</Table.Column>
        <Table.Column>Action</Table.Column>
      </Table.Header>
      <Table.Body>{renderEmployeeRow()}</Table.Body>
    </Table>
  );
};

export default OutletList;
