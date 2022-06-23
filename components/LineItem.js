import Stat from "./Stat";
import NumberStat from "./NumberStat";
import { intervalToDuration, differenceInDays } from "date-fns";

export default function LineItem({ component, goal, cost, budget, scheduled_send, complete, client, index, start, end, paid, post_date }) {
    let startDate, endDate, totalDuration, daysElapsed, progress;
    if (start && end) {
         startDate = new Date(start);
         endDate = new Date(end);
         totalDuration = differenceInDays(endDate, startDate) + 1;
         daysElapsed = intervalToDuration({start: startDate, end: new Date()});
         progress = daysElapsed.days/totalDuration * 100;
    }
    let formatedPaid = paid ? "Yes" : "No";

    return (
        <div className="shadow stats w-full grid-cols-[50px_200px_150px_100px_150px_200px_150px_50px]">
            <Stat title={"#"} value={index + 1} />
            <Stat title={"Type"} value={component.replace('order.', '')} />
            {/*{client &&*/}
            {/*    <div className="stat">*/}
            {/*        <div className="stat-title">Client</div>*/}
            {/*        <div className="stat-value text-base capitalize">{client}</div>*/}
            {/*    </div>*/}
            {/*}*/}
            <NumberStat title={"Impressions"} value={goal} />
            <NumberStat title={"CPM"} value={cost} prefix={'$'} />
            {budget &&
                <NumberStat title={"Budget"} value={budget} prefix={'$'}/>
            }
            { post_date &&
                <Stat title={"Post Date"} value={post_date} date={true}/>
            }
            { scheduled_send &&
                <Stat title={"Send Date"} value={scheduled_send} date={true}/>
            }
            {complete &&
                <Stat title={"Status"} value={"Complete"} success={true}/>
            }
            {start && end &&
                <div className="artboard phone">
                    <progress className="progress" value={progress} max="100"></progress>
                </div>
            }
            {/*<Stat title={"Start"} value={start}/>*/}
            {!complete &&
                <Stat title={"Status"} value={"Not Complete"} success={false} />
            }
            <Stat title={"Paid"} value={formatedPaid}/>
        </div>
    )
}
