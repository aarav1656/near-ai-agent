import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    origin || (typeof window !== "undefined" ? window.location.origin : "")
  );
};
