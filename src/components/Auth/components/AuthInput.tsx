import React, { ReactElement } from "react";

interface Props {
  label: string;
  id: string;
  type: string;
  placeholder: string;
}

function AuthInput({ label, id, type, placeholder }: Props): ReactElement {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-black font-bold">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="flex-grow border-b-2 border-black text-black rounded-sm bg-transparent bg-opacity-0 placeholder-white"
      />
    </div>
  );
}

export default AuthInput;
