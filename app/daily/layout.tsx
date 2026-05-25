import React from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Shabble",
  description: "Shabble is a shape guessing puzzle game. Play daily to get a new shape to guess. Solve with as less attempts as possible."
};

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-screen h-screen min-h-screen bg-gray-200'>
      <div className='w-full h-full flex justify-center items-center'>
        <div className='max-w-[730px] w-full h-full bg-white'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default layout