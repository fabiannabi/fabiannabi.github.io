import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Entry as EntryData } from "../../data/content";
import { Entry } from "./Entry";

const full: EntryData = {
  when: "2023 — Present",
  title: "User Interface Engineer",
  org: "Salesloft",
  note: "Promoted from Associate UI Engineer in 14 months",
  description: "Build and maintain the components the whole product is assembled from.",
  tags: ["React", "TypeScript"],
};

describe("Entry", () => {
  it("renders every field it is given", () => {
    render(<Entry entry={full} />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "User Interface Engineer · Salesloft",
    );
    expect(screen.getByText(full.note as string)).toBeInTheDocument();
    expect(screen.getByText(full.description as string)).toBeInTheDocument();
  });

  it("marks up tags as a list rather than a row of spans", () => {
    render(<Entry entry={full} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("omits the optional parts instead of rendering empty elements", () => {
    const { container } = render(<Entry entry={{ when: "2013 — 2017", title: "BSc Biochemical Engineering" }} />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("renders the badge on unpublished writing", () => {
    render(<Entry entry={{ when: "Draft", title: "A post", badge: "to publish" }} />);

    expect(screen.getByText("to publish")).toBeInTheDocument();
  });
});
