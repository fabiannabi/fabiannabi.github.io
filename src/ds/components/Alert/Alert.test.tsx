import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../test/axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Alert tone="info" title="Sync scheduled">
          Runs in twelve minutes.
        </Alert>
        <Alert tone="danger" title="Payment failed" onDismiss={() => undefined}>
          Update the card.
        </Alert>
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("interrupts for warnings and errors", () => {
    render(<Alert tone="danger">Payment failed</Alert>);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("waits its turn for information and confirmations", () => {
    render(<Alert tone="success">Sequence published</Alert>);

    // role=status, not role=alert. Announcing every success assertively is how a
    // screen reader becomes something people switch off.
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.each([
    ["info", "Information"],
    ["success", "Success"],
    ["warning", "Warning"],
    ["danger", "Error"],
  ] as const)("carries the tone as text for %s, not only as colour", (tone, word) => {
    render(<Alert tone={tone}>Message body</Alert>);

    // SC 1.4.1 — the meaning survives for anyone who cannot tell red from green.
    expect(screen.getByText(`${word}:`)).toBeInTheDocument();
  });

  it("names the dismiss button after the tone it is dismissing", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert tone="danger" onDismiss={onDismiss}>
        Payment failed
      </Alert>,
    );

    await user.click(screen.getByRole("button", { name: "Dismiss error" }));

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("has no dismiss button unless one is asked for", () => {
    render(<Alert>Nothing to close</Alert>);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
