import React from 'react'

const Progress = ({progress, status}) => {
    const getColor = () => {
      switch (status) {
        case 'Em Progresso':
         return 'text-cyan-500 bg-cyan-500 border border-cyan-500/10'
         
        case 'Completo':
         return 'text-indigo-500 bg-indigo-500 borde border-indigo-500/10'
         
        default:
            return 'text-violet-500 bg-violet-500 border border-violet-500/10' 
      }
    }
  return (
    <div className=''>
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{width: `${progress}%`}}>
        </div>
    </div>
  )
}

export default Progress