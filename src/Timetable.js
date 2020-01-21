import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import fetchSchedule from "./MBTA";

function Timetable(props) {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    fetchSchedule(props.station).then(data => setScheduleData(data));

    const interval = setInterval(() => {
      fetchSchedule(props.station).then(data => setScheduleData(data));
    }, 10000);

    return () => clearInterval(interval);
  }, [props.station]);

  scheduleData.forEach(obj => console.log(obj));

  return (
    <>
      <h1>{props.station === "place-north" ? "North Station" : "South Station"}</h1>
      <table className="Timetable">
        <thead>
          <tr>
            <th>Time</th>
            <th>Destination</th>
            <th>Train#</th>
            <th>Track#</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            scheduleData.map(item =>
              <TimetableRow key={item.key}
                time={item.time}
                destination={item.destination}
                trackNumber={item.trackNumber}
                trainNumber={item.trainNumber}
                status={item.status} />)
          }
        </tbody>
      </table>
    </>);
}

function TimetableRow(props) {
  return (
    <tr>
      <td>{moment(props.time).format("h:mm A")}</td>
      <td>{props.destination}</td>
      <td>{props.trainNumber}</td>
      <td>{props.trackNumber}</td>
      <td>{props.status}</td>
    </tr>
  );
}

export default Timetable;