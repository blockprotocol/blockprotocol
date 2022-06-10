import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Snippet } from "../../snippet";

const reactDummyCode = `export const App: BlockComponent<AppProps> =({
    updateEntities,
    entityId,
    accountId,
    ...rest
 }) => {const [ toDoList, setToDoList ] = useState(data);
   
 return (
     <div className="container">
       <div className="date-title">
         <h1>{date}</h1>
       </div>
       <div className=”list”>
         {toDoList.map(todo => {`;

const CodeBlock = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        margin: {
          xs: "1rem 1rem 0 1.5rem",
          sm: "2rem 2rem 0 2.5rem",
          md: "3rem 3rem 0 3.5rem",
        },
        maxWidth: { xs: "80%", md: "50%" },
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src="/assets/new-home/code-box-header.svg"
        sx={{ width: "100%", marginBottom: "-3px" }}
      />
      <Box
        sx={{
          background:
            "linear-gradient(181.4deg, #39444F 50%, #39444F 50%, #242D37 94.38%)",
          fontSize: { xs: "0.875rem", md: "1rem" },
          height: "100%",
          color: ({ palette }) => palette.gray[30],
        }}
      >
        <Box
          component="pre"
          sx={{
            px: { xs: 3, md: 5 },
            pt: { xs: 2.5, md: 4.5 },
          }}
        >
          <Snippet
            sx={{
              fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
              whiteSpace: "break-spaces",
            }}
            source={reactDummyCode}
            language="jsx"
          />
        </Box>
      </Box>
    </Box>
  );
};

export const AnyFramework = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 10, md: 12 },
        px: { xs: "1rem", lg: "0" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: "1250px",
          margin: "0 auto",
          background: "linear-gradient(181.4deg, #FFFFFF 50%, #FDFCFE 94.38%)",
          border: "2px solid #EBF2F7",
          borderRadius: "8px",

          boxShadow:
            "0px 2.8px 2.2px rgba(174, 155, 190, 0.15), 0px 6.7px 5.3px rgba(174, 155, 190, 0.08), 0px 12.5px 10px rgba(174, 155, 190, 0.05), 0px 22.3px 17.9px rgba(174, 155, 190, 0.09), 0px 41.8px 33.4px rgba(174, 155, 190, 0.1)",
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "48%" },
            padding: {
              xs: "1rem 1rem 0 1.5rem",
              sm: "3rem 3rem 0 3.5rem",
              md: "4rem 0 4rem 4.5rem",
            },
          }}
        >
          <Typography variant="bpHeading2" textAlign="left" mb={2}>
            Build blocks in any framework
          </Typography>
          <Typography
            variant="bpBodyCopy"
            textAlign="left"
            mb={1}
            sx={{
              color: ({ palette }) => palette.gray[80],
              maxWidth: "60ch",
            }}
          >
            Blocks can be built with Web Components, React, Vue, TypeScript,
            Angular, or simply plain HTML. The Protocol only defines how blocks
            communicate with the application they’re embedded within, not how
            they should be built.
          </Typography>
          <Typography
            variant="bpBodyCopy"
            textAlign="left"
            sx={{
              color: ({ palette }) => palette.gray[80],
              maxWidth: { xs: "100%", md: "60ch" },
            }}
          >
            Build using whatever technologies you love most.
          </Typography>
          <Box
            mt={4}
            sx={{ display: "flex", gridGap: "1.5rem", flexWrap: "wrap" }}
          >
            <Box component="img" src="/assets/new-home/webc-logo.svg" />
            <Box component="img" src="/assets/new-home/react-logo.svg" />
            <Box component="img" src="/assets/new-home/vue-logo.svg" />
            <Box component="img" src="/assets/new-home/angular-logo.svg" />
            <Box component="img" src="/assets/new-home/typescript-logo.svg" />
          </Box>
        </Box>
        <CodeBlock />
      </Box>
    </Box>
  );
};
