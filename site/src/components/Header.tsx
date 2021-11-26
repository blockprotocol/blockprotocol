import { tw } from "twind";

const containerString = `mx-auto px-4 md:px-0 lg:max-w-4xl md:max-w-2xl`;

export default function Header() {
  return (
    <header
      id="partners_header"
      className={tw`text-center pt-4 pb-8 ${containerString}`}
    >
      <a className={tw`flex items-center justify-center`} href="/partners">
        <img
          className={tw`inline w-12 md:w-20 mr-5 md:mr-6 rotate-12`}
          alt="Blockprotocol Logo"
          src="/assets/logo.png"
        />{" "}
        <span>
          <span className={tw`font-bold`}>block</span>
          <span className={tw`font-medium`}>protocol</span>
          <span className={tw`font-light`}>.org</span>
        </span>
      </a>

      <h1 className={tw`font-extrabold mt-8`}>An open standard for blocks</h1>
      <div className={tw`mt-5`}>
        A standardized way to{" "}
        <span className={tw`font-bold`}>
          create blocks whose contents are mapped to schemas
        </span>
        , which are both human and machine-readable.
      </div>
    </header>
  );
}
