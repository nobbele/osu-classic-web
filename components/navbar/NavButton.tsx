import Link from 'next/link';
import Button from 'components/Button';

export interface NavButtonProps {
    href: string,
    title: string,
    alwaysWide?: boolean,
}

export default function NavButton({ href, title, alwaysWide }: NavButtonProps) {
    return (
        <Link href={href} passHref={true}>
            <Button alwaysWide={alwaysWide}>
                {title}
            </Button>
        </Link>
    );
}