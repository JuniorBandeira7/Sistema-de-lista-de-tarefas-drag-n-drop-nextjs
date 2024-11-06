import { NextRequest, NextResponse } from "next/server";

import prisma from "@db/db"

// helpers
const getUserByToken = require('../../helpers/get-user-by-token')
const getToken = require('../../helpers/get-token')

// CreateTask
export async function POST(req: Request) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    const { name, cost, dateLimit } = await req.json()

    try {
         // Conta quantas tarefas o usuário já possui
         const taskCount = await prisma.task.count({
            where: {
                userId: user.id,
            },
        });

        // Define a ordem como o numero de tarefas que o usuario já possui + 1
        const order = taskCount + 1;

        // Verifica se já existe uma tarefa com o mesmo userId e name
        const existingTask = await prisma.task.findFirst({
            where: {
                userId: user.id,
                name: name,
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

        const task = await prisma.task.create({
            data:{
                name,
                cost,
                dateLimit,
                order,
                userId: user.id
                }
            });
            console.log(task)
        return NextResponse.json({message: "OK", user, task})
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error",
                error,
            },
            {
                status: 500,
            }
        );
    }
}

// getTasksByUser
export async function GET(req: Request){
    // Busca o token e depois busca o usuario pelo token
    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
        const tasks = await prisma.task.findMany({
            where:{
                userId: user.id
            }
        })
        return NextResponse.json({message: "OK", tasks})
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error",
                error,
            },
            {
                status: 500
            }
        )
    }
}
