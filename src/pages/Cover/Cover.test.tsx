import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { headline, links, projects } from "../../data/content";
import { expectNoAxeViolations } from "../../test/axe";
import { REDUCED_MOTION, setMediaQuery } from "../../test/media";
import { Cover } from "./Cover";

describe("Cover", () => {
  beforeEach(() => {
    // Structure is what these tests are about; the rail's rAF loop is not.
    setMediaQuery(REDUCED_MOTION, true);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Cover />);

    await expectNoAxeViolations(container);
  });

  it("leads with the full claim in one accessible sentence", () => {
    render(<Cover />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(headline.sentence);
  });

  it("points at the profile and the three contact channels", () => {
    render(<Cover />);

    expect(screen.getByRole("link", { name: /read the full profile/i })).toHaveAttribute(
      "href",
      links.profile,
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", links.email);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", links.linkedin);
  });

  it("ships a real GitHub URL", () => {
    render(<Cover />);

    // This shipped as github.com/REPLACE once. It does not get to happen twice.
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/fabiannabi");
    expect(github.getAttribute("href")).not.toMatch(/replace/i);
  });

  it("keeps external links in the same tab, so there is no opener to hand over", () => {
    render(<Cover />);

    // Contact moved from buttons (which open a new tab, with noopener) to plain
    // links. A link that does not open a window cannot leak window.opener.
    for (const name of ["GitHub", "LinkedIn"]) {
      expect(screen.getByRole("link", { name })).not.toHaveAttribute("target");
    }
  });

  it("keeps the cover to one screen's worth of claims", () => {
    render(<Cover />);

    // Three stats, four projects, one action and three ways to reach me. Adding
    // another of anything is a design decision, not a content edit, so it should
    // break a test. frontscan became the fourth project when it shipped on npm,
    // paid for in words by a shorter subtitle and Forge line.
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getAllByRole("link")).toHaveLength(8);
  });

  it("shows the four projects, each one link to its page", () => {
    render(<Cover />);

    for (const project of projects) {
      const card = screen.getByRole("link", { name: (name) => name.includes(project.title) && name.includes(project.line) });
      expect(card).toHaveAttribute("href", project.href);
    }
    expect(projects.map((p) => p.href)).toEqual(["/design/", "/mcp/", "/forge/", "/frontscan/"]);
  });

  it("carries no instrument: the simulator lives on /design/ now", () => {
    render(<Cover />);

    expect(screen.queryByRole("button", { name: /^Deutan/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /x-ray/i })).not.toBeInTheDocument();
  });
});
