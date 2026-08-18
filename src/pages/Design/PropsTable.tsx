import { Badge } from "../../ds/components/Badge/Badge";
import { Code } from "../../ds/components/Code/Code";
import type { PropDoc } from "../../ds/docs/types";
import styles from "./PropsTable.module.css";

type Props = {
  props: readonly PropDoc[];
  componentName: string;
};

/**
 * A real <table> with a caption and header cells, not a grid of divs. Prop
 * tables are exactly the content people navigate cell by cell, and a div grid
 * gives a screen reader no way to say which column a value is in.
 */
export function PropsTable({ props, componentName }: Props) {
  return (
    <div className={styles.scroller} tabIndex={0} role="region" aria-label={`${componentName} props`}>
      <table className={styles.table}>
        <caption className={styles.caption}>Props for {componentName}</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <th scope="row" className={styles.name}>
                <Code>{prop.name}</Code>
                {prop.required ? (
                  <span className={styles.required}>
                    <Badge tone="accent">required</Badge>
                  </span>
                ) : null}
              </th>
              <td className={styles.type}>{prop.type}</td>
              <td className={styles.default}>{prop.default ?? "—"}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
