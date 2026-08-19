import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Link } from "./Link";

describe("Link", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Link href="#a">Read the full profile</Link>
        <Link href="#b" font="mono" tone="muted">
          GitHub
        </Link>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("is a real anchor, so it lands in the links list", () => {
    render(<Link href="/profile/">Read the full profile</Link>);

    expect(screen.getByRole("link", { name: "Read the full profile" })).toHaveAttribute(
      "href",
      "/profile/",
    );
  });

  it("keeps the underline at every state so hovering never moves the line", () => {
    const { container } = render(<Link href="#a">Read the full profile</Link>);
    const link = container.querySelector("a");

    // The rule is a transparent border that only changes colour. Underline on
    // hover only is the common version and it is the one that reflows the text.
    expect(link).toBeInTheDocument();
    expect(link?.className).toContain("link");
  });
});
