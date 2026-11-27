import NarrativePage, { pageMetadata } from "../components/NarrativePage";

export const metadata = pageMetadata("now");

export default function Page() {
  return <NarrativePage name="now" />;
}
