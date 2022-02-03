import Layout  from '../components/layout';
import Order from '../components/Order';

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*";
// const apiEndpoint = "http://localhost:1337/api/orders?[populate]=*";

export async function getServerSideProps(context) {
    const response = await fetch(apiEndpoint);
    const sortedOrderData = await response.json();
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
        props: { orderDataSortedByStatus },
    };
}

export default function Home({ orderDataSortedByStatus }) {
    let totalOrderCount = 0;

    for (const property in orderDataSortedByStatus) {
        totalOrderCount+= orderDataSortedByStatus[property].length;
    }
    return (
        <Layout>
            <h2 className="text-center text-xl mt-4">Orders ({totalOrderCount})</h2>
            <div className="divider"></div>
            <section className="grid grid-cols-5 gap-4 px-10 max-w-screen-2xl m-auto">
                <section className="">
                    <h3
                        className="mb-10 inline-flex badge badge-neutral w-full p-4 text-base tooltip cursor-help"
                        data-tip="Missing creatives, payment, or other blocking status">Backlog ({orderDataSortedByStatus[0].length})</h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[0].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3
                        className="mb-10 inline-flex badge badge-primary w-full p-4 text-base tooltip cursor-help"
                        data-tip="Fully set up, but not running yet. Scheduled for future date.">
                        Ready ({orderDataSortedByStatus[1].length})
                    </h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[1].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3
                        className="mb-10 badge inline-flex badge-primary w-full p-4 text-base tooltip cursor-help"
                        data-tip="Currently serving">
                        Live ({orderDataSortedByStatus[2].length})
                    </h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[2].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} />
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3
                        className="mb-10 inline-flex badge badge-secondary w-full p-4 text-base tooltip cursor-help"
                        data-tip="Was active, but paused likely due to client request"
                    >
                        Paused ({orderDataSortedByStatus[3].length})
                    </h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[3].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} pos={true}/>
                        ))}
                    </ul>
                </section>
                <section className="">
                    <h3
                        className="mb-10 inline-flex badge badge-accent w-full p-4 text-base tooltip cursor-help"
                        data-tip="Served all it's line items to completion"
                    >
                        Complete ({orderDataSortedByStatus[4].length})
                    </h3>
                    <ul className="space-y-4">
                        {orderDataSortedByStatus[4].map(({ id, attributes }) => (
                            <Order key={id} id={id} attributes={attributes} pos={true}/>
                        ))}
                    </ul>
                </section>
            </section>
        </Layout>
    )
}