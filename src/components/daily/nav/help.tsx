import React from 'react'
import { Icons, Title, Divider, Text } from '@/components';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { instructions } from '@/constants';

interface HelpProps {
  setShowHelp: (showHelp: boolean) => void;
}

function Help({ setShowHelp }: HelpProps) {
  return (
    <div className='fixed inset-0 z-50 flex justify-center bg-black/50'>

      {/* Modal */}
      <div className='relative w-full max-w-[730px] h-screen bg-white flex flex-col animate-slide-up'>

        {/* Header */}
        <nav className='relative flex items-center justify-center min-h-[72px] border-b border-gray-light px-4'>
          <Title
            title='HOW TO PLAY?'
            className='text-center'
          />

          <div className='absolute right-4 top-1/2 -translate-y-1/2'>
            <Icons
              icon={
                <IoIosCloseCircleOutline className='w-[32px] h-[32px] md:w-[40px] md:h-[40px]' />
              }
              className='bg-white'
              onClick={() => setShowHelp(false)}
            />
          </div>
        </nav>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto hide-scrollbar px-8 py-6'>

          {instructions.map((section, sectionIndex) => (
            <section
              key={sectionIndex}
              className='flex flex-col gap-4 w-full'
            >

              {section.map((text, textIndex) => (
                <Text key={textIndex}>
                  {text}
                </Text>
              ))}

              <Divider
                isVertical={false}
                className='my-4'
              />

            </section>
          ))}

        </div>
      </div>

      {/* Background click close */}
      <div
        className='absolute inset-0 -z-10'
        onClick={() => setShowHelp(false)}
      />

    </div>
  )
}

export { Help }