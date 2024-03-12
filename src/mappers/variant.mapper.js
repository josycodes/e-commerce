export default class VariantMapper {
    static toDTO(data) {
        return {
            user: {
                id: data.id,
                type: data.type,
                value: data.value
            }
        }
    }
}
