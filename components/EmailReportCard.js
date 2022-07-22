import { differenceInDays } from "date-fns";
import React, { useState, useEffect } from "react";
const backend = "https://strapi-iteh.onrender.com";

export default function EmailReportCard({ sendDate, mailingId = 0, report = [], refresh, orderId }) {
    const formattedDate = new Date(sendDate).toLocaleDateString();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
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

        if (differenceInDays(today, sd) <= 0 || !mailingId) {
            setButtonDisabled(true)
        }
    });

    async function handleClick(id, index) {
        setLoading(true);
        const res = await fetch(backend + '/api/order/report/email/' + orderId + "/" + mailingId);

        if (res.status < 300) {
            setLoading(false);
            refresh();
            setInterval(function() {
            }, 3000)
        }
    }

    function NormalButton() {
        return (
            <button
                onClick={() => handleClick(mailingId)}
                className="btn btn-primary"
                disabled={buttonDisabled}
            >
                Get Report</button>
        )
    }

    function DisabledButton() {
        return (
            <button
                className="btn btn-primary"
                disabled={buttonDisabled}
            >
                Report Unavailable</button>
        )
    }

    function LoadingButton() {
        return (
            <button
                onClick={() => handleClick(mailingId)}
                className="btn btn-primary disabled"
            >
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>Fetching...</button>
        )
    }

    function Button() {
        if (buttonDisabled) {
            return <DisabledButton />
        } else if (loading) {
            return <LoadingButton />
        }
        return <NormalButton />
    }

    return (
        <div className="card m-4 text-base-content shadow-xl basis-1/5">
            <div className="card-body bg-white">
                <h2 className="card-title">{formattedDate}</h2>
                <p>Mailing ID: {mailingId}</p>
                <p>Sent Emails: {specificReport.sent.toLocaleString('en-US')}</p>
                <p>Opens: {specificReport.uniqueOpens.toLocaleString('en-US')}</p>
                <p>Open Rate: {(specificReport.uniqueOpens / specificReport.sent * 100).toFixed(2)}%</p>
                <p>Clicks: {specificReport.uniqueHtmlClick.toLocaleString('en-US')}</p>
                <p>CTR: {(specificReport.uniqueHtmlClick / specificReport.uniqueOpens * 100).toFixed(2)}%</p>
                <div className="card-actions justify-end">
                    <Button />
                </div>
            </div>
        </div>
    )
}
