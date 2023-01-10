import { UnknownRecord } from "@blockprotocol/core";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export const useDefaultState = <
  T extends any[] | UnknownRecord | boolean | string,
>(
  providedDefaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const defaultStateValue = {
    prevDefault: providedDefaultValue,
    currentValue: providedDefaultValue,
  };
  const [{ prevDefault, currentValue }, setNextValue] =
    useState(defaultStateValue);

  if (
    prevDefault !== providedDefaultValue &&
    JSON.stringify(prevDefault) !== JSON.stringify(providedDefaultValue)
  ) {
    setNextValue(defaultStateValue);
  }

  const setState = useCallback((value: T | SetStateAction<T>) => {
    setNextValue((prevValue) => {
      const nextValue =
        typeof value === "function" ? value(prevValue.currentValue) : value;

      return {
        prevDefault: prevValue.prevDefault,
        currentValue: nextValue,
      };
    });
  }, []);

  return [currentValue, setState];
};
