import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  to?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  to,
  children,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "w-30 items-center py-2 border-2 rounded-2xl bg-blue-500 text-black font-semibold transition-colors duration-300 hover:bg-purple-900 border-black";

  if (to) {
    return (
      <button
        className={`${baseClasses} ${className}`}
        type={type}
        onClick={onClick}
      >
        <Link to={to} className="block w-full text-center">
          {children}
        </Link>
      </button>
    );
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
