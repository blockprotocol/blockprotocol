import { Grid, List, ListItem, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

export const FieldInfoWrapper = ({
  children,
  items,
  title,
}: PropsWithChildren<{ title: string; items: ReactNode[] }>) => {
  return (
    <Grid container columnSpacing={4}>
      <Grid md={6} xs={12} item>
        {children}
      </Grid>
      <Grid md={6} xs={12} item mt={2}>
        <Typography
          variant="bpSmallCopy"
          fontWeight={400}
          sx={{ color: "gray.70" }}
        >
          <List
            dense
            subheader={<b>{title}</b>}
            disablePadding
            sx={(theme) => ({
              li: {
                display: "list-item",
                listStyleType: "disc",
                listStylePosition: "inside",
                p: theme.spacing(0, 1),
              },
            })}
          >
            {items.map((item, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <ListItem key={i}>{item}</ListItem>
            ))}
          </List>
        </Typography>
      </Grid>
    </Grid>
  );
};
