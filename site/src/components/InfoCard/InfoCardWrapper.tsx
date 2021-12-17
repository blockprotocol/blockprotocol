import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  VoidFunctionComponent,
} from "react";
import { Box } from "@mui/material";

type InfoCardWrapperProps = {
  children: ReactNode;
};

export const InfoCardWrapper: VoidFunctionComponent<InfoCardWrapperProps> = ({
  children,
}) => {
  const childrenAsArray = Children.toArray(children);
  const infoCardElements = childrenAsArray.filter(
    (child) => isValidElement(child) && child.props.mdxType === "InfoCard",
  );

  if (infoCardElements.length !== 1) {
    throw new Error(
      `Expected InfoCardWrapper to contain exactly one InfoCard, got ${infoCardElements.length}`,
    );
  }
  const infoCardElement = infoCardElements[0] as ReactElement;

  const childrenWithoutInfoCard = childrenAsArray.filter(
    (child) => child !== infoCardElement,
  );

  return (
    <Box
      display="flex"
      sx={{
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Box>{childrenWithoutInfoCard}</Box>
      <Box
        sx={{
          marginLeft: {
            xs: 0,
            sm: 3,
          },
          marginBottom: {
            xs: 2,
            sm: 0,
          },
        }}
      >
        {cloneElement(infoCardElement, {
          width: {
            sx: "unset",
            sm: 275,
          },
        })}
      </Box>
    </Box>
  );
};
