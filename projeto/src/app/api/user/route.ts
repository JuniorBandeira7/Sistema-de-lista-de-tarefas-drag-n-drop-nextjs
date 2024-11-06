import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
//import jwt from 'jsonwebtoken'

import prisma from "@db/db"

// helpers
const createUserToken = require('../../helpers/create-user-token')
const getUserByToken = require('../../helpers/get-user-by-token')
const getToken = require('../../helpers/get-token')

export async function POST(req: Request){
    const {name, email, password} = await req.json()

    // validações
    if(!name){
        return NextResponse.json(
            {
                message: 'o nome é obrigatório'
            },
            {
                status: 422
            }
        )
    }
    if(!email){
        return NextResponse.json(
            {
                message: 'O email é obrigatório'
            },
            {
                status: 422
            }
        )
    }
    if(!password){
        return NextResponse.json(
            {
                message: 'a password é obrigatória'
            },
            {
                status: 422
            }
        )
    }

    // Verificar se usuario já existe
    const userExists = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

    if(userExists){
        return NextResponse.json(
            {
                message: 'Email já cadastrado'
            },
            {
                status: 422
            }
        )
    }

    // Criar password com criptografia
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    
    try {
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: passwordHash
            }
        })
        
        const token = await createUserToken(user)
        return Response.json({message: "ok", user, token}) 
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