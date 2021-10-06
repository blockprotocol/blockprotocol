import { tw } from "twind";

export default function Header() {
  return (
    <header className={tw`text-center mt-4`}>
      <a href="/partners">
        <img className={tw`inline w-24`} src="/assets/logo.svg" />{" "}
        <span className={tw`text-2xl`}>
          <span className={tw`font-bold`}>block</span>
          <span className={tw`font-medium`}>protocol</span>
          <span className={tw`font-light`}>.org</span>
        </span>
      </a>
    </header>
  );
}
