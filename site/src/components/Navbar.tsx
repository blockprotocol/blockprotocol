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
          <span>Block Gallery</span>
        </li>
        <li>
          <span>Documentation</span>
        </li>
        <li>
          <span>Publish a Block</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
