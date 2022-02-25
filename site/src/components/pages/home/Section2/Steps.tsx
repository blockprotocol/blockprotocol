import {
  useState,
  useRef,
  useEffect,
  useMemo,
  VFC,
  FC,
  ReactElement,
} from "react";
import { Box, Fade, Icon } from "@mui/material";

/**
 * This file contains code needed for the sticky section in Section2.tsx
 */

type BlockProps = {
  withTitle?: boolean;
  titleLocation?: "top" | "bottom";
  active?: boolean;
};

type TextBlockProps = {
  noBoxShadow?: boolean;
} & BlockProps;

const TextBlock: VFC<TextBlockProps> = ({
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
            color: ({ palette }) => palette.gray[70],
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
            color: ({ palette }) => palette.gray[90],
            fontWeight: 600,
            fontSize: 22,
            lineHeight: 1.3,
            mb: 1.5,
          }}
        >
          What's a protocol
        </Box>
        <Box sx={{ fontWeight: 400, color: ({ palette }) => palette.gray[90] }}>
          Protocols are standardized ways for two or more systems to
          communicate.
        </Box>
      </Box>
    </Box>
  );
};

type ChecklistBlockProps = {
  noBoxShadow?: boolean;
  withTitle?: boolean;
  titleLocation?: "top" | "bottom";
  active?: boolean;
  direction?: "column" | "row";
};

const ChecklistBlock: VFC<ChecklistBlockProps> = ({
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
            color: ({ palette }) => palette.gray[70],
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
            { text: <span>Write tests</span>, completed: true, id: 1 },
            { text: <span>Review latest PRs</span>, completed: true, id: 2 },
          ].map(({ text, completed, id }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                fontSize: 17,
              }}
              key={id}
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
              id: 3,
            },
            {
              text: <span>Check the color contrast</span>,
              completed: false,
              id: 4,
            },
          ].map(({ text, completed, id }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                fontSize: 17,
              }}
              key={id}
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

type ImageBlockProps = {} & BlockProps;

const ImageBlock: VFC<ImageBlockProps> = ({
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
            color: ({ palette }) => palette.gray[70],
            fontSize: 15,
            fontWeight: 400,
          }}
        >
          Image Block
        </Box>
      )}
      <Box
        component="img"
        sx={{
          width: "100%",
          border: ({ palette }) =>
            `1px solid ${active ? palette.purple[700] : "transparent"}`,
          borderRadius: "6px",
        }}
        src="/assets/image-block.png"
      />
    </Box>
  );
};

const SCHEMA_CONTENT = {
  definedTerm: {
    title: "DefinedTerm",
    content: [
      { key: "name", value: "protocol", id: 1 },
      {
        key: "description",
        value:
          "Protocols are standardized ways for two or more systems to communicate.",
        id: 2,
      },
    ],
  },
  itemList: {
    title: "ItemList",
    content: [
      { id: 3, key: "numberOfItems", value: 4 },
      { id: 5, key: "ListItem", value: "write tests" },
      { id: 6, key: "ListItem", value: "review latest PRs" },
      { id: 7, key: "ListItem", value: "read The Big Short" },
      { id: 8, key: "ListItem", value: "check color contrast" },
    ],
  },
  imageObject: {
    title: "ImageObject",
    content: [
      { id: 9, key: "caption", value: "a soft rainbow gradient" },
      { id: 10, key: "url", value: "https://pics.rainbow.png" },
      { id: 11, key: "thumbnail", value: "a soft rainbow gradient" },
      { id: 12, key: "associatedArticle", value: "https://atlantic.com" },
    ],
  },
} as {
  [key: string]: {
    title: string;
    content: { key: string; value: string; id: number }[];
  };
};

type SchemaBlockProps = {
  name: "definedTerm" | "itemList" | "imageObject";
  withTitle?: boolean;
  titleLocation?: "top" | "bottom";
};

