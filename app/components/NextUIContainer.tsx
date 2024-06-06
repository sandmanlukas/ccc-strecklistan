import { ReactNode } from 'react';

export default function NextUiContainer({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full items-center justify-between space-x-4 p-2 border-2  hover:border-gray-400 rounded-xl transition-colors duration-300"> {
            children
        }
        </div>
    )
}