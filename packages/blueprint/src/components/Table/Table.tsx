import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { Label } from "../Label/Label";
import { xray } from "../../xray/instrument";
import styles from "./Table.module.css";

export type TableColumn = {
  key: string;
  header: string;
  /** Right-aligns a column of numbers. Text stays at the start edge. */
  numeric?: boolean;
};

export type TableRow = {
  /** Stable across renders. Not rendered. */
  id: string;
  /** One entry per column, in the same order. */
  cells: readonly ReactNode[];
};

type Props = {
  /**
   * Required, and not decorative. A table with no caption is announced as
   * "table, four columns" and nothing else, which is no use to anyone landing
   * on it from the table list.
   */
  caption: string;
  columns: readonly TableColumn[];
  rows: readonly TableRow[];
  /**
   * Treats the first cell of every row as its header, so a screen reader reading
   * a cell in the middle announces which row it belongs to as well as which
   * column. Use it whenever the first column identifies the row.
   */
  rowHeaders?: boolean;
  /** Hides the caption visually. It stays in the accessibility tree. */
  hideCaption?: boolean;
};

/**
 * A real table: caption, `scope` on every header, and one cell per column.
 *
 * The alternative — a grid of divs with `display: grid` — looks identical and
 * gives a screen reader no way to say which column a value is in. Tabular data
 * is exactly what people navigate cell by cell.
 *
 * The scroll container is focusable and carries a role and a label, because a
 * region that scrolls has to be reachable by keyboard (SC 2.1.1): a mouse user
 * can drag a wide table sideways and a keyboard user cannot, unless something
 * in it can take focus.
 */
export function Table({ caption, columns, rows, rowHeaders = false, hideCaption = false }: Props) {
  return (
    <div
      className={styles.scroller}
      tabIndex={0}
      role="region"
      aria-label={caption}
      {...xray("Table", { columns: columns.length, rows: rows.length })}
    >
      <table className={styles.table}>
        <caption className={cx(styles.caption, hideCaption && styles.hidden)}>
          {/* A caption and a column header are the same typographic role as a
              section marker, so they are Labels. Re-declaring the mono face and
              the caps tracking here would be a second place to change them. */}
          <Label size="sm" caps tone="subtle" as="span">
            {caption}
          </Label>
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={cx(column.numeric && styles.numeric)}>
                <Label size="sm" caps tone="default" as="span">
                  {column.header}
                </Label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) => {
                const column = columns[index];
                const className = cx(column?.numeric && styles.numeric);
                return index === 0 && rowHeaders ? (
                  <th key={column?.key ?? index} scope="row" className={className}>
                    {cell}
                  </th>
                ) : (
                  <td key={column?.key ?? index} className={className}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
