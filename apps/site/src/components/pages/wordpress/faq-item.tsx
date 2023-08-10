import {
  Box,
  Collapse,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from "@mui/material";
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

interface FaqItemProps {
  title: ReactNode;
  children: ReactNode;
  bordered?: Boolean;
}

export const FaqItem: FunctionComponent<FaqItemProps> = ({
  title,
  children,
  bordered = true,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Box
      sx={{
        borderBottom: bordered ? 1 : 0,
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
          <Box sx={{ mt: { xs: "-2px", md: "-1px" }, pr: "6px" }}>
            <Box sx={{ ml: "-4px" }}>
              <RightPointerIcon />
            </Box>
          </Box>
          <Typography component="div" fontWeight={600}>
            {title}
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
        <Box
          sx={{
            px: "30px",
            pb: "1rem",
            color: ({ palette }) => palette.bpGray[80],
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};
