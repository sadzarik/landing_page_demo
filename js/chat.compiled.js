const {
  useState,
  useEffect,
  useRef
} = React;

// Your real webhook
const WEBHOOK_URL = "YOUR_WEBHOOK_URL_HERE"; // Placeholder for demo
const SUGGESTIONS = ["Чим ви кращі за інших?", "Для чого потрібні автоматизації?", "Чи я можу обрати лише одну послугу?"];
function ChatBlock() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, showSuggestions]);
  const handleSendMessage = async text => {
    if (!text.trim()) return;

    // 1. Додаємо повідомлення юзера
    const userMsg = {
      id: Date.now(),
      text: text,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setShowSuggestions(false);
    setIsTyping(true);
    try {
      // Цей блок для тестування, якщо URL не справжній.
      // Оскільки у вас реальний URL, код піде далі до fetch.
      if (WEBHOOK_URL.includes("your-webhook-url")) {
        setTimeout(() => {
          const aiMsg = {
            id: Date.now() + 1,
            text: "Це тестова відповідь. Налаштуйте WEBHOOK_URL.",
            sender: 'ai'
          };
          setMessages(prev => [...prev, aiMsg]);
          setIsTyping(false);
        }, 1500);
        return;
      }

      // 2. Відправка на n8n
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text
        })
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      // !!! ВИПРАВЛЕНО ТУТ: додано оператори ||
      const aiResponseText = data.output || data.reply || data.text || "Помилка відповіді.";
      const aiMsg = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Вибачте, зараз я не можу відповісти.",
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isTyping) handleSendMessage(inputValue);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "chat-section"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "main-title"
  }, "\u041D\u0435 \u043B\u044E\u0431\u0438\u0442\u0435 \u0447\u0435\u043A\u0430\u0442\u0438?", /*#__PURE__*/React.createElement("br", null), "\u041C\u0438 \u0442\u0435\u0436."), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: showSuggestions ? 1 : 0,
      maxHeight: showSuggestions ? '200px' : '0px',
      overflow: 'hidden',
      transition: 'all 0.5s ease',
      marginBottom: showSuggestions ? '120px' : '0'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "sub-title"
  }, "\u0423 \u0432\u0430\u0441 \u043F\u0438\u0442\u0430\u043D\u043D\u044F? ", /*#__PURE__*/React.createElement("br", null), "\u0423 \u043D\u0430\u0441 \u043C\u0438\u0442\u0442\u0454\u0432\u0430 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C. ", /*#__PURE__*/React.createElement("br", null), "\u0421\u0435\u0440\u0439\u043E\u0437\u043D\u043E, \u0441\u043F\u0438\u0442\u0430\u0439\u0442\u0435 \u0431\u0443\u0434\u044C-\u0449\u043E \u043F\u0440\u043E \u043D\u0430\u0448\u0456 \u043F\u043E\u0441\u043B\u0443\u0433\u0438.")), /*#__PURE__*/React.createElement("div", {
    className: "chat-interface-container"
  }, !showSuggestions && /*#__PURE__*/React.createElement("div", {
    className: "chat-history",
    ref: chatContainerRef
  }, messages.map(msg =>
    /*#__PURE__*/
    // !!! ВИПРАВЛЕНО ТУТ: бектіки для шаблонного рядка
    React.createElement("div", {
      key: msg.id,
      className: `message ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`
    }, msg.text)), isTyping && /*#__PURE__*/React.createElement("div", {
      className: "message message-ai"
    }, /*#__PURE__*/React.createElement("div", {
      className: "typing-indicator"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)))), /*#__PURE__*/React.createElement("div", {
      className: "chat-input-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "chat-input-wrapper"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "chat-input",
      placeholder: "\u0421\u043F\u0438\u0442\u0430\u0439\u0442\u0435 \u043C\u0435\u043D\u0435 \u0449\u043E\u0441\u044C...",
      value: inputValue,
      onChange: e => setInputValue(e.target.value),
      onKeyDown: handleKeyDown,
      disabled: isTyping
    }), /*#__PURE__*/React.createElement("button", {
      className: "send-btn",
      onClick: () => !isTyping && handleSendMessage(inputValue),
      style: {
        opacity: isTyping ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 5 19 12 12 19"
    })))), /*#__PURE__*/React.createElement("p", {
      className: "legal-disclaimer"
    }, "\u0426\u0435\u0439 \u0447\u0430\u0442 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0454 \u0448\u0442\u0443\u0447\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u043B\u0435\u043A\u0442. \u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456 \u043C\u043E\u0436\u0443\u0442\u044C \u0431\u0443\u0442\u0438 \u043D\u0435\u0442\u043E\u0447\u043D\u0438\u043C\u0438. \u041C\u0438 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u043C\u043E \u0456\u0441\u0442\u043E\u0440\u0456\u044E \u0434\u0456\u0430\u043B\u043E\u0433\u0456\u0432.")), showSuggestions && /*#__PURE__*/React.createElement("div", {
      className: "suggestions-list"
    }, SUGGESTIONS.map((text, index) => /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "suggestion-item",
      onClick: () => handleSendMessage(text)
    }, text)))));
}

// NEW CODE (safe):
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById('chat-root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(/*#__PURE__*/React.createElement(ChatBlock, null));
  } else {
    console.error("Помилка: Контейнер #chat-root не знайдено в HTML.");
  }
});

