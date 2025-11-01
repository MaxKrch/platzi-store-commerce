import { User, UserApi } from "@model/user";

const normalizeUser = (from: UserApi): User => {
    return ({
        id: from.id,
        email: from.email,
        name: from.name,
        role: from.role,
        avatar: from.avatar
    });
};

export default normalizeUser;