import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section>
        <header>Logo</header>
      </section>

      <section>
        <h1>Colors</h1>
      </section>

      <section>
        <h1>Typography</h1>
        <p>
          <span>Source Sans Pro</span>
        </p>

        <section>
          <header className="text-4xl font-bold">Title</header>
          <h1 className="text-2xl font-bold">Heading</h1>
          <h2 className="text-xl font-bold">Subheading</h2>
          <h3 className="text-lg font-bold">Subsubheading</h3>
          <p>This is a longer paragraph</p>
        </section>
      </section>
    </div>
  );
}
