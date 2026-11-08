import Arrow from "./components/Arrow";
export default function NotFound() {
  return (
    <section className="page-intro not-found">
      <p className="eyebrow">404 / UNCHARTED TERRITORY</p>
      <h1>
        A question
        <br />
        for another <em>page.</em>
      </h1>
      <p>
        This address isn’t part of the current collection. There’s plenty more
        to explore.
      </p>
      <a href="/" className="button">
        Back to the beginning <Arrow />
      </a>
    </section>
  );
}
