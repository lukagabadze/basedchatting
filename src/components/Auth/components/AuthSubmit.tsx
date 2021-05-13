import React, { ReactElement } from "react";

interface Props {}

function AuthSubmit({}: Props): ReactElement {
  return (
    <button
      type="submit"
      className="text-xl py-1 bg-green-600 hover:bg-green-500 rounded-b-md"
    >
      Submit
    </button>
  );
}

export default AuthSubmit;
