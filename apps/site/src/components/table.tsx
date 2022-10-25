import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export type TableRows = ReactNode[][];

type TableProps = {
  header: string[];
  rows: TableRows;
};

export const Table: FunctionComponent<TableProps> = ({ header, rows }) => {
  return (
    <TableContainer>
      <MuiTable sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header.map((title) => (
              <TableCell
                key={title}
                sx={{
                  color: "#4D5C6C",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
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
      </MuiTable>
    </TableContainer>
  );
};
