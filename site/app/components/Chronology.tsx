import { timeline } from "../../lib/profile";
import Arrow from "./Arrow";

export default function Chronology({
  selected = false,
}: {
  selected?: boolean;
}) {
  const milestones = selected
    ? timeline.filter((item) => item.featured)
    : timeline;
  return (
    <ol className="arc-chronology">
      {milestones.map((item) => (
        <li key={item.href}>
          <span className="arc-year">{item.year}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a className="arc-source" href={item.href}>
              {item.label} <Arrow />
            </a>
          </div>
        </li>
      ))}
    </ol>
  );
}
