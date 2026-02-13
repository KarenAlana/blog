"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  X,
  Code,
  AlertCircle,
  RefreshCw,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UserTokenData {
  tokensUsed: number;
  tokensLimit: number;
  lastResetDate: string;
}

const DEFAULT_TOKEN_LIMIT = 5000; // 5k tokens por semana

// Função para gerenciar tokens do usuário
const getUserId = (): string => {
  if (typeof window === "undefined") return "anonymous";
  let userId = localStorage.getItem("chatAI_userId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("chatAI_userId", userId);
  }
  return userId;
};

const getUserTokenData = (userId: string): UserTokenData => {
  if (typeof window === "undefined") {
    return {
      tokensUsed: 0,
      tokensLimit: DEFAULT_TOKEN_LIMIT,
      lastResetDate: new Date().toISOString(),
    };
  }

  const stored = localStorage.getItem(`chatAI_tokens_${userId}`);
  if (!stored) {
    const initialData: UserTokenData = {
      tokensUsed: 0,
      tokensLimit: DEFAULT_TOKEN_LIMIT,
      lastResetDate: new Date().toISOString(),
    };
    localStorage.setItem(
      `chatAI_tokens_${userId}`,
      JSON.stringify(initialData),
    );
    return initialData;
  }

  const data: UserTokenData = JSON.parse(stored);
  const lastReset = new Date(data.lastResetDate);
  const now = new Date();
  const daysSinceReset = Math.floor(
    (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Migrar limite de tokens antigo para o novo limite
  if (data.tokensLimit !== DEFAULT_TOKEN_LIMIT) {
    // Se o limite usado exceder o novo limite, ajustar para o novo limite
    const newTokensUsed = Math.min(data.tokensUsed, DEFAULT_TOKEN_LIMIT);
    const updatedData: UserTokenData = {
      tokensUsed: newTokensUsed,
      tokensLimit: DEFAULT_TOKEN_LIMIT,
      lastResetDate: data.lastResetDate,
    };
    localStorage.setItem(
      `chatAI_tokens_${userId}`,
      JSON.stringify(updatedData),
    );
    data.tokensLimit = DEFAULT_TOKEN_LIMIT;
    data.tokensUsed = newTokensUsed;
  }

  // Renovar tokens se passou uma semana
  if (daysSinceReset >= 7) {
    const newData: UserTokenData = {
      tokensUsed: 0,
      tokensLimit: DEFAULT_TOKEN_LIMIT,
      lastResetDate: now.toISOString(),
    };
    localStorage.setItem(`chatAI_tokens_${userId}`, JSON.stringify(newData));
    return newData;
  }

  return data;
};

const updateUserTokens = (userId: string, tokensUsed: number): void => {
  if (typeof window === "undefined") return;
  const data = getUserTokenData(userId);
  data.tokensUsed += tokensUsed;
  localStorage.setItem(`chatAI_tokens_${userId}`, JSON.stringify(data));
};

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState<string>(getUserId());
  const [tokenData, setTokenData] = useState<UserTokenData>(
    getUserTokenData(userId),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 640px)").matches;
    if (isDesktop) setIsOpen(true);
  }, []);

  useEffect(() => {
    setTokenData(getUserTokenData(userId));
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkTokensAvailable = (): boolean => {
    const data = getUserTokenData(userId);
    return data.tokensUsed < data.tokensLimit;
  };

  const getTokensRemaining = (): number => {
    const data = getUserTokenData(userId);
    return Math.max(0, data.tokensLimit - data.tokensUsed);
  };

  const getDaysUntilReset = (): number => {
    const data = getUserTokenData(userId);
    const lastReset = new Date(data.lastResetDate);
    const now = new Date();
    const daysSinceReset = Math.floor(
      (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, 7 - daysSinceReset);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Verificar se há tokens disponíveis
    if (!checkTokensAvailable()) {
      setError(
        `Você atingiu o limite de tokens desta semana. Os tokens serão renovados em ${getDaysUntilReset()} dia(s).`,
      );
      return;
    }

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Preparar mensagens para a API (sem o system prompt, ele é adicionado no servidor)
      const apiMessages = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user" as const, content: input },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        const errorMessage =
          errorData.error || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "Erro ao obter resposta",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Atualizar tokens usados com os dados reais da API
      const tokensUsed = data.usage?.total_tokens || 0;
      if (tokensUsed > 0) {
        updateUserTokens(userId, tokensUsed);
        setTokenData(getUserTokenData(userId));
      }
    } catch (err: any) {
      setError(
        err?.message || "Erro ao processar sua mensagem. Tente novamente.",
      );
      console.error("Erro no chat:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const tokensRemaining = getTokensRemaining();
  const daysUntilReset = getDaysUntilReset();
  const tokensPercentage = (tokenData.tokensUsed / tokenData.tokensLimit) * 100;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-4 py-3 sm:px-6 sm:py-4 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 sm:hover:scale-110 hover:shadow-blue-500/50 flex items-center gap-2 sm:gap-3 group touch-manipulation"
        aria-label="Abrir chat AI"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
        </div>
        <span className="font-semibold text-sm sm:text-base">Chat AI</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full h-full sm:w-[420px] sm:h-[650px] sm:max-h-[85vh] sm:rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border-0 sm:border border-slate-200/50 dark:border-slate-700/50 flex flex-col overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 text-white px-4 py-3 sm:p-5 flex items-center justify-between shadow-lg flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base sm:text-lg truncate">Chat AI</h3>
            <p className="text-xs text-blue-100 truncate hidden sm:block">Assistente de Programação</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-shrink-0 hover:bg-white/20 active:bg-white/30 rounded-xl p-2.5 transition-all duration-200 hover:rotate-90 touch-manipulation"
          aria-label="Fechar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Token Info */}
      {/* <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {tokenData.tokensUsed.toLocaleString()} / {tokenData.tokensLimit.toLocaleString()} tokens
            </span>
          </div>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            🔄 {daysUntilReset} dia(s)
          </span>
        </div>
        <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              tokensPercentage >= 90
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : tokensPercentage >= 70
                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            } shadow-sm`}
            style={{ width: `${Math.min(100, tokensPercentage)}%` }}
          />
        </div>
        {tokensRemaining === 0 && (
          <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Limite de tokens atingido</span>
          </div>
        )}
      </div> */}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 space-y-4 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/30 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 dark:text-slate-400 mt-6 sm:mt-12 px-2">
            <div className="relative inline-block mb-3 sm:mb-4">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"></div>
              <Bot className="w-12 h-12 sm:w-16 sm:h-16 mx-auto relative text-blue-500 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2 text-slate-700 dark:text-slate-300">
              Olá! 👋
            </h4>
            <p className="text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              Sou seu assistente de programação. Envie qualquer mensagem; respondo sobre programação e desenvolvimento.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 sm:gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                  : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-sm"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                {message.content}
              </p>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-md">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex gap-1.5">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-3 sm:mx-5 mb-2 sm:mb-3 p-2.5 sm:p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-5 pb-[env(safe-area-inset-bottom,0.75rem)] sm:pb-5 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 min-w-0 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mensagem sobre programação..."
              className="w-full resize-none rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 sm:px-4 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              rows={2}
              disabled={isLoading || tokensRemaining === 0}
            />
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl p-2.5 sm:p-3 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Limpar chat"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || tokensRemaining === 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white rounded-xl p-2.5 sm:p-3 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg shadow-md disabled:hover:scale-100 disabled:hover:shadow-md touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Enviar mensagem"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 sm:mt-3 text-center hidden sm:block">
          💡 Você pode enviar qualquer mensagem, mas o chat só responde sobre
          programação
        </p>
      </div>
    </div>
  );
};

export default ChatAI;
