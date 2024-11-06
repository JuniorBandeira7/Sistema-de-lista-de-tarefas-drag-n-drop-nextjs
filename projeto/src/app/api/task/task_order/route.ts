import { NextRequest, NextResponse } from "next/server";
import prisma from "@db/db";

// helpers
const getUserByToken = require('../../../helpers/get-user-by-token');
const getToken = require('../../../helpers/get-token');

// Atualiza a ordem das tarefas
export async function PATCH(req: NextRequest) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    
    // Recebe a lista de tarefas com a nova ordem
    const { tasks } = await req.json();
    
    if (!tasks || tasks.length === 0) {
        return NextResponse.json(
            {
                message: "Nenhuma tarefa foi recebida para atualização.",
            },
            {
                status: 400,
            }
        );
    }

    try {
        // Começa uma transação para garantir que todas as atualizações sejam feitas com sucesso
        const updatedTasks = [];

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            // Atualiza a tarefa com a nova ordem
            const updatedTask = await prisma.task.update({
                where: {
                    id: task.id,
                },
                data: {
                    order: task.order, // A nova ordem
                },
            });

            updatedTasks.push(updatedTask);
        }

        return NextResponse.json({
            message: "Ordem das tarefas atualizada com sucesso.",
            tasks: updatedTasks,
        });
    } catch (error) {
        console.error("Erro ao atualizar a ordem das tarefas:", error);
        return NextResponse.json(
            {
                message: "Erro ao atualizar a ordem das tarefas.",
                error,
            },
            {
                status: 500,
            }
        );
    }
}
