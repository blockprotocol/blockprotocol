import React from "react";
import { tw } from "twind";

import Header from "../../components/Header";

const labelSubtitleStyles = "text-gray-500 font-light block md:inline";

const containerString = `mx-auto px-4 md:px-0 lg:max-w-4xl md:max-w-2xl`;

export default function Partners() {
  return (
    <div id="partners" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />

      <main style={{ background: "#FCFDFE" }} className={tw`text-center pt-8 pb-10 w-auto`}>
        <div className={tw`${containerString}`}>
          <h2  className={tw`font-extrabold `}>
            Register an interest
          </h2>
          <div style={{ fontSize: 18 }} className={tw`mt-4 px-0 lg:px-2`}>
            If you’re working on an existing or upcoming block editor, or would otherwise like to
            contribute to the new standard, fill in some details below and we’ll be in touch.
          </div>

          <form
            id="partners_form"
            action="https://hash.us15.list-manage.com/subscribe/post"
            method="POST"
            className={tw`text-left mt-10`}
          >
            <input type="hidden" name="u" value="fdd8507b12076e95d84141f86" />
            <input type="hidden" name="id" value="e511d9c097" />

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
              <label htmlFor="PROJECT" className={tw`font-semibold uppercase `}>
                Project Name <span className={tw`text-blue-600 mr-2`}>*</span>
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                The name of the block editor (or related application) you’re working on
              </span>

              <input
                id="PROJECT"
                name="PROJECT"
                required
                type="text"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label htmlFor="PROJECTURL" className={tw`font-semibold uppercase mr-2`}>
                Project Homepage
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                Paste a link to your project or company’s homepage, if it’s public
              </span>

              <input
                id="PROJECTURL"
                name="PROJECTURL"
                type="text"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label htmlFor="PROFILEURL" className={tw`font-semibold uppercase mr-2`}>
                Your Profile
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                Paste a link to a profile you maintain so we know who we’re talking to (GitHub,
                LinkedIn, Twitter, etc.)
              </span>

              <input
                id="PROFILEURL"
                name="PROFILEURL"
                type="text"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2`}
              />
            </div>

            <div className={tw`mt-8`}>
              <label htmlFor="COMMENTS" className={tw`font-semibold uppercase mr-2`}>
                Comments
              </label>
              <span className={tw`${labelSubtitleStyles}`}>
                Let us know what interests you about the standard, or where you think you might be
                helpful
              </span>

              <textarea
                id="COMMENTS"
                name="COMMENTS"
                className={tw`block border-1 border-gray-300 rounded mt-4 px-5 py-2 w-96`}
                rows={8}
              />
            </div>

            <button
              className={tw`text-white mt-8 px-10 py-3 rounded font-semibold flex items-center`}
              type="submit"
            >
              {/*
              @aj try this instead
              import Airplane from "../../assets/svg/airplane.svg";
              <Airplane className={tw`ml-2`} />
            */}
              Submit Form <img className={tw`ml-2`} src="/assets/airplane.svg" />
            </button>
          </form>

          <div style={{ fontSize: 15 }} className={tw`text-left text-gray-500 mt-10 pr-0 lg:pr-48`}>
            By submitting this form, you agree to HASH’s{" "}
            <a className={tw`font-bold`} href="https://hash.ai/legal/privacy">
              privacy policy
            </a>
            , and consent to being contacted in relation to the development and launch of the Block
            Protocol. You can opt-out at any time.
          </div>
        </div>
      </main>
    </div>
  );
}
