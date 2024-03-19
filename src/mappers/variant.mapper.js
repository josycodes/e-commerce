export default class VariantMapper {
    static toDTO(data) {
        return {
            data: {
                id: data.id,
                type: data.type,
                value: data.value
            }
        }
    }
}
