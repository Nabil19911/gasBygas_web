import { useCallback } from "react";
import { IOutlet } from "../../../type/IOutlet";
import Table from "../../ui-components/table";
import OutletRow from "./OutletRow";

interface IOutletListProps {
  outlets?: IOutlet[];
}

const OutletList = ({ outlets }: IOutletListProps) => {
  const renderEmployeeRow = useCallback(() => {
    if (outlets) {
      return outlets.map((outlet) => <OutletRow key={outlet._id} outlet={outlet} />);
    }
    return [];
  }, [outlets]);

  return (
    <Table>
      <Table.Header>
        <Table.Column>Branch Code</Table.Column>
        <Table.Column>Address</Table.Column>
        <Table.Column>Email</Table.Column>
        <Table.Column>Contact</Table.Column>
        <Table.Column>Status</Table.Column>
        <Table.Column>Action</Table.Column>
      </Table.Header>
      <Table.Body>{renderEmployeeRow()}</Table.Body>
    </Table>
  );
};

export default OutletList;