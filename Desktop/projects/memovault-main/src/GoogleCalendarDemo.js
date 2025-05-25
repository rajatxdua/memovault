import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export default function GoogleCalendarDemo() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(setSignedIn);
        setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const signIn = () => gapi.auth2.getAuthInstance().signIn();
  const signOut = () => gapi.auth2.getAuthInstance().signOut();

  // Example event: today, 1 hour from now
  const addEvent = async () => {
    const now = new Date();
    const start = new Date(now.getTime() + 10 * 60 * 1000); // 10 min from now
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

    const event = {
      summary: "Test Event from React",
      description: "This event was added via Google Calendar API and React!",
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    };

    try {
      await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      alert("Event added to your Google Calendar!");
    } catch (err) {
      alert("Failed to add event: " + err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Google Calendar API Demo</h2>
      {!signedIn ? (
        <button onClick={signIn} className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign in with Google
        </button>
      ) : (
        <>
          <button onClick={signOut} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
            Sign Out
          </button>
          <button onClick={addEvent} className="bg-green-500 text-white px-4 py-2 rounded">
            Add Event to Google Calendar
          </button>
        </>
      )}
    </div>
  );
}
