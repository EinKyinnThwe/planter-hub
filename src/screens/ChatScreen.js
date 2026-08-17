import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useChatMessages from '../hooks/useChatMessages';
import { SUPPORT_NAME, SUPPORT_ONLINE } from '../constants/chatConfig';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const formatMessageTime = (timestamp) => {
  if (!timestamp?.toDate) return '';
  return timestamp.toDate().toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ChatScreen = ({ navigation }) => {
  const {
    messages,
    loading,
    error,
    sending,
    supportTyping,
    sendMessage,
    editMessage,
    deleteMessage,
    currentUserId,
  } = useChatMessages();
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      // Small delay lets the FlatList finish laying out the new row first.
      const timeout = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [messages.length, supportTyping]);

  const handleSend = async () => {
    if (!text.trim()) return;

    if (editingId) {
      const idToEdit = editingId;
      const newText = text;
      setEditingId(null);
      setText('');
      await editMessage(idToEdit, newText);
      return;
    }

    const outgoing = text;
    setText('');
    await sendMessage(outgoing);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setText('');
  };

  const handleLongPressMessage = (item) => {
    if (item.senderId !== currentUserId) return; // only your own messages are editable/deletable

    Alert.alert('Message options', undefined, [
      {
        text: 'Edit',
        onPress: () => {
          setEditingId(item.id);
          setText(item.text);
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete message?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMessage(item.id) },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderMessage = ({ item }) => {
    const isMine = item.senderId === currentUserId;

    return (
      <TouchableOpacity
        activeOpacity={isMine ? 0.7 : 1}
        onLongPress={() => handleLongPressMessage(item)}
        style={[styles.bubbleRow, isMine ? styles.bubbleRowRight : styles.bubbleRowLeft]}
      >
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{item.text}</Text>
        </View>
        <Text style={styles.timeText}>
          {formatMessageTime(item.createdAt)}
          {item.edited ? ' · edited' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() && navigation.goBack()}
          hitSlop={8}
          style={styles.backButton}
        >
          {navigation.canGoBack() && <Text style={styles.backArrow}>{'\u2190'}</Text>}
        </TouchableOpacity>

        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🌿</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{SUPPORT_NAME}</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                !SUPPORT_ONLINE && !supportTyping && styles.statusDotOffline,
              ]}
            />
            <Text style={styles.statusText}>
              {supportTyping ? 'Typing…' : SUPPORT_ONLINE ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Message list */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>Say hello — we're happy to help!</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={
              supportTyping ? (
                <View style={[styles.bubbleRow, styles.bubbleRowLeft]}>
                  <View style={[styles.bubble, styles.bubbleTheirs, styles.typingBubble]}>
                    <Text style={styles.bubbleText}>•••</Text>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input bar */}
        {editingId && (
          <View style={styles.editingBanner}>
            <Text style={styles.editingBannerText}>Editing message</Text>
            <TouchableOpacity onPress={cancelEditing} hitSlop={6}>
              <Text style={styles.editingBannerCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor={COLORS.placeholder}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            <Text style={styles.sendButtonText}>{editingId ? '✓' : '➤'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  backButton: {
    width: 24,
  },
  backArrow: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  headerName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3FBA5A',
    marginRight: 4,
  },
  statusDotOffline: {
    backgroundColor: COLORS.textFaint,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  bubbleRow: {
    marginBottom: SPACING.md,
    maxWidth: '78%',
  },
  bubbleRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubbleRowRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  bubbleTheirs: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  typingBubble: {
    paddingVertical: SPACING.xs,
  },
  bubbleMine: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
  },
  bubbleTextMine: {
    color: COLORS.white,
  },
  timeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textFaint,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  editingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryLight,
  },
  editingBannerText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  editingBannerCancel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.danger,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    maxHeight: 100,
    marginRight: SPACING.sm,
  },
  sendButton: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
});

export default ChatScreen