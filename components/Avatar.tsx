import Image from "next/image";

export interface AvatarProps {
    onClick?: () => void,
    userId: number,
}

export default function Avatar({ onClick, userId: _userId }: AvatarProps) {
    return (
        <div className='inline-flex flex-row items-center cursor-pointer' onClick={onClick}>
            <Image
                className="rounded-full border border-gray-100 shadow-sm relative"
                width="40"
                height="40"
                src="/default_avatar.png"
                alt="User Profile Picture"
            />
        </div>
    );
}