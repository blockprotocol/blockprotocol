import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FunctionComponent, ReactNode } from "react";

export type TableHeader = ReactNode[];
export type TableRows = ReactNode[][];

type TableProps = {
  header: TableHeader;
  rows: TableRows;
};

export const Table: FunctionComponent<TableProps> = ({ header, rows }) => {
  return (
    <TableContainer>
      <MuiTable sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header.map((cell) =>
              typeof cell === "string" ? (
                <TableCell
                  key={cell}
                  sx={{
                    color: ({ palette }) => palette.bpGray[70],
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {cell}
                </TableCell>
              ) : (
                cell
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              // eslint-disable-next-line react/no-array-index-key
              key={`row-${rowIndex}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.map((cell, colIndex) =>
                typeof cell === "string" ? (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableCell key={`col-${colIndex}`}>{cell}</TableCell>
                ) : (
                  cell
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
