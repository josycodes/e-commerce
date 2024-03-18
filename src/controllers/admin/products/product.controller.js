import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";

export const create = async (req, res, next) => {
    const collectionService = new CollectionService();
    try {
        const { name, slug, description } = req.body;

        const createdCollection = await collectionService.createCollection({
            name, slug, description
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Collection Created",
            data: CollectionMapper.toDTO(createdCollection)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}