import PageBase from "components/PageBase";
import Head from 'next/head';

export default function FAQ() {
  return (
    <PageBase>
      <Head>
        <title>osu!classic FAQ</title>
      </Head>
      <h1 className="text-2xl">FAQ</h1>
      <hr />
      <h2 className="text-lg font-bold">Why does this exist?</h2>
      <p>Because I felt like making it.</p>
    </PageBase>
  );
}
