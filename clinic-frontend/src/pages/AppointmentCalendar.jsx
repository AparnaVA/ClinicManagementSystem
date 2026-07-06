import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function AppointmentCalendar() {
    const [events, setEvents] = useState([]);

    const loadEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('appointments/calendar/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEvents(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleEventClick = (eventInfo) => {
        const event = eventInfo.event;
        alert(
            `Patient: ${event.extendedProps.patient}\n` +
            `Doctor: ${event.extendedProps.doctor}\n` +
            `Status: ${event.extendedProps.status}\n` +
            `Reason: ${event.extendedProps.reason}`
        );
    };

    return (
        <>
            <Navbar />
            <div className="calendar-page-wrapper page-fade-in">
                {/* Embedded Scoped Style Panel */}
                <style>{`
                    .calendar-page-wrapper {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f4f7f5 0%, #edf3f0 100%);
                        padding: 32px 0 60px;
                        font-family: 'Inter', system-ui, sans-serif;
                        color: #334155;
                    }

                    /* --- Entrance Animation --- */
                    .page-fade-in {
                        animation: calendarSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }

                    @keyframes calendarSlideUp {
                        from {
                            opacity: 0;
                            transform: translateY(12px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    /* --- Layout Base Header --- */
                    .calendar-header-block {
                        margin-bottom: 24px;
                    }

                    .calendar-title {
                        color: #1f3f35;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                    }

                    /* --- Card Wrap Layer --- */
                    .clinic-calendar-card {
                        background: #ffffff;
                        border: 1px solid rgba(47, 91, 74, 0.08);
                        border-radius: 16px;
                        padding: 24px;
                        box-shadow: 0 6px 20px rgba(31, 63, 53, 0.03);
                    }

                    /* --- Deep FullCalendar Custom Overrides --- */
                    
                    /* Toolbar Controls & Headers */
                    .fc .fc-toolbar {
                        margin-bottom: 20px !important;
                        flex-wrap: wrap;
                        gap: 12px;
                    }

                    .fc .fc-toolbar-title {
                        font-size: 1.25rem !important;
                        font-weight: 700 !important;
                        color: #1f3f35 !important;
                    }

                    /* Button Restyling */
                    .fc .fc-button-primary {
                        background-color: #ffffff !important;
                        border: 1px solid #cbd5e1 !important;
                        color: #475569 !important;
                        font-weight: 600 !important;
                        font-size: 0.85rem !important;
                        padding: 6px 14px !important;
                        text-transform: capitalize !important;
                        border-radius: 8px !important;
                        transition: all 0.2s ease !important;
                        box-shadow: none !important;
                    }

                    .fc .fc-button-primary:hover {
                        background-color: #f8fafc !important;
                        border-color: #2f5b4a !important;
                        color: #2f5b4a !important;
                    }

                    .fc .fc-button-active {
                        background-color: #2f5b4a !important;
                        border-color: #2f5b4a !important;
                        color: #ffffff !important;
                    }

                    .fc .fc-button-primary:disabled {
                        background-color: #f1f5f9 !important;
                        color: #94a3b8 !important;
                        border-color: #e2e8f0 !important;
                    }

                    /* Button Group Handling spacing */
                    .fc .fc-button-group > .fc-button {
                        border-radius: 8px !important;
                        margin: 0 2px !important;
                    }

                    /* Grid Table Borders and Headers */
                    .fc theme-standard td, .fc theme-standard th, .fc .fc-scrollgrid {
                        border-color: #e2e8f0 !important;
                    }

                    .fc .fc-col-header-cell {
                        background: #f8fafc !important;
                        padding: 10px 0 !important;
                    }

                    .fc .fc-col-header-cell-cushion {
                        color: #475569 !important;
                        font-weight: 600 !important;
                        font-size: 0.825rem !important;
                        text-transform: uppercase;
                        letter-spacing: 0.03em;
                        text-decoration: none !important;
                    }

                    /* Individual Day Cells */
                    .fc .fc-daygrid-day-number {
                        color: #64748b !important;
                        font-size: 0.85rem !important;
                        font-weight: 500 !important;
                        padding: 8px !important;
                        text-decoration: none !important;
                    }

                    .fc .fc-day-today {
                        background: rgba(47, 91, 74, 0.04) !important;
                    }

                    /* Event Elements UI Design */
                    .fc-v-event, .fc-h-event {
                        background-color: #eef6f3 !important;
                        border: 1px solid rgba(47, 91, 74, 0.2) !important;
                        border-left: 4px solid #2f5b4a !important;
                        border-radius: 6px !important;
                        padding: 2px 6px !important;
                        cursor: pointer !important;
                        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
                    }

                    .fc-v-event:hover, .fc-h-event:hover {
                        transform: translateY(-1px) !important;
                        box-shadow: 0 4px 10px rgba(47, 91, 74, 0.1) !important;
                        background-color: #e4f0ec !important;
                    }

                    .fc-event-title {
                        font-weight: 600 !important;
                        color: #1f3f35 !important;
                        font-size: 0.8rem !important;
                    }

                    .fc-event-time {
                        color: #2f5b4a !important;
                        font-size: 0.75rem !important;
                        font-weight: 500 !important;
                    }
                `}</style>

                <div className="container">
                    {/* Header Block */}
                    <div className="calendar-header-block">
                        <h3 className="calendar-title">Appointment Tracking Calendar</h3>
                        <p className="text-muted small mb-0">View, navigate, and audit patient medical consultation time allocations interactively.</p>
                    </div>

                    {/* Main Calendar Card Component */}
                    <div className="clinic-calendar-card">
                        <FullCalendar
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin
                            ]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            eventClick={handleEventClick}
                            height="auto"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AppointmentCalendar;