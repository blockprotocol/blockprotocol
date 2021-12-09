// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import React from "react";
import { tw } from "twind";

import Header from "../../components/Header";

const containerString = `mx-auto px-4 md:px-0 lg:max-w-4xl md:max-w-2xl`;

export default function PartnersSubmitted() {
  return (
    <div
      id="partners"
      style={{ fontFamily: "'Inter', sans-serif" }}
      className={tw`flex flex-col min-h-screen`}
    >
      <Header />

      <main
        style={{ background: "#FCFDFE" }}
        className={tw`text-center pt-8 pb-10 w-auto flex-grow-1`}
      >
        <div className={tw`${containerString}`}>
          <h2 className={tw`font-extrabold`}>Thanks for registering</h2>
          <div style={{ fontSize: 18 }} className={tw`mt-4`}>
            We’ve received your submission and will be in touch.
          </div>

          <Link href="https://hash.ai" replace>
            <a
              id="return_home"
              className={tw`text-white mt-8 px-10 py-3 rounded font-semibold flex items-center inline-block mx-auto`}
            >
              Return to HASH{" "}
              <img
                className={tw`ml-2 inline`}
                alt="return"
                src="/assets/keyboard-return.svg"
              />
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
