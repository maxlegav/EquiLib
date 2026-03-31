import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../styles';
import { MessageBubble } from '../components/MessageBubble';
import { Button } from '../components/Button';
import { mockMessages, mockTriageResult } from '../data/mockData';
import { Message } from '../types/models';
import { useNavigation } from '@react-navigation/native';

const mockResponses = [
  'Je comprends ce que vous ressentez. C\'est tout à fait normal d\'éprouver cela. Pouvez-vous me dire depuis quand vous vivez cette situation ?',
  'Merci de partager cela avec moi. Ces sentiments sont importants. Est-ce que cela affecte votre quotidien, par exemple votre sommeil ou votre appétit ?',
  'Je vous entends. Avez-vous pu en parler avec quelqu\'un de votre entourage ?',
  'C\'est courageux de votre part d\'en parler. Comment décririez-vous votre niveau de stress en ce moment, sur une échelle de 1 à 10 ?',
  'Je comprends. Avez-vous déjà consulté un professionnel de santé mentale auparavant ?',
  'Merci pour votre confiance. D\'après ce que vous me décrivez, je pense qu\'une orientation pourrait vous être utile. Souhaitez-vous que je génère une analyse ?',
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
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: 'conv-1',
        role: 'assistant',
        content: mockResponses[responseIndex % mockResponses.length],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setResponseIndex(prev => prev + 1);

      // Show triage banner after a few exchanges
      if (responseIndex >= 2) {
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
            Orientation disponible — Voir votre analyse
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
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Écrivez votre message..."
          placeholderTextColor={Colors.gray700}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Button
          title="Envoyer"
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
