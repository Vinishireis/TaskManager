import React from 'react';

const DeleteAlert = ({ content, onDelete, onCancel }) => {
  return (
    <div className="p-4">
      <p className="text-sm text-gray-600 mb-6">{content}</p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center gap-1.5 cursor-pointer"
          onClick={onDelete}
        >
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;