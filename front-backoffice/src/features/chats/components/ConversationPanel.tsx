import { Fragment, useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  IconArrowLeft,
  IconDotsVertical,
  IconPhone,
  IconVideo,
  IconPlus,
  IconPhotoPlus,
  IconPaperclip,
  IconSend,
  IconLoader2,
  IconRobot,
  IconDatabase,
  IconMicrophone,
  IconVolume,
  IconSettings,
} from '@tabler/icons-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatUser, Convo } from '../data/chat-types';
import { aiService, type ChatMessage } from '@/api/services/ai-service';
import { toast } from '@/hooks/use-toast';
import { VoiceRecorder } from '@/components/ui/voice-recorder';
import { VoicePlayer } from '@/components/ui/voice-player';

type ConversationPanelProps = {
  selectedUser: ChatUser;
  mobileSelectedUser: ChatUser | null;
  onBack: () => void;
};

export function ConversationPanel({ selectedUser, mobileSelectedUser, onBack }: ConversationPanelProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [lastInputWasVoice, setLastInputWasVoice] = useState(false);
  const [autoPlayAudioRef, setAutoPlayAudioRef] = useState<HTMLAudioElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to auto-click the play button for voice responses
  const autoClickPlayButton = (messageId: string) => {
    console.log('Attempting to auto-click play button for message:', messageId);
    
    // Try multiple times with increasing delays to ensure the button is rendered
    const attemptClick = (attempt: number = 1) => {
      setTimeout(() => {
        // Look for the most recent voice player play button
        const voicePlayers = document.querySelectorAll('.voice-player-auto-click');
        if (voicePlayers.length > 0) {
          const lastVoicePlayer = voicePlayers[voicePlayers.length - 1];
          // Try multiple selectors to find the play button
          const playButton = lastVoicePlayer.querySelector('button[aria-label*="Play"], button:not([aria-label*="Pause"]):not([aria-label*="Stop"]):not([aria-label*="Volume"]):has([class*="play"])') as HTMLButtonElement;
          
          if (playButton && !playButton.disabled) {
            console.log('Found and clicking play button, attempt:', attempt);
            playButton.click();
            
            toast({
              title: "🔊 Auto-playing response",
              description: "Voice response is playing automatically",
              variant: "default",
              duration: 2000
            });
            return;
          }
        }
        
        // Fallback: try to find any play button in the chat
        const allPlayButtons = document.querySelectorAll('button[aria-label*="Play"]');
        if (allPlayButtons.length > 0 && attempt <= 2) {
          const lastButton = allPlayButtons[allPlayButtons.length - 1] as HTMLButtonElement;
          if (!lastButton.disabled) {
            console.log('Found fallback play button, clicking it, attempt:', attempt);
            lastButton.click();
            
            toast({
              title: "🔊 Auto-playing response",
              description: "Voice response is playing automatically",
              variant: "default",
              duration: 2000
            });
            return;
          }
        }
        
        // If not found and we haven't exceeded max attempts, try again
        if (attempt < 4) {
          console.log('Play button not ready, retrying attempt:', attempt + 1);
          attemptClick(attempt + 1);
        } else {
          console.log('Failed to find play button after multiple attempts');
          toast({
            title: "🔊 Audio ready",
            description: "Click the play button to hear the response",
            variant: "default",
            duration: 3000
          });
        }
      }, attempt * 400); // Increasing delay: 400ms, 800ms, 1200ms, etc.
    };
    
    attemptClick();
  };

  const isAIChat = selectedUser.id === 'ai';

  // Check voice support on component mount
  useEffect(() => {
    setVoiceSupported(aiService.isVoiceSupported());
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiMessages]);

  // Focus input when AI chat is selected
  useEffect(() => {
    if (isAIChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAIChat]);

  // Voice handling functions
  const handleStartRecording = async (): Promise<boolean> => {
    if (!voiceSupported) return false;

    const hasPermission = await aiService.requestMicrophonePermission();
    if (!hasPermission) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive"
      });
      return false;
    }

    const started = await aiService.startVoiceRecording();
    if (started) {
      setIsRecording(true);
    }
    return started;
  };

  const handleStopRecording = async (): Promise<Blob | null> => {
    const audioBlob = await aiService.stopVoiceRecording();
    setIsRecording(false);
    
    if (audioBlob) {
      setIsProcessingVoice(true);
      try {
        const transcription = await aiService.speechToText(audioBlob);
        if (transcription.success && transcription.text) {
          // Set the transcribed text in the input field
          setMessage(transcription.text);
          
          // Mark that this input came from voice
          setLastInputWasVoice(true);
          console.log('Voice input detected and flagged for auto-play');
          
          // Show a brief preview of the transcribed text
          toast({
            title: "Voice Transcribed",
            description: `"${transcription.text.substring(0, 50)}${transcription.text.length > 50 ? '...' : ''}"`,
            variant: "default"
          });
          
          // Auto-send the transcribed message immediately to maintain user gesture
          setTimeout(() => {
            // Create a synthetic form event
            const syntheticEvent = {
              preventDefault: () => {},
              target: { value: transcription.text }
            } as React.FormEvent;
            
            handleSendMessage(syntheticEvent, transcription.text);
          }, 500); // Shorter delay to maintain user gesture context
        } else {
          toast({
            title: "Transcription Failed",
            description: transcription.error || "Could not convert speech to text.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Voice Processing Error",
          description: "Failed to process voice input.",
          variant: "destructive"
        });
      } finally {
        setIsProcessingVoice(false);
      }
    }
    
    return audioBlob;
  };

  const handleVoiceError = (error: string) => {
    toast({
      title: "Voice Error",
      description: error,
      variant: "destructive"
    });
    setIsRecording(false);
    setIsProcessingVoice(false);
  };

  const handleTranscriptionComplete = (text: string) => {
    setMessage(text);
  };

  const handleGenerateAudio = async (text: string): Promise<string | null> => {
    if (!voiceSupported) return null;

    setIsGeneratingAudio(true);
    try {
      const audioResponse = await aiService.textToSpeech(text);
      if (audioResponse.success && audioResponse.audioUrl) {
        return audioResponse.audioUrl;
      } else {
        toast({
          title: "Audio Generation Failed",
          description: audioResponse.error || "Could not generate audio.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Audio Generation Error",
        description: "Failed to generate audio response.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const playAudioDirectly = async (audioUrl: string): Promise<boolean> => {
    try {
      console.log('Attempting to play audio directly:', audioUrl);
      
      // Create a new audio element to preserve user gesture
      const audio = new Audio(audioUrl);
      setAutoPlayAudioRef(audio);
      
      // Configure audio
      audio.preload = 'auto';
      audio.volume = 1.0;
      
      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(void 0);
        };
        
        const handleError = (e: any) => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          reject(new Error('Audio failed to load'));
        };
        
        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
        
        // Start loading
        audio.load();
      });
      
      // Try to play
      await audio.play();
      console.log('Audio started playing successfully');
      
      // Clean up when audio ends
      audio.addEventListener('ended', () => {
        setAutoPlayAudioRef(null);
      });
      
      return true;
    } catch (error) {
      console.error('Direct audio play failed:', error);
      setAutoPlayAudioRef(null);
      return false;
    }
  };

  const handleSendMessage = async (e: React.FormEvent, overrideMessage?: string) => {
    e.preventDefault();
    
    const messageToSend = overrideMessage || message.trim();
    if (!messageToSend || isLoading) return;

    if (!isAIChat) {
      toast({
        title: "Not implemented",
        description: "Human-to-human chat is not yet implemented in this demo.",
        variant: "default"
      });
      return;
    }

    const userMessage = aiService.createUserMessage(messageToSend);
    setAiMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Determine if this is a backoffice query or regular chat
      const isBackofficeQuery = aiService.isBackofficeQuery(messageToSend);
      console.log('Message routing - isBackofficeQuery:', isBackofficeQuery, 'for message:', messageToSend);
      
      let response;
      if (isBackofficeQuery) {
        console.log('Taking backoffice path for DB queries');
        // Send to backoffice AI for database insights
        response = await aiService.sendBackofficeQuery(messageToSend);
        
        // Format the response with SQL query if available
        const formattedResponse = aiService.formatBackofficeResponse(response);
        
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'AI Backoffice Assistant',
          message: formattedResponse,
          timestamp: response.timestamp,
          isAI: true
        };
        
        setAiMessages(prev => [...prev, aiMessage]);

        // Generate and auto-play audio for AI response if voice was used and voice is enabled
        if (voiceEnabled && response.success) {
          console.log('Backoffice: Voice enabled and response successful, lastInputWasVoice:', lastInputWasVoice);
          if (lastInputWasVoice) {
            // Auto-generate and play audio for voice input responses
            console.log('Backoffice: Voice input detected, generating and auto-playing audio...');
            const audioUrl = await handleGenerateAudio(response.response);
            if (audioUrl) {
              // Update message with audio URL
              setAiMessages(prev => 
                prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, audioUrl } 
                    : msg
                )
              );
              
              // Try to play audio directly (preserving user gesture)
              autoClickPlayButton(aiMessage.id);
            }
            
            // Voice flag will be reset at the end of message processing
          } else {
            // Just generate audio for manual play for text input
            handleGenerateAudio(response.response).then(audioUrl => {
              if (audioUrl) {
                setAiMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, audioUrl } 
                      : msg
                  )
                );
              }
            });
          }
        }
        
        if (!response.success) {
          toast({
            title: "Query Error",
            description: response.error || "Failed to process backoffice query",
            variant: "destructive"
          });
        }
      } else {
        console.log('Taking regular chat path for general questions');
        // Send to regular chatbot
        response = await aiService.sendChatMessage(messageToSend);
        const aiMessage = aiService.createAIMessage(response);
        setAiMessages(prev => [...prev, aiMessage]);

        // Generate and auto-play audio for AI response if voice was used and voice is enabled
        if (voiceEnabled && response.success) {
          console.log('Regular chat: Voice enabled and response successful, lastInputWasVoice:', lastInputWasVoice);
          if (lastInputWasVoice) {
            // Auto-generate and play audio for voice input responses
            console.log('Regular chat: Voice input detected, generating and auto-playing audio...');
            const audioUrl = await handleGenerateAudio(response.response);
            if (audioUrl) {
              // Update message with audio URL
              setAiMessages(prev => 
                prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, audioUrl } 
                    : msg
                )
              );
              
              // Try to play audio directly (preserving user gesture)
              autoClickPlayButton(aiMessage.id);
            }
            
            // Voice flag will be reset at the end of message processing
          } else {
            // Just generate audio for manual play for text input
            handleGenerateAudio(response.response).then(audioUrl => {
              if (audioUrl) {
                setAiMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, audioUrl } 
                      : msg
                  )
                );
              }
            });
          }
        }
        
        if (!response.success) {
          toast({
            title: "Chat Error",
            description: response.error || "Failed to send message",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'AI Assistant',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isAI: true
      };
      setAiMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach AI service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Reset voice input flag after all processing is complete (with delay for audio processing)
      if (lastInputWasVoice) {
        setTimeout(() => {
          console.log('Resetting voice input flag after all message processing');
          setLastInputWasVoice(false);
        }, 2000); // 2 second delay to allow audio generation and auto-click to complete
      }
    }
  };

  // For non-AI chats, use the original messages
  // For AI chats, use the dynamic AI messages
  const messagesToShow = isAIChat ? aiMessages : selectedUser.messages;

  // Group messages by date for non-AI chats
  const groupedMessages = isAIChat 
    ? { [format(new Date(), 'd MMM, yyyy')]: aiMessages }
    : messagesToShow.reduce((acc: Record<string, (Convo | ChatMessage)[]>, msg) => {
    const dateKey = format(new Date(msg.timestamp), 'd MMM, yyyy');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div
      className={cn(
        'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
        mobileSelectedUser && 'left-0 flex'
      )}
    >
      {/* Conversation Header */}
      <div className="mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg">
        <div className="flex gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="-ml-2 h-full sm:hidden"
            onClick={onBack}
          >
            <IconArrowLeft />
          </Button>
          <div className="flex items-center gap-2 lg:gap-4">
            <Avatar className="size-9 lg:size-11">
              <AvatarImage src={selectedUser.profile} alt={selectedUser.username} />
              <AvatarFallback>
                {isAIChat ? <IconRobot size={20} /> : selectedUser.username}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium lg:text-base">
                {selectedUser.fullName}
              </span>
              <span className="mt-1 text-xs text-muted-foreground lg:text-sm flex items-center gap-1">
                {isAIChat && <IconRobot size={12} />}
                {selectedUser.title}
                {isAIChat && (
                  <>
                    <span className="mx-1">•</span>
                    <IconDatabase size={12} />
                    <span>Backoffice AI</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="-mr-1 flex items-center gap-1 lg:gap-2">
          {/* Voice controls for AI chat */}
          {isAIChat && voiceSupported && (
            <div className="flex items-center gap-2 mr-2">
              <div className="flex items-center gap-1">
                <Switch
                  id="voice-mode"
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                  size="sm"
                />
                <Label htmlFor="voice-mode" className="text-xs hidden sm:inline">
                  Voice
                </Label>
              </div>
              
              {voiceEnabled && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <IconVolume size={10} />
                  <span className="hidden sm:inline">Auto-play</span>
                </Badge>
              )}
            </div>
          )}

          {!isAIChat && (
            <>
          <Button size="icon" variant="ghost" className="hidden size-8 rounded-full sm:inline-flex lg:size-10">
            <IconVideo size={22} className="stroke-muted-foreground" />
          </Button>
          <Button size="icon" variant="ghost" className="hidden size-8 rounded-full sm:inline-flex lg:size-10">
            <IconPhone size={22} className="stroke-muted-foreground" />
          </Button>
            </>
          )}
          <Button size="icon" variant="ghost" className="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6">
            <IconDotsVertical className="stroke-muted-foreground sm:size-5" />
          </Button>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0">
        <div className="flex flex-1">
          <div className="chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden">
            <div 
              ref={chatContainerRef}
              className="chat-flex flex w-full flex-grow flex-col justify-start gap-3 overflow-y-auto py-2 pb-4 pr-4"
            >
              {Object.keys(groupedMessages).reverse().map((dateKey) => (
                <Fragment key={dateKey}>
                  <div className="text-center text-xs">{dateKey}</div>
                  {groupedMessages[dateKey].map((msg, index) => {
                    const isFromUser = msg.sender === 'You';
                    const isFromAI = msg.sender.includes('AI') || 'isAI' in msg;
                    
                    return (
                    <div
                      key={`${msg.sender}-${msg.timestamp}-${index}`}
                      className={cn(
                        'chat-box m-1 max-w-72 break-words px-3 py-2 shadow-lg',
                          isFromUser
                          ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                            : isFromAI
                            ? 'self-start rounded-[16px_16px_16px_0] bg-blue-50 border-l-4 border-blue-400 dark:bg-blue-950 dark:border-blue-600'
                          : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                      )}
                    >
                        {isFromAI && (
                          <div className="flex items-center gap-1 mb-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                            {msg.sender.includes('Backoffice') ? <IconDatabase size={12} /> : <IconRobot size={12} />}
                            {msg.sender.includes('Backoffice') ? 'Data Insights' : 'AI Assistant'}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{msg.message}</div>
                        
                        {/* Voice player for AI messages */}
                        {isFromAI && voiceEnabled && (
                          <VoicePlayer
                            audioUrl={(msg as ChatMessage).audioUrl}
                            text={msg.message}
                            onGenerateAudio={handleGenerateAudio}
                            isGenerating={isGeneratingAudio}
                            className="mt-2 voice-player-auto-click"
                            showText={false}
                            autoPlay={(msg as ChatMessage).autoPlay || false}
                          />
                        )}
                        
                      <span
                        className={cn(
                          'mt-1 block text-xs font-light italic text-muted-foreground',
                            isFromUser && 'text-right'
                        )}
                      >
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </span>
                    </div>
                    );
                  })}
                </Fragment>
              ))}
              
              {/* Voice processing indicator */}
              {isProcessingVoice && (
                <div className="self-start m-1 max-w-72 px-3 py-2 rounded-[16px_16px_16px_0] bg-green-50 border-l-4 border-green-400 dark:bg-green-950 dark:border-green-600">
                  <div className="flex items-center gap-2">
                    <IconLoader2 size={16} className="animate-spin text-green-600" />
                    <span className="text-sm text-green-600">Processing voice...</span>
                  </div>
                </div>
              )}

              {/* Auto-play audio indicator */}
              {autoPlayAudioRef && (
                <div className="self-start m-1 max-w-72 px-3 py-2 rounded-[16px_16px_16px_0] bg-purple-50 border-l-4 border-purple-400 dark:bg-purple-950 dark:border-purple-600">
                  <div className="flex items-center gap-2">
                    <IconVolume size={16} className="text-purple-600 animate-pulse" />
                    <span className="text-sm text-purple-600">Auto-playing response...</span>
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="self-start m-1 max-w-72 px-3 py-2 rounded-[16px_16px_16px_0] bg-blue-50 border-l-4 border-blue-400 dark:bg-blue-950 dark:border-blue-600">
                  <div className="flex items-center gap-2">
                    <IconLoader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-sm text-blue-600">AI is thinking...</span>
                  </div>
                </div>
              )}

              {/* Welcome message for AI chat */}
              {isAIChat && aiMessages.length === 0 && !isLoading && (
                <div className="self-center text-center text-sm text-muted-foreground p-4 space-y-2">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                      <IconRobot size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="font-medium">Welcome to AI Assistant!</p>
                  <p>Ask me about:</p>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <IconRobot size={12} />
                      <span>General real estate questions</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <IconDatabase size={12} />
                      <span>Database insights & analytics</span>
                    </div>
                  </div>
                  {voiceEnabled && (
                    <div className="mt-3 p-2 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                        <IconVolume size={12} />
                        <span className="text-xs font-medium">Voice mode active - Responses will auto-play</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Message Input Form */}
        <form className="flex w-full flex-none gap-2" onSubmit={handleSendMessage}>
          <div className="flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4">
            {/* Voice recorder for AI chat */}
            {isAIChat && voiceSupported && voiceEnabled && (
              <VoiceRecorder
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onTranscriptionComplete={handleTranscriptionComplete}
                onError={handleVoiceError}
                isProcessing={isProcessingVoice}
                disabled={isLoading}
              />
            )}

            {!isAIChat && (
            <div className="space-x-1">
              <Button size="icon" type="button" variant="ghost" className="h-8 rounded-md">
                <IconPlus size={20} className="stroke-muted-foreground" />
              </Button>
              <Button size="icon" type="button" variant="ghost" className="hidden h-8 rounded-md lg:inline-flex">
                <IconPhotoPlus size={20} className="stroke-muted-foreground" />
              </Button>
              <Button size="icon" type="button" variant="ghost" className="hidden h-8 rounded-md lg:inline-flex">
                <IconPaperclip size={20} className="stroke-muted-foreground" />
              </Button>
            </div>
            )}
            <label className="flex-1">
              <span className="sr-only">Chat Text Box</span>
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isProcessingVoice 
                    ? "Processing voice input..."
                    : isRecording 
                    ? "Recording..."
                    : isAIChat 
                    ? (voiceEnabled ? "Type or speak your message..." : "Ask me anything about real estate or your data...")
                    : "Type your messages..."
                }
                className="h-8 w-full bg-inherit focus-visible:outline-none"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  // Reset voice flag when user types
                  if (e.target.value && lastInputWasVoice) {
                    setLastInputWasVoice(false);
                  }
                }}
                disabled={isLoading || isRecording || isProcessingVoice}
              />
            </label>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:inline-flex"
              type="submit"
              disabled={!message.trim() || isLoading || isRecording || isProcessingVoice}
            >
              {isLoading || isProcessingVoice ? (
                <IconLoader2 size={20} className="animate-spin" />
              ) : (
              <IconSend size={20} />
              )}
            </Button>
          </div>
          <Button 
            className="h-full sm:hidden" 
            type="submit"
            disabled={!message.trim() || isLoading || isRecording || isProcessingVoice}
          >
            {isLoading || isProcessingVoice ? (
              <IconLoader2 size={18} className="animate-spin mr-2" />
            ) : (
              <IconSend size={18} className="mr-2" />
            )}
            {isProcessingVoice ? "Processing" : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
