import Link from 'next/link';
import NavButton from './NavButton';

export interface NavBarProps {

}

export default function NavBar({ }: NavBarProps) {
    return (
        <nav className='flex items-center w-full items-center justify-between bg-purple-600 p-3'>
            <Link href='/'>
                <a className='inline-flex items-center'>
                    <span className='text-xl text-white font-bold tracking-wider'>
                        osu!classic
                    </span>
                </a>
            </Link>
            <div className='inline-flex flex-row items-center'>
                <NavButton href="/" title="Home" />
                <NavButton href="/faq" title="FAQ" />
            </div>
            <div className='inline-flex flex-row items-center'>
                <NavButton href="/profile" title="Profile" />
            </div>
        </nav>
    );
}