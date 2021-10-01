import { useEffect } from "react";
import { createContext, Dispatch, PropsWithChildren, ReducerAction, ReducerState, useContext, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const createPostfetcher = (params: any) => (url: any) => (global as any).fetch(url, {
    method: "POST",
    body: JSON.stringify(params),
}).then((res: any) => res.json())

interface IUserData {
    username: string,
}

interface IAuthContext {
    isAuthenticated: boolean,
    userData: IUserData | null,
    token: string | null,
}

const AuthContext = createContext<[ReducerState<typeof reducer>, Dispatch<ReducerAction<typeof reducer>>] | null>(null);

function reducer(state: IAuthContext, action: any): IAuthContext {
    switch (action.type) {
        case "login":
            console.log("login!");
            return {
                isAuthenticated: true,
                userData: action.userData,
                token: action.token,
            };
        case "logout":
            console.log("logout!");
            return {
                isAuthenticated: false,
                userData: null,
                token: null,
            };
        default:
            return state;
    }
};

export function AuthContextProvider({ children }: PropsWithChildren<{}>) {
    const [state, dispatch] = useReducer(reducer, {
        isAuthenticated: false,
        userData: null,
        token: null,
    });

    const [{ token }, _setToken] = useCookies<string>(["token"]);
    const { data: vertificationData, error: _verificationError } = useSWR(!state.isAuthenticated && token ? '/api/verify-token' : null, createPostfetcher({ token }));
    const { data: userData, error: _userDataError } = useSWR(vertificationData && vertificationData.valid ? `/api/user/${vertificationData.user_id}/info` : null, createPostfetcher({ token }));

    if (userData) {
        dispatch({
            type: "login",
            userData,
            token: token,
        });
    }

    return (
        <AuthContext.Provider value={[state, dispatch]} >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)!;
}