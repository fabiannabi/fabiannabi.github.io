import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { headline, links } from "../../data/content";
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

  it("opens external links without handing over the opener", () => {
    render(<Cover />);

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("keeps the cover to one screen's worth of claims", () => {
    render(<Cover />);

    // Three stats and five actions. Adding a fourth stat or a sixth link is a
    // design decision, not a content edit, so it should break a test. The fifth
    // link — the design system — was added deliberately when that page shipped.
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  it("offers the x-ray without spending a link on it", () => {
    render(<Cover />);

    expect(screen.getByRole("button", { name: /x-ray/i })).toHaveAttribute("aria-pressed", "false");
  });
});
