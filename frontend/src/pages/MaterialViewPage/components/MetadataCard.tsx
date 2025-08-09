import React from 'react'

const MetadataCard = ({ icon, label, value, isPaid = false, capitalize = false } : { icon: React.ReactNode, label: string, value: string | number, isPaid?: boolean, capitalize?: boolean }) => {
    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${isPaid ? 'bg-red-50 text-red-700 shadow-md' : 'bg-zinc-100 text-zinc-700'}`}>
            <div className='text-gray-400'>
                {icon}
            </div>
            <div>
                <p className='text-sm font-semibold text-gray-500'>{label}</p>
                <p className={`font-bold ${capitalize ? 'capitalize' : ''}`}>
                {value}
                </p>
            </div>
        </div>
    )
}

export default MetadataCard;