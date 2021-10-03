import { useAuth } from "contexts/AuthContext";
import { createPostfetcher } from "lib/fetcher";
import { createRef } from "react";
import { useCookies } from "react-cookie";
import SparkMD5 from "spark-md5";

export interface NavLoginFormProps {

}

export default function NavLoginForm({ }: NavLoginFormProps) {
    const [auth, dispatcher] = useAuth();
    if (auth.isAuthenticated) {
        throw new Error("Already logged in");
    }

    const [_, setToken] = useCookies<string>(["token"]);

    const usernameRef = createRef<HTMLInputElement>();
    const passwordRef = createRef<HTMLInputElement>();

    async function onLogin() {
        const username = usernameRef.current!.value;
        const password = passwordRef.current!.value;
        const passwordHash = SparkMD5.hash(password);

        let loginAttempt = await createPostfetcher({
            username,
            password: passwordHash
        })('/api/web-login');

        if (loginAttempt) {
            const res = await fetch(`/api/user/${loginAttempt.user_id}/username`);
            const username = await res.text();
            setToken("token", loginAttempt.token, {
                secure: true,
                sameSite: "strict"
            });
            dispatcher({
                type: "login",
                userData: {
                    username,
                    user_id: loginAttempt.user_id,
                },
                token: loginAttempt.token
            });
        }
    }

    return (<>
        <div className="mb-1">
            <h3>Username:</h3>
            <input className="text-black" type="text" placeholder="username" autoComplete="username" ref={usernameRef} />
        </div>
        <div className="mb-4">
            <h3>Password:</h3>
            <input className="text-black" type="password" placeholder="password" autoComplete="current-password" ref={passwordRef} />
        </div>
        <button className="mb-1 inline-block bg-red-500 hover:bg-red-700 py-1 px-3 rounded" onClick={() => onLogin()}>Login</button>
        <a className="mt-1" href="/register">Go to register</a>
    </>);
}