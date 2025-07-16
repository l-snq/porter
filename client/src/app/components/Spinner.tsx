import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="spinner">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="#ff8a00"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
      </svg>
    </div>
  );
};

export default Spinner;