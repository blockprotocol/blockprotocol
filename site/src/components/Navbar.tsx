import Link from "next/link";
import React from "react";
import { tw } from "twind";

interface NavbarProps {
  className?: string;
}

const Navbar: React.VFC<NavbarProps> = ({ className }) => {
  return (
    <nav className={className}>
      <ul className={tw`list-none flex flex-row justify-between items-center text-base font-bold`}>
        <li>
          <a href="/partners">
            <span style={{ fontSize: "2rem" }}>
              <span className={tw`font-bold`}>block</span>
              <span className={tw`font-medium`}>protocol</span>
              <span className={tw`font-light`}>.org</span>
            </span>
          </a>
        </li>
        <li>
          <Link href="/gallery">Block Gallery</Link>
        </li>
        <li>
          <span className={tw`text-gray-500 cursor-not-allowed`} title="under construction">
            Documentation
          </span>
        </li>
        <li>
          <span className={tw`text-gray-500 cursor-not-allowed`} title="under construction">
            Publish a Block
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
