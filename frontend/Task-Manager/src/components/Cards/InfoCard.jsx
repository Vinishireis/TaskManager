import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
      <div className={`w-2 h-5 ${color} rounded-full`} />
      <div>
        <p className='text-sm md:text-base font-semibold text-gray-800'>{value}</p>
        <p className='text-xs md:text-sm text-gray-500 flex items-center gap-1'>
          {icon && <span className="text-xs">{icon}</span>}
          {label}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;