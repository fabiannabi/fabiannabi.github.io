/* The helper lives with the design system so its own tests can use it; the site
   re-exports it so page tests keep importing from src/test. */
export { expectNoAxeViolations } from "../../packages/blueprint/test/axe";
