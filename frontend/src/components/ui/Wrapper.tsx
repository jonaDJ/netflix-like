import React from "react";

interface WrapperProps {
  children: React.ReactNode;
  maxWidth?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="px-[4%] w-full">{children}</div>;
};

export default Wrapper;
