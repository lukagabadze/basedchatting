import React, { ReactElement } from "react";

interface Props {
  children: React.ReactNode;
}

function AuthCard({ children }: Props): ReactElement {
  return (
    <div className="bg-yellow-400 rounded-md">
      <form className="flex flex-col space-y-6 ">{children}</form>
    </div>
  );
}

export default AuthCard;
