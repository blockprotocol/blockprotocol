import { Typography } from "@mui/material";
import { ChangeEvent, FunctionComponent, useState } from "react";

import { TextField } from "../../../components/text-field";

export const UsageLimitSection: FunctionComponent = () => {
  const [limit, setLimit] = useState("");

  // Operate on the event as text. We validate that the "value" is a number through "pattern" so we only need to set the limit
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(event.target.value.replace(/[\D]/g, ""));
  };

  return (
    <>
      <Typography
        variant="bpHeading2"
        sx={{ fontSize: 28, fontWeight: 400, marginBottom: 1 }}
      >
        Usage Limits
      </Typography>
      <Typography
        component="p"
        variant="bpSmallCopy"
        sx={{ fontWeight: 400, marginBottom: 2 }}
      >
        Optionally cap usage-based charges. Leave blank to uncap, or enter $0 to
        prevent all overage charges.
      </Typography>
      <Typography
        component="p"
        variant="bpSmallCopy"
        sx={{ fontWeight: 400, marginBottom: 1 }}
      >
        Spending cap
      </Typography>
      <TextField
        sx={{
          width: 355,
        }}
        fullWidth
        type="text"
        inputProps={{
          maxLength: 13,
          step: "1",
          // Does this work on safari?
          inputMode: "numeric",
          pattern: "D*(.DD?)?",
        }}
        value={limit}
        onChange={handleLimitChange}
        placeholder="Leave blank, or enter an amount - e.g. 10.00"
      />
    </>
  );
};
