const { useState, useEffect, useRef } = React;

const WEBHOOK_URL = "https://apila.app.n8n.cloud/webhook/29c6dd00-5919-4150-9e35-8a16c7c2714e";

const SUGGESTIONS = [
    "Why are you better than others?",
    "What are automations for?",
    "Can I choose just one service?"
];

function ChatBlock() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping, showSuggestions]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        setInputValue("");
        setShowSuggestions(false);
        setIsTyping(true);

        try {
            if (WEBHOOK_URL.includes("your-webhook-url")) {
                setTimeout(() => {
                    const aiMsg = { id: Date.now() + 1, text: "This is a test response. Configure WEBHOOK_URL.", sender: 'ai' };
                    setMessages(prev => [...prev, aiMsg]);
                    setIsTyping(false);
                }, 1500);
                return;
            }

            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            const aiResponseText = data.output || data.reply || data.text || "Response error.";

            const aiMsg = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = { id: Date.now() + 1, text: "Sorry, I cannot answer right now.", sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isTyping) handleSendMessage(inputValue);
        }
    };

    return (
        <div className="chat-section">
            <h2 className="main-title">Don't like waiting?<br />Neither do we.</h2>

            <div style={{
                opacity: showSuggestions ? 1 : 0,
                maxHeight: showSuggestions ? '200px' : '0px',
                overflow: 'hidden',
                transition: 'all 0.5s ease',
                marginBottom: showSuggestions ? '120px' : '0'
            }}>
                <p className="sub-title">Have a question? <br />We have an instant answer. <br />Seriously, ask anything about our services.</p>
            </div>

            <div className="chat-interface-container">
                {!showSuggestions && (
                    <div className="chat-history" ref={chatContainerRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message message-ai">
                                <div className="typing-indicator"><span></span><span></span><span></span></div>
                            </div>
                        )}
                    </div>
                )}

                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Ask me anything..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isTyping}
                        />
                        <button className="send-btn" onClick={() => !isTyping && handleSendMessage(inputValue)} style={{ opacity: isTyping ? 0.5 : 1 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                    <p className="legal-disclaimer">This chat uses artificial intelligence. Answers may be inaccurate. We save dialogue history.</p>
                </div>

                {showSuggestions && (
                    <div className="suggestions-list">
                        {SUGGESTIONS.map((text, index) => (
                            <div key={index} className="suggestion-item" onClick={() => handleSendMessage(text)}>{text}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



// НОВИЙ КОД (безпечний):
document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById('chat-root');

    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<ChatBlock />);
    } else {
        console.error("Помилка: Контейнер #chat-root не знайдено в HTML.");
    }
});