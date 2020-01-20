import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import fetchSchedule from "./MBTA";
import { setIntervalAsync } from "set-interval-async/dynamic";

function Timetable(props) {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setScheduleData(await fetchSchedule(props.station, props.apiKey));
    }

    getData();
  }, [props.station, props.apiKey]);

  // setIntervalAsync(() => fetchSchedule(props.station, props.apiKey).then(item => setScheduleData(item)), 10000);

  scheduleData.forEach(obj => console.log(obj));

  return (
    <>
      <h1>{props.station === "place-north" ? "North Station" : "South Station"}</h1>
      <table className="Timetable">
        <thead>
          <tr>
            <th>Time</th>
            <th>Destination</th>
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
                trackNumber="TBD"
                status={item.status}
              />)
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
      <td>{props.trackNumber}</td>
      <td>{props.status}</td>
    </tr>
  );
}

export default Timetable;