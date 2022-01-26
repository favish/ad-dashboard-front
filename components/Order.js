import LineItem from "./LineItem";

function PaidBadge(props) {
    let isPaid = "not paid";
    let classes = "badge ";

    if(props.paidStatus) {
        isPaid = "paid";
        classes += "badge-accent ";
    } else {
        classes += "badge-secondary ";
    }
    return <div className={classes}>{isPaid}</div>
}

export default function Order({ id, attributes }) {
    return (
        <li className="card card-bordered collapse collapse-arrow bg-slate-300" key={id}>
            <input type="checkbox" />
            <div className="collapse-title">
                <PaidBadge paidStatus={attributes.paid} />
                <p>Order: {attributes.order_id}</p>
                <p>Advertiser: {attributes.advertiser.data.attributes.advertiser_name}</p>
            </div>
            <section className="collapse-content space-y-4 divide-y divide-black">
                <p>Line Items</p>
                {attributes.line_items.map(({ id, __component, goal, cost, budget, scheduled_send, complete, Advertiser }) => (
                    <LineItem
                        key={id}
                        component={__component}
                        goal={goal}
                        cost={cost}
                        budget={budget}
                        scheduled_send={scheduled_send}
                        complete={complete}
                        advertiser={Advertiser}
                    />
                ))}
            </section>
        </li>
        )
}
