export default class CollectionMapper {
    static toDTO(data) {
        return {
            collection: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                description: data.description
            }
        }
    }
}
