import React from "react";

export const TransactionDetail = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | JSX.Element;
  className?: string;
}) => (
  <div className={`bitte-flex bitte-items-center bitte-justify-between bitte-text-sm ${className}`}>
    <div className="bitte-text-text-secondary">{label}</div>
    <div className="bitte-break-all bitte-text-gray-800">{value}</div>
  </div>
);
