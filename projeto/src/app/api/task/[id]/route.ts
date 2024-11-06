import { NextRequest, NextResponse } from "next/server";

import prisma from "@db/db"

// helpers
const getUserByToken = require('../../../helpers/get-user-by-token')
const getToken = require('../../../helpers/get-token')

// DeteleTaskById
export async function DELETE(req: Request, { params }: { params: { id: string}}) {
    const { id } = await params

    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
        // Busca a task para poder terr acesso ao userId
        let task = await prisma.task.findUnique({
            where:{
                id: parseInt(id, 10)
            }
        })

        // Verifica se o userId da task é o mesmo do usuário logado
        if(task?.userId !== user.id){
            return NextResponse.json(
                {
                    message: "Acesso negado!"
                },
                {
                    status: 422
                }
            )
        }

        task = await prisma.task.delete({
            where:{
                id: parseInt(id, 10)
            }
        })
        return NextResponse.json({ message: "OK", task})
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error",
                error
            },
            {
                status: 500
            }
        )
    }
}

// updateTaskById
export async function PATCH(req: Request, { params }: { params: { id: string}}) {
    const { id } = await params

    const { name, cost, dateLimit } = await req.json()

    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
        // Busca a task para poder terr acesso ao userId
        let task = await prisma.task.findUnique({
            where:{
                id: parseInt(id, 10)
            }
        })

        // Verifica se o userId da task é o mesmo do usuário logado
        if(task?.userId !== user.id){
            return NextResponse.json(
                {
                    message: "Acesso negado!"
                },
                {
                    status: 422
                }
            )
        }

        // Verifica se já existe uma tarefa com o mesmo userId e name
        const existingTask = await prisma.task.findFirst({
            where: {
                userId: user.id,
                name: name,
                NOT: {
                    id: parseInt(id, 10) // Exclui a própria tarefa para evitar conflito com ela mesma
                }
            }
        })

        if (existingTask) {
            return NextResponse.json(
                {
                    message: "Já existe uma tarefa com o mesmo nome."
                },
                {
                    status: 409
                }
            )
        }

        task = await prisma.task.update({
            where:{
                id: parseInt(id, 10)
            },
            data:{
                name,
                cost,
                dateLimit,
            }
        })
        return NextResponse.json({ message: "OK", task})
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error",
                error
            },
            {
                status: 500
            }
        )
    }
}

