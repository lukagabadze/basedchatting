import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

interface Props {}

function Header({}: Props): ReactElement {
  return (
    <header className="flex justify-between items-center bg-yellow-500 p-2 px-14">
      <p className="text-3xl">Based Chatting</p>
      <div className="flex space-x-3">
        <Link to="/auth/login">
          <button className="border-2 border-black px-2 text-xl hover:bg-black">
            Login
          </button>
        </Link>
        <Link to="/auth/signup">
          <button className="border-2 border-black px-2 text-xl hover:bg-black">
            Signup
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
