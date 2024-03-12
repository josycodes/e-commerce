export default class CategoryMapper {
    static toDTO(data) {
        return {
            user: {
                id: data.id,
                name: data.name,
                description: data.description
            }
        }
    }
}
