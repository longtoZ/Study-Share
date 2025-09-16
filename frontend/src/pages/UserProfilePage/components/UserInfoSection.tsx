import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import PlaceholderPfp from '../images/placeholder_pfp.png';
import PlaceholderBg from '../images/placeholder_bg.png';

interface UserInfoSectionProps {
    user: any;
}

const UserInfoSection = ({ user } : UserInfoSectionProps) => {
    return (
        <div className='rounded-3xl bg-primary overflow-hidden card-shadow pb-6'>
            <div className='p-2'>
                <img referrerPolicy="no-referrer" src={user?.background_image_url || PlaceholderBg} alt="" className='w-full rounded-3xl h-80 object-cover pointer-events-none'/>
            </div>
            <div className='px-6'>
                <div className='p-4 relative'>
                    <img referrerPolicy="no-referrer" src={user?.profile_picture_url || PlaceholderPfp} alt="Profile" className='absolute w-48 h-48 object-cover rounded-full border-6 border-white -top-34 left-6 pointer-events-none'/>
                    
                    <div className='mt-12 flex justify-between items-center'>
                        <div>
                            <h1 className='text-header-large'>{user?.full_name}</h1>
                            <h2 className='text-subtitle'>@{user?.user_id}</h2>
                            <p className='mt-4'>Joined on <span className='font-[600]'>{user?.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}</span></p>
                            <p className=''>Living in <span className='font-[600]'>{user?.address}</span></p>
                        </div>
                        <div>
                            <button className='button-primary w-40 px-6 py-2 rounded-md'>
                                <AddOutlinedIcon className='mr-1' style={{fontSize: '1.4rem'}}/>
                                Follow
                            </button>
                            <button className='button-outline w-40 px-6 py-2 rounded-md ml-4'>
                                <EmailOutlinedIcon className='mr-1' style={{fontSize: '1.4rem'}}/>
                                Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfoSection;