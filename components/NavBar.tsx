import Link from 'next/link';
import NavButton from './navbar/NavButton';
import { useState } from 'react';
import NavProfileMenu from './navbar/NavProfileMenu';
import NavAvatar from './navbar/NavAvatar';
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
    console.log(auth);
    if (auth.isAuthenticated) {
        profileMenu = <>
            <NavButton href="/profile" title="Profile" alwaysWide={true} />
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
                <NavButton href="/faq" title="FAQ" />
            </div>
            <NavAvatar onClick={() => setShowProfileMenu(old => !old)} />
        </nav>
        {showProfileMenu && <NavProfileMenu>{profileMenu}</NavProfileMenu>}
    </>);
}