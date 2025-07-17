import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  IconMicrophone, 
  IconMicrophoneOff, 
  IconPlayerStop, 
  IconLoader2,
  IconVolume,
  IconWaveSine
} from '@tabler/icons-react'

interface VoiceRecorderProps {
  onStartRecording: () => Promise<boolean>
  onStopRecording: () => Promise<Blob | null>
  onTranscriptionComplete: (text: string) => void
  onError: (error: string) => void
  isProcessing?: boolean
  className?: string
  disabled?: boolean
}

export function VoiceRecorder({
  onStartRecording,
  onStopRecording,
  onTranscriptionComplete,
  onError,
  isProcessing = false,
  className,
  disabled = false
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const animationRef = useRef<number>()

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setRecordingTime(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  // Audio level animation
  useEffect(() => {
    if (isRecording) {
      const animate = () => {
        setAudioLevel(Math.random() * 100)
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setAudioLevel(0)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRecording])

  const handleStartRecording = async () => {
    try {
      const success = await onStartRecording()
      if (success) {
        setIsRecording(true)
      } else {
        onError('Failed to start recording. Please check microphone permissions.')
      }
    } catch (error) {
      onError('Error starting recording: ' + (error as Error).message)
    }
  }

  const handleStopRecording = async () => {
    try {
      setIsRecording(false)
      const audioBlob = await onStopRecording()
      
      if (audioBlob) {
        // Here you would typically send the blob for transcription
        // For now, we'll simulate the transcription process
        onTranscriptionComplete('Recording processed successfully')
      } else {
        onError('Failed to process recording')
      }
    } catch (error) {
      onError('Error stopping recording: ' + (error as Error).message)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getButtonVariant = () => {
    if (isRecording) return 'destructive'
    if (isProcessing) return 'secondary'
    return 'default'
  }

  const getButtonIcon = () => {
    if (isProcessing) return <IconLoader2 className="h-4 w-4 animate-spin" />
    if (isRecording) return <IconPlayerStop className="h-4 w-4" />
    return <IconMicrophone className="h-4 w-4" />
  }

  const getTooltipText = () => {
    if (disabled) return 'Voice input not available'
    if (isProcessing) return 'Processing audio...'
    if (isRecording) return 'Stop recording'
    return 'Start voice recording'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={getButtonVariant()}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={disabled || isProcessing}
              className={cn(
                'relative transition-all duration-200',
                isRecording && 'animate-pulse shadow-lg shadow-red-500/25'
              )}
            >
              {getButtonIcon()}
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute -top-1 -right-1">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-ping" />
                  <div className="absolute top-0 left-0 h-3 w-3 bg-red-500 rounded-full" />
                </div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Recording status */}
      {isRecording && (
        <div className="flex items-center gap-2 animate-fade-in">
          <Badge variant="destructive" className="flex items-center gap-1">
            <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
            REC
          </Badge>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <IconWaveSine className="h-3 w-3" />
            {formatTime(recordingTime)}
          </div>

          {/* Audio level indicator */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-1 bg-green-500 rounded-full transition-all duration-75',
                  audioLevel > i * 20 ? 'h-4 opacity-100' : 'h-1 opacity-30'
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="flex items-center gap-2 animate-fade-in">
          <Badge variant="secondary" className="flex items-center gap-1">
            <IconLoader2 className="h-3 w-3 animate-spin" />
            Processing...
          </Badge>
        </div>
      )}
    </div>
  )
} 
 
 