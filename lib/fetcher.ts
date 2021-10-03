export function createPostfetcher(params: any) {
    return async (url: any) => {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(params),
        });
        if (res.status == 200) {
            return await res.json();
        } else {
            const text = await res.text();
            throw new Error(text);
        }
    };
}

export function createGetfetcher() {
    return (url: any) => fetch(url).then((res: any) => res.json());
}