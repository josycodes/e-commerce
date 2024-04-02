import CategoryService from "../../../services/category.service.js";
import CategoryMapper from "../../../mappers/category.mapper.js";
import ResponseLib from "../../../libs/Response.lib.js";

export const getAll = async (req, res, next) => {
    const collectionService = new CategoryService();
    try {
        const collections = await collectionService.getAllCollections();
        const collectionsDTO = await Promise.all(collections.map(async (collection) => {
            return CategoryMapper.toDTO(collection);
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