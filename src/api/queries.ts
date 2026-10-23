import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getConfig } from "./config";
import { getLoot } from "./loot";
import { getRounds } from "./rounds";
import { getSettings, saveRank } from "./settings";
import { getSteamProfile } from "./steam";

export const useConfig = () =>
  useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
    staleTime: Infinity,
  });

export const useLoot = () =>
  useQuery({
    queryKey: ["loot"],
    queryFn: getLoot,
  });

export const useRounds = () =>
  useQuery({
    queryKey: ["rounds"],
    queryFn: getRounds,
  });

export const useSettings = () =>
  useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })

export const useSteamProfile = () =>
  useQuery({
    queryKey: ["steam"],
    queryFn: getSteamProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

// Definition of mutations
export const useSaveRank = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveRank,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })
}