import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Badge } from "../Badge/Badge";
import { Code } from "../Code/Code";
import { Text } from "../Text/Text";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Heading level={1} size="hero">
          I build the design systems other teams build on.
        </Heading>
        <Heading level={2}>Components you can take apart</Heading>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("renders a real heading element at the given level", () => {
    render(<Heading level={3}>Section</Heading>);

    expect(screen.getByRole("heading", { level: 3, name: "Section" })).toBeInTheDocument();
  });

  it("keeps the level when the size is overridden", () => {
    render(
      <Heading level={2} size="sm">
        Quiet but important
      </Heading>,
    );

    // The defect this prevents: an h4 chosen because it was the right size,
    // leaving an outline that skips from h1 to h4.
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});

describe("Text", () => {
  it("renders a paragraph by default and the requested element otherwise", () => {
    const { container } = render(
      <>
        <Text>Body</Text>
        <Text as="span">Inline</Text>
      </>,
    );

    expect(container.querySelector("p")).toHaveTextContent("Body");
    expect(container.querySelector("span")).toHaveTextContent("Inline");
  });
});

describe("Code", () => {
  it("names and focuses a block, because it scrolls", () => {
    render(<Code block label="Button usage">{"<Button />"}</Code>);

    // A scrollable region that cannot be reached or scrolled by keyboard fails
    // SC 2.1.1.
    const region = screen.getByRole("region", { name: "Button usage" });
    expect(region).toHaveAttribute("tabindex", "0");
  });

  it("stays inert when inline", () => {
    render(<Code>variant</Code>);

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("is content, not a control", () => {
    render(<Badge tone="success">Active</Badge>);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
