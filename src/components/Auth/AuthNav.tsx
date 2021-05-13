import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

interface Props {}

function AuthNav({}: Props): ReactElement {
  return (
    <Link to="/" className="flex items-center hover:underline cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 17l-5-5m0 0l5-5m-5 5h12"
        />
      </svg>
      <p>Back to home</p>
    </Link>
  );
}

export default AuthNav;
