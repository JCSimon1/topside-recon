import { describe, expect, it } from "vitest";
import { makeUi } from "../test/builds";
import { renderWithClient } from "../test/renderWithClient";
import { screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListView from "./ListView";
import type { Round } from "../api/types";

const round = (overrides: Partial<Round> = {}): Round => ({
  id: 1,
  number: 1,
  date: "2026-01-01",
  time: "12:00",
  map: "Spaceport",
  condition: "Clear",
  money: 0,
  xp: 0,
  ...overrides,
});

const filterData = [
  round({
    id: 1,
    number: 101,
    map: "Spaceport",
    condition: "Clear",
    date: "2026-01-10",
  }),
  round({
    id: 2,
    number: 102,
    map: "Dam Battlegrounds",
    condition: "Clear",
    date: "2026-02-05",
  }),
  round({
    id: 3,
    number: 103,
    map: "Spaceport",
    condition: "Hurricane",
    date: "2026-02-20",
  }),
];

const pagedData = [1, 2, 3, 4, 5].map((n) =>
  round({
    id: n,
    number: 100 + n,
    date: `2026-01-0${n}`,
    map: n % 2 === 0 ? "Dam Battlegrounds" : "Spaceport",
  }),
);

const paged = {
  rounds: pagedData,
  config: { ui: makeUi({ listPageSize: 2 }) },
};

const next = () => screen.getByRole("button", { name: "Weiter →" });
const prev = () => screen.getByRole("button", { name: "← Zurück" });

describe("ListView", () => {
  it("shows an empty state when there are no rounds", () => {
    renderWithClient(<ListView />, { rounds: [] });
    expect(screen.getByText("Noch keine Runden erfasst.")).toBeInTheDocument();
  });

  it("shows rounds newest first", () => {
    renderWithClient(<ListView />, {
      rounds: [
        round({ id: 1, number: 1, date: "2026-01-01" }),
        round({ id: 2, number: 2, date: "2026-01-02" }),
      ],
    });
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("2");
    expect(rows[2]).toHaveTextContent("1");
  });
});

const visibleNumbers = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0].textContent);

describe("ListView filters", () => {
  it("lists unique, sorted maps and conditions in the dropdowns", () => {
    renderWithClient(<ListView />, { rounds: filterData });
    const [mapSelect, conditionSelect] = screen.getAllByRole("combobox");

    const options = (select: HTMLElement) =>
      within(select)
        .getAllByRole("option")
        .map((o) => o.textContent);

    expect(options(mapSelect)).toEqual([
      "Alle Maps",
      "Dam Battlegrounds",
      "Spaceport",
    ]);
    expect(options(conditionSelect)).toEqual([
      "Alle Conditions",
      "Clear",
      "Hurricane",
    ]);
  });

  it("filters by map", async () => {
    const user = userEvent.setup();
    renderWithClient(<ListView />, { rounds: filterData });

    await user.selectOptions(screen.getAllByRole("combobox")[0], "Spaceport");

    expect(visibleNumbers()).toEqual(["103", "101"]);
  });

  it("combines map and condition filters", async () => {
    const user = userEvent.setup();
    renderWithClient(<ListView />, { rounds: filterData });
    const [mapSelect, conditionSelect] = screen.getAllByRole("combobox");

    await user.selectOptions(mapSelect, "Spaceport");
    await user.selectOptions(conditionSelect, "Hurricane");

    expect(visibleNumbers()).toEqual(["103"]);
  });

  it("resets all filters", async () => {
    const user = userEvent.setup();
    renderWithClient(<ListView />, { rounds: filterData });
    const [mapSelect, conditionSelect] = screen.getAllByRole("combobox");

    await user.selectOptions(mapSelect, "Spaceport");
    await user.selectOptions(conditionSelect, "Hurricane");
    await user.click(
      screen.getByRole("button", { name: "Filter zurücksetzen" }),
    );

    expect(visibleNumbers()).toEqual(["103", "102", "101"]);
    expect(mapSelect).toHaveValue("");
    expect(conditionSelect).toHaveValue("");
  });

  it("filters by month", () => {
    const { container } = renderWithClient(<ListView />, {
      rounds: filterData,
    });
    const monthInput = container.querySelector('input[type="month"]')!;

    fireEvent.change(monthInput, { target: { value: "2026-02" } });

    expect(visibleNumbers()).toEqual(["103", "102"]);
  });
});

describe("ListView pagination", () => {
  it("shows the first page and the page count", () => {
    renderWithClient(<ListView />, paged);
    expect(screen.getByText("Seite 1 von 3")).toBeInTheDocument();
    expect(visibleNumbers()).toEqual(["105", "104"]);
  });

  it("navigates forward and backward", async () => {
    const user = userEvent.setup();
    renderWithClient(<ListView />, paged);

    await user.click(next());
    expect(visibleNumbers()).toEqual(["103", "102"]);

    await user.click(prev());
    expect(visibleNumbers()).toEqual(["105", "104"]);
  });

  it("disables the buttons at both ends", async () => {
    const user = userEvent.setup();
    renderWithClient(<ListView />, paged);

    expect(prev()).toBeDisabled();
    await user.click(next());
    await user.click(next());
    expect(screen.getByText("Seite 3 von 3")).toBeInTheDocument();
    expect(next()).toBeDisabled();
  });

  it("jumps back to page 1 when a filter changes", async () => {
    const user = userEvent.setup();
    renderWithClient(<ListView />, paged);

    await user.click(next());
    expect(screen.getByText("Seite 2 von 3")).toBeInTheDocument();

    await user.selectOptions(screen.getAllByRole("combobox")[0], "Spaceport");

    expect(screen.getByText("Seite 1 von 2")).toBeInTheDocument();
    expect(visibleNumbers()).toEqual(["105", "103"]);
  });

  it("jumps back to page 1 when filters are reset", async () => {
    const user = userEvent.setup();
    renderWithClient(<ListView />, paged);

    await user.click(next());
    await user.click(
      screen.getByRole("button", { name: "Filter zurücksetzen" }),
    );

    expect(screen.getByText("Seite 1 von 3")).toBeInTheDocument();
  });

  it("falls back to 20 rows per page without a config", () => {
    const many = Array.from({ length: 21 }, (_, i) =>
      round({ id: i + 1, number: i + 1, date: "2026-01-01", time: "12:00" }),
    );
    renderWithClient(<ListView />, { rounds: many });
    expect(screen.getByText("Seite 1 von 2")).toBeInTheDocument();
  });
});
