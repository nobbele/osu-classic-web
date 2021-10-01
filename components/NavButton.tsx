import Link from 'next/link';

export interface NavButtonProps {
    href: string,
    title: string,
}

export default function NavButton({ href, title }: NavButtonProps) {
    return (
        <Link href={href}>
            <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-green-600 hover:text-white '>
                {title}
            </a>
        </Link>
    );
}