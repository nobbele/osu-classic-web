import PageBase from "components/PageBase";
import Head from 'next/head';
import { createRef } from "react";
import SparkMD5 from 'spark-md5';
import { createPostfetcher } from "lib/fetcher";
import { useAuth } from "contexts/AuthContext";
import { useCookies } from "react-cookie";

export default function FAQ() {
    const [_auth, dispatcher] = useAuth();
    const [_tokenObj, setToken] = useCookies<string>(["token"]);

    const usernameRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();

    // TODO deduplicate this (similar implementation in NavLoginForm)
    async function onRegister() {
        const username = usernameRef.current!.value;
        const password = passwordRef.current!.value;
        const passwordHash = SparkMD5.hash(password);

        let registerAttempt = await createPostfetcher({
            username,
            password: passwordHash
        })('/api/web-register');

        setToken("token", registerAttempt.token, {
            secure: true,
            sameSite: "strict"
        });
        dispatcher({
            type: "login",
            userData: {
                username,
                user_id: registerAttempt.user_id,
            },
            token: registerAttempt.token
        });
    }

    return (
        <PageBase>
            <Head>
                <title>osu!classic Register</title>
            </Head>
            <h1 className="text-2xl">Register a new account</h1>
            <hr />
            <div className="mb-1">
                <h3>Username:</h3>
                <input className="text-black" type="text" placeholder="username" autoComplete="username" ref={usernameRef} />
            </div>
            <div className="mb-4">
                <h3>Password:</h3>
                <input className="text-black" type="password" placeholder="password" autoComplete="new-password" ref={passwordRef} />
            </div>
            <button className="bg-red-500 hover:bg-red-700 py-1 px-3 rounded" onClick={() => onRegister()}>Register</button>
        </PageBase>
    );
}
