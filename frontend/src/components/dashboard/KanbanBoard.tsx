"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
interface Task {
  _id: string;
  title: string;
  status: string;
  slaStatus: "SAFE" | "AT_RISK" | "OVERDUE";
}

interface Props {
  tasks: Task[];
  reload: () => void;
}



export default function KanbanBoard({ tasks, reload }: Props) {

  const columns = {
    TODO: tasks.filter(t => t.status === "CREATED" || t.status === "ASSIGNED"),
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
    REVIEW: tasks.filter(t => t.status === "IN_REVIEW"),
    DONE: tasks.filter(t => t.status === "APPROVED" || t.status === "COMPLETED"),
  };

const statusMap: Record<string, string> = {
  TODO: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "IN_REVIEW",
  DONE: "APPROVED",
};

const handleDragEnd = async (result: any) => {

  if (!result.destination) return;

  if (result.source.droppableId === result.destination.droppableId) {
    return;
  }

  const taskId = result.draggableId;

  const newStatus =
    statusMap[result.destination.droppableId as keyof typeof statusMap];

  try {

    await api.patch(`/tasks/${taskId}/status`, {
      status: newStatus
    });

    reload();

  } catch (err: any) {

    console.error("Task move failed:", err?.response?.data);

  }

};
useEffect(() => {

  socket.on("TASK_UPDATED", () => {
    reload();
  });

  return () => {
    socket.off("TASK_UPDATED");
  };

}, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>

      <div className="grid grid-cols-4 gap-4 mt-6">

        {Object.entries(columns).map(([columnId, columnTasks]) => (

          <Droppable droppableId={columnId} key={columnId}>

            {(provided) => (

              <div
                className="bg-card rounded-xl p-4 min-h-[350px]"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h3 className="font-semibold mb-4">
                  {columnId}
                </h3>

                {(columnTasks as Task[]).map((task, index) => (

                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >

                    {(provided) => (

                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 rounded-lg shadow mb-3 text-sm
                        ${
                          task.slaStatus === "OVERDUE"
                            ? "bg-red-100"
                            : task.slaStatus === "AT_RISK"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                        }`}
                      >

                        {task.title}

                      </div>

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}

              </div>

            )}

          </Droppable>

        ))}

      </div>

    </DragDropContext>
  );
}