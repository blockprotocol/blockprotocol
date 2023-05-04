import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonProps } from "@mui/material";

import { Button } from "../../button";
import { FontAwesomeIcon } from "../../icons";

export const CustomButton = ({ endIcon, children, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      endIcon={endIcon || <FontAwesomeIcon icon={faArrowRight} />}
    >
      {children}
    </Button>
  );
};
