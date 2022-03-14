import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const TableTreeIcon: FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon width="1em" height="1em" {...props} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2.33359C1 1.5604 1.6268 0.933594 2.4 0.933594H8C8.7732 0.933594 9.4 1.5604 9.4 2.33359V5.13359C9.4 5.90679 8.7732 6.53359 8 6.53359H6.25002V7.93359C6.25002 8.12689 6.40672 8.28359 6.60002 8.28359H13.6L13.6 6.53338C13.6 5.76018 14.2268 5.13338 15 5.13338H20.6C21.3732 5.13338 22 5.76018 22 6.53338V12.1334C22 12.9066 21.3732 13.5334 20.6 13.5334H15C14.2268 13.5334 13.6 12.9066 13.6 12.1334L13.6 10.3836H6.60002C6.48119 10.3836 6.36434 10.3751 6.25002 10.3588V17.7334C6.25002 17.9267 6.40672 18.0834 6.60002 18.0834H13.6V16.3336C13.6 15.5604 14.2268 14.9336 15 14.9336H20.6C21.3732 14.9336 22 15.5604 22 16.3336V21.9336C22 22.7068 21.3732 23.3336 20.6 23.3336H15C14.2268 23.3336 13.6 22.7068 13.6 21.9336V20.1834H6.60002C5.24693 20.1834 4.15002 19.0865 4.15002 17.7334V7.93359V6.53359H2.4C1.6268 6.53359 1 5.90679 1 5.13359V2.33359ZM15.7 7.23338V11.4334H19.9V7.23338H15.7ZM15.7 21.2336V17.0336H19.9V21.2336H15.7Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
