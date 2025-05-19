import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Todas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "Todas" ? "" : filterStatus,
        },
      });

      if (!response.data) {
        throw new Error("Resposta da API inválida");
      }

      setAllTasks(response.data.tasks || []);

      const statusSummary = response.data.statusSummary || {};
      setTabs([
        { label: "Todas", count: statusSummary.all || 0 },
        { label: "Pendente", count: statusSummary.pendingTasks || 0 },
        { label: "Em Progresso", count: statusSummary.inProgressTasks || 0 },
        { label: "Completo", count: statusSummary.completedTasks || 0 },
      ]);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setError(error.message || "Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`); // Corrigido o path de navegação
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Gerenciar Tarefas">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-medium">Minhas Tarefas</h2>

          <TaskStatusTabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
            disabled={loading}
          />
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
            {error}
            <button 
              onClick={getAllTasks}
              className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
            >
              Tentar novamente
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : allTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                createdAt={task.createdAt}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo?.map(user => user?.profileImageUrl) || []}
                attachmentCount={task.attachments?.length || 0}
                completedTodoCount={task.completedTodoCount || 0}
                todoChecklist={task.todoChecklist || []}
                onClick={() => handleTaskClick(task._id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded text-center py-10 text-gray-500">
            Nenhuma tarefa encontrada
            {filterStatus !== "Todas" && (
              <button
                onClick={() => setFilterStatus("Todas")}
                className="mt-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm block mx-auto"
              >
                Mostrar todas as tarefas
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;