import Link from 'next/link';

export default function Header() {
    return (
        <header className="px-10 py-4 space-x-2">
            <div className="navbar mb-2 shadow-lg  bg-neutral text-neutral-content rounded-box">
                <div className="px-2 mx-2">
                    <span className="text-lg font-bold">Favish Advertising</span>
                </div>
                <div className="px-2 mx-2 navbar-center lg:flex">
                    <div className="flex items-stretch">
                        <Link href="/" >
                            <a className="btn btn-sm btn-ghost">Orders</a>
                        </Link>
                        <Link href="/email/calender">
                            <a className="btn btn-sm btn-ghost">Email & Sponsored Post Calender</a>
                        </Link>
                        <Link href="/orders/archived-orders">
                            <a className="btn btn-sm btn-ghost">Archived Orders</a>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}