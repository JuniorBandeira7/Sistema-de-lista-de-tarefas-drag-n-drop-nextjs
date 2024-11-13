"use client"
import Header from "../app/components/Header"
import Button from './components/Button'
import Link from 'next/link'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { Task } from "./components/Task"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

interface Task {
  id: number
  name: string
  cost: number
  dateLimit: Date
  order: number
  userId: number
}

export default function Home() {
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editedTask, setEditedTask] = useState<Partial<Task>>({})
  const router = useRouter()

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  // Função para salvar a ordem no banco de dados
  const saveOrder = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const updatedTasks = tasks.map((task, index) => ({
        ...task,
        order: index + 1, // Ajusta a ordem para começar de 1, 2, 3, etc.
      }))

      // Envia as ordens para a API para salvar no banco de dados
      const response = await fetch('/api/task/task_order', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: updatedTasks }),
      })

      if (response.ok) {
        alert("Ordem salva com sucesso!")
        fetchTasks() // Chama a função para buscar as tarefas novamente após a atualização
      } else {
        alert("Erro ao salvar a ordem")
      }
    } catch (error) {
      console.error("Erro ao salvar a ordem:", error)
    }
  }

  // Função chamada após o arrasto
  function onDragEnd(result: any) {
    if (!result.destination) return

    const items = reorder(tasks, result.source.index, result.destination.index)
    setTasks(items)

    // Ajustar as ordens para garantir que sejam consecutivas (1, 2, 3, etc.)
    const reorderedTasks = items.map((task, index) => ({
      ...task,
      order: index + 1,
    }))
    setTasks(reorderedTasks)
  }

  useEffect(() => {
    const fetchUserTasks = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch('/api/task', {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        const data = await response.json()

        if (response.ok) {
          // Ordena as tarefas pela ordem de forma crescente
          const sortedTasks = data.tasks.sort((a: Task, b: Task) => a.order - b.order)
          setTasks(sortedTasks)
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error)
      }
    }

    fetchUserTasks()
  }, [])

  // Função para buscar tarefas atualizadas após salvar a ordem
  const fetchTasks = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch('/api/task', {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (response.ok) {
        // Ordena as tarefas pela ordem de forma crescente
        const sortedTasks = data.tasks.sort((a: Task, b: Task) => a.order - b.order)
        setTasks(sortedTasks)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    }
  }

  const formatDate = (date: Date) => new Date(date).toLocaleDateString()

  const handleEdit = (taskId: number) => {
    setEditingTaskId(taskId)
    const taskToEdit = tasks.find(task => task.id === taskId)
    if (taskToEdit) {
      setEditedTask({ ...taskToEdit })
    }
  }

  const handleDelete = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      if (confirm("Tem certeza que quer excluir?")) {
        const response = await fetch(`/api/task/${taskId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        })

        setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId))
        alert("Tarefa excluída com sucesso!")
      }
    } catch (error) {
      alert("Erro ao excluir tarefa")
      console.error(error)
    }
  }

  const handleConfirmEdit = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      if (editedTask.name == "") {
        alert("O nome não pode ser vazio")
        return
      }

      if (editedTask.cost == undefined || Number.isNaN(editedTask.cost)) {
        alert("Informe o custo!")
        return
      }

      if (editedTask.cost > Number.MAX_SAFE_INTEGER) {
        alert("Número de custo muito alto, por favor tente um número menor")
        return
      }

      if (editedTask.cost < 0) {
        alert("Informe valores positivos para o custo!")
        return
      }

      const response = await fetch(`/api/task/${taskId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTask),
      })

      if (response.ok) {
        setTasks(prevTasks => prevTasks.map(task =>
          task.id === taskId ? { ...task, ...editedTask } : task
        ))
        setEditingTaskId(null)
        setEditedTask({})
      } else {
        alert("Erro ao salvar alterações.")
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedTask(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) : value
    }))
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks" direction="vertical" type="list">
            {(provided) => (
              <ul className="list-group"
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index}className={task.cost >= 1000
                    ? "list-group-item d-flex justify-content-between align-items-center bg-red-900 text-white p-3"
                    : "list-group-item d-flex justify-content-between align-items-center bg-gray-800 text-white p-3"}>
                    <div>
                      {editingTaskId === task.id ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            value={editedTask.name || ''}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                          />
                          <input
                            type="number"
                            name="cost"
                            value={editedTask.cost}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                          />
                          <input
                            type="date"
                            name="dateLimit"
                            value={editedTask.dateLimit ? new Date(editedTask.dateLimit).toISOString().split('T')[0] : ''}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                          />
                        </>
                      ) : (
                        <>
                          <p className="mb-1"><strong>Id: </strong>{task.id}</p>
                          <h2 className="mb-1"><strong>{task.name}</strong></h2>
                          <p className="mb-1"><strong>Custo:</strong> R$ {Number(task.cost).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className="mb-1"><strong>Data Limite:</strong> {formatDate(task.dateLimit)}</p>
                        </>
                      )}
                    </div>
                    <div>
                      {editingTaskId === task.id ? (
                        <Button onClick={() => handleConfirmEdit(task.id)}>
                          Confirmar
                        </Button>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(task.id)} className="btn btn-link text-info me-2">
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button onClick={() => handleDelete(task.id)} className="btn btn-link text-danger">
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </Task>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {/* Botão para salvar a ordem */}
        <div className="text-center mt-4">
          <Button onClick={saveOrder}>
            Salvar Ordem
          </Button>
        </div>

        {/* Botão para criar uma nova tarefa */}
        <div className="text-center mt-4">
          <Link href={"/criar_tarefa"}>
            <Button>
              Criar Nova Tarefa
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
