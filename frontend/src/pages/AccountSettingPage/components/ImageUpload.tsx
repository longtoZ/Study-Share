import React, { useState, useRef } from 'react'

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const ImageUpload = ({ onChange, title } : { onChange: React.ChangeEventHandler<HTMLInputElement>, title: string}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div 
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 max-h-[20rem] text-center hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-300 cursor-pointer group">
            <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-zinc-100 rounded-full group-hover:bg-zinc-200 transition-colors duration-300">
                    <AddPhotoAlternateOutlinedIcon className="text-zinc-600 text-4xl" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
                </div>
                
                <div className="text-sm text-gray-400">
                    Supported formats: PNG, JPG, JPEG
                </div>

                <input 
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".png, .jpg, .jpeg"
                    onChange={onChange}
                    className="hidden" 
                />
            </div>
        </div>
    )
}

export default ImageUpload