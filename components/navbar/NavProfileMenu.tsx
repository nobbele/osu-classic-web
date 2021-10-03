import { PropsWithChildren } from "react";

export interface NavProfileMenuProps {

}

export default function NavProfileMenu({ children }: PropsWithChildren<NavProfileMenuProps>) {
    return (
        <div className="rounded flex items-center flex-col bg-purple-600 w-64 m-1 p-4 absolute right-2 top-20">
            {children}
        </div>
    );
}