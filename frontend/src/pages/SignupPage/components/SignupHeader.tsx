
import React from 'react';
import BackgroundImage from '../images/signup_background.jpeg';

const SignupHeader: React.FC = () => {
    return (
        <div className="flex w-1/2 flex-col justify-center items-center p-12 text-white relative mx-2 rounded-3xl overflow-hidden h-[98%]">
            <img
                referrerPolicy="no-referrer"
                src={BackgroundImage}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
            />
            <div className="max-w-lg text-center z-10">
                <h1 className="text-4xl font-bold mb-6">Join StudyShare</h1>
                <p className="text-lg leading-relaxed">
                    Connect with fellow students, share knowledge, and accelerate your learning journey.
                    Access thousands of study materials, collaborate on projects, and build meaningful
                    academic relationships that will last a lifetime.
                </p>
            </div>
        </div>
    );
};

export default SignupHeader;
