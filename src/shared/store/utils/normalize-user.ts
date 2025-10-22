import { User, UserApi } from "@model/auth";

const normalizeUser = (from: UserApi): User => {
    return ({
        id: from.id,
        username: from.username,
        email: from.email,
        confirmed: from.confirmed,
        blocked: from.blocked,
        createdAt: new Date(from.createdAt),
        updatedAt: new Date(from.updatedAt)
    });
};

export default normalizeUser;