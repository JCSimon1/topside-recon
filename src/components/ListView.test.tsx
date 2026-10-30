import { describe, expect, it } from "vitest";
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
