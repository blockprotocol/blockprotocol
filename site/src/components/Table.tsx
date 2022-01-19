import { ReactNode, VoidFunctionComponent } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export type TableRows = ReactNode[][];

type TableProps = {
  header: string[];
  rows: TableRows;
};

export const BpTable: VoidFunctionComponent<TableProps> = ({
  header,
  rows,
}) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header.map((title) => (
              <TableCell key={title} sx={{ color: "#4D5C6C", fontWeight: 500 }}>
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              // eslint-disable-next-line react/no-array-index-key
              key={`row-${rowIndex}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.map((cell) =>
                typeof cell === "string" ? <TableCell>{cell}</TableCell> : cell,
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
