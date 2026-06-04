import React from 'react'
import { Icons, Title, Divider, Text } from '@/components';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { instructions } from '@/constants';

interface HelpProps {
  setShowHelp: (showHelp: boolean) => void;
}
function Help({ setShowHelp }: HelpProps) {

  return (
    <div
      className='fixed inset-0 w-full h-full flex justify-center items-center z-50'
    >
      <div className='bg-black/50 flex-1 h-full' onClick={() => setShowHelp(false)}></div>
      <div className='max-w-[730px] w-full h-full animate-slide-up border-t border-gray-light'>
        <div className='h-[72px] opacity-0 debug' onClick={() => setShowHelp(false)} />
        <div className='h-[calc(100%-72px)] glass'>

          <nav className='relative flex items-center w-full h-[72px]'>
            <Title
              title='HOW TO PLAY?'
              className='text-center flex-1'
            />
            <div className='absolute right-0 top-1/2 -translate-y-1/2'>
              <Icons
                icon={<IoIosCloseCircleOutline className='w-[30px] h-[30px] md:w-[40px] md:h-[40px]' />}
                className='mx-2 bg-white'
                onClick={() => setShowHelp(false)}
              />
            </div>
          </nav>
          <Divider isVertical={false} className='mb-4' />

          <div className='flex flex-col overflow-y-auto h-[calc(100%-100px)] w-full hide-scrollbar px-8'>
            {instructions.map((section, sectionIndex) => (
              <section className='flex flex-col justify-center gap-4 w-full' key={sectionIndex}>
                {section.map((text, textIndex) => (
                  <Text key={textIndex}>{text}</Text>
                ))}
                <Divider isVertical={false} className='my-4' />
              </section>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-black/50 flex-1 h-full' onClick={() => setShowHelp(false)}></div>

    </div>
  )
}

export { Help }