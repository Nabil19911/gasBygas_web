import { IOutlet } from "../../../../type/IOutlet";
import Table from "../../../ui-components/table";

interface IOutletRowProps {
  outlet: IOutlet;
}

const OutletRow = ({ outlet }: IOutletRowProps) => {
  return (
    <Table.Row key={outlet.branch_code}>
      <Table.Cell>
        <span className="font-medium text-gray-900">
          {outlet?.branch_code ?? "--"}
        </span>
      </Table.Cell>
      <Table.Cell>{outlet?.full_address?.address ?? "--"}</Table.Cell>
      <Table.Cell>{outlet?.email ?? "--"}</Table.Cell>
      <Table.Cell>{outlet?.contact ?? "--"}</Table.Cell>
      <Table.Cell>{outlet?.status ?? "--"}</Table.Cell>
      {/* <Table.Cell>{outlet?.created_by}</Table.Cell>
      <Table.Cell>{outlet?.created_by}</Table.Cell> */}
      <Table.Cell>Action</Table.Cell>
    </Table.Row>
  );
};

export default OutletRow;
