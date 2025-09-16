import React from 'react';
import { useSignup } from './hooks/useSignup';

import EmailVerification from './components/EmailVerification';
import AccountStep from './components/AccountStep';
import PersonalInfoStep from './components/PersonalInfoStep';
import SignupHeader from './components/SignupHeader';

const SignupPage: React.FC = () => {
    const {
        currentStep,
        isLoading,
        formData,
        emailRef,
        passwordRef,
        retypePasswordRef,
        emailValidRef,
        passwordValidRef,
        retypePasswordValidRef,
        handleInputChange,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        setFormData,
        navigate
    } = useSignup();

    return (
        <div className="h-full flex items-center relative bg-gradient-to-br bg-white">
            {currentStep === 3 ?
                <EmailVerification email={formData.email} /> :
                <>
                    <SignupHeader />
                    <div className="w-1/2 flex items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            <div className="flex justify-center mb-8">
                                <div className="flex space-x-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                        1
                                    </span>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                        2
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8">
                                {currentStep === 1 && (
                                    <AccountStep
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleNextStep={handleNextStep}
                                        isLoading={isLoading}
                                        emailRef={emailRef}
                                        passwordRef={passwordRef}
                                        retypePasswordRef={retypePasswordRef}
                                        emailValidRef={emailValidRef}
                                        passwordValidRef={passwordValidRef}
                                        retypePasswordValidRef={retypePasswordValidRef}
                                        navigate={navigate}
                                    />
                                )}

                                {currentStep === 2 && (
                                    <PersonalInfoStep
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handlePrevStep={handlePrevStep}
                                        setFormData={setFormData}
                                        isLoading={isLoading}
                                    />
                                )}
                            </form>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default SignupPage;