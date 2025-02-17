import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  href: string;
  icon?: ReactNode;
  text: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  href,
  icon,
  text,
  className = "",
  bgColor = "bg-white",
  textColor = "text-black",
  hoverColor = "hover:bg-gray-400",
}) => {
  return (
    <Link
      href={href}
      className={`px-4 py-1.5 rounded flex items-center justify-center transition-colors ${bgColor} ${textColor} ${hoverColor} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </Link>
  );
};

export default Button;
