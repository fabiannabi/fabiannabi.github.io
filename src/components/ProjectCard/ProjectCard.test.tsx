import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../test/axe";
import { ProjectCard } from "./ProjectCard";

const project = { kicker: "Agent platform", title: "Forge", line: "Agent teams that turn tickets into reviewed PRs.", href: "/forge/" };

describe("ProjectCard", () => {
  it("has no axe violations", async () => {
    const { container } = render(<ProjectCard project={project} />);
    await expectNoAxeViolations(container);
  });

  it("is one link named by its title and line, without the decorative arrow", () => {
    render(<ProjectCard project={project} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/forge/");
    expect(link).toHaveAccessibleName(/Forge.*Agent teams that turn tickets into reviewed PRs\./);
    expect(link.textContent).toContain("→");
    expect(link.getAttribute("aria-label")).toBeNull();
  });

  it("puts the title in the document outline", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Forge");
  });
});
