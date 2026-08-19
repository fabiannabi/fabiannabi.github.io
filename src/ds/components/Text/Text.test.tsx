import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Text } from "./Text";

describe("Text", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Text tone="muted" measure>
        Six years in software.
      </Text>,
    );

    await expectNoAxeViolations(container);
  });

  it("renders a paragraph by default", () => {
    const { container } = render(<Text>Six years in software.</Text>);

    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("renders inline without breaking the sentence it sits in", () => {
    const { container } = render(
      <Text>
        Six years in{" "}
        <Text as="span" size="inherit" weight="medium">
          software
        </Text>
        .
      </Text>,
    );

    // One paragraph, not two. A span that renders a <p> would split the sentence
    // into separate blocks for anyone reading it linearly.
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(screen.getByText("software")).toBeInTheDocument();
  });

  it("caps the measure when asked", () => {
    const { container } = render(<Text measure>A long line of body copy.</Text>);

    expect(container.querySelector("p")?.className).toContain("measure");
  });
});
