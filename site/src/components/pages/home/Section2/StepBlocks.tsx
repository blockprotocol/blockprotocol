import {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  VFC,
  FC,
  ReactElement,
  memo,
} from "react";
import {
  Container,
  Typography,
  Box,
  Fade,
  useTheme,
  Icon,
} from "@mui/material";

type BlockProps = {
  name: "text" | "checklist" | "image";
};

const TextBlock = ({
  noBoxShadow,
  withTitle,
  titleLocation = "top",
  active,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: titleLocation === "top" ? "column" : "column-reverse",
      }}
    >
      {withTitle && (
        <Box
          sx={{
            ...(titleLocation === "top"
              ? {
                  mb: 1,
                }
              : {
                  mt: 1.5,
                }),
            color: ({ palette }) => palette.gray[60],
            fontSize: 15,
            fontWeight: 400,
          }}
        >
          Text Block
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.common.white,
          border: ({ palette }) =>
            `1px solid ${active ? palette.purple[700] : palette.gray[10]}`,
          boxShadow: noBoxShadow ? 0 : 1,
          p: 3,
          borderRadius: "6px",
        }}
      >
        <Box
          sx={{
            color: ({ palette }) => palette.gray[80],
            fontWeight: 600,
            fontSize: 22,
            lineHeight: 1.3,
            mb: 1.5,
          }}
        >
          What's a protocol
        </Box>
        <Box sx={{ fontWeight: 400, color: ({ palette }) => palette.gray[80] }}>
          Protocols are standardized ways for two or more systems to
          communicate.
        </Box>
      </Box>
    </Box>
  );
};

const ChecklistBlock = ({
  noBoxShadow,
  withTitle,
  titleLocation = "top",
  active,
  direction = "column",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: titleLocation === "top" ? "column" : "column-reverse",
      }}
    >
      {withTitle && (
        <Box
          sx={{
            ...(titleLocation === "top"
              ? {
                  mb: 1,
                }
              : {
                  mt: 1.5,
                }),
            color: ({ palette }) => palette.gray[60],
            fontSize: 15,
            fontWeight: 400,
          }}
        >
          Checklist Block
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.common.white,
          border: ({ palette }) =>
            `1px solid ${active ? palette.purple[700] : palette.gray[10]}`,
          boxShadow: noBoxShadow ? 0 : 1,
          p: 3,
          borderRadius: "6px",
          display: "flex",
          flexDirection: direction,
        }}
      >
        <Box
          sx={{
            mr: direction === "row" ? "5%" : 0,
          }}
        >
          {[
            { text: <span>Write tests</span>, completed: true },
            { text: <span>Review latest PRs</span>, completed: true },
          ].map(({ text, completed }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                fontSize: 17,
              }}
            >
              <Icon
                className={completed ? "fas fa-check-square" : "fal fa-stop"}
                sx={{
                  height: 19,
                  width: 19,
                  mr: 1,
                  color: ({ palette }) => palette.purple[700],
                }}
              />
              {text}
            </Box>
          ))}
        </Box>
        <Box>
          {[
            {
              text: (
                <span>
                  Read <strong>The Big Short</strong>
                </span>
              ),
              completed: false,
            },
            { text: <span>Check the color contrast</span>, completed: false },
          ].map(({ text, completed }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                fontSize: 17,
              }}
            >
              <Icon
                className={completed ? "fas fa-check-square" : "fal fa-stop"}
                sx={{
                  height: 19,
                  width: 19,
                  mr: 1,
                  color: ({ palette }) => palette.purple[700],
                }}
              />
              {text}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const App: FC<{ name: "docs" | "notes" | "todo"; block: ReactElement }> = ({
  name,
  block,
}) => {
  const { iconClass, title } = useMemo(() => {
    switch (name) {
      case "docs":
        return {
          iconClass: "fas fa-file-alt",
          title: "Team Docs",
        };
      case "notes":
        return {
          iconClass: "fas fa-pencil",
          title: "Personal Notes",
        };
      case "todo":
      default:
        return {
          iconClass: "fas fa-check-circle",
          title: "To-do App",
        };
    }
  }, [name]);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: ({ palette }) => palette.gray[10],
        borderRadius: "6px",
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          mb: 1.5,
          color: ({ palette }) => palette.gray[60],
        }}
      >
        <Icon
          className={iconClass}
          sx={{
            p: 1,
            height: 16,
            width: 16,
            color: "currentColor",
          }}
        />
        {title}
      </Box>
      <Box>{block}</Box>
    </Box>
  );
};

// @todo use SvgIcon for this
const LayoutBg = (props) => {
  return (
    <svg
      width={619}
      height="auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#a)" transform="rotate(-180 309.5 260.5)">
        <ellipse cx={309.5} cy={260.5} rx={209} ry={160.5} fill="#C4C4C4" />
        <ellipse cx={309.5} cy={260.5} rx={209} ry={160.5} fill="url(#b)" />
      </g>
      <defs>
        <linearGradient
          id="b"
          x1={323.292}
          y1={299.901}
          x2={127.164}
          y2={128.376}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A292FF" />
          <stop offset={1} stopColor="#7CCFFF" />
        </linearGradient>
        <filter
          id="a"
          x={0.5}
          y={0}
          width={618}
          height={521}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={50}
            result="effect1_foregroundBlur_1612_10700"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Layout: VFC<{ blocks: ReactElement[]; withBg: boolean }> = ({
  blocks,
  withBg,
}) => {
  return (
    <Box sx={{ border: "1px solid black", p: 1, position: "relative" }}>
      <Box
        sx={{
          width: "75%",
          mx: "auto",
          mb: 2.5,
          position: "relative",
          zIndex: 2,
        }}
      >
        {blocks[0]}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box sx={{ flex: 0.44 }}>{blocks[1]}</Box>
        <Box sx={{ flex: 0.53 }}>{blocks[2]}</Box>
      </Box>
      {withBg && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LayoutBg style={{ width: "100%" }} />
        </Box>
      )}
    </Box>
  );
};

export const Step1 = ({ isMobile }) => {
  if (isMobile) {
    return <ChecklistBlock withTitle />;
  }

  return (
    <Layout
      blocks={[
        <TextBlock withTitle />,
        <ChecklistBlock withTitle titleLocation="bottom" />,
        <TextBlock withTitle titleLocation="bottom" />,
      ]}
    />
  );
};

export const Step2 = ({ isMobile }) => {
  return (
    <Layout
      blocks={[
        <App name="docs" block={<TextBlock noBoxShadow />} />,
        <App name="todo" block={<ChecklistBlock noBoxShadow />} />,
        <App name="notes" block={<TextBlock noBoxShadow />} />,
      ]}
    />
  );
};

export const Step3 = ({ isMobile }) => {
  return (
    <Layout
      blocks={[
        <App
          name="todo"
          block={<ChecklistBlock noBoxShadow active direction="row" />}
        />,
        <App name="docs" block={<TextBlock noBoxShadow active />} />,
        <App name="notes" block={<TextBlock noBoxShadow active />} />,
      ]}
      withBg
    />
  );
};

export const Step4 = ({ isMobile }) => {
  return (
    <Layout
      blocks={[
        <App name="docs" block={<TextBlock noBoxShadow />} />,
        <App name="todo" block={<ChecklistBlock noBoxShadow />} />,
        <App name="notes" block={<TextBlock noBoxShadow />} />,
      ]}
    />
  );
};
