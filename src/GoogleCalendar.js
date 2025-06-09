// src/GoogleCalendar.js
import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export function useGoogleCalendar() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      });
    }
    gapi.load("client:auth2", start);
  }, []);
}

export async function createCalendarEvent({ summary, description, startDateTime, endDateTime }) {
  try {
    await window.gapi.auth2.getAuthInstance().signIn();
    const event = {
      summary,
      description,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
    };
    await window.gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    alert("Reminder set in Google Calendar!");
  } catch (error) {
    alert("Failed to create event: " + error.message);
  }
}
