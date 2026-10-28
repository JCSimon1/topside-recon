import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getConfig } from "./config";
import { getLoot, saveLootAmount } from "./loot";
import { getRounds } from "./rounds";
import { getSettings, saveRank } from "./settings";
import { getSteamProfile } from "./steam";

import type { Settings } from "./types";

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
    queryKey: ["settings"],
    queryFn: getSettings,
  });

export const useSteamProfile = () =>
  useQuery({
    queryKey: ["steam"],
    queryFn: getSteamProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

// Definition of mutations
export const useSaveLootAmount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, amount }: { key: string; amount: number }) =>
      saveLootAmount(key, amount),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loot"] }),
  });
};

export const useSaveRank = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveRank,
    onMutate: async (rank) => {
      await qc.cancelQueries({ queryKey: ["settings"] });
      const previous = qc.getQueryData<Settings>(["settings"]);
      qc.setQueryData<Settings>(["settings"], (old) =>
        old ? { ...old, rank } : old,
      );
      return { previous };
    },
    onError: (_err, _rank, context) => {
      if (context?.previous) qc.setQueryData(["settings"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
};
