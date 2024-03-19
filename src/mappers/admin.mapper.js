export default class AdminMapper {
    static toDTO(data) {
        return {
            user: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email
            },
            token: data.token ? data.token : null
        }
    }
}
