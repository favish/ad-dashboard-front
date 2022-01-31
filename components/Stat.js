function FormattedDate(date) {
    const sendDate = new Date(date.date).toDateString();
    return <span>{sendDate}</span>
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
