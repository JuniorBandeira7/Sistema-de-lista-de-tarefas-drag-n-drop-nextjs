const jwt = require('jsonwebtoken')
import prisma from "@db/db"

const getUserByToken = async (token) => {
    if (!token) {
        return { status: 401, message: "Acesso Negado!" }
    }

    try {
        const decoded = jwt.verify(token, 'secret')
        const userId = decoded.id

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return { status: 404, message: "Usuário não encontrado!" }
        }

        return user
    } catch (error) {
        return { status: 401, message: "Token inválido!" }
    }
}

module.exports = getUserByToken
