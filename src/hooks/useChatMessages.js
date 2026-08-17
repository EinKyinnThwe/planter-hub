import { useEffect, useState, useCallback } from 'react';
import useAuthUser from './useAuthUser';
import {
    subscribeToMessages,
    sendMessage as sendMessageToFirestore,
    sendAutoReply,
    editMessage as editMessageInFirestore,
    deleteMessage as deleteMessageInFirestore,
} from '../services/chatService';
import { getAutoReplyText } from '../utils/autoReply';
import { AUTO_REPLY_ENABLED, AUTO_REPLY_DELAY_MS } from '../constants/chatConfig';
import { measureAsync } from '../services/performanceService';

export default function useChatMessages() {
    const { user } = useAuthUser();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    const [supportTyping, setSupportTyping] = useState(false);

    useEffect(() => {
        if (!user) {
            setMessages([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToMessages(
            user.uid,
            (data) => {
                setMessages(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message || 'Failed to load messages.');
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    const sendMessage = useCallback(
        async (text) => {
            const trimmed = text.trim();
            if (!trimmed || !user) return;

            setSending(true);
            try {
                await measureAsync('send_chat_message',
                    () => sendMessageToFirestore(user.uid, trimmed),
                    { messageLength: trimmed.length }
                );
                if (AUTO_REPLY_ENABLED) {
                    setSupportTyping(true);
                    setTimeout(async () => {
                        try {
                            await sendAutoReply(user.uid, getAutoReplyText(trimmed));
                        } catch {
                            // Silently drop — a missed auto-reply isn't worth surfacing an error for.
                        } finally {
                            setSupportTyping(false);
                        }
                    }, AUTO_REPLY_DELAY_MS);
                }
            } catch (err) {
                setError(err.message || 'Failed to send message.');
            } finally {
                setSending(false);
            }
        },
        [user]
    );

    const editMessage = useCallback(
        async (messageId, newText) => {
            const trimmed = newText.trim();
            if (!trimmed || !user) return;
            try {
                await editMessageInFirestore(user.uid, messageId, trimmed);
            } catch (err) {
                setError(err.message || 'Failed to edit message.');
            }
        },
        [user]
    );

    const deleteMessage = useCallback(
        async (messageId) => {
            if (!user) return;
            try {
                await deleteMessageInFirestore(user.uid, messageId);
            } catch (err) {
                setError(err.message || 'Failed to delete message.');
            }
        },
        [user]
    );

    return {
        messages,
        loading,
        error,
        sending,
        supportTyping,
        sendMessage,
        editMessage,
        deleteMessage,
        currentUserId: user?.uid,
    };
}