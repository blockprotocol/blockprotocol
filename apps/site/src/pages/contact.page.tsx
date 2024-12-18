import { Box, Container, Typography } from "@mui/material";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { tw } from "twind";

import { Button } from "../components/button";
import { AirplaneIcon } from "../components/icons";
import { Link } from "../components/link";

const labelSubtitleStyles = "text-gray-500 font-light block md:inline";

const Partners: NextPage = () => {
  return (
    <>
      <NextSeo title="Block Protocol – Contact" />
      <Container
        sx={{
          marginTop: {
            xs: 4,
            md: 8,
          },
          marginBottom: {
            xs: 4,
            md: 8,
          },
        }}
      >
        <main className={tw`text-center pt-8 pb-10 w-auto`}>
          <Box
            sx={{
              marginBottom: {
                xs: 4,
                md: 8,
              },
            }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography mb={2} variant="bpTitle">
              Get in touch
            </Typography>
            <Typography
              textAlign="center"
              maxWidth={750}
              variant="bpSubtitle"
              sx={{ fontSize: 20, marginBottom: 2 }}
            >
              If you need help with using the Block Protocol, if you’re working
              on an existing or upcoming block editor, or would otherwise like
              to contribute to the new standard, fill in some details below and
              we’ll be in touch.
            </Typography>
            <Typography
              textAlign="center"
              maxWidth={750}
              variant="bpSubtitle"
              sx={{ fontSize: 20, marginBottom: 2 }}
            >
              You can also{" "}
              <Link href="mailto:help@blockprotocol.org">email us</Link>{" "}
              directly.
            </Typography>
          </Box>
          <form
            id="partners_form"
            action="https://hash.us15.list-manage.com/subscribe/post"
            method="POST"
            className={tw`text-left`}
          >
            <input type="hidden" name="u" value="fdd8507b12076e95d84141f86" />
            <input type="hidden" name="id" value="7ef48267fd" />

            <div>
              <label htmlFor="NAME" className={tw`font-semibold uppercase `}>
                Full Name <span className={tw`text-blue-600 mr-2`}>*</span>
              </label>
              <span className={tw`${labelSubtitleStyles}`}>Your full name</span>

              <input
                id="NAME"
                name="NAME"
                required
                type="text"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label htmlFor="EMAIL" className={tw`font-semibold uppercase `}>
                Email <span className={tw`text-blue-600 mr-2`}>*</span>
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                The best email address to contact you at
              </span>

              <input
                id="EMAIL"
                name="EMAIL"
                required
                type="email"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label
                htmlFor="PROJECT"
                className={tw`font-semibold uppercase mr-2`}
              >
                Project Name
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                The name of the block editor you’re working on or block you'd
                like to write (if applicable)
              </span>

              <input
                id="PROJECT"
                name="PROJECT"
                type="text"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label
                htmlFor="PROJECTURL"
                className={tw`font-semibold uppercase mr-2`}
              >
                Project Homepage
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                Paste a link to your project or company’s homepage, if it’s
                public
              </span>

              <input
                id="PROJECTURL"
                name="PROJECTURL"
                type="text"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label
                htmlFor="PROFILEURL"
                className={tw`font-semibold uppercase mr-2`}
              >
                Your Profile
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                Paste a link to a profile you maintain so we know who we’re
                talking to (GitHub, LinkedIn, Twitter, etc.)
              </span>

              <input
                id="PROFILEURL"
                name="PROFILEURL"
                type="text"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label
                htmlFor="COMMENTS"
                className={tw`font-semibold uppercase mr-2`}
              >
                Comments
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                Let us know what interests you about the Block Protocol, what
                you'd like from us, or where you think you might be helpful
              </span>

              <textarea
                id="COMMENTS"
                name="COMMENTS"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2 w-96`}
                rows={8}
              />
            </div>
            <div hidden>
              <input type="hidden" name="tags" value="1830797" />
            </div>
            <Button
              sx={{
                marginTop: 4,
              }}
              endIcon={<AirplaneIcon />}
              type="submit"
              squared
            >
              Submit Form
            </Button>
          </form>

          <div
            style={{ fontSize: 15 }}
            className={tw`text-left text-gray-500 mt-10 pr-0 lg:pr-48`}
          >
            By submitting this form, you agree to HASH’s{" "}
            <a className={tw`font-bold`} href="https://hash.ai/legal/privacy">
              privacy policy
            </a>
            , and consent to being contacted in relation to the development and
            launch of the Block Protocol. You can opt-out at any time.
          </div>
        </main>
      </Container>
    </>
  );
};

export default Partners;
