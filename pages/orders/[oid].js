import Layout from '../../components/layout'
import { useRouter } from 'next/router';
import React, { useState, useRef } from 'react';
import EmailReportCard from "../../components/EmailReportCard";
import GamReportCard from "../../components/GamReportCard";

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
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        const res = await fetch(backend + '/api/order/report/gam/' + oid);

        if (res.status < 300) {
            refreshData();
            setLoading(false);
        }
    }

    function NormalButton() {
        return (
            <button
                onClick={() => handleClick()}
                className="btn btn-primary mt-10"
                disabled={buttonDisabled}
            >
                Refresh All GAM Reports</button>
        )
    }

    function LoadingButton() {
        return (
            <button
                onClick={() => handleClick()}
                className="btn btn-primary mt-10 disabled"
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
         if (loading) {
            return <LoadingButton />
        }
        return <NormalButton />
    }

    return (
        <Layout>
            <div className="overflow-x-auto 2xl:max-w-screen-2xl md:max-w-screen-xl m-auto mt-6 mb-6">
                <p className="text-center font-bold text-xl">Order: {oid}</p>
                <p className="text-center font-bold mb-10">Advertiser: {advertiserName}</p>
                {gamItems &&
                    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                        <input type="checkbox" />
                        <div className="collapse-title text-xl font-medium">
                            Display (GAM) Reports
                        </div>
                        <div className="collapse-content">
                            <div className="p-6">
                                <div className="flex flex-wrap space-x-4 mt-4">
                                    {report.gam && report.gam.map((report, index) => {
                                        return (
                                            <GamReportCard
                                                key={index}
                                                name={report.name}
                                                impressions={report.imps}
                                                clicks={report.clicks}
                                                delivery={report.delivery}
                                                status={report.status}
                                            />
                                        )
                                    })}
                                </div>
                                <Button />
                            </div>
                        </div>
                    </div>
                }
                {postUpItemsExist &&
                    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                        <input type="checkbox" />
                        <div className="collapse-title text-xl font-medium">
                            Dedicated Email Reports
                        </div>
                        <div className="collapse-content">
                            <div className="flex p-6 flex-wrap justify-between space-4">
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
                        </div>
                    </div>
                }
                <p className="mt-4">Passendo Reports: Coming Soon!</p>
                <p className="mt-4">Sponsored Article Reports: Coming Soon!</p>
            </div>
        </Layout>
    )
}

export default Order;