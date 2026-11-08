import { Code } from "@fabiannabi/blueprint/components/Code/Code";
import { Heading } from "@fabiannabi/blueprint/components/Heading/Heading";
import { Label } from "@fabiannabi/blueprint/components/Label/Label";
import { Link } from "@fabiannabi/blueprint/components/Link/Link";
import { Text } from "@fabiannabi/blueprint/components/Text/Text";
import { region } from "@fabiannabi/blueprint/xray/instrument";
import styles from "./Agents.module.css";

const PACKAGE = "@fabiannabi/blueprint-mcp";
const VERSION = "0.1.1";
const REPO = "https://github.com/fabiannabi/fabiannabi.github.io";

const TOOLS: ReadonlyArray<{ name: string; does: string }> = [
  { name: "list_components", does: "every component, with its category and summary" },
  { name: "get_component", does: "props and allowed values, accessibility, do and don't, import path" },
  { name: "find_token", does: "the semantic token for an intent, in English or Spanish" },
  { name: "check_contrast", does: "WCAG 2.2 for two tokens or colours, per theme" },
  { name: "lint_ui", does: "flags raw colours, unknown tokens, invalid props, unlabelled icon buttons" },
];

const LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "npm", href: `https://www.npmjs.com/package/${PACKAGE}` },
  { label: "Source", href: `${REPO}/tree/main/packages/blueprint-mcp` },
  { label: "Security", href: `${REPO}/blob/main/packages/blueprint-mcp/SECURITY.md` },
  { label: "Storybook", href: "/storybook/" },
];

/** Blueprint as an MCP server: the same answers this page gives, for a coding agent. */
export function Agents() {
  return (
    <section
      id="agents"
      className={styles.section}
      aria-labelledby="agents-title"
      {...region("For coding agents")}
    >
      <Heading level={2} size="lg">
        <span id="agents-title">For coding agents</span>
      </Heading>

      <Text tone="muted" measure>
        Blueprint ships as an MCP server, so an agent writing UI can ask which component to use and
        which token means “error text”, then lint what it wrote. It reads the same registry this page
        renders, so the answers match.
      </Text>

      <div className={styles.install}>
        <Label size="sm" caps tone="subtle" as="h3">
          Claude Code
        </Label>
        <Code block label="Add Blueprint to Claude Code">
          {`claude mcp add blueprint -- npx -y ${PACKAGE}@${VERSION}`}
        </Code>
        <Label size="sm" caps tone="subtle" as="h3">
          Cursor, Windsurf, Claude Desktop
        </Label>
        <Code block label="MCP client configuration">
          {`{
  "mcpServers": {
    "blueprint": {
      "command": "npx",
      "args": ["-y", "${PACKAGE}@${VERSION}"]
    }
  }
}`}
        </Code>
        <Label size="sm" caps tone="subtle" as="h3">
          CI, without MCP
        </Label>
        <Code block label="Lint a file from the command line">
          {`npx ${PACKAGE}@${VERSION} lint src/Toolbar.tsx`}
        </Code>
      </div>

      <ul className={styles.tools}>
        {TOOLS.map((tool) => (
          <li key={tool.name}>
            <Code>{tool.name}</Code>{" "}
            <Text as="span" size="sm" tone="muted">
              {tool.does}
            </Text>
          </li>
        ))}
      </ul>

      <Text size="sm" tone="muted" measure>
        Read-only by construction, tested against hostile input and prompt injection, released only
        from CI with provenance and approved by hand.
      </Text>

      <nav className={styles.links} aria-label="Blueprint MCP links">
        {LINKS.map((link) => (
          <Link key={link.label} href={link.href} font="mono" size="sm">
            {link.label} →
          </Link>
        ))}
      </nav>
    </section>
  );
}
