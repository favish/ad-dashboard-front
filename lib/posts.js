export async function getSortedOrderData() {
    const res = await fetch('http://localhost:1337/api/orders?[populate]=*');
    const sortedOrderData = await res.text();
    console.info(sortedOrderData);
    return {
        props: {
            sortedOrderData
        }
    };
}