import { PropsWithChildren } from "react";
import NavBar from "components/NavBar";

export interface PageBaseProps {

}

export default function PageBase({ children }: PropsWithChildren<PageBaseProps>) {
    return (
        <div className="">
            <NavBar />
            <main>{children}</main>
        </div>
    );
}