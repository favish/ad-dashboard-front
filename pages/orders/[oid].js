import Layout from '../../components/layout'
import { useRouter } from 'next/router';

// const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?filter;

// export async function getServerSideProps(context) {
//     const res = await fetch(apiEndpoint);
//     const data = await res.json();
//
//     const sortedData = data.data.map((order) => {
//         order.attributes.createdAt = new Date(order.attributes.createdAt).toLocaleString('default', { month: 'short'} );
//         return order;
//     });
//
//     console.info(sortedData);
//     return {
//         props: { sortedData } ,
//     };
// }

const Order = () => {
    const router = useRouter();
    const { oid } = router.query;

    return <p>Order: {oid}</p>
}

export default Order;

// export default function OrderByDate({ sortedOrders }) {
//     return (
//         <Layout>
//             <h1 className="text-center text-xl">Order</h1>
//         </Layout>
//     )
// }
