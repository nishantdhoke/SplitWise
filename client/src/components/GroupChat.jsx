import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGroupMessages, sendGroupMessage } from '../services/api';
import { Send, MessageSquare, AlertCircle, Sparkles, User, RefreshCw } from 'lucide-react';

export default function GroupChat({ groupId, groupName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getGroupMessages(groupId);
      setMessages(data.messages || []);
      setError('');
    } catch (err) {
      if (!silent) {
        setError(err.message || 'Failed to load messages');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial fetch and auto-scroll
  useEffect(() => {
    fetchMessages(false).then(() => {
      scrollToBottom(false);
    });
  }, [groupId]);

  // Real-time polling every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [groupId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const data = await sendGroupMessage(groupId, messageText);
      if (data.chatMessage) {
        setMessages((prev) => [...prev, data.chatMessage]);
      } else {
        await fetchMessages(true);
      }
      setTimeout(() => scrollToBottom(true), 100);
      inputRef.current?.focus();
    } catch (err) {
      setError(err.message || 'Failed to send message');
      setNewMessage(messageText); // restore on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    'Hey everyone! 👋',
    'Just added a new expense 🧾',
    'Please check the settlements and settle up! 💳',
    'All settled up! Thanks ✨',
  ];

  return (
    <div
      className="cosmic-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '650px',
        padding: 0,
        overflow: 'hidden',
        border: '1px solid rgba(124, 58, 237, 0.25)',
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: '1.15rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8, 13, 29, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'radial-gradient(circle at 35% 35%, #38D9FF 0%, #7C3AED 70%, #03040B 100%)',
              color: '#F8FAFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(56, 217, 255, 0.35)',
            }}
          >
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--star-white)' }}>
              Group Discussion
            </h3>
            <p className="text-muted" style={{ fontSize: '0.78rem' }}>
              Chat, coordinate expenses, and discuss settlements with members
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMessages(false)}
          className="btn btn-secondary btn-icon"
          title="Refresh chat"
          style={{ width: '34px', height: '34px' }}
        >
          <RefreshCw size={14} className={loading ? 'cosmic-spinner' : ''} />
        </button>
      </div>

      {/* Messages Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'rgba(3, 4, 11, 0.45)',
        }}
      >
        {loading && messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.75rem' }}>
            <div className="cosmic-spinner" style={{ width: '2rem', height: '2rem' }}></div>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(56, 217, 255, 0.1)',
                color: 'var(--starlight-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <MessageSquare size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--star-white)' }}>
              No Messages Yet
            </h4>
            <p className="text-muted" style={{ fontSize: '0.85rem', maxWidth: '340px', marginTop: '0.35rem' }}>
              Start the conversation! Coordinate bills, check payments, or say hello to the group.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' }}>
              {quickPrompts.slice(0, 2).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setNewMessage(prompt);
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: 'rgba(56, 217, 255, 0.08)',
                    border: '1px solid rgba(56, 217, 255, 0.25)',
                    color: 'var(--starlight-cyan)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === user?.id;
            const formattedTime = new Date(msg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const formattedDate = new Date(msg.created_at).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Sender Name & Timestamp */}
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0 0.4rem',
                  }}
                >
                  <strong style={{ color: isMe ? 'var(--starlight-cyan)' : 'var(--text-secondary)' }}>
                    {isMe ? 'You' : msg.user_name}
                  </strong>
                  <span>&bull;</span>
                  <span>{formattedTime}</span>
                </div>

                {/* Message Bubble */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isMe
                      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.85) 0%, rgba(37, 99, 235, 0.85) 100%)'
                      : 'rgba(13, 20, 41, 0.95)',
                    border: isMe
                      ? '1px solid rgba(56, 217, 255, 0.35)'
                      : '1px solid rgba(248, 250, 255, 0.1)',
                    color: 'var(--star-white)',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    boxShadow: isMe
                      ? '0 4px 15px rgba(124, 58, 237, 0.25)'
                      : '0 4px 15px rgba(0, 0, 0, 0.4)',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      {messages.length > 0 && (
        <div
          style={{
            padding: '0.45rem 1.25rem',
            background: 'rgba(8, 13, 29, 0.7)',
            borderTop: '1px solid rgba(248, 250, 255, 0.05)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setNewMessage(prompt);
                inputRef.current?.focus();
              }}
              style={{
                background: 'rgba(56, 217, 255, 0.08)',
                border: '1px solid rgba(56, 217, 255, 0.2)',
                color: 'var(--starlight-cyan)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--border)',
          background: 'rgba(8, 13, 29, 0.95)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {error && (
          <div style={{ position: 'absolute', bottom: '65px', left: '20px', right: '20px' }} className="alert alert-danger">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          className="form-input"
          placeholder="Type a message to the group (Press Enter to send)..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={2000}
          style={{
            flex: 1,
            height: '44px',
            borderRadius: 'var(--radius-full)',
            paddingLeft: '1.25rem',
            paddingRight: '1rem',
            background: 'rgba(3, 4, 11, 0.85)',
          }}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!newMessage.trim() || sending}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Send message"
        >
          {sending ? (
            <div className="cosmic-spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
}
