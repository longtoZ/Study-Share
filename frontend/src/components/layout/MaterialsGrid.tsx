import React from 'react'
import { useNavigate } from 'react-router-dom';
import type { Material } from '@interfaces/userProfile';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

const MaterialsGrid = ({ materials } : { materials: Material[] }) => {
    const navigate = useNavigate();

    return (
        <div className='mt-4'>
            {materials.map((_, index) => (
                <div key={index} 
                    className='p-4 my-2 border border-primary rounded-lg cursor-pointer hover:button-transparent'
                    onClick={() => navigate(`/material/${materials[index]?.material_id}`)}
                    >
                    <h2 className='text-header-medium'>{materials[index]?.name}</h2>
                    <p className='text-subtitle'>{materials[index]?.description.substring(0, 100)}...</p>
                    <div className='mt-2 flex justify-between items-center'>
                        <div>
                            <span className='text-subtitle-secondary'>Subject: {materials[index]?.subject}</span>
                            <span className='text-subtitle-secondary ml-6'>
                                <FileDownloadOutlinedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
                                <span className='relative top-1'>Downloads: {materials[index]?.download_count}</span>
                            </span>
                            <span className='text-subtitle-secondary ml-6'>
                                <StarBorderOutlinedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
                                <span className='relative top-1'>Rating: {materials[index]?.rating}</span>
                            </span>
                        </div>
                        <span className='text-xs text-gray-400'>Uploaded on: {new Date(materials[index]?.upload_date).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MaterialsGrid