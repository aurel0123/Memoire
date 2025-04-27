import React from 'react'
import {cn} from '@/lib/utils'
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button'

export default function BentoGrid({className, children}) {
  return (
    <div className={cn(
        "grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4",
        className
      )}>
        {children}
    </div>
  )
}

export const BentoGridItem = ({
    className,
    vote,
    title,
    description,
    header,
    button,
    link , 
    status }) => {
    return (
        <div
        className={cn(
            "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
            className,
            )}
        >
            <div className='relative w-full h-40'>
                <span className="absolute top-2 left-2 z-10 rounded-md bg-green-700 px-3 py-1 text-xs text-white">
                    {status.toUpperCase()}
                </span>
                <div className="w-full h-full rounded-xl overflow-hidden">
                    <img 
                        //className="w-full h-full object-cover transition-all duration-700 group-hover/bento:contrast-125 group-hover/bento:blur-sm"
                        className="w-full h-full object-cover transition-all duration-500 group-hover/bento:scale-110 group-hover/bento:brightness-110"
                        src={header}
                        alt={title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100 rounded-xl"></div>
                </div>
            </div>
            <div className="transition gap-2 duration-200 group-hover/bento:translate-x-2">
                <div className='flex gap-2 items-center'>
                    <Star size={20} color='#fff700'/> <span className='text-sm'>{vote} vote(s)</span>
                </div>
                <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
                    {title}
                </div>
                <div className="font-sans text-xs line-clamp-2 font-normal text-neutral-600 dark:text-neutral-300">
                    {description}
                </div>
                <div className='mt-2 w-full'>
                    <Button className="w-full" size="sm" onClick={link}>
                        {button}
                    </Button>
                </div>
            </div>
        </div>
    )
}