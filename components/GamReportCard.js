import React from "react";

export default function GamReportCard({ name, impressions = 0, clicks = 0, delivery = 0, status = "" }) {
    function parseToNumber(data) {
        return parseInt(data).toLocaleString('en-US');
    }

    return (
        <div className="card bg-white text-base-content shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p>Delivered Impressions: {parseToNumber(impressions)}</p>
                <p>Clicks: {parseToNumber(clicks)}</p>
                <p>CTR: {(clicks / impressions * 100).toFixed(2)}%</p>
                <p>Delivery: {parseToNumber(delivery)}%</p>
                <p>Status: {status}</p>
            </div>
        </div>
    )
}
