import React, { Suspense } from "react";
import { Await, defer, json, redirect, useRouteLoaderData } from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

const EventDetailPage = () => {
  const { event, events } = useRouteLoaderData("event-detail");
  return (
    <>
        <Suspense fallback={<p style={{textAlign: 'center'}}>Loading...</p>}>
            <Await resolve={event}>
                {(loadedEvent) => <EventItem event={loadedEvent} />}
            </Await>
        </Suspense>
        <Suspense fallback={<p style={{textAlign: 'center'}}>Loading...</p>}>
            <Await resolve={events}>
                {(loadedEvents) => <EventsList events={loadedEvents} />}
            </Await>
        </Suspense>
    </>
  );
};

export default EventDetailPage;

const loadeEvent = async (id) => {
    const response = await fetch(`http://localhost:8080/events/${id}`);
    if (!response.ok) {
        throw json({ message: "Could not fetch details for selected event" }, {
        status: 500,
        });
    } else {
        const resData = await response.json();
        return resData.event;
    }
}

const loadEvents = async () => {
  const response = await fetch("http://localhost:8080/events");
  if (!response.ok) {
    // return { isError: true, message: 'could not fetch events'}
    // throw new Response(JSON.stringify({ message: "could not fetch events" }), {
    //   status: 500,
    // });
    throw json({ message: "could not fetch events" }, { status: 500 });
  } else {
    const resData = await response.json();
    return resData.events;
  }
};

export const loader = async ({ request, params }) => {
    const id = params.event_id;
    return defer({
        event: await loadeEvent(id),
        events: loadEvents(),
    })
};

export const action = async ({ params, request }) => {
  const response = await fetch(
    `http://localhost:8080/events/${params.event_id}`,
    {
      method: request.method,
    }
  );
  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for selected event" },
      {
        status: 500,
      }
    );
  }

  return redirect("/events");
};
