import { ReactNode } from 'react';

export const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full shadow-md sm:rounded-lg overflow-hidden">
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full text-sm text-left text-gray-500">
          {children}
        </table>
      </div>
    </div>
  );
};

Table.Header = ({ children }: { children: ReactNode }) => {
  return (
    <thead className="bg-gray-900 sticky top-0 z-10">
      <tr>{children}</tr>
    </thead>
  );
};

Table.Column = ({ children }: { children: ReactNode }) => {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
    >
      {children}
    </th>
  );
};

Table.Body = ({ children }: { children: ReactNode }) => {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
};

Table.Row = ({ children }: { children: ReactNode }) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      {children}
    </tr>
  );
};

Table.Cell = ({ children }: { children: ReactNode }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {children}
    </td>
  );
};

export default Table;
