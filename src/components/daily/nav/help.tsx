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
      className='fixed inset-0 bg-black/50 flex justify-center items-center z-[10000]'
      onClick={() => setShowHelp(false)}
    >
      <div 
        className='flex flex-col max-w-[730px] w-[90%] h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-slide-up overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <nav className='relative flex items-center w-full h-[72px] shrink-0 border-b border-gray-light dark:border-gray-700'>
          <Title
            title='HOW TO PLAY?'
            className='text-center flex-1 dark:text-white'
          />
          <div className='absolute right-0 top-1/2 -translate-y-1/2'>
            <Icons
              icon={<IoIosCloseCircleOutline className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] dark:text-white' />}
              className='mx-2'
              onClick={() => setShowHelp(false)}
            />
          </div>
        </nav>

        <div className='flex flex-col overflow-y-auto w-full hide-scrollbar px-4 sm:px-8 py-4'>
          {instructions.map((section, sectionIndex) => (
            <section className='flex flex-col justify-center gap-4 w-full' key={sectionIndex}>
              {section.map((text, textIndex) => (
                <Text key={textIndex} className="dark:text-gray-300">{text}</Text>
              ))}
              <Divider isVertical={false} className='my-4' />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Help }