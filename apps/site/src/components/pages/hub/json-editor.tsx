import { Box } from "@mui/material";
import Prism from "prismjs";
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { CODE_FONT_FAMILY } from "../../../theme/typography";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height: string | number;
}

export const JsonEditor = ({ onChange, value, height }: JsonEditorProps) => {
  const highlightedElementRef = useRef<HTMLPreElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!highlightedElementRef.current) {
      return;
    }
    Prism.highlightElement(highlightedElementRef.current.children[0]!);
  }, [value]);

  /**
   * This ensures the code block scrolls with
   * the textarea
   */
  const handleTextAreaScroll = useCallback(() => {
    if (!highlightedElementRef.current || !textAreaRef.current) {
      return;
    }

    highlightedElementRef.current.scrollLeft = textAreaRef.current.scrollLeft;
    highlightedElementRef.current.scrollTop = textAreaRef.current.scrollTop;
  }, []);

  const handleKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!textAreaRef.current) {
        return;
      }

      if (evt.key === "Tab") {
        evt.preventDefault();
        const { selectionStart } = evt.currentTarget;
        let newCursorPos;
        let newText;

        if (evt.shiftKey) {
          // The previous character has to be a tab
          if (value.substring(selectionStart - 1, selectionStart) !== "\t") {
            return;
          }

          newText = `${value.substring(0, selectionStart - 1)}${value.substring(
            selectionStart,
          )}`;

          newCursorPos = selectionStart - 1;
        } else {
          newText = `${value.substring(0, selectionStart)}\t${value.substring(
            selectionStart,
          )}`;
          newCursorPos = selectionStart + 1;
        }

        onChange(newText);

        // Once state is updated, the cursor is pushed to the end of the string, which isn't ideal
        // if the indentation is made before the end of the string.
        // Doing this helps to preserve the cursor location.
        textAreaRef.current.value = newText;
        textAreaRef.current.selectionStart = newCursorPos;
        textAreaRef.current.selectionEnd = newCursorPos;
      }
    },
    [value, onChange],
  );

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(evt.target.value);
    },
    [onChange],
  );

  return (
    <Box
      sx={(theme) => ({
        height,
        position: "relative",
        fontSize: 14,
        backgroundColor: theme.palette.gray[90],
        borderTopLeftRadius: {
          xs: 6,
          md: 0,
        },
        borderTopRightRadius: {
          xs: 6,
          md: 0,
        },
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
      })}
    >
      <pre
        style={{
          borderRadius: 0,
          outline: "none",
          height: "100%",
          background: "transparent",
          padding: "32px 0",
          margin: "0 32px",
        }}
        ref={highlightedElementRef}
      >
        <code style={{ tabSize: 2 }} className="language-json">
          {value}
        </code>
      </pre>
      <Box
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          /**
           * firefox does not work with inset:0 to adjust the width of `textarea` element width `position: absolute`
           * and we cannot use `100%` as `width`, because that does not respect to horizontal margin
           * `-moz-available` works as expected on firefox
           */
          width: "-moz-available",
          height: "100%",
          padding: "32px 0",
          margin: "0 32px",
          resize: "none",
          // to override focus outline on firefox
          outline: "none !important",
          caretColor: theme.palette.common.white,
          background: "transparent",
          color: "transparent",
          tabSize: 2,
          fontFamily: CODE_FONT_FAMILY,
          fontSize: "1em",
        })}
        wrap="off"
        component="textarea"
        ref={textAreaRef}
        onChange={handleChange}
        value={value}
        onKeyDown={handleKeyDown}
        onScroll={handleTextAreaScroll}
        spellCheck="false"
      />
    </Box>
  );
};
