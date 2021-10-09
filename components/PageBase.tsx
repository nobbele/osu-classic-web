import { PropsWithChildren } from "react";
import NavBar from "components/NavBar";
import Head from "next/head";

export interface PageBaseProps {

}

export default function PageBase({ children }: PropsWithChildren<PageBaseProps>) {
    return (<>
        <Head>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col h-full text-white">
            <NavBar />
            <main className="bg-hero-image flex-grow p-4">
                <div className="flex flex-col rounded bg-gray-500 h-full lg:mx-40 text-center p-4">
                    {children}
                </div>
            </main>
        </div>
    </>);
}