function FormattedDate(date) {
    // This helps offset the time zone for fields that only have date (no time or timezone) as they are incorrectly shown as the previous day due to how Date works.
    const rawDate = new Date(date.date);
    const correctedDate = new Date( rawDate.getTime() + Math.abs(rawDate.getTimezoneOffset()*60000) ).toDateString()

    // const sendDate = new Date(date.date).toDateString();
    // console.info("after: ", sendDate)
    return <span>{correctedDate}</span>
}

export default function Stat({ title, value, date, success }) {
    let classes = "stat-value text-base capitalize";

    if(typeof success != "undefined") {
        if(success) {
            classes += " underline decoration-4 underline-offset-2 decoration-success";
        } else {
            classes += " underline decoration-4 underline-offset-2 decoration-warning";
        }
    }

    return (
        <div className="stat">
            <div className="stat-title">{title}</div>
            {date &&
                <div className="stat-value text-base">
                    <FormattedDate className="stat-value text-base" date={value} />
                </div>
            }
            {!date && success &&
                <div className={classes}>{value}</div>
            }
            {!date && !success &&
                <div className={classes}>{value}</div>
            }
        </div>
    )
}
