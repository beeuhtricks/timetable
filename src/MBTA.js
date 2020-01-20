import Serializer from "jsonapi-serializer";

const deserializer = new Serializer.Deserializer();

async function deserialize(rawJSONAPIResult) {
  return await deserializer.deserialize(rawJSONAPIResult);
}

export default async function fetchSchedule(station) {
    const query = `https://api-v3.mbta.com/predictions/
?filter[stop]=${station}
&filter[route_type]=2
&fields[prediction]=departure_time,status
&fields[stop]=platform_code
&fields[trip]=headsign,name
&sort=status
&include=stop,trip
`;

  const result = (await jsonAPIQuery(query)).filter(item => item["departure-time"] !== null);

  const normalizedData = result
    .map(item => {
      return {
        "key": item.id,
        "time": item["departure-time"],
        "destination": item.trip.headsign,
        "trainNumber": item.trip.name,
        "trackNumber": item.stop["platform-code"] === null ? "TBD" : item.stop["platform-code"],
        "status": item.status,
      }
    });

  return normalizedData;
}

async function jsonAPIQuery(query) {
  const result = await fetch(query);
  const serializedResult = await result.json();
  const queryData = await deserialize(serializedResult);

  return queryData;
}