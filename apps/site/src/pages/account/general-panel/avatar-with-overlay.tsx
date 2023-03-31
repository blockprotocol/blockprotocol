import { faFaceLaugh } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@mui/material";

import { FontAwesomeIcon } from "../../../components/icons";

export const AvatarWithOverlay = ({
  src,
  showDangerOverlay,
}: {
  showDangerOverlay: boolean;
  src?: string;
}) => {
  return (
    <Avatar
      src={src}
      sx={[
        {
          width: 150,
          height: 150,
          backgroundColor: "gray.10",
          border: "1px solid",
          borderColor: "gray.30",
          position: "relative",
          alignSelf: "center",
          margin: 2,

          "&:after": {
            content: '""',
            transition: (theme) => theme.transitions.create("opacity"),
            opacity: showDangerOverlay ? 1 : 0,
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            zIndex: 1,
            background:
              "linear-gradient(0deg, rgba(218, 42, 84, 0.33), rgba(218, 42, 84, 0.33))",
          },
        },
      ]}
    >
      <FontAwesomeIcon
        icon={faFaceLaugh}
        sx={{ color: "gray.40", fontSize: 80 }}
      />
    </Avatar>
  );
};
