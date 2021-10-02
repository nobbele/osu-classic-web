import Image from 'next/image';
import React from 'react';

export interface NavBrandingProps {
    href?: string,
}

const NavBranding = React.forwardRef(({ href }: NavBrandingProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
    return (
        <a className='inline-flex items-center hover:bg-green-600 px-2 rounded' href={href} ref={ref}>
            <Image
                className="rounded-full border border-gray-100 shadow-sm relative"
                width="40"
                height="40"
                src="/logo.png"
                alt="osu!classic Logo"
            />
            <span className='text-xl text-white font-bold tracking-wider ml-2 py-2'>
                osu!classic
            </span>
        </a>
    );
});

NavBranding.displayName = "NavBranding";

export default NavBranding;