import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import type { AppConfig, Round } from "../api/types";

interface Seed {
  rounds?: Round[];
  config?: Partial<AppConfig>;
}

export function renderWithClient(ui: ReactElement, seed: Seed = {}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  if (seed.rounds) client.setQueryData(["rounds"], seed.rounds);
  if (seed.config) client.setQueryData(["config"], seed.config);

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}
