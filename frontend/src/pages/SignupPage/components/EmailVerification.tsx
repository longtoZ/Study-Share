import React from 'react'

const EmailVerification = () => {
    const [codes, setCodes] = React.useState(Array(6).fill(''));
    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (!val) return;
        const newCodes = [...codes];
        newCodes[idx] = val;
        setCodes(newCodes);
        if (idx < 5 && val) {
            inputsRef.current[idx + 1]?.focus();
        } else if (idx === 5) {
            // Optionally handle submission when all digits are entered
            console.log('Verification code entered:', newCodes.join(''));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace') {
            if (codes[idx]) {
                const newCodes = [...codes];
                newCodes[idx] = '';
                setCodes(newCodes);
            } else if (idx > 0) {
                inputsRef.current[idx - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        } else if (e.key === 'ArrowRight' && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
            <p className="mb-6 text-gray-600">Enter the 6-digit code sent to your email</p>
            <div className="flex gap-3 mb-6">
                {codes.map((code, idx) => (
                    <input
                        key={idx}
                        ref={el => { inputsRef.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl hover:outline-none focus:outline-none focus:border-blue-500 transition"
                        value={code}
                        onChange={e => handleChange(e, idx)}
                        onKeyDown={e => handleKeyDown(e, idx)}
                        autoFocus={idx === 0}
                    />
                ))}
            </div>
            {/* You can add a submit button or resend code link here */}
        </div>
    )
}

export default EmailVerification