import Layout from '../../components/layout'
import {Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*";
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
const myEventsList = [
    {
        id: 0,
        title: "blah",
        allDay: true,
        start: new Date(2022, 0, 10),
        end: new Date(2022, 0, 11)
    },
    {
        id: 1,
        title: "New Event",
        start: new Date(2022, 0, 15),
        end: new Date(2022, 0, 23)
    }
]

export async function getServerSideProps(context) {
    const response = await fetch(apiEndpoint);
    const data = await response.json();

    //TODO: This filters out orders that don't have email sends. Currently Strapi does not allow filtering by components. May be able to make custom route for this.
    const ordersWithEmail = data.data.filter(order => order.attributes.line_items.some(lineItem => lineItem.__component === "order.dedicated-email"));

    return {
        props: { ordersWithEmail } ,
    };
}

export default function Calender({ ordersWithEmail }) {
    let emailSends = [];
    ordersWithEmail.forEach(order => {
        order.attributes.line_items.forEach(lineItem => {
            emailSends.push(
                {
                    title: order.attributes.order_id + " - " + order.attributes.advertiser.data.attributes.advertiser_name ,
                    start: lineItem.scheduled_send,
                    end: lineItem.scheduled_send,
                }
            )
        })
    })

    return (
        <Layout>
            <h1 className="text-center text-xl">Dedicated Email Calendar</h1>
            <div className="divider"></div>
            <Calendar
                className="p-10"
                localizer={localizer}
                events={emailSends}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
            />

        </Layout>
    )
}
