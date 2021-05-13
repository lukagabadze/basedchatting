import React, { ReactElement } from "react";

interface Props {
  error: string;
}

function AuthError({ error }: Props): ReactElement {
  return <p className="text-red-500 font-bold text-xl">{error}</p>;
}

export default AuthError;
