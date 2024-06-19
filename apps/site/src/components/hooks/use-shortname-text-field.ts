import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";

import { apiClient } from "../../lib/api-client";
import {
  ApiIsShortnameTakenQueryParams,
  ApiIsShortnameTakenResponse,
} from "../../pages/api/is-shortname-taken.api";

const parseShortnameInput = (input: string) =>
  input.replaceAll(/[^a-zA-Z0-9-_]/g, "").toLowerCase();

type UseShortnameTextFieldProps = {
  touched: boolean;
};

export const useShortnameTextField = ({
  touched,
}: UseShortnameTextFieldProps) => {
  const [shortname, setShortname] = useState<string>("");
  const [isTaken, setIsTaken] = useState<boolean>();

  const isEmpty = !shortname;

  const isTooShort = shortname.length < 4;

  const isTooLong = shortname.length > 24;

  const shortnameInputIsValid = !(isEmpty || isTooShort || isTooLong);

  const debouncedCheckIfShortnameIsValid = useMemo(
    () =>
      debounce(async (params: { shortname: string }) => {
        const { data: isShortnameTaken, error } = await apiClient.get<
          ApiIsShortnameTakenResponse,
          ApiIsShortnameTakenQueryParams
        >("is-shortname-taken", { params });

        if (error) {
          throw error;
        } else if (isShortnameTaken !== undefined) {
          setIsTaken(isShortnameTaken);
        }
      }, 300),
    [],
  );

  useEffect(() => {
    if (shortnameInputIsValid) {
      setIsTaken(undefined);

      void debouncedCheckIfShortnameIsValid({ shortname });
    }
  }, [shortnameInputIsValid, shortname, debouncedCheckIfShortnameIsValid]);

  const isShortnameValid = shortnameInputIsValid && isTaken === false;

  const shortnameHelperText =
    isEmpty && touched
      ? "You must choose a username"
      : isTooShort && touched
      ? "Must be at least 4 characters"
      : isTooLong
      ? "Must be shorter than 24 characters"
      : isTaken
      ? "This user has already been taken"
      : isShortnameValid
      ? "We’ll use this as your public display name"
      : undefined;

  return {
    shortname,
    setShortname: (updatedShortname: string) =>
      setShortname(parseShortnameInput(updatedShortname)),
    isShortnameValid,
    shortnameHelperText,
  };
};
