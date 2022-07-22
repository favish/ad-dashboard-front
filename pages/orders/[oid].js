import Layout from '../../components/layout'
import { useRouter } from 'next/router';
import React, { useState, useRef } from 'react';
import EmailReportCard from "../../components/EmailReportCard";

const backend = "https://strapi-iteh.onrender.com";
const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders/?[populate]=*&filters[order_id][$eq]=";
// export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:1337'
// const apiEndpoint = API_URL + "/api/orders/?[populate]=*&filters[order_id][$eq]=";

export async function getServerSideProps(context) {
    const res = await fetch(apiEndpoint + context.query.oid);
    const data = await res.json();

    return {
        props: { data } ,
    };
}

const Order = (data) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const refs = useRef([]);
    console.info(data);
    const gamBtnRef = useRef();
    const router = useRouter();
    const { oid } = router.query;
    const advertiserName = data.data.data[0].attributes.advertiser.data.attributes.advertiser_name;
    const gamItems = data.data.data[0].attributes.line_items.some((lineItem) => lineItem.__component === "order.display");
    const postUpItemsExist = data.data.data[0].attributes.line_items.some((lineItem) => lineItem.__component === "order.dedicated-email");
    const postUpItems = data.data.data[0].attributes.line_items.filter((item) => item.__component === "order.dedicated-email");
    let report = data.data.data[0].attributes.report;

    if (!report) {
        report = []
    }

    const refreshData = () => {
        router.replace(router.asPath);
    }

    async function handleClick(e) {
        setButtonDisabled(true)
        const res = await fetch(backend + '/api/order/report/gam/' + oid);

        if (res.status < 300) {
            refreshData();
            setButtonDisabled(false)
        }
    }

    async function handlePostUpClick(id, index) {
        const res = await fetch(backend + '/api/order/report/email/' + oid + "/" + id);
        refs.current[index].disabled = true;

        if (res.status < 300) {
            refreshData();
            setInterval(function() {
                refs.current[index].disabled = false;
            }, 3000)
        }
    }

    return (
        <Layout>
            <div className="overflow-x-auto 2xl:max-w-screen-2xl md:max-w-screen-xl m-auto mt-6 mb-6">
                <p className="text-center font-bold text-xl">Order: {oid}</p>
                <p className="text-center font-bold mb-10">Advertiser: {advertiserName}</p>
                {gamItems &&
                    <>
                        <p className="mt-4 mb-4">Google Ad Manager Reports:</p>
                        <div className="mb-10 p-6 border-solid border-4 border-black">
                            <div className="flex flex-wrap space-x-4 mt-4">
                                {report.gam && report.gam.map((report, index) => {
                                    return (
                                        <div key={index} className="card w-96 bg-neutral text-neutral-content shadow-xl">
                                            <div className="card-body">
                                                <h2 className="card-title">{report.name}</h2>
                                                <p>Delivered Impressions: {parseInt(report.imps).toLocaleString('en-US')}</p>
                                                <p>Clicks: {parseInt(report.clicks).toLocaleString('en-US')}</p>
                                                <p>CTR: {(report.clicks / report.imps * 100).toFixed(2)}%</p>
                                                <p>Delivery: {parseInt(report.delivery).toLocaleString('en-US')}%</p>
                                                <p>Status: {report.status}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <button
                                className="btn btn-primary mt-10"
                                disabled={buttonDisabled}
                                onClick={handleClick}
                            >
                                {buttonDisabled ? 'Refreshing...' : 'Refresh All GAM Reports'}
                            </button>
                        </div>
                    </>
                }
                {postUpItemsExist &&
                    <>
                        <p className="mt-4">PostUp Reports:</p>
                        <div className="flex space-x-4 mt-4 mb-10 p-6 border-solid border-4 border-black">
                            {postUpItems.map((item, index) => (
                                <EmailReportCard
                                    key={index}
                                    sendDate={item.scheduled_send}
                                    mailingId={item.postup}
                                    report={report}
                                    refresh={refreshData}
                                    orderId={oid}
                                />
                            ))}
                        </div>
                    </>
                }
                <p className="mt-4">Passendo Reports: Coming Soon!</p>
                <p className="mt-4">Sponsored Article Reports: Coming Soon!</p>
            </div>
        </Layout>
    )
}

export default Order;