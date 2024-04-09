import ErrorLib, { BadRequest, NotFound } from "../../../../libs/Error.lib.js";
import ResponseLib from "../../../../libs/Response.lib.js";
import ShippingMethodService from "../../../../services/shipping_method.service.js";
import {SHIPPING_METHODS} from "../../../../config/shipping_method.js";
import ShippingLocationConditionService from "../../../../services/shipping_location_condition.service.js";
import ShippingFlatRateConditionService from "../../../../services/shipping_rate_condition.service.js";
import ShippingMethodMapper from "../../../../mappers/shipping_method.mapper.js";

export const addShippingMethod = async (req, res, next) => {
    const shippingMethodService = new ShippingMethodService();
    const shippingLocationConditionService = new ShippingLocationConditionService();
    const shippingFlatRateConditionService = new ShippingFlatRateConditionService();
    try{
        const {
            name,
            method_type,
            description,
            status,
            conditions
        } = req.body;

        //create Shipping Method
        const shipping_method = await shippingMethodService.addShippingMethod({
            name,
            type: method_type,
            description,
            status,
        });

        //Add Conditions
        if(method_type === SHIPPING_METHODS.LOCATION_BASED){
            await Promise.all(conditions.map(async (condition) => {
                await shippingLocationConditionService.addShippingLocationCondition({
                    shipping_method_id: shipping_method.id,
                    charge: condition.charge,
                    condition: condition.condition,
                    condition_sign: condition.condition_sign,
                    count: condition.count
                })
            }))

        }else if(method_type === SHIPPING_METHODS.FLAT_RATE){
            await Promise.all(conditions.map(async (condition) => {
                await shippingFlatRateConditionService.addShippingFlatRateCondition({
                    shipping_method_id: shipping_method.id,
                    charge: condition.charge,
                    condition: condition.condition,
                    condition_sign: condition.condition_sign,
                    count: condition.count
                })
            }))
        }
        const method_conditions = await shippingMethodService.getShippingMethodConditions(method_type, {
            shipping_method_id: shipping_method.id
        })

        return new ResponseLib(req, res).json({
            status: true,
            message: "Shipping Method Updated Successfully",
            data: ShippingMethodMapper.toDTO({...shipping_method}, method_conditions)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const updateShippingConditions = async (req, res, next) => {
    const shippingMethodService = new ShippingMethodService();
    const shippingLocationConditionService = new ShippingLocationConditionService();
    const shippingFlatRateConditionService = new ShippingFlatRateConditionService();
    try{
        const { shipping_method_id } = req.params;
        const { conditions } = req.body;

        //create Shipping Method
        const shipping_method = await shippingMethodService.findShippingMethod({id: shipping_method_id});

        //Add Conditions
        if(shipping_method.type === SHIPPING_METHODS.LOCATION_BASED){
            await Promise.all(conditions.map(async (condition) => {
                await shippingLocationConditionService.addShippingLocationCondition({
                    shipping_method_id: shipping_method.id,
                    charge: condition.charge,
                    condition: condition.condition,
                    condition_sign: condition.condition_sign,
                    count: condition.count
                })
            }))

        }else if(shipping_method.type === SHIPPING_METHODS.FLAT_RATE){
            await Promise.all(conditions.map(async (condition) => {
                await shippingFlatRateConditionService.addShippingFlatRateCondition({
                    shipping_method_id: shipping_method.id,
                    charge: condition.charge,
                    condition: condition.condition,
                    condition_sign: condition.condition_sign,
                    count: condition.count
                })
            }))
        }
        const method_conditions = await shippingMethodService.getShippingMethodConditions(shipping_method.type, {
            shipping_method_id: shipping_method.id
        })

        return new ResponseLib(req, res).json({
            status: true,
            message: "Shipping Method Updated Successfully",
            data: ShippingMethodMapper.toDTO({...shipping_method}, method_conditions)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const updateShippingStatus = async (req, res, next) => {
    const shippingMethodService = new ShippingMethodService();
    try{
        const { shipping_method_id } = req.params;
        const { status } = req.body;

        const shipping_method = await shippingMethodService.findShippingMethod({id: shipping_method_id});
        if(!shipping_method) throw new NotFound('Shipping Method not Found');

        const updated_method = await shippingMethodService.updateShippingMethod({id: shipping_method_id}, {status});

        const method_conditions = await shippingMethodService.getShippingMethodConditions(shipping_method.type, {
            shipping_method_id: shipping_method.id
        })

        return new ResponseLib(req, res).json({
            status: true,
            message: "Shipping Method Updated Successfully",
            data: ShippingMethodMapper.toDTO({...updated_method}, method_conditions)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const listMethods = async (req, res, next) => {
    const shippingMethodService = new ShippingMethodService();
    try{
        const shipping_methods = await shippingMethodService.getShippingMethods();
        const MethodsDTO = await Promise.all(shipping_methods.map(async (shipping_method) => {
            return ShippingMethodMapper.toDTO({...shipping_method})
        }) )

        return new ResponseLib(req, res).json({
            status: true,
            message: "Shipping Method Loaded Successfully",
            data: MethodsDTO
            });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

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
