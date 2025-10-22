import 'client-only';
import { Context, useContext } from "react";

type UseStrictContextParams<T> = {
  context:  Context<T | null>;
  message?: string;
};

export const useStrictContext = <T>({
  context,
  message = "useStrictContext missing provider",
}: UseStrictContextParams<T>): T => {
  const value = useContext(context);

  if (value === null) {
    throw new Error(message);
  }
  return value;
};