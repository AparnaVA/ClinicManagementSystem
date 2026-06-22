import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function AppointmentCalendar(){
    const [events, setEvents] = useState([]);
    const loadEvents = async () => {

    try {

        const token =
            localStorage.getItem(
                'token'
            );

        const response =
            await api.get(

                'appointments/calendar/',

                {
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );

        setEvents(
            response.data
        );

    } catch (error) {

        console.log(error);
    }
};
useEffect(() => {

    loadEvents();

}, []);
const handleEventClick =
(eventInfo) => {

    const event =
        eventInfo.event;

    alert(

        `Patient: ${
            event.extendedProps.patient
        }

Doctor: ${
            event.extendedProps.doctor
        }

Status: ${
            event.extendedProps.status
        }

Reason: ${
            event.extendedProps.reason
        }`
    );
};
return(
    <>
<Navbar />

<div className="container mt-4">

<h2>
Appointment Calendar
</h2>

<FullCalendar

plugins={[

    dayGridPlugin,

    timeGridPlugin,

    interactionPlugin
]}

initialView="dayGridMonth"

headerToolbar={{

    left:
    'prev,next today',

    center:
    'title',

    right:
    'dayGridMonth,timeGridWeek,timeGridDay'
}}

events={events}

eventClick={
    handleEventClick
}

height="auto"

/>

</div>

</>
)
}
export default AppointmentCalendar;