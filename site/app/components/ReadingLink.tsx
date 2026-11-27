import type { ReactNode } from "react";
import Arrow from "./Arrow";

export default function ReadingLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a className="reading-link" href={href}>
      {children}
      <Arrow diagonal={href.startsWith("https://")} />
    </a>
  );
}
