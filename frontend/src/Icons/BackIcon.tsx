import React from "react";

interface LeftIconProps {
  className?: string;
}

const LeftIcon: React.FC<LeftIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      version="1"
      viewBox="0 0 32 32"
      className={className}
    >
      <path
        d="M90 205l-44-45 44-45c24-24 46-42 49-40 2 3-11 21-29 40l-34 35h102c61 0 102 4 102 10s-41 10-102 10H76l34 35c18 19 31 37 29 40-3 2-25-16-49-40z"
        transform="matrix(.1 0 0 -.1 0 32)"
        fill="currentColor"
      ></path>
    </svg>
  );
};

export default LeftIcon;