const SchemaBlock: VFC<SchemaBlockProps> = ({
  name,
  withTitle,
  titleLocation = "top",
}) => {
  const { title, content } = SCHEMA_CONTENT[name ?? "definedTerm"];
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
            color: ({ palette }) => palette.purple[700],
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          {title}
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.common.white,
          border: ({ palette }) => `2px solid ${palette.purple[700]}`,
          boxShadow: 1,
          p: 3,
          ...(name === "definedTerm"
            ? { pb: 5.75 }
            : name === "imageObject"
            ? { pb: 12.5 }
            : {}),
          borderRadius: "6px",
        }}
      >
        {content.map(({ key, value, id }) => (
          <Box
            sx={{
              display: "flex",
              mb: 1,
              ":last-of-type": {
                mb: 0,
              },
              typography: "bpSmallCopy",
              fontWeight: 500,
            }}
            key={id}
          >
            <Box
              sx={{
                mr: 1,
                color: ({ palette }) => palette.purple[700],
              }}
              component="span"
            >
              {key}
            </Box>
            <Box
              sx={{ color: ({ palette }) => palette.gray[70] }}
              component="span"
            >
              {value}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

type AppProps = {
  name: "docs" | "notes" | "todo";
  block: ReactElement;
};

const App: FC<AppProps> = ({ name, block }) => {
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
      <Fade key={title} in timeout={{ enter: 750, exit: 500 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            mb: 1.5,
            color: ({ palette }) => palette.gray[70],
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
      </Fade>
      <Box>{block}</Box>
    </Box>
  );
};

const LayoutBg = () => {
  return (
    <svg
      viewBox="-20 -20 640 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "80%" }}
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

const Layout: VFC<{ blocks: ReactElement[]; withBg?: boolean }> = ({
  blocks,
  withBg,
}) => {
  return (
    <Box sx={{ p: 1, position: "relative" }}>
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
          <LayoutBg />
        </Box>
      )}
    </Box>
  );
};

type StepProps = {
  isMobile: boolean;
  isActive?: boolean;
};

export const Step1: VFC<StepProps> = ({ isMobile }) => {
  if (isMobile) {
    return <ChecklistBlock withTitle />;
  }

  return (
    <Layout
      blocks={[
        <TextBlock key={1} withTitle />,
        <ChecklistBlock key={2} withTitle titleLocation="bottom" />,
        <ImageBlock key={3} withTitle titleLocation="bottom" />,
      ]}
    />
  );
};

export const Step2: VFC<StepProps> = ({ isMobile }) => {
  if (isMobile) {
    return <App name="todo" block={<ChecklistBlock />} />;
  }

  return (
    <Layout
      blocks={[
        <App key={1} name="docs" block={<TextBlock noBoxShadow />} />,
        <App key={2} name="todo" block={<ChecklistBlock noBoxShadow />} />,
        <App key={3} name="notes" block={<ImageBlock />} />,
      ]}
    />
  );
};

export const Step3: VFC<StepProps> = ({ isMobile, isActive }) => {
  const [titles, setTitles] = useState<AppProps["name"][]>([
    "todo",
    "docs",
    "notes",
  ]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        const newTitles = [...titles];
        newTitles.unshift(newTitles.pop()!);
        setTitles([...newTitles]);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, titles]);

  if (isMobile) {
    return <App name="docs" block={<ChecklistBlock />} />;
  }
  return (
    <Layout
      blocks={[
        <App
          key={1}
          name={titles[0]}
          block={<ChecklistBlock noBoxShadow active direction="row" />}
        />,
        <App key={2} name={titles[1]} block={<ImageBlock active />} />,
        <App
          key={3}
          name={titles[2]}
          block={<TextBlock noBoxShadow active />}
        />,
      ]}
      withBg
    />
  );
};

export const Step4: VFC<StepProps> = ({ isMobile }) => {
  if (isMobile) {
    return <SchemaBlock name="itemList" withTitle titleLocation="bottom" />;
  }
  return (
    <Layout
      blocks={[
        <SchemaBlock
          key={1}
          name="definedTerm"
          withTitle
          titleLocation="top"
        />,
        <SchemaBlock
          key={2}
          name="itemList"
          withTitle
          titleLocation="bottom"
        />,
        <SchemaBlock
          key={3}
          name="imageObject"
          withTitle
          titleLocation="bottom"
        />,
      ]}
    />
  );
};
