import PageBase from "components/PageBase";
import Head from 'next/head';
import useSWR from "swr";
import { createGetfetcher } from "lib/fetcher";
import { createRef, FormEvent } from "react";

export default function FAQ() {
    const { data: beatmaps, error: _beatmapsError } = useSWR(
        `/api/get-beatmaps`,
        createGetfetcher()
    );

    return (
        <PageBase>
            <Head>
                <title>osu!classic Beatmaps</title>
            </Head>
            <h1 className="text-2xl">Beatmaps</h1>
            <hr />
            {
                beatmaps && beatmaps.map((beatmap: any) => (
                    <div key={beatmap.id}>
                        <span>({beatmap.status})</span>
                        <span>{beatmap.title}</span>
                        <br />
                    </div>
                ))
            }
        </PageBase >
    );
}
