"use client"

import Daily from '@/components/daily/daily';
import { GameSettingsProvider } from '@/contexts';
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const params= useParams();
  return (
    <GameSettingsProvider puzzleId={Number(params.puzzleId)}>
        <Daily />
    </GameSettingsProvider>
  )
}

export default page
