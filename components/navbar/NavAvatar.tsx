import Image from "next/image";

export interface NavAvatarProps {
    onClick: () => void,
}

export default function NavAvatar({ onClick }: NavAvatarProps) {
    return (
        <div className='inline-flex flex-row items-center cursor-pointer' onClick={onClick}>
            <Image
                className="rounded-full border border-gray-100 shadow-sm relative"
                width="48"
                height="48"
                src="/default_avatar.png"
                alt="User Profile Picture"
            />
        </div>
    );
}