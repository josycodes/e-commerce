import CollectionService from "../../../services/collection.service.js";
import CollectionMapper from "../../../mappers/collection.mapper.js";
import ResponseLib from "../../../libs/Response.lib.js";

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