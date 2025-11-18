import React from 'react'
import LOGO from '../../../public/logo.png'

const EmptyCard = ({ message }) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <img src={LOGO} alt="No notes"  className='w-22 h-22 bg-cyan-200/50 p-3 rounded-full'/>

      <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
        {message}
      </p>
    </div>
  )
}

export default EmptyCard
