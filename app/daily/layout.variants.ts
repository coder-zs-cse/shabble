import { tv } from 'tailwind-variants';

export const dailyLayout = tv({
  slots: {
    root: 'w-screen min-h-screen bg-gray-200 flex flex-col lg:flex-row ',
    sidebar:
      'hidden lg:flex flex-1 w-full items-center justify-center p-4 shrink-0  ',
    main:
      'relative w-full lg:w-[730px] lg:max-w-[730px] lg:flex-shrink-0 min-h-screen flex flex-col bg-white lg:pb-0',
    mobileBar:
      'lg:hidden fixed bottom-0 left-0 right-0 z-20 flex min-h-[60px] items-center bg-gray-200 border-t border-gray-300 px-2 py-2',
  },
  variants: {
    mobileAd: {
      true: {
        main: 'pb-28',
      },
      false: {},
    },
  },
  defaultVariants: {
    mobileAd: false,
  },
});
