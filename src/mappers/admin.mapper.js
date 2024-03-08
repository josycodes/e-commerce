export default class AdminMapper {
    static toDTO(data) {
        return {
            user: {
                id: data.id,
                name: data.name,
                email: data.email
            },
            token: data.token
        }
    }
}
