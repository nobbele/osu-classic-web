import PageBase from "components/PageBase";
import { useRouter } from "next/router";
import Head from 'next/head';
import useSWR from "swr";
import { createGetfetcher } from "lib/fetcher";
import Avatar from "components/Avatar";

export default function Index() {
    const router = useRouter();
    const { user_id: user_id_str } = router.query;

    const user_id = user_id_str && Number.parseInt(user_id_str as string);

    const { data: infoData, error: _infoDataError } = useSWR(user_id
        ? `/api/user/${user_id}/info`
        : null,
        createGetfetcher()
    );
    const { data: rankData, error: _rankDataError } = useSWR(user_id
        ? `/api/user/${user_id}/rank`
        : null,
        createGetfetcher()
    );

    const username_text = infoData?.username || "Loading...";
    const pp_text = infoData?.performance_points
        ? `${new Intl.NumberFormat('en').format(infoData.performance_points)}pp`
        : "Loading...";
    const rank_text = rankData
        ? `#${rankData} (${pp_text})`
        : "Loading...";
    const ranked_score_text = infoData?.ranked_score
        ? new Intl.NumberFormat('en').format(infoData.ranked_score)
        : "Loading...";
    const total_score_text = infoData?.total_score
        ? new Intl.NumberFormat('en').format(infoData.total_score)
        : "Loading...";

    return (
        <PageBase>
            <Head>
                <title>osu!classic {infoData?.username || ""}</title>
            </Head>
            <Avatar userId={user_id || 0} />
            <h1 className="text-2xl inline">{username_text}</h1>
            <hr className="my-4" />
            <span className="text-lg">Rank: </span>
            <span className="text-md">{rank_text}</span>
            <br />
            <span className="text-lg">Ranked Score: </span>
            <span className="text-md">{ranked_score_text}</span>
            <br />
            <span className="text-lg">Total Score: </span>
            <span className="text-md">{total_score_text}</span>
        </PageBase>
    );
}
