import Head from 'next/head'
import Header from "./Header";
export const siteTitle = 'Order Management'

export default function Layout({ children, home }) {
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Favish Order Management"
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Header></Header>
            <main>{children}</main>
        </div>
    )
}