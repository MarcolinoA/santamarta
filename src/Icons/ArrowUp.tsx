import React from "react";

interface ArrowProps {
  className?: string;
}

const ArrowUp: React.FC<ArrowProps> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      fontWeight="bold"
      width="30px"
      height="20px"
      viewBox="0 0 64 80"
    >
      <path d="M32 18.045a5.775 5.775 0 00-4.107 1.695L3.551 44.034a1.102 1.102 0 000 1.585c.449.45 1.131.449 1.581 0l24.346-24.294c1.384-1.382 3.661-1.375 5.044.007l24.342 24.29c.223.223.5.324.79.324h.004c.291 0 .568-.103.79-.327a1.102 1.102 0 000-1.585L36.106 19.74a5.777 5.777 0 00-4.107-1.695z" />
    </svg>
  );
};

export default ArrowUp;

