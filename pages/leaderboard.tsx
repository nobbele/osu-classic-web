import PageBase from "components/PageBase";
import Head from 'next/head';
import useSWR from "swr";
import { createGetfetcher } from "lib/fetcher";
import { useState } from "react";
import Button from "components/Button";

export default function Leaderboard() {
    const [type, setType] = useState<string>('performance_points');
    const { data: leaderboard, error: _leaderboardError } = useSWR(
        `/api/leaderboard?type=${type}`,
        createGetfetcher()
    );

    let type_text;
    if (type == "performance_points") {
        type_text = "Performance Points";
    } else if (type == "ranked_score") {
        type_text = "Ranked Score";
    } else if (type == "total_score") {
        type_text = "Total Score";
    } else {
        type_text = type;
    }

    return (
        <PageBase>
            <Head>
                <title>osu!classic Leaderboard</title>
            </Head>
            <div className="flex flex-row justify-center">
                <Button onClick={() => setType('performance_points')}>Performance Points</Button>
                <Button onClick={() => setType('ranked_score')}>Ranked Score</Button>
                <Button onClick={() => setType('total_score')}>Total Score</Button>
            </div>
            <h1 className="text-2xl">{type_text} Leaderboard</h1>
            <hr />
            {
                leaderboard
                    ? leaderboard.map((placement: any, index: number) => {
                        let data_text;
                        if (type == "performance_points") {
                            data_text = `${placement.performance_points}pp`;
                        } else if (type == "ranked_score") {
                            data_text = new Intl.NumberFormat('en').format(placement.ranked_score);
                        } else if (type == "total_score") {
                            data_text = new Intl.NumberFormat('en').format(placement.total_score);
                        } else {
                            data_text = "??";
                        }
                        return (
                            <div key={placement.user_id}>
                                <span>#{index + 1}: {placement.username} ({data_text})</span>
                                <br />
                            </div>
                        );
                    })
                    : <span>Loading...</span>
            }
        </PageBase>
    );
}
