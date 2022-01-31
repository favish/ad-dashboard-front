import NumberFormat from "react-number-format";

export default function NumberStat({ title, value, prefix }) {
    return (
        <div className="stat">
            <div className="stat-title">{title}</div>
            <NumberFormat
                className="stat-value text-base"
                value={value} displayType={'text'}
                thousandSeparator={true}
                prefix={prefix}
            />
        </div>
    )
}
