export default class UserMapper {
    static toDTO(data) {
        return {
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone
            },
            token: data.token ? data.token : null
        }
    }
}
