import Layout  from '../components/layout';
import Order from '../components/Order';

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*";

export async function getStaticProps() {
    const res = await fetch(apiEndpoint);
    const sortedOrderData = await res.json();
    const status = [
        'awaiting_creatives',
        'ready',
        'live',
        'paused',
        'complete',
    ];
    let orderDataSortedByStatus = [];

    status.forEach(function(status) {
        const statusData = sortedOrderData.data.filter(element => element.attributes.status == status);
        orderDataSortedByStatus.push(statusData);
    });

    return {
        props: {
            orderDataSortedByStatus
        },
        revalidate: 10
    };
}

export default function Home({ orderDataSortedByStatus }) {
    return (
        <Layout>
            <h2 className="text-center text-xl mt-4">Orders</h2>
            <section className="grid grid-cols-5 gap-4 p-10 max-w-screen-2xl m-auto">
                <section className="">
                    <h3 className="mb-10 badge badge-warning w-full">Awaiting Creatives</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[0].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-info w-full">Ready</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[1].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-info w-full">Live</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[2].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-error w-full">Paused</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[3].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-success w-full">Complete</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[4].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
            </section>
        </Layout>
    )
}