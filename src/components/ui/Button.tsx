import React from "react";

interface ButtonProps {
  onClick: (event: React.MouseEvent) => void;
  icon: React.ReactNode;
  className: string;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  icon,
  className,
  ariaLabel,
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full hover:bg-gray-700 transition-all ${className}`}
    aria-label={ariaLabel}
  >
    {icon}
  </button>
);

export default Button;
