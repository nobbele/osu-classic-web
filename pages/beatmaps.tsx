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

    const oszRef = createRef<HTMLInputElement>();

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        let oszInput = oszRef.current!;

        const formData = new FormData();
        formData.append("osz", oszInput.files![0], oszInput.value);

        await fetch("/api/submit-beatmap", {
            method: 'POST',
            body: formData,
        })
    }

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
                        <span>{beatmap.title}</span>
                        <br />
                    </div>
                ))
            }
            <form onSubmit={onSubmit} className="mt-auto self-center text-black flex flex-col">
                <input name="osz" type="file" ref={oszRef} />
                <input type="submit"></input>
            </form>
        </PageBase >
    );
}
