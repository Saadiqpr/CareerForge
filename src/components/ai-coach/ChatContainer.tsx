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
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "./MarkdownRenderer";
import ThinkingIndicator from "./ThinkingIndicator";

const STARTER_PROMPTS = [
  {
    title: "Career conversations",
    description: "Prepare thoughtful questions and talking points for important moments.",
    prompt:
      "I have an upcoming career growth conversation with my engineering manager. Help me structure my talking points, highlight recent wins, and frame my request for advancement effectively.",
  },
  {
    title: "Practice sessions",
    description: "Work through common interview and networking scenarios.",
    prompt:
      "Let's conduct a mock behavioral interview. Ask me a challenging interview question for a Frontend / Fullstack AI Engineer role, wait for my response, and give me constructive feedback using the STAR method.",
  },
  {
    title: "Next reflection",
    description: "Capture what you learned and choose a useful action to take.",
    prompt:
      "I want to reflect on my technical skill development over the past quarter, identify gaps in modern AI/Frontend engineering, and choose high-leverage actions for next month.",
  },
];

interface MessagePartLike {
  type: string;
  text?: string;
}

interface MessageLike {
  id: string;
  role: "system" | "user" | "assistant";
  content?: string;
  parts?: MessagePartLike[];
}

function getMessageText(message: MessageLike): string {
  if (typeof message.content === "string") {
    return message.content;
  }
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part): part is MessagePartLike & { text: string } => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
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
} = useChat({
  api: "/api/chat",
});

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
      // Allow scroll animation to complete before re-enabling manual detection
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 300);
    }
  }, []);

  // Monitor user scroll position to toggle auto-scroll and "Jump to latest"
  const handleScroll = useCallback(() => {
    if (isAutoScrollingRef.current || !scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Threshold of 60px to detect if user has intentionally scrolled up
    const isAwayFromBottom = distanceFromBottom > 60;
    setIsUserScrolledUp(isAwayFromBottom);
  }, []);

  // Auto-scroll when messages change or streaming is active, only if user is near the bottom
  useEffect(() => {
    if (!isUserScrolledUp) {
      scrollToBottom("smooth");
    }
  }, [messages, isUserScrolledUp, scrollToBottom]);

  // Jump to latest button click handler
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

  // Determine if we should show the thinking indicator:
  // Visible when loading and either no assistant message exists yet or the latest assistant message is empty
  const typedMessages = messages as unknown as MessageLike[];
  const lastMessage = typedMessages[typedMessages.length - 1];
  const lastMessageText = lastMessage ? getMessageText(lastMessage) : "";
  const isThinking =
    isLoading &&
    (typedMessages.length === 0 ||
      lastMessage?.role === "user" ||
      (lastMessage?.role === "assistant" && !lastMessageText.trim()));

  return (
    <div className="relative flex flex-col rounded-2xl border border-[var(--border)] bg-white shadow-sm overflow-hidden h-[calc(100vh-13rem)] min-h-[540px] max-h-[850px]">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-white px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--navy)] text-white shadow-sm shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-[var(--font-space-grotesk)] text-sm sm:text-base font-bold text-[var(--navy)]">
                CareerForge AI Coach
              </h2>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Claude 3.5
              </span>
            </div>
            <p className="text-xs text-black/60 hidden sm:block">
              Interactive career strategy, interview prep, and technical mentorship
            </p>
          </div>
        </div>

        {/* Clear Conversation Action */}
        {typedMessages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearConversation}
            className="text-xs text-black/60 hover:text-[var(--navy)] hover:bg-slate-100 gap-1.5"
            title="Clear conversation"
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
          /* Empty State with Starter Prompts */
          <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--navy)]/5 text-[var(--navy)] mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-[var(--font-space-grotesk)] text-lg sm:text-xl font-bold text-[var(--navy)]">
              How can I support your career today?
            </h3>
            <p className="mt-1 max-w-md text-xs sm:text-sm text-black/70 px-2">
              Select a guided topic below or type your own question to start a live coaching session.
            </p>

            <div className="mt-6 grid w-full max-w-2xl gap-3 grid-cols-1 sm:grid-cols-3 text-left">
              {STARTER_PROMPTS.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handlePromptClick(item.prompt)}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-xs transition hover:border-[var(--blue)] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                >
                  <p className="font-[var(--font-space-grotesk)] text-sm font-semibold text-[var(--navy)] group-hover:text-[var(--blue)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-black/70 leading-5">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          typedMessages.map((message) => {
            const isUser = message.role === "user";
            const textContent = getMessageText(message);

            // Skip rendering empty assistant message bubble if it has no text yet (handled by ThinkingIndicator)
            if (!isUser && !textContent.trim()) {
              return null;
            }

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[92%] sm:max-w-[85%]",
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-xs",
                    isUser
                      ? "bg-[var(--blue)] text-white"
                      : "bg-[var(--navy)] text-white"
                  )}
                  aria-hidden="true"
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                      ? "bg-[var(--navy)] text-white rounded-tr-xs"
                      : "border border-[var(--border)] bg-gray-50/90 text-black rounded-tl-xs shadow-2xs"
                  )}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap break-words text-white font-normal">
                      {textContent}
                    </div>
                  ) : (
                    <MarkdownRenderer content={textContent} />
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Pre-Token Thinking Indicator */}
        {isThinking && <ThinkingIndicator />}

        {/* Error Notification */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3.5 sm:p-4 text-sm text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <span className="text-xs sm:text-sm">
                {error.message || "Failed to generate response. Please verify server configuration."}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => regenerate()}
              className="gap-1 bg-white hover:bg-rose-50 text-rose-900 border-rose-200 shrink-0 ml-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="text-xs">Retry</span>
            </Button>
          </div>
        )}
      </div>

      {/* Floating "Jump to Latest" Button */}
      {isUserScrolledUp && typedMessages.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleJumpToLatest}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/95 px-3.5 py-1.5 text-xs font-medium text-[var(--navy)] shadow-md backdrop-blur-sm hover:bg-slate-50 transition hover:scale-105"
          >
            <ArrowDown className="h-3.5 w-3.5 text-[var(--blue)] animate-bounce motion-reduce:animate-none" />
            <span>Jump to latest</span>
          </Button>
        </div>
      )}

      {/* Input Form & Controls */}
      <div className="border-t border-[var(--border)] bg-white p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or practice interview scenarios..."
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-[var(--navy)] focus:outline-none focus:ring-1 focus:ring-[var(--navy)]"
          />

          {isLoading ? (
            <Button
              type="button"
              onClick={() => stop()}
              className="gap-1.5 bg-rose-600 text-white hover:bg-rose-700 shrink-0 px-3 sm:px-4 h-10"
              title="Stop generation"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs sm:text-sm font-medium">Stop</span>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!(input || "").trim()}
              className="gap-1.5 bg-[var(--navy)] text-white hover:bg-[var(--navy-light)] disabled:opacity-40 shrink-0 px-3 sm:px-4 h-10"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium">Send</span>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
