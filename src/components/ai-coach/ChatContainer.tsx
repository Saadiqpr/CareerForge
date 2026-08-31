"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Bot,
  User,
  Send,
  Square,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowDown,
  Trash2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "./MarkdownRenderer";
import ThinkingIndicator from "./ThinkingIndicator";

const STARTER_PROMPTS = [
  {
    title: "Career Growth & Promotion",
    description: "Structure talking points and highlight engineering wins for performance reviews.",
    icon: Sparkles,
    prompt:
      "I have an upcoming career growth conversation with my engineering manager. Help me structure my talking points, highlight recent wins, and frame my request for advancement effectively.",
  },
  {
    title: "STAR Behavioral Interview",
    description: "Rehearse difficult behavioral and conflict resolution scenarios with live feedback.",
    icon: Zap,
    prompt:
      "Let's conduct a mock behavioral interview. Ask me a challenging interview question for a Frontend / Fullstack AI Engineer role, wait for my response, and give me constructive feedback using the STAR method.",
  },
  {
    title: "Quarterly Skill Reflection",
    description: "Identify high-leverage gaps in modern AI/Frontend engineering stacks.",
    icon: Bot,
    prompt:
      "I want to reflect on my technical skill development over the past quarter, identify gaps in modern AI/Frontend engineering, and choose high-leverage actions for next month.",
  },
];

function getMessageText(message: any): string {
  if (!message) return "";
  if (typeof message === "string") return message;
  if (typeof message.content === "string" && message.content.length > 0) {
    return message.content;
  }
  if (typeof message.text === "string" && message.text.length > 0) {
    return message.text;
  }
  if (Array.isArray(message.parts) && message.parts.length > 0) {
    return message.parts
      .map((part: any) => {
        if (!part) return "";
        if (typeof part === "string") return part;
        if (typeof part.text === "string") return part.text;
        if (typeof part.content === "string") return part.content;
        if (typeof part.reasoning === "string") return part.reasoning;
        return "";
      })
      .join("");
  }
  return "";
}

