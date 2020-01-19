import Serializer from "jsonapi-serializer";
import moment from "moment";

export default async function fetchData(station) {
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
&fields[trip]=direction_id
&api_key=26078f0cbe9d4b31a54505e0029e07ad`;
    const queryResult = await fetch(query);
    const queryResultRaw = await queryResult.json();
    const queryData = await new Serializer.Deserializer().deserialize(queryResultRaw);
    const normalizedData = queryData.filter(item => item.route.type === 2 && item["departure-time"] !== null)
    .slice(10)
    .map(item => {
        return {
        "key": item.id,
        "time": item.prediction === null ? item["departure-time"] : item.prediction["departure-time"],
        "destination": item.route["direction-destinations"][0],
        "trackNumber": item.stop["platform-code"] === null ? "TBD" : item.stop["platform-code"],
        "status": item.prediction === null ? "Pending" : item.prediction.status
        }
    });

    normalizedData.forEach(item => {
    console.log(item);
    });

    return normalizedData;
}