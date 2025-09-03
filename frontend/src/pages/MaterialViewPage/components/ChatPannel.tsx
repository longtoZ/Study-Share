import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PsychologyIcon from "@mui/icons-material/Psychology";

const AI_MODELS = [
    { label: "GPT-4", value: "gpt-4", icon: <SmartToyIcon /> },
    { label: "Claude 3", value: "claude-3", icon: <PsychologyIcon /> },
];

interface ChatMessage {
    sender: "user" | "ai";
    content: string;
}

export default function ChatPannel({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [model, setModel] = useState<string | null>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "user", content: input }]);
        setInput("");
        // Simulate AI response (replace with real API call)
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", content: `AI (${model}): Response to "${input}"` },
            ]);
        }, 800);
    };

    return (
        <div className="sticky right-0 h-full bottom-0 z-50 flex justify-end p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-[#00000080] bg-opacity-60 transition-opacity"
                onClick={onClose}
            />
            {/* Chat Panel */}
            <div className="relative w-full sm:w-1/2 max-w-xl h-[90%] bg-white rounded-3xl flex flex-col overflow-hidden"
                style={{ minWidth: 350 }}>
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <SmartToyIcon className="text-blue-500" />
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
                                <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="mb-2 w-full flex flex-col bg-zinc-100 rounded-xl overflow-hidden border-2 border-zinc-300">
                        <input
                            className="flex-1 p-2 focus:outline-none m-2 border-transparent"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <div className="flex gap-2 justify-end bg-zinc-200 p-2">
                            <select
                                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none"
                                value={model || ""}
                                onChange={(e) => setModel(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select AI Model
                                </option>
                                {AI_MODELS.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
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