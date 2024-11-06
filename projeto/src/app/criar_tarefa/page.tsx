"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import Button from "../components/Button"

export default function CreateTask() {
  const [name, setName] = useState("")
  const [cost, setCost] = useState(0)
  const [dateLimit, setDateLimit] = useState("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const formattedDateLimit = new Date(dateLimit).toISOString()

      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          cost,
          dateLimit: formattedDateLimit,
        }),
      })

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        alert("Tarefa criada com sucesso!")
        router.push("/")
      } else {
        setError(data.message || "Erro ao criar tarefa.")
      }
    } catch (error) {
      setError("Erro ao criar tarefa.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2 className="text-white mb-4">Criar Nova Tarefa</h2>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-md">
          <div className="mb-3">
            <label className="text-white" htmlFor="name">
              Nome da Tarefa
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="text-white" htmlFor="cost">
              Custo
            </label>
            <input
              type="number"
              id="cost"
              className="form-control"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-3">
            <label className="text-white" htmlFor="dateLimit">
              Data Limite
            </label>
            <input
              type="date"
              id="dateLimit"
              className="form-control"
              value={dateLimit}
              onChange={(e) => setDateLimit(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button className="btn btn-primary" type="submit"> Criar tarefa </Button>
        </form>
      </div>
    </>
  )
}
