import { FunctionComponent } from "react";

import { Button } from "../../../button";
import { ApplicationBadge, ApplicationBadgeProps } from "./application-badge";

export const ApplicationBadgeButton: FunctionComponent<
  ApplicationBadgeProps & { onClick: () => void; alreadyVoted: boolean }
> = ({ onClick, ...props }) => {
  return (
    <Button
      color="inherit"
      onClick={onClick}
      sx={{
        borderRadius: 2.5,
        background: "transparent",
        p: 0,
        "&:hover": {
          background: "#F4F3FF !important",
        },
      }}
    >
      <ApplicationBadge {...props} />
    </Button>
  );
};
