import Layout  from '../components/layout';
import Order from '../components/Order';

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*";
// const apiEndpoint = "http://localhost:1337/api/orders?[populate]=*";

export async function getServerSideProps(context) {
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
    };
}

export default function Home({ orderDataSortedByStatus }) {
    let totalOrderCount = 0;

    for (const property in orderDataSortedByStatus) {
        console.info(`${orderDataSortedByStatus[property].length}`);
        totalOrderCount+= orderDataSortedByStatus[property].length;
    }
    return (
        <Layout>
            <h2 className="text-center text-xl mt-4">Orders ({totalOrderCount})</h2>
            <section className="grid grid-cols-5 gap-4 p-10 max-w-screen-2xl m-auto">
                <section className="">
                    <h3 className="mb-10 badge badge-warning w-full p-4 text-base">Backlog ({orderDataSortedByStatus[0].length})</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[0].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-info w-full p-4 text-base">Ready ({orderDataSortedByStatus[1].length})</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[1].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-info w-full p-4 text-base">Live ({orderDataSortedByStatus[2].length})</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[2].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-error w-full p-4 text-base">Paused ({orderDataSortedByStatus[3].length})</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[3].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3 className="mb-10 badge badge-success w-full p-4 text-base">Complete ({orderDataSortedByStatus[4].length})</h3>
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