export default function ChatContainer() {
  const [input, setInput] = useState<string>("");

  const {
    messages,
    setMessages,
    sendMessage,
    stop,
    status,
    error,
    regenerate,
  } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const isAutoScrollingRef = useRef(false);

  // Scroll to bottom helper
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
      isAutoScrollingRef.current = true;
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 300);
    }
  }, []);

  // Monitor user scroll position
  const handleScroll = useCallback(() => {
    if (isAutoScrollingRef.current || !scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isAwayFromBottom = distanceFromBottom > 60;
    setIsUserScrolledUp(isAwayFromBottom);
  }, []);

  useEffect(() => {
    if (!isUserScrolledUp) {
      scrollToBottom("smooth");
    }
  }, [messages, isUserScrolledUp, scrollToBottom]);

  const handleJumpToLatest = () => {
    setIsUserScrolledUp(false);
    scrollToBottom("smooth");
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
  };

  const handleClearConversation = () => {
    if (isLoading) {
      stop();
    }
    setMessages([]);
    setIsUserScrolledUp(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = (input || "").trim();
    if (!trimmed || isLoading) return;

    setInput("");
    sendMessage({ text: trimmed });
  };

  const typedMessages = (messages || []) as any[];
  const lastMessage = typedMessages[typedMessages.length - 1];
  const lastMessageText = lastMessage ? getMessageText(lastMessage) : "";
  const isThinking =
    isLoading &&
    (typedMessages.length === 0 ||
      lastMessage?.role === "user" ||
      (lastMessage?.role === "assistant" && !lastMessageText.trim()));

  return (
    <div className="relative flex flex-col rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl shadow-2xl overflow-hidden h-[calc(100vh-13rem)] min-h-[560px] max-h-[850px]">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#090e1a]/80 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/25 shrink-0">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#090e1a] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-[var(--font-space-grotesk)] text-sm sm:text-base font-bold text-white">
                CareerForge AI Coach
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                <Sparkles className="h-2.5 w-2.5" />
                Live AI Mentorship
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive career strategy, STAR rehearsals, and technical mentorship
            </p>
          </div>
        </div>

        {typedMessages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearConversation}
            className="text-xs text-slate-400 hover:text-white hover:bg-white/[0.08] gap-1.5 rounded-xl border border-white/[0.06]"
            title="Start new coaching session"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Session</span>
          </Button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth"
      >
        {typedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12 text-center animate-fade-in">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 mb-4 shadow-lg shadow-cyan-500/10">
              <Sparkles className="h-7 w-7 text-cyan-400 animate-pulse-slow" />
            </div>
            <h3 className="font-[var(--font-space-grotesk)] text-xl sm:text-2xl font-extrabold text-white">
              How can I elevate your career today?
            </h3>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-400 px-2 leading-relaxed">
              Select a guided coaching exercise below or ask your own specific technical interview question.
            </p>

            <div className="mt-8 grid w-full max-w-3xl gap-3.5 grid-cols-1 sm:grid-cols-3 text-left">
              {STARTER_PROMPTS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handlePromptClick(item.prompt)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800/80 hover:shadow-[0_8px_25px_-5px_rgba(56,189,248,0.2)] hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 group-hover:bg-cyan-500/20 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="font-[var(--font-space-grotesk)] text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <span className="mt-4 text-[11px] font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to load prompt &rarr;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          typedMessages.map((message, idx) => {
            const isUser = message.role === "user";
            const textContent = getMessageText(message);

            if (!isUser && !textContent.trim() && isLoading && idx === typedMessages.length - 1) {
              return null;
            }

            return (
              <div
                key={message.id || idx}
                className={cn(
                  "flex gap-3 max-w-[92%] sm:max-w-[85%]",
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-md",
                    isUser
                      ? "bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950"
                      : "bg-slate-800 border border-white/[0.1] text-cyan-400"
                  )}
                  aria-hidden="true"
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-lg",
                    isUser
                      ? "bg-gradient-to-br from-cyan-600 via-indigo-600 to-purple-600 text-white rounded-tr-xs font-medium"
                      : "border border-white/[0.08] bg-[#111a2e]/90 text-slate-100 rounded-tl-xs backdrop-blur-md"
                  )}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap break-words text-white">
                      {textContent}
                    </div>
                  ) : (
                    <MarkdownRenderer content={textContent || "..."} />
                  )}
                </div>
              </div>
            );
          })
        )}

        {isThinking && <ThinkingIndicator />}

        {error && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <span className="text-xs sm:text-sm">
                {error.message || "Failed to generate response. Retrying with fallback..."}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => regenerate()}
              className="gap-1 bg-white/[0.05] hover:bg-rose-500/20 text-rose-200 border-rose-500/30 shrink-0 ml-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="text-xs">Retry</span>
            </Button>
          </div>
        )}
      </div>

      {/* Floating Jump to Latest */}
      {isUserScrolledUp && typedMessages.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleJumpToLatest}
            className="flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-xl backdrop-blur-md hover:bg-slate-800 transition hover:scale-105"
          >
            <ArrowDown className="h-3.5 w-3.5 text-cyan-400 animate-bounce motion-reduce:animate-none" />
            <span>Jump to latest</span>
          </Button>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-white/[0.08] bg-[#090e1a]/90 p-3 sm:p-4 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your career coach anything or practice interview questions..."
            className="flex-1 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
          />

          {isLoading ? (
            <Button
              type="button"
              onClick={() => stop()}
              className="gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl shrink-0 px-4 h-11 shadow-lg shadow-rose-600/30"
              title="Stop generation"
            >
              <Square className="h-4 w-4 fill-current" />
              <span className="text-xs sm:text-sm font-semibold">Stop</span>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input.trim()}
              className="gradient-btn gap-1.5 text-white rounded-2xl shrink-0 px-5 h-11 shadow-lg shadow-indigo-500/25 font-bold"
              title="Send message"
            >
              <span className="text-xs sm:text-sm font-bold hidden sm:inline">Send</span>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
