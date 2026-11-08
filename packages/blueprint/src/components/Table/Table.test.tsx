import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Table } from "./Table";

const COLUMNS = [
  { key: "token", header: "Token" },
  { key: "value", header: "Resolves to" },
  { key: "ratio", header: "Contrast", numeric: true },
];

const ROWS = [
  { id: "text", cells: ["--ds-text", "slate-50", "15.63"] },
  { id: "muted", cells: ["--ds-text-muted", "slate-400", "6.07"] },
];

describe("Table", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Table caption="Text tones" columns={COLUMNS} rows={ROWS} rowHeaders />,
    );

    await expectNoAxeViolations(container);
  });

  it("is a real table, named by its caption", () => {
    render(<Table caption="Text tones" columns={COLUMNS} rows={ROWS} />);

    // The accessible name of a table comes from its caption. Without one it is
    // announced as its shape and nothing else.
    expect(screen.getByRole("table", { name: "Text tones" })).toBeInTheDocument();
  });

  it("scopes every column header", () => {
    render(<Table caption="Text tones" columns={COLUMNS} rows={ROWS} />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers).toHaveLength(3);
    for (const header of headers) expect(header).toHaveAttribute("scope", "col");
  });

  it("makes the first cell a row header when asked, so a cell announces its row", () => {
    render(<Table caption="Text tones" columns={COLUMNS} rows={ROWS} rowHeaders />);

    const rowHeaders = screen.getAllByRole("rowheader");

    expect(rowHeaders).toHaveLength(2);
    for (const header of rowHeaders) expect(header).toHaveAttribute("scope", "row");
  });

  it("leaves every cell a data cell when it does not", () => {
    render(<Table caption="Text tones" columns={COLUMNS} rows={ROWS} />);

    expect(screen.queryAllByRole("rowheader")).toHaveLength(0);
  });

  it("gives the scrolling region a name and a place in the tab order", () => {
    render(<Table caption="Text tones" columns={COLUMNS} rows={ROWS} />);

    // SC 2.1.1: a mouse can drag a wide table sideways and a keyboard cannot,
    // unless something inside the scroll container can take focus.
    const region = screen.getByRole("region", { name: "Text tones" });

    expect(region).toHaveAttribute("tabindex", "0");
    expect(within(region).getByRole("table")).toBeInTheDocument();
  });

  it("keeps a hidden caption in the accessibility tree", () => {
    render(<Table caption="Text tones" columns={COLUMNS} rows={ROWS} hideCaption />);

    // Clipped, not display:none — the table would otherwise lose its name, which
    // is the one thing the caption is for.
    expect(screen.getByRole("table", { name: "Text tones" })).toBeInTheDocument();
  });
});
