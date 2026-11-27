import NarrativePage, { pageMetadata } from "../components/NarrativePage";

export const metadata = pageMetadata("film");

export default function Page() {
  return <NarrativePage name="film" />;
}
