import Link from 'next/link';

export default function Header() {
    return (
        <header className="p-4 space-x-2">
            <Link href="/" >
                <a className="btn">Home</a>
            </Link>
            <Link href="/email/calender">
                <a className="btn">Email Calender</a>
            </Link>
            {/*<Link href="/orders/orders-by-date">*/}
            {/*    <a className="btn">Order by Date</a>*/}
            {/*</Link>*/}
        </header>
    )
}