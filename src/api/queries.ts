import { useQuery } from "@tanstack/react-query";
import { getConfig } from "./config";
import { getRounds } from "./rounds";

export const useConfig = () =>
  useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
    staleTime: Infinity,
  });

export const useRounds = () =>
  useQuery({
    queryKey: ["rounds"],
    queryFn: getRounds,
  });
