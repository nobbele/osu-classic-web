import Link from 'next/link';
import NavButton from './navbar/NavButton';
import { useState } from 'react';
import NavProfileMenu from './navbar/NavProfileMenu';
import Avatar from './Avatar';
import NavBranding from './navbar/NavBranding';
import { useAuth } from 'contexts/AuthContext';
import NavLoginForm from './navbar/NavLoginForm';
import Button from './Button';
import { useCookies } from 'react-cookie';

export interface NavBarProps {

}

export default function NavBar({ }: NavBarProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [auth, dispatch] = useAuth();
    const [_, setToken] = useCookies<string>(["token"]);

    function logout() {
        setToken("token", null, {
            secure: true,
            sameSite: "strict",
        });
        dispatch({
            type: "logout"
        });
    }

    let profileMenu;
    if (auth.isAuthenticated) {
        profileMenu = <>
            <NavButton href={{ pathname: "/profile", query: { user_id: auth.userData!.user_id } }} title="Profile" alwaysWide={true} />
            <NavButton href="/settings" title="Settings" alwaysWide={true} />
            <Button alwaysWide={true} onClick={() => logout()}>Logout</Button>
        </>;
    } else {
        profileMenu = <NavLoginForm />;
    }

    return (<>
        <nav className='flex items-center w-full items-center justify-between bg-purple-600 p-3'>
            <Link href='/' passHref={true}>
                <NavBranding />
            </Link>
            <div className='inline-flex flex-row items-center'>
                <NavButton href="/leaderboard" title="Leaderboard" />
                <NavButton href="/faq" title="FAQ" />
            </div>
            <div className="rounded flex items-center p-1 hover:bg-green-600 cursor-pointer" onClick={() => setShowProfileMenu(old => !old)} >
                <span className="mr-3">{auth.userData?.username || ""}</span>
                <Avatar userId={auth.userData?.user_id || 0} />
            </div>
        </nav>
        {showProfileMenu && <NavProfileMenu>{profileMenu}</NavProfileMenu>}
    </>);
}