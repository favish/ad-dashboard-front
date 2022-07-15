import Layout from '../../components/layout'
import React from 'react';
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*&pagination[pageSize]=50&sort=id%3Adesc&filters[Archived][$ne]=true&filters[status][$ne]=complete";

export async function getServerSideProps() {
    const res = await fetch(apiEndpoint);
    const data = await res.json();

    return {
        props: { data } ,
    };
}

function calcDates(start, end) {
    const differenceBetween = Math.ceil((end.getTime() - start.getTime()) / (100 * 3600 * 24));
    const daysIn = Math.ceil((end.getTime() - new Date().getTime()) / (100 * 3600 * 24));;

    return Math.round(daysIn / differenceBetween * 100);
}

function cleanTypeName(type) {
    let cleanedType = type.split(".")[1];

    return cleanedType.charAt(0).toUpperCase() + cleanedType.slice(1);
}

const GanttPage = ({ data }) => {
    let tasks = [];

    data.data.forEach(order => {
        order.attributes.line_items.forEach(lineItem => {
            if (lineItem.__component === "order.display" || lineItem.__component === "order.newsletter") {
                if (lineItem.start && !lineItem.complete) {
                    tasks.push({
                        start: new Date(lineItem.start),
                        end: new Date(lineItem.end),
                        name: order.attributes.advertiser.data.attributes.advertiser_name + " - " + order.attributes.order_id + " - " + cleanTypeName(lineItem.__component),
                        id: order.id,
                        type: 'task',
                        progress: calcDates(new Date(lineItem.start), new Date(lineItem.end)),
                        isDisabled: true,
                        styles: {progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d'},
                    })
                }
            }
        //     else if (lineItem.__component === "order.sponsored-article") {
        //         if (lineItem.post_date && !lineItem.complete) {
        //             tasks.push({
        //                 start: new Date(lineItem.post_date),
        //                 end: new Date(lineItem.post_date),
        //                 name: order.attributes.advertiser.data.attributes.advertiser_name + " - " + order.attributes.order_id + " - " + cleanTypeName(lineItem.__component),
        //                 id: order.id,
        //                 type: 'milestone',
        //                 progress: 0,
        //                 isDisabled: true,
        //                 styles: {progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'green'},
        //             })
        //         }
        //     } else if (lineItem.__component === "order.dedicated-email") {
        //     if (lineItem.scheduled_send && !lineItem.complete) {
        //         tasks.push({
        //             start: new Date(lineItem.scheduled_send),
        //             end: new Date(lineItem.scheduled_send),
        //             name: order.attributes.advertiser.data.attributes.advertiser_name + " - " + order.attributes.order_id + " - " + cleanTypeName(lineItem.__component),
        //             id: order.id,
        //             type: 'milestone',
        //             progress: 0,
        //             isDisabled: true,
        //             styles: {progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d', backgroundColor: 'blue'},
        //         })
        //     }
        // }
        })
    })

    // Gets the date 10 days before the current date, so the chart is easier to read when opening.
    const dateToView = new Date(new Date().setDate(new Date().getDate() - 10))

    return (
        <Layout>
            <h1 className="text-center text-xl">Orders - Gantt Chart</h1>
            <div className="p-10 pt-2 pb-2">
                <Gantt
                    tasks={tasks}
                    viewMode={"Day"}
                    viewDate={dateToView}
                    todayColor={"#e88888"}
                />
            </div>
        </Layout>
    )
}

export default GanttPage;