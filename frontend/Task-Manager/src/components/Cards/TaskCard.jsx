import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
import "moment/locale/pt-br"; // Importa locale brasileiro

moment.locale('pt-br'); // Configura moment para português

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "Em Progresso":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completo":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Baixo":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Médio":
        return "text-amber-500 bg-amber-50 border border-amber-500/10"; // Corrigido typo em "text-amber"
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  const formatDate = (date) => {
    return date ? moment(date).format('DD/MM/YYYY') : '--/--/----';
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-2 mb-3">
        <div className={`text-xs font-medium ${getStatusTagColor()} px-3 py-0.5 rounded-full`}>
          {status}
        </div>
        <div className={`text-xs font-medium ${getPriorityTagColor()} px-3 py-0.5 rounded-full`}>
          {priority}
        </div>
      </div>

      <div className={`pl-3 border-l-[3px] mb-4 ${
        status === "Em Progresso"
          ? "border-cyan-500"
          : status === "Completo"
          ? "border-indigo-500"
          : "border-violet-500"
      }`}>
        <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-3 line-clamp-3">
          {description}
        </p>

        {todoChecklist?.length > 0 && (
          <p className="text-xs text-gray-500 mb-2">
            Tarefas concluídas:{" "}
            <span className="font-medium">
              {completedTodoCount || 0} de {todoChecklist.length}
            </span>
          </p>
        )}

        <Progress progress={progress} status={status} />
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="space-y-1">
          <div>
            <label className="text-gray-400">Criado em: </label>
            <span className="text-gray-600">
              {formatDate(createdAt)}
            </span>
          </div>
          <div>
            <label className="text-gray-400">Vencimento: </label>
            <span className="text-gray-600">
              {formatDate(dueDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AvatarGroup avatars={assignedTo || []} />
          
          {attachmentCount > 0 && (
            <div className="flex items-center text-gray-500">
              <LuPaperclip className="mr-1" size={14} />
              <span>{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;