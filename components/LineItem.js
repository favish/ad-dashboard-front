import Stat from "./Stat";
import NumberStat from "./NumberStat";

export default function LineItem({ component, goal, cost, budget, scheduled_send, complete, client, index }) {
    return (
        <div className="shadow stats w-full">
            <Stat title={"#"} value={index + 1} />
            <Stat title={"Type"} value={component.replace('order.', '')} />
            {client &&
                <div className="stat">
                    <div className="stat-title">Client</div>
                    <div className="stat-value text-base capitalize">{client}</div>
                </div>
            }
            <NumberStat title={"Impressions"} value={goal} />
            <NumberStat title={"CPM"} value={cost} prefix={'$'} />
            {budget &&
                <NumberStat title={"Budget"} value={budget} prefix={'$'}/>
            }
            { scheduled_send &&
                <Stat title={"Send Date"} value={scheduled_send} date={true}/>
            }
            {complete &&
                <Stat title={"Status"} value={"Complete"} success={true}/>
            }
            {!complete &&
                <Stat title={"Status"} value={"Not Complete"} success={false} />
            }
        </div>
    )
}
