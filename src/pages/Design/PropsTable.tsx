import { Badge } from "../../ds/components/Badge/Badge";
import { Code } from "../../ds/components/Code/Code";
import { Table, type TableColumn } from "../../ds/components/Table/Table";
import type { PropDoc } from "../../ds/docs/types";
import styles from "./PropsTable.module.css";

type Props = {
  props: readonly PropDoc[];
  componentName: string;
};

const COLUMNS: readonly TableColumn[] = [
  { key: "prop", header: "Prop" },
  { key: "type", header: "Type" },
  { key: "default", header: "Default" },
  { key: "description", header: "Description" },
];

/**
 * The props table is app code: it knows what a PropDoc is, and that is this
 * repo's shape. What it does *not* do any more is know how to build a table —
 * the caption, the scopes and the focusable scroll region moved into Table,
 * where the next table on the site inherits them instead of copying them.
 */
export function PropsTable({ props, componentName }: Props) {
  return (
    <Table
      caption={`Props for ${componentName}`}
      columns={COLUMNS}
      rowHeaders
      rows={props.map((prop) => ({
        id: prop.name,
        cells: [
          <>
            <Code>{prop.name}</Code>
            {prop.required ? (
              <span className={styles.required}>
                <Badge tone="accent">required</Badge>
              </span>
            ) : null}
          </>,
          <span className={styles.type}>{prop.type}</span>,
          <span className={styles.default}>{prop.default ?? "—"}</span>,
          prop.description,
        ],
      }))}
    />
  );
}
