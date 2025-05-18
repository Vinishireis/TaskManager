import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from "react-hot-toast"
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropDown from '../../components/Inputs/SelectDropdown'
import SelectUsers from "../../components/Inputs/SelectUsers"
import TodoListInput from '../../components/Inputs/TodoListInput'
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput'

const CreateTask = () => {

  const location = useLocation()
  const { taskId } = location.state || {}
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: "",  // Corrigido: tile → title
    description: "",
    priority: "Baixo",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  })

  const [currentTask, setCurrentTask] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }))
  }

  const clearData = () => {
    //Reset Form
    setTaskData({
      title: "",  // Corrigido: tile → title
      description: "",
      priority: "Baixa",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    })
  }

  //Create Task
  const createTask = async () => {}

  //Update Task
  const updateTask = async () => {}

  const handleSubmit = async () => {}

  // get Task info by ID
  const getTaskDetailsByID = async () => {}

  //Delete Task
  const deleteTask = async () => {}

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {taskId ? "Atualização da Tarefa" : "Tarefa Criada"}
              </h2>

              {taskId && (
                <button 
                  className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer' 
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className='text-base' /> Delete 
                </button>
              )}
            </div>

            <div className='mt-4'>
              <label className='text-xs font-medium'>Título da Tarefa</label>
              <input 
                placeholder='Nome da Tarefa'
                className='form-input'
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)  // Corrigido: adicionado target.value
                }
              />
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Descrição
              </label>
              <textarea 
                placeholder='Descreva a Tarefa'
                className='form-input'
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }              
              />
            </div>

            <div className='grid grid-cols-12 gap-4 mt-2'>
              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>
                  Prioridade
                </label>
                <SelectDropDown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}  // Corrigido: Priority → priority
                  placeholder="Selecione a Prioridade"
                />
              </div>

              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>
                  Data de Vencimento
                </label>
                <input
                  placeholder='Data de Vencimento'
                  className='form-input'
                  value={taskData.dueDate}
                  onChange={({ target }) => 
                    handleValueChange("dueDate", target.value)
                  }
                  type='date'
                />
              </div>

              <div className='col-span-12 md:col-span-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Atribuído a
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}  // Corrigido: SelectedUSers → selectedUsers
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value)
                  }}
                />
              </div> 
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                TODO Checklist
              </label>

              <TodoListInput 
              todoList={taskData?.todoChecklist}
              setTodoList={(value) => 
                handleValueChange("todoChecklist", value)
              }
              />
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Adicionar Anexos
              </label>

              <AddAttachmentsInput
              attachments={taskData?.attachments}
              setAttachments={(value) =>
                handleValueChange("attachments", value)
              }
              />
            </div>

            {error && (
              <p className='text-x font-medium text-red-500 mt-5'>{error}</p>
            )}
            <div className='flex justify-end mt-7'>
              <button
               className='add-btn'
               onClick={handleSubmit}
               disabled={loading}
              >
                {taskId ? "UPDATE TASK": "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateTask