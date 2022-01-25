import NumberFormat from "react-number-format";

function FormattedDate(date) {
    const sendDate = new Date(date.date).toDateString();
    return <span>{sendDate}</span>
}

export default function LineItem({ component, goal, cost, budget, scheduled_send, complete }) {
    return (
        <div className="pt-2">
            <p className="capitalize">
                {component.replace('order.', '')}
                {complete &&
                    <span className="ml-2 badge">Complete</span>
                }
                {!complete &&
                    <span className="ml-2 badge">Not Complete</span>
                }
            </p>
            <p>
                <span>Impressions: </span>
                <NumberFormat value={goal} displayType={'text'} thousandSeparator={true} />
            </p>
            <p>
                <span>CPM: </span>
                <NumberFormat className="inline-block" value={cost} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </p>
            {budget &&
                <p>
                    <span>Budget: </span>
                    <NumberFormat value={budget} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </p>
            }
            { scheduled_send &&
                <p>
                    <span>Send Date: </span>
                    <FormattedDate date={scheduled_send} />
                </p>
            }
        </div>
    )
}
