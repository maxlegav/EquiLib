import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../styles';
import { MessageBubble } from '../components/MessageBubble';
import { PractitionerSuggestion } from '../components/PractitionerSuggestion';
import { Button } from '../components/Button';
import { mockMessages, mockTriageResult } from '../data/mockData';
import { Message } from '../types/models';
import { useNavigation } from '@react-navigation/native';

const mockResponses = [
  "ouch, that's a lot to carry 😔 what's weighing on you the most right now — work or not being able to sleep?",
  "yeah, ruminating at night is pretty classic when your brain just won't clock out from work... how long has this been going on roughly?",
  "ok, I'm getting a clearer picture. what you're describing — ruminations, insomnia, burnout at work since a specific change — sounds like chronic stress and I'd really recommend getting some support. I found 3 people who could genuinely help with what you're going through.",
];

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);
  const [showTriageBanner, setShowTriageBanner] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: 'conv-1',
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');

    // Mock AI response
    if (responseIndex >= mockResponses.length) return;

    setTimeout(() => {
      const nextIndex = responseIndex;
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: 'conv-1',
        role: 'assistant',
        content: mockResponses[nextIndex],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setResponseIndex(prev => prev + 1);

      // Show triage banner after the 3rd AI response
      if (nextIndex === 2) {
        setShowTriageBanner(true);
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {showTriageBanner && (
        <TouchableOpacity
          style={styles.triageBanner}
          onPress={() => navigation.navigate('Triage' as never)}
        >
          <Text style={styles.triageBannerText}>
            Referral available — View your analysis
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={responseIndex >= 3 ? <PractitionerSuggestion /> : null}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={Colors.gray700}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Button
          title="Send"
          onPress={handleSend}
          variant="primary"
          disabled={!inputText.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  messageList: {
    paddingVertical: Spacing.md,
  },
  triageBanner: {
    backgroundColor: Colors.doctolibBlue,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  triageBannerText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    backgroundColor: Colors.gray50,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
  },
});
