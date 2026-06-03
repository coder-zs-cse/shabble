import React from 'react'

interface PuzzleCardProps{
    id: number;
    date: string;
    stars?: number | 0;
    attempted: boolean;
}

const PuzzleCard = ({id, date, stars, attempted}: PuzzleCardProps) => {
  const formattedDate= new Date(date).toLocaleDateString("en-GB",{
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
  return (
    <div className='bg-gray-100 rounded-3xl p-6 flex justify-between items-center w-full'>
      <div>
        <h1 className='text-4xl font-bold text-black mb-2'>#{id}</h1>
        <p className='text-black'>{formattedDate}</p>
      </div>

      {attempted ? (
        <div>{stars && stars > 0 ? '⭐'.repeat(stars) : '❌'}</div>
      ): (
        <div className='text-gray-400'>UNATTEMPTED</div>
      )}
    </div>
  )
}

export default PuzzleCard
