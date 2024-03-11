import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import CollectionService from "../../../services/collection.service.js";
import CollectionMapper from "../../../mappers/collection.mapper.js";

export const create = async (req, res, next) => {
    const collectionService = new CollectionService();
    try {
        const { name, slug, description } = req.body;

        const createdCollection = await collectionService.createCollection({
            name, slug, description
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Login Successful",
            data: CollectionMapper.toDTO(createdCollection)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}

export const getAll = async (req, res, next) => {
    const collectionService = new CollectionService();
    try {
        const collections = await collectionService.getAllCollections();
        const collectionsDTO = await Promise.all(collections.map(async (collection) => {
            return CollectionMapper.toDTO(collection);
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Collections Loaded",
            data: collectionsDTO
        });
    } catch (error) {
        next(error)
    }
}

export const edit = async (req, res, next) => {
    const collectionService = new CollectionService();
    try {
        const { collection_id } = req.params.collection_id;
        const { name, slug, description } = req.body;

        //Validate collection_id
        const collection = await collectionService.findCollection({id: collection_id});
        if(!collection){
            throw new ErrorLib('Invalid Collection', 400);
        }

        const updated_collection = await collectionService.updateCollection({ id: collection.id }, { name, slug, description })

        return new ResponseLib(req, res).json({
            status: true,
            message: "Collection Updated",
            data: CollectionMapper.toDTO(updated_collection)
        });
    } catch (error) {
        next(error)
    }
}

/**
 * Todo: Figure out where products under removed collections would go to
 * @param req
 * @param res
 * @param next
 * @returns {Promise<ResponseLib|*>}
 */
export const remove = async (req, res, next) => {
    const collectionService = new CollectionService();
    try {
        const { collection_id } = req.params.collection_id;

        //Validate collection_id
        const collection = await collectionService.findCollection({id: collection_id});
        if(!collection){
            throw new ErrorLib('Invalid Collection', 400);
        }

        //Remove Collection
        await collectionService.deleteCollection({id: collection.id});

        return new ResponseLib(req, res).json({
            status: true,
            message: "Collection Successful"
        });
    } catch (error) {
        next(error)
    }
}
