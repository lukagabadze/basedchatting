import React, { ReactElement } from "react";

interface Props {
  children: React.ReactNode;
}

function AuthCard({ children }: Props): ReactElement {
  return (
    <div className="bg-yellow-400 rounded-md">
      <div className="flex flex-col space-y-6 ">{children}</div>
    </div>
  );
}

export default AuthCard;
