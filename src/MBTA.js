import Serializer from "jsonapi-serializer";
import moment from "moment";

const deserializer = new Serializer.Deserializer();

async function deserialize(rawJSONAPIResult) {
  return await deserializer.deserialize(rawJSONAPIResult);
}

export default async function fetchSchedule(station, key) {
  const query =
`https://api-v3.mbta.com/schedules/
?filter[stop]=${station}
&filter[min_time]=${moment().format("HH:mm")}
&filter[max_time]=24:00
&sort=departure_time
&include=prediction,route,stop,trip
&fields[schedule]=departure_time
&fields[prediction]=departure_time,status,trip
&fields[schedule]=arrival_time,departure_time
&fields[route]=direction_destinations,type
&fields[stop]=platform_code
&fields[trip]=direction_id`;
  const result = (await jsonAPIQuery(query, key)).filter(item => item.route.type === 2 && item["departure-time"] !== null);
  console.log(result[0]);

  const normalizedData = result.filter(item => item.route.type === 2 && item["departure-time"] !== null)
    .map(item => {
      return {
        "key": item.id,
        "time": item.prediction === null ? item["departure-time"] : item.prediction["departure-time"],
        "destination": item.route["direction-destinations"][0],
        "status": ("prediction" in item)? "Pending" : item.prediction.status
      }
    }).slice(0, 10);

  return normalizedData;
}

async function jsonAPIQuery(queryString, key) {
  const query = queryString + (key !== "" && key !== null && key !== undefined ? `&api_key=${key}` : "");
  const result = await fetch(query);
  const serializedResult = await result.json();
  const queryData = await deserialize(serializedResult);

  return queryData;
}