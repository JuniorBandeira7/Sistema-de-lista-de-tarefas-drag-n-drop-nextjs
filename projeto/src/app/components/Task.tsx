import { Draggable } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Button from "./Button"

interface TaskProps {
    task: {
        id: number
        name: string
        cost: number
        dateLimit: Date
        order: number
        userId: number
    },
    index: number
    className: string
    children: React.ReactNode 
  }

export function Task({ task, index, className, children }: TaskProps){

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
          {(provided) =>(
            <li key={task.id} className={`${className}`} ref={provided.innerRef} 
              {...provided.draggableProps} 
              {...provided.dragHandleProps}
            >
            {children}
          </li>
          )}
        </Draggable>
    )
}