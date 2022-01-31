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
        <li className="bg-slate-300 p-4 rounded-lg" key={id}>
            <label htmlFor={"my-modal-" + id} className="modal-button">
                <input type="checkbox" id={"my-modal-" + id} className="modal-toggle" />
                <div className="modal">
                    <section className="space-y-4 divide-y new-modal-box max-w-50" tabIndex="0">
                        {attributes.line_items.map(({ id, __component, goal, cost, budget, scheduled_send, complete, client, paid }, index) => (
                            <LineItem
                                index={index}
                                className="drawer-content"
                                key={id}
                                component={__component}
                                goal={goal}
                                cost={cost}
                                budget={budget}
                                scheduled_send={scheduled_send}
                                complete={complete}
                                client={client}
                            />
                        ))}
                    </section>
                </div>
                <div tabIndex="0" className="cursor-pointer">
                    <PaidBadge paidStatus={attributes.paid} />
                    <p>Order: {attributes.order_id}</p>
                    <p>Advertiser: {attributes.advertiser.data.attributes.advertiser_name}</p>
                </div>
            </label>

        </li>
        )
}
