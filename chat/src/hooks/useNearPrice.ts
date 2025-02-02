import { nearPrice } from "@mintbase-js/data";
import { useEffect, useMemo, useRef, useState } from "react";

type UseNearPriceReturn = {
  nearPrice: number;
  error: string | null;
};

export const useNearPrice = (): UseNearPriceReturn => {
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchNearPrice = async () => {
      try {
        const { data } = await nearPrice();
        setPrice(Number(data));
      } catch (err) {
        setError((err as Error).message);
      }
    };

    if (!hasFetched.current) {
      fetchNearPrice();
      hasFetched.current = true;
    }
  }, []);

  const memoizedReturn = useMemo(
    () => ({ nearPrice: price, error }),
    [price, error]
  );

  return memoizedReturn;
};
