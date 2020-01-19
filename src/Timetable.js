import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import fetchData from "./MBTA"


function Timetable(props) {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      setScheduleData(await fetchData(props.station));
    }

    fetchSchedule();
  }, [props.station]);

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
      <td>Unknown</td>
      <td>{props.trackNumber}</td>
      <td>{props.status}</td>
    </tr>
  );
}

export default Timetable;