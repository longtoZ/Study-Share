import { useNavigate } from 'react-router-dom';
import type { MaterialExtended } from '@interfaces/userProfile.d';
import { subjectColors } from '@/constants/subjectColor';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import StarIcon from '@mui/icons-material/Star';

const MaterialsGrid = ({ materials } : { materials: MaterialExtended[] }) => {
    const navigate = useNavigate();

    return (
        <div className='mt-4'>
            {materials.map((_, index) => (
                <div key={index} 
                    className='p-4 my-5 border-2 border-zinc-200 rounded-2xl shadow-zinc-100 shadow-lg transition-all ease-in-out duration-200 hover:border-blue-600 hover:shadow-blue-200 hover:shadow-lg hover:scale-[101%]'
                    onClick={() => navigate(`/material/${materials[index]?.material_id}`)}
                    >
                        <div className='flex relative justify-between items-center gap-1'>  
                            <div className='absolute right-4 top-2/3 -translate-y-1/2'>
                                <div className={`px-4 py-2 rounded-xl font-semibold text-md text-white bg-gradient-to-r shadow-xl hover:px-6 transition-all duration-200 ease-in-out ${materials[index]?.is_paid ? 'from-yellow-500 to-orange-500 shadow-amber-200' : 'from-emerald-500 to-lime-500 shadow-green-200'}`}>
                                    {materials[index]?.is_paid ? `Paid | $${materials[index]?.price}` : 'Free'}
                                </div>
                            </div>      
                            <div className='w-[8%] flex justify-center items-center opacity-90'>
                                { materials[index]?.name.endsWith('.pdf') ? <svg height="60px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                                    viewBox="0 0 309.267 309.267" xmlSpace="preserve">
                                <g>
                                    <path style={{fill:"#E2574C"}} d="M38.658,0h164.23l87.049,86.711v203.227c0,10.679-8.659,19.329-19.329,19.329H38.658
                                        c-10.67,0-19.329-8.65-19.329-19.329V19.329C19.329,8.65,27.989,0,38.658,0z"/>
                                    <path style={{fill:"#B53629"}} d="M289.658,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L289.658,86.981z"/>
                                    <path style={{fill:"#FFFFFF"}} d="M217.434,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44
                                        c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153
                                        c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C204.194,146.544,217.434,146.544,217.434,146.544z
                                        M155.107,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159
                                        c16.758,0,27.824-11.027,27.824-28.047C183.743,147.095,173.325,135.42,155.107,135.42z M155.755,181.946h-8.225v-35.334h7.413
                                        c11.221,0,16.101,7.529,16.101,17.918C171.044,174.253,166.25,181.946,155.755,181.946z M106.33,135.42H92.964
                                        c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379
                                        c10.341,0,18.875-7.326,18.875-19.107C125.659,143.152,117.425,135.42,106.33,135.42z M106.108,163.158h-7.703v-17.097h7.703
                                        c4.755,0,7.78,3.711,7.78,8.553C113.878,159.447,110.863,163.158,106.108,163.158z"/>
                                </g>
                                </svg> :
                                <svg fill="#0059b8" width={70} height={70} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="-49 -49 588.00 588.00" stroke="#0059b8"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" strokeWidth="4.9"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M144.467,364.001c3.38-5.353,5.069-17.451,5.069-36.263c0-11.514-2.108-19.574-6.31-24.18 c-4.217-4.606-11.589-6.894-22.116-6.894H84.054v75.366h37.489C133.431,372.031,141.072,369.354,144.467,364.001z M98.35,359.993 v-51.291h21.264c6.654,0,10.901,1.495,12.696,4.516c1.809,3.021,2.707,10.094,2.707,21.204c0,10.752-1.002,17.705-3.006,20.845 c-2.004,3.155-6.43,4.725-13.279,4.725H98.35z"></path> <path d="M188.969,372.689c15.208,0,24.778-2.243,28.741-6.729c3.963-4.501,5.936-15.372,5.936-32.644 c0-15.791-1.974-25.959-5.907-30.505c-3.948-4.546-12.755-6.819-26.453-6.819c-15.387,0-25.047,2.303-28.995,6.909 c-3.933,4.606-5.907,15.881-5.907,33.84c0,15.103,2.004,24.868,6.026,29.294C166.419,370.476,175.271,372.689,188.969,372.689z M173.342,311.947c1.615-2.467,7.238-3.693,16.838-3.693c9.286,0,14.759,1.151,16.434,3.454c1.675,2.303,2.512,9.765,2.512,22.385 c0,12.591-0.882,20.128-2.647,22.61c-1.78,2.482-7.088,3.738-15.971,3.738c-9.271,0-14.864-1.107-16.748-3.32 c-1.899-2.213-2.841-8.718-2.841-19.544C170.92,322.953,171.727,314.415,173.342,311.947z"></path> <path d="M263.064,372.689c13.129,0,21.593-1.525,25.421-4.606c3.828-3.081,5.742-9.854,5.742-20.352v-2.587h-14.355l0.09,3.365 c0,5.009-1.047,8.24-3.17,9.72c-2.123,1.465-6.729,2.213-13.817,2.213c-8.763,0-13.952-1.331-15.552-3.978 c-1.6-2.662-2.393-11.2-2.393-25.63c0-10.707,0.882-17.152,2.662-19.32c1.794-2.168,7.118-3.26,16-3.26 c6.61,0,10.856,0.688,12.711,2.064c1.884,1.391,2.811,4.546,2.811,9.481v1.929h14.355l-0.06-1.705 c0-9.585-1.824-15.971-5.413-19.201c-3.619-3.215-10.797-4.83-21.533-4.83c-14.774,0-24.464,1.959-29.115,5.877 c-4.636,3.933-6.953,12.112-6.953,24.554c0,21.13,1.72,34.124,5.129,38.984C239.048,370.266,248.2,372.689,263.064,372.689z"></path> <path d="M313.487,372.031l10.871-18.109c2.438-4.007,4.606-7.821,6.52-11.439l1.6-2.976h0.224l1.6,2.931l1.54,2.976 c1.51,2.871,3.095,5.712,4.755,8.509l10.827,18.109h16.778l-24.12-38.879l22.64-36.487h-16.898l-10.049,16.838 c-1.78,2.946-3.245,5.563-4.426,7.836l-1.376,2.602c-0.299,0.583-0.763,1.466-1.376,2.647h-0.224l-1.376-2.647l-1.391-2.662 c-1.391-2.572-2.886-5.189-4.471-7.836l-10.049-16.778h-17.062l22.969,36.487l-24.733,38.879H313.487z"></path> <path d="M77.788,0v265.111H42.189v139.615h0.001l35.59,35.591L77.788,490h370.023V102.422L345.388,0H77.788z M395.793,389.413 H57.501v-108.99h338.292V389.413z M353.022,36.962l57.816,57.804h-57.816V36.962z"></path> </g> </g></svg>
                                }
                            </div>
                            <div className='w-[92%]'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='text-header-medium'>{materials[index]?.name}</h2>
                                    <div className='relative w-22 ml-auto'>
                                        <span>
                                            <FileDownloadOutlinedIcon className='relative -top-[2px] mr-1' style={{fontSize: '1.1rem'}}/>
                                            <span className='relative text-sm top-[1px]'>{materials[index]?.download_count}</span>
                                        </span>
                                        <span className='border-r mx-2 border-zinc-300'></span>
                                        <span className=''>
                                            <VisibilityOutlinedIcon className='relative mr-1' style={{fontSize: '1.1rem'}}/>
                                            <span className='relative text-sm top-[1px]'>{materials[index]?.view_count}</span>
                                        </span>
                                    </div>
                                </div>
                                <p className='text-subtitle text-sm'>{materials[index]?.description.length ? materials[index].description.substring(0, 100) + '...' : 'No description available'}</p>
                                <div className='flex items-center gap-2 mt-4'>
                                    <img referrerPolicy="no-referrer" src={materials[index]?.profile_picture_url} alt={materials[index]?.user_name} className='w-6 h-6 object-cover rounded-full'/>
                                    <span 
                                        className='cursor-pointer text-md font-semibold hover:text-blue-700 hover:underline transition-all ease-in-out duration-100' 
                                        onClick={() => navigate(`/user/${materials[index]?.user_id}`, )}>{materials[index]?.user_name}</span>
                                </div>
                                <div className='mt-2 flex justify-between items-center'>
                                    <div>
                                        <span className={`px-4 py-1 rounded-full font-semibold text-xs`} 
                                            style={{
                                                backgroundColor: subjectColors[materials[index]?.subject_id] || '#6b7280', 
                                                color: subjectColors[materials[index]?.subject_id]?.substring(0, 7) || '#ffffff',
                                                border: `2px solid ${subjectColors[materials[index]?.subject_id]?.substring(0, 7) + '25' || '#6b7280'}`,
                                                boxShadow: `0 10px 10px ${subjectColors[materials[index]?.subject_id]?.substring(0, 7) + '20' || '#6b7280'}`
                                            }}>
                                            {materials[index]?.subject_name}
                                        </span>
                                        <span className='ml-4 bg-yellow-400 border-2 border-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-yellow-200'>
                                            <StarIcon className='relative mr-1 -top-[1px]' style={{fontSize: '1.2rem'}}/>
                                            <span className='relative top-[1px]'>{materials[index]?.rating?.toFixed(1)}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-start ml-4 mt-6'>
                            <span className='text-xs text-gray-400'>Uploaded on {new Date(materials[index]?.upload_date).toLocaleDateString()}</span>
                        </div>
                </div>
            ))}
        </div>
    )
}

export default MaterialsGrid