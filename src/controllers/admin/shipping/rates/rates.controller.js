//
// export const rates1 = async(req, res, next) => {
//     const client = new Client();
//     let locations;
//     const coordinates = locations.map(location => `${location.latitude},${location.longitude}`);
//     const directions = []
//     for (let i = 0; i < coordinates.length; i += 1) {
//         if (!coordinates[i + 1]) continue;
//         directions.push({origin: coordinates[i], destination: coordinates[i + 1]})
//     }
//     const responses = await Promise.all(directions.map(direction => {
//         return client.directions({
//             params: {
//                 key: process.env.GOOGLE_MAPS_API_KEY as string,
//                 origin: direction.origin,
//                 destination: direction.destination,
//                 region: 'NG',
//                 departure_time: surge_reason ? undefined : moment().utc().valueOf()
//             }
//         })
//     }));
//     let distance = 0, duration = 0, duration_in_traffic = 0;
//     for (const response of responses) {
//         LoggerLib.log('directions', response.data)
//         for (const route of response.data.routes) {
//             for (const leg of route.legs) {
//                 distance += leg.distance.value
//                 duration += leg.duration.value
//                 duration_in_traffic += (leg.duration_in_traffic?.value ?? leg.duration.value)
//             }
//         }
//     }
//     let minimum_price = Number(await UtilsService.getConfiguration(CONFIG_OPTIONS.MIN_ORDER_PRICE, 1000))
//     let km_price = Number(await UtilsService.getConfiguration(CONFIG_OPTIONS.PRICE_PER_KM, 70))
//     let distance_fare = Math.max(((distance - 4000) / 1000 * km_price), 0)
//     let amount = minimum_price + distance_fare
// // amount = amount * directions.length // multiply min amount by
//     const high_traffic_surge = await UtilsService.getConfiguration(CONFIG_OPTIONS.HIGH_TRAFFIC_SURGE, 1.2)
//     if (duration_in_traffic > duration) {
//         surge = high_traffic_surge;
//         surge_reason = 'Increased Traffic Conditions'
//     }
// }
//
// export const rates3 = async(req, res, next) => {
//
//     const client = new Client();
//     const coordinates = locations.map(location => `${location.latitude},${location.longitude}`);
//     const directions = []
//     for (let i = 0; i < coordinates.length; i += 1) {
//         if (!coordinates[i + 1]) continue;
//         directions.push({origin: coordinates[i], destination: coordinates[i + 1]})
//     }
//     const responses = await Promise.all(directions.map(direction => {
//         return client.directions({
//             params: {
//                 key: process.env.GOOGLE_MAPS_API_KEY as string,
//                 origin: direction.origin,
//                 destination: direction.destination,
//                 region: 'NG',
//                 departure_time: surge_reason ? undefined : moment().utc().valueOf()
//             }
//         })
//     }));
// }
//
//
// export const rates2 = async(req, res, next) => {
//
//     let distance = 0, duration = 0, duration_in_traffic = 0;
//     for (const response of responses) {
//         LoggerLib.log('directions', response.data)
//         for (const route of response.data.routes) {
//             for (const leg of route.legs) {
//                 distance += leg.distance.value
//                 duration += leg.duration.value
//                 duration_in_traffic += (leg.duration_in_traffic?.value ?? leg.duration.value)
//             }
//         }
//     }
//
//     let max_kg_order_distance = Number(await UtilsService.getConfiguration(CONFIG_OPTIONS.MAX_KG_ORDER_DISTANCE, 1000))
//     if ((distance / 1000) > max_kg_order_distance) {
//         throw new BadRequest(`Only intra-state drop offs allowed. ${(distance / 1000)}`)
//     }
//
// // TODO: - optimize - db or config
//     let amount = 2000;
//     if (kg > 5 && kg < 501) {
//         amount = 30000
//     } else if (kg > 500 && kg < 1001) {
//         amount = 35000
//     } else if (kg > 1000) {
//         amount = 40000
//     }
//
//     return {
//         base_price: Math.round((amount) / 100) * 100,
//         amount: Math.round((amount * surge) / 100) * 100,
//         distance,
//         token: this.generateReference(20),
//         surge_multiple: surge,
//         surge_reason,
//         locations: JSON.stringify(locations),
//         premium_charge: 0,
//         distance_fare: 0,
//     }
// }
//
