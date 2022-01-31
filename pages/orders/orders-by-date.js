import Layout from '../../components/layout'
import Order from "../../components/Order";

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?sort=createdAt";

export async function getServerSideProps(context) {
    const res = await fetch(apiEndpoint);
    const data = await res.json();

    const sortedData = data.data.map((order) => {
        order.attributes.createdAt = new Date(order.attributes.createdAt).toLocaleString('default', { month: 'short'} );
        return order;
    });

    console.info(sortedData);
    return {
        props: { sortedData } ,
    };
}

export default function OrderByDate({ sortedOrders }) {
    return (
        <Layout>
            <h1 className="text-center text-xl">Orders By Date</h1>
            <div>{sortedOrders}</div>
            {/*{sortedOrders.map(({ id, attributes }) => (*/}
            {/*    <Order key={id} id={id} attributes={attributes} />*/}
            {/*))}*/}
        </Layout>
    )
}
