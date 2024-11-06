const jwt = require('jsonwebtoken')
const getToken = require('./get-token')
const prisma = require('@db/db') 


const checkToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Acesso Negado!" })
    }

    const token = getToken(req)

    if (!token) {
        return res.status(401).json({ message: "Acesso Negado!" })
    }

    try {
        const verified = jwt.verify(token, 'secret')
        req.user = verified

        const user = await prisma.user.findUnique({
            where: { id: verified.id }
        })

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(400).json({ message: "Token inválido" })
    }
}

module.exports = checkToken
