import React from "react";
import { tw } from "twind";

import Header from "../../components/Header";

export default function PartnersSubmitted() {
  return (
    <body
      className={tw`mx-auto px-4 md:px-0 lg:max-w-4xl md:max-w-2xl`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header />

      <main className={tw`text-center mt-8 mb-10`}>
        <h1 className={tw`text-4xl font-extrabold`}>An open standard for blocks</h1>
        <div className={tw`mt-8`}>
          A standardized way to{" "}
          <span className={tw`font-bold`}>create blocks whose contents are mapped to schemas</span>,
          which are both human and machine-readable.
        </div>

        <h2 className={tw`text-3xl font-extrabold mt-16`}>Thanks for registering</h2>
        <div className={tw`mt-6`}>We’ve received your submission and will be in touch.</div>

        <button
          id="partners_button"
          className={tw`text-white mt-8 px-10 py-3 rounded font-semibold flex items-center mx-auto`}
          onClick={() => location.replace("https://hash.ai")}
        >
          {/*
            @aj try this instead
            import KeyboardReturn from "../../assets/svg/keyboard-return.svg";
            <KeyboardReturn className={tw`ml-2`} />
          */}
          Return to HASH <img className={tw`ml-2`} src="/assets/keyboard-return.svg" />
        </button>
      </main>
    </body>
  );
}
