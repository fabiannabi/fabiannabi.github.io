import { useEffect, useState } from "react";

/**
 * Which section is actually in view, for the nav marker.
 *
 * The rootMargin collapses the viewport to a band across the middle, so the
 * marker changes when a section reaches reading position rather than when its
 * top edge clips the bottom of the screen.
 */
export function useActiveSection(ids: readonly string[], fallback: string): string {
  const [active, setActive] = useState(fallback);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
