import { Box, Container, ContainerProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export const PageContainer: FunctionComponent<{
  children: ReactNode;
  sx?: ContainerProps["sx"];
}> = ({ children, sx = [] }) => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #FAFBFC 0%, rgba(250, 251, 252, 0) 100%)",
      }}
    >
      <Container
        sx={[
          {
            paddingTop: {
              xs: 5,
              md: 9,
            },
            paddingBottom: {
              xs: 5,
              md: 9,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {children}
      </Container>
    </Box>
  );
};
