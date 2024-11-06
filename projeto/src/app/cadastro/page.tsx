"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "../components/Button"

export default function RegisterForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleRegister = async () => {
        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
            })

            if (response.ok) {
                console.log("Usuário cadastrado com sucesso!")
                router.push("/login")
            } else {
                const data = await response.json()
                alert(data.message || "Erro ao cadastrar usuário")
                console.log(data.message || "Erro ao cadastrar usuário")
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center bg-gray-800 p-8 rounded-lg w-96">
                <h1 className="text-white text-3xl mb-6">Cadastrar</h1>
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
                />
                <Button onClick={handleRegister} className="w-full bg-blue-600 text-white"> Cadastrar </Button>
            </div>
        </div>
    )
}
