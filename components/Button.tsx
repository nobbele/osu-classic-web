import React from "react";
import { PropsWithChildren } from "react";

export interface Button {
    alwaysWide?: boolean,
    onClick?: () => void,
}

const Button = React.forwardRef<HTMLAnchorElement, PropsWithChildren<Button>>(({ children, alwaysWide, onClick }, ref) => {
    let width;
    if (alwaysWide) {
        width = "w-full"
    } else {
        width = "lg:w-auto w-full"
    }

    return (
        <a
            className={'lg:inline-flex px-3 py-2 rounded font-bold items-center justify-center hover:bg-green-600 cursor-pointer ' + width}
            onClick={onClick}
            ref={ref}
        >
            {children}
        </a>
    );
})

Button.displayName = "Button";

export default Button;