import React from 'react';

const TaskListTable = ({tableData}) => {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Completo': return 'bg-green-100 text-green-500 border border-green-200';
            case 'Pendente': return 'bg-red-100 text-red-500 border border-red-200';
            case 'Em Progresso': return 'bg-orange-100 text-orange-500 border border-orange-200';
            default: return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'Alto': return 'bg-red-100 text-red-500 border border-red-200';
            case 'Médio': return 'bg-orange-100 text-orange-500 border border-orange-200';
            case 'Baixo': return 'bg-green-100 text-green-500 border border-green-200';
            default: return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Sao_Paulo'
        };
        return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
    };

    return (
      <div className='overflow-x-auto p-0 rounded-lg mt-3'>
        <table className='min-w-full'>
            <thead>
                <tr className='text-left'>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Nome</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Status</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Prioridade</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell'>Criado Desde</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((task) => (
                    <tr key={task.id} className='border-t border-gray-200'>
                        <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.title}</td>
                        <td className='py-4 px-4'>
                            <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>
                                {task.status}
                            </span>
                        </td>
                        <td className='py-4 px-4'>
                            <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>
                                {task.priority}
                            </span>
                        </td>
                        <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>
                            {formatDate(task.createdAt)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    );
};

export default TaskListTable;