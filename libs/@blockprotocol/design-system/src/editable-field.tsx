import {
  Box,
  Fade,
  IconButton,
  InputBase,
  InputBaseProps,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { PenIcon, PenToSquareIcon } from "./main";

export const EditableField = ({
  editIconFontSize,
  readonly,
  placeholderSx = {},
  value,
  placeholder,
  sx,
  onBlur,
  ...props
}: {
  editIconFontSize?: number;
  readonly?: boolean;
  placeholderSx?: SxProps<Theme>;
} & InputBaseProps) => {
  const { palette } = useTheme();

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [inputHeight, setInputHeight] = useState(0);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const resize = () => {
      const newInputHeight = inputRef.current?.offsetHeight;

      if (newInputHeight) {
        setInputHeight(newInputHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (editing) {
      inputRef.current.focus();
    }

    window.addEventListener("resize", resize);
    resizeObserver.observe(inputRef.current);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [editing]);

  return readonly && !value ? null : (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        width: 1,
      }}
    >
      <Box
        sx={{
          ...(editing ? { flex: 1 } : {}),
          position: "relative",
          transition: ({ transitions }) =>
            inputHeight ? transitions.create("height") : "none",
          ...(inputHeight ? { height: inputHeight } : {}),
        }}
      >
        {!editing ? (
          <Typography
            ref={inputRef}
            onClick={() => {
              if (!value && !readonly) {
                setEditing(true);
              }
            }}
            sx={[
              ...(Array.isArray(sx) ? sx : [sx]),
              {
                width: 1,
                wordBreak: "break-word",
                whiteSpace: "break-spaces",
                ...(!value
                  ? {
                      color: palette.gray[50],
                      opacity: 1,
                      ...placeholderSx,
                    }
                  : {}),
                ...(!value
                  ? {
                      cursor: "pointer",
                    }
                  : null),
              },
            ]}
          >
            {value && typeof value === "string" ? (
              value
            ) : (
              <>
                <Box component="span" sx={{ mr: 1 }}>
                  {placeholder}
                </Box>
                <Box
                  component="span"
                  sx={{ display: "inline-flex", verticalAlign: "middle" }}
                >
                  <PenIcon sx={{ fontSize: "inherit" }} />
                </Box>
              </>
            )}
          </Typography>
        ) : (
          <InputBase
            {...props}
            multiline
            value={value}
            autoFocus
            onBlur={(event) => {
              setEditing(false);
              onBlur?.(event);
            }}
            onKeyDown={({ shiftKey, code }) => {
              if (!shiftKey && code === "Enter") {
                inputRef.current?.blur();
              }
            }}
            onFocus={(event) =>
              event.currentTarget.setSelectionRange(
                event.currentTarget.value.length,
                event.currentTarget.value.length,
              )
            }
            inputRef={inputRef}
            placeholder={!readonly ? placeholder : undefined}
            inputProps={{
              sx: [
                {
                  "&::placeholder": {
                    color: palette.gray[50],
                    opacity: 1,
                    ...placeholderSx,
                  },
                  // Override WP Input styles
                  minHeight: "unset",
                  border: "none",
                  boxShadow: "none !important",
                },
              ],
            }}
            sx={[
              {
                width: 1,
                p: 0,
                verticalAlign: "top",
              },
              ...(Array.isArray(sx) ? sx : [sx]),
            ]}
          />
        )}
      </Box>

      {!readonly ? (
        <Fade in={!!value && hovered && !editing} timeout={editing ? 0 : 300}>
          <IconButton
            tabIndex={0}
            onClick={() => {
              setEditing(!editing);
              inputRef.current?.focus();
            }}
            sx={{
              padding: 0.5,
            }}
          >
            <PenToSquareIcon
              sx={{ fontSize: `${editIconFontSize}px !important` }}
            />
          </IconButton>
        </Fade>
      ) : null}
    </Box>
  );
};
