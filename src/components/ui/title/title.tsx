import React from 'react'

interface TitleProps {
    title: string;
    className?: string;
}

function Title({title, className}: TitleProps) {
  return (
    <h1 className={`text-2xl md:text-3xl font-bold ${className}`}>{title}</h1>
  )
}

export default Title
