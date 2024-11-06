import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

// helpers
const getUserByToken = require('../../../../helpers/get-user-by-token')
const getToken = require('../../../../helpers/get-token')


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const token = getToken(req)
    const user = await getUserByToken(token)
    const { id } = await params  // Obtendo o parâmetro da URL corretamente

    // Compara o id do usuário com o parâmetro da URL
    if (user.id.toString() !== id) {
        return NextResponse.json({ message: "Acesso negado!" }, { status: 403 })
    }

    return NextResponse.json({ message: "Token válido", user }, { status: 200 })
}
