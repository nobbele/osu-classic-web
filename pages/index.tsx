import PageBase from "components/PageBase";
import Head from 'next/head';

export default function Index() {
  return (
    <PageBase>
      <Head>
        <title>osu!classic Home</title>
      </Head>
      <h1 className="text-2xl">Welcome to osu!classic. An osu! server for the 2012 client.</h1>
      <p>gaming</p>
    </PageBase>
  );
}
