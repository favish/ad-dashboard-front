import { intervalToDuration, differenceInDays } from "date-fns";
import React, { useRef, useState, useEffect } from "react";

export default function EmailReportCard({ sendDate, mailingId = 0, report = [], refresh, orderId }) {
    const formattedDate = new Date(sendDate).toLocaleDateString();
    const ref = useRef([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    let specificReport;
    if (report.email && report.email[mailingId]) {
        specificReport = report.email[mailingId]
    } else {
        specificReport = {
            sent: 0,
            opens:0,
            openRate: 0,
            uniqueOpens: 0,
            uniqueHtmlClick: 0,
            CTR: 0,
        };
    }

    useEffect(() => {
        const today = new Date();
        const sd = new Date(sendDate);

        if (differenceInDays(today, sd) <= 0) {
            setButtonDisabled(true)
        }

        console.info('Diff in days = ', differenceInDays(today, sd));
    });

    console.info(specificReport);

    async function handleClick(id, index) {
        const res = await fetch('http://localhost:1337/api/order/report/email/' + orderId + "/" + mailingId);
        ref.current.disabled = true;

        if (res.status < 300) {
            refresh();
            setInterval(function() {
                ref.current.disabled = false;
            }, 3000)
        }
    }

    return (
        <div className="card w-96 bg-neutral text-neutral-content shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{formattedDate}</h2>
                <p>Mailing ID: {mailingId}</p>
                <p>Sent Emails: {specificReport.sent.toLocaleString('en-US')}</p>
                <p>Opens: {specificReport.uniqueOpens.toLocaleString('en-US')}</p>
                <p>Open Rate: {(specificReport.uniqueOpens / specificReport.sent * 100).toFixed(2)}%</p>
                <p>Clicks: {specificReport.uniqueHtmlClick.toLocaleString('en-US')}</p>
                <p>CTR: {(specificReport.uniqueHtmlClick / specificReport.uniqueOpens * 100).toFixed(2)}%</p>
                <div className="card-actions justify-end">
                    <button
                        onClick={() => handleClick(mailingId)}
                        disabled={buttonDisabled}
                        ref={ref}
                        className="btn glass"
                    >Get Report</button>
                </div>
            </div>
        </div>
    )
}
