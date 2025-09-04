import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { generateResponse } from "@/services/aiChatService";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import DropdownList from "@/components/common/DropdownList";

import GeminiIcon from '../images/google-gemini-icon.png';
import GptIcon from '../images/chatgpt-icon.png';

const AI_MODELS = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash' },
];

interface ChatMessage {
    sender: "user" | "ai";
    content: string;
}

export default function ChatPannel({
    open,
    onClose,
    userId,
    materialId,
}: {
    open: boolean;
    onClose: () => void;
    userId: string;
    materialId: string;
}) {
    if (!userId || !materialId) return null;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [model, setModel] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "user", content: input }]);
        setInput("");
        setIsThinking(true);
        setMessages((prev) => [
            ...prev,
            { sender: "ai", content: `${ prev.length === 2 ? "I'm reading the material for the first time. Please wait a moment..." : "Thinking..."}` },
        ]);

        const response = await generateResponse(userId, materialId, input, model);
        setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { sender: "ai", content: response };
            return updated;
        });
        setIsThinking(false);
    };

    useEffect(() => {
        if (model) {
            setMessages(() => [...messages, { sender: "ai", content: `AI model set to ${AI_MODELS.find(m => m.id === model)?.name}. You can start asking questions!` }]);   
        }
    }, [model]);

    return (
        <div className={`sticky right-0 h-full bottom-0 z-50 flex justify-end p-2 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-[#00000080] bg-opacity-60 transition-all duration-300 ease-in-out ${open ? "opacity-100 backdrop-blur-xs" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />
            {/* Chat Panel */}
            <div className={`relative w-[75%] h-[90%] bg-white rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
                style={{ minWidth: 350 }}>
                <div className="flex items-center justify-between px-6 py-4 bg-zinc-100">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <AutoAwesomeOutlinedIcon/>
                        AI Chat
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-gray-400 text-center mt-10">No messages yet.</div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                { msg.sender === 'ai' ? (
                                    <div className="flex items-start gap-2 max-w-[70%]">
                                        <img src={ model === 'gemini-2.0-flash-lite' ? GeminiIcon : GptIcon} alt="AI" className="w-8 h-8 rounded-full mt-1"/>
                                        <div className={`px-4 py-2 rounded-2xl bg-zinc-100 text-zinc-800 ${isThinking && idx === messages.length - 1 ? "italic animate-pulse" : ""}`}>
                                            <Markdown>{msg.content}</Markdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`px-4 py-2 rounded-2xl max-w-[70%] bg-gradient-to-r from-blue-500 to-violet-600 text-white`}>
                                        {msg.content}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="px-4 py-2 bg-gradient-to-t from-blue-50 to-white">
                    <div className="mb-2 w-full flex flex-col bg-zinc-100 rounded-2xl border-2 h-32 border-zinc-300">
                        <input
                            className="flex-1 p-2 focus:outline-none m-2 border-transparent"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            autoComplete="off"
                            disabled={!model}
                        />
                        <div className="flex gap-2 justify-end bg-zinc-200 p-2 rounded-b-2xl">
                            <DropdownList options={AI_MODELS} onSelect={setModel} placeholder="Select AI Model" reversePosition={true} className={`${model && 'pointer-events-none opacity-50'}`}/>
                            <button
                                className="button-primary rounded-xl w-10 h-10 p-4 flex items-center justify-center"
                                onClick={handleSend}
                                style={{ borderRadius: '50%' }}
                            >
                                <SendIcon fontSize="small" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}