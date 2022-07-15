import Layout from '../../components/layout'
import {Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*&pagination[pageSize]=50";
const locales = {
    'en-US': enUS,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export async function getServerSideProps(context) {
    const response = await fetch(apiEndpoint);
    const data = await response.json();

    //TODO: This filters out orders that don't have email sends. Currently Strapi does not allow filtering by components. May be able to make custom route for this.
    const ordersWithEmail = data.data.filter(order => order.attributes.line_items.some(lineItem => lineItem.__component === "order.dedicated-email"));
    const ordersWithPosts = data.data.filter(order => order.attributes.line_items.some(lineItem => lineItem.__component === "order.sponsored-article"));
    const mergedPostsAndEmails = ordersWithEmail.concat(ordersWithPosts);

    return {
        props: { mergedPostsAndEmails } ,
    };
}

export default function Calender({ mergedPostsAndEmails }) {
    let emailSends = [];
    mergedPostsAndEmails.forEach(order => {
        order.attributes.line_items.forEach(lineItem => {

            if (lineItem.__component === "order.dedicated-email") {
                emailSends.push(
                    {
                        title: order.attributes.order_id + " - " + order.attributes.advertiser.data.attributes.advertiser_name ,
                        start: lineItem.scheduled_send,
                        end: lineItem.scheduled_send,
                    }
                )
            } else if (lineItem.__component === "order.sponsored-article") {
                // date ends are exclusive in this library, so we need to add +1 day to the start date to get it on the actual date.
                const date = new Date(lineItem.post_date);
                date.setDate(date.getDate() + 1);

                emailSends.push(
                    {
                        title: order.attributes.order_id + " - " + order.attributes.advertiser.data.attributes.advertiser_name ,
                        start: date,
                        end: date,
                        allDay: true,
                        resources: [
                            {
                                id: "type",
                                title: "sponsored",
                            }
                        ]
                    }
                )
            }
        })
    })

    return (
        <Layout>
            <div className="divider"></div>
            <div className="p-3 pt-0 text-right">
                <h3 className="mb-1">Legend</h3>
                <span className="bg-blue-500 mt-2 mr-2 p-1 rounded w-56 text-white">Dedicated Email Sends</span>
                <span className="bg-green-600 p-1 rounded w-56 text-white">Sponsored Posts</span>
            </div>
            <Calendar
                className="p-10 pt-2 pb-2"
                localizer={localizer}
                events={emailSends}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
                eventPropGetter={(event) => {
                    const backgroundColor = event.resources ? '#16a34a' : '#3b82f6';
                    return { style: { backgroundColor } }
                }}
                views={{
                    month: true,
                }}
            />
        </Layout>
    )
}
