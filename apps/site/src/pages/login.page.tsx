import { Box, Container, Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { FormEvent, useState } from "react";

import { Button } from "../components/button";
import { TextField } from "../components/text-field";

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The Block Protocol account system has been removed while we focus on
    // HASH. The page intentionally stays live so existing inbound links keep
    // working, but no credentials can succeed against it.
    setErrorMessage("Invalid email or password.");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        flexGrow: 1,
        background:
          "radial-gradient(141.84% 147.92% at 50% 122.49%, #FFB172 0%, #9482FF 32.87%, #84E6FF 100%)",
      }}
    >
      <Container
        sx={{
          py: { xs: 8, md: 14 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            borderRadius: "6px",
            maxWidth: 480,
            width: "100%",
            padding: { xs: 3.5, sm: 5 },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            <Typography variant="bpHeading4" component="h1">
              Log in
            </Typography>
            <Typography variant="bpSmallCopy" sx={{ color: "gray.70" }}>
              Sign in to your Block Protocol account.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Email"
              type="email"
              value={email}
              required
              onChange={(event) => {
                setEmail(event.target.value);
                if (errorMessage) {
                  setErrorMessage(null);
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              required
              onChange={(event) => {
                setPassword(event.target.value);
                if (errorMessage) {
                  setErrorMessage(null);
                }
              }}
              error={!!errorMessage}
              helperText={errorMessage ?? undefined}
            />
            <Button type="submit">Sign in</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
