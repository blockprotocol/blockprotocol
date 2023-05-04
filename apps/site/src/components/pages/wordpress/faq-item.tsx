// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { FunctionComponent, ReactNode, useState } from "react";

import { ExpandMoreIcon, RightPointerIcon } from "../../icons";

const ExpandMore = styled((props: { expand: boolean } & IconButtonProps) => {
  return <IconButton {...props} />;
})(({ theme, expand }) => ({
  transform: expand ? "rotate(90deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export interface FaqItemProps {
  title: ReactNode;
  children: ReactNode;
  hasBorderBottom?: Boolean;
}

export const FaqItem: FunctionComponent<FaqItemProps> = ({
  title,
  children,
  hasBorderBottom = true,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Box
      sx={{
        borderBottom: hasBorderBottom ? 1 : 0,
        borderColor: ({ palette }) => palette.gray[30],
        mb: "12px",
        py: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={handleExpandClick}
      >
        <Box sx={{ display: "flex", mr: "14px" }}>
          <RightPointerIcon />
          <Typography component="div">
            <strong>{title}</strong>
          </Typography>
        </Box>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ pl: "30px" }}>{children}</Box>
      </Collapse>
    </Box>
  );
};
