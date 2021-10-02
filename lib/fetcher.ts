export function createPostfetcher(params: any) {
    return async (url: any) => {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(params),
        });
        return await res.json();
    };
}

export function createGetfetcher() {
    return (url: any) => fetch(url).then((res: any) => res.json());
}