export default class CountryMapper {
    static toDTO(data) {
        return {
            id: data.id,
            name: data.name
        }
    }
}
