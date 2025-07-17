import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconPlayerStop,
  IconVolume,
  IconVolumeOff,
  IconLoader2,
  IconSpeakerphone
} from '@tabler/icons-react'

interface VoicePlayerProps {
  audioUrl?: string
  text: string
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onGenerateAudio?: (text: string) => Promise<string | null>
  isGenerating?: boolean
  className?: string
  autoPlay?: boolean
  showText?: boolean
}

export function VoicePlayer({
  audioUrl,
  text,
  onPlay,
  onPause,
  onStop,
  onGenerateAudio,
  isGenerating = false,
  className,
  autoPlay = false,
  showText = true
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [hasAudio, setHasAudio] = useState(!!audioUrl)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Initialize audio when URL changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl
      setHasAudio(true)
      
      if (autoPlay) {
        // Wait for audio to be ready and try to play
        const tryAutoPlay = async () => {
          try {
            // Ensure audio is loaded
            if (audioRef.current) {
              await audioRef.current.load()
              // Try to play
              await handlePlay()
              console.log('Auto-play successful')
            }
          } catch (error) {
            console.warn('Auto-play blocked by browser:', error)
            // Fallback: just prepare the audio for manual play
            if (audioRef.current) {
              audioRef.current.load()
            }
          }
        }
        
        // Small delay to ensure component is ready
        setTimeout(tryAutoPlay, 200)
      }
    }
  }, [audioUrl, autoPlay])

  // Update time progress
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onStop?.()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onStop])

  const handlePlay = async () => {
    if (!audioRef.current) return

    try {
      // Ensure the audio is ready
      if (audioRef.current.readyState < 2) {
        await new Promise((resolve) => {
          const handleCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay)
            resolve(void 0)
          }
          audioRef.current?.addEventListener('canplay', handleCanPlay)
        })
      }
      
      await audioRef.current.play()
      setIsPlaying(true)
      onPlay?.()
      console.log('Audio playback started successfully')
    } catch (error) {
      console.error('Error playing audio:', error)
      // Try to show user why auto-play failed
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.warn('Auto-play was prevented by browser policy. User interaction required.')
      }
    }
  }

  const handlePause = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setIsPlaying(false)
    onPause?.()
  }

  const handleStop = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
    onStop?.()
  }

  const handleGenerateAudio = async () => {
    if (!onGenerateAudio) return

    try {
      const newAudioUrl = await onGenerateAudio(text)
      if (newAudioUrl && audioRef.current) {
        audioRef.current.src = newAudioUrl
        setHasAudio(true)
        if (autoPlay) {
          handlePlay()
        }
      }
    } catch (error) {
      console.error('Error generating audio:', error)
    }
  }

  const handleVolumeToggle = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn('flex flex-col gap-2 p-3 rounded-lg border bg-muted/30', className)}>
      <audio ref={audioRef} preload="metadata" />
      
      {/* Main controls */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {/* Play/Pause/Generate button */}
          {!hasAudio ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleGenerateAudio}
                  disabled={isGenerating || !onGenerateAudio}
                  className="h-8 w-8"
                >
                  {isGenerating ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <IconSpeakerphone className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isGenerating ? 'Generating audio...' : 'Generate audio'}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={isPlaying ? "default" : "outline"}
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="h-8 w-8"
                >
                  {isPlaying ? (
                    <IconPlayerPause className="h-4 w-4" />
                  ) : (
                    <IconPlayerPlay className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? 'Pause' : 'Play'}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Stop button */}
          {hasAudio && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleStop}
                  disabled={!isPlaying && currentTime === 0}
                  className="h-8 w-8"
                >
                  <IconPlayerStop className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Volume control */}
          {hasAudio && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleVolumeToggle}
                  className="h-8 w-8"
                >
                  {isMuted ? (
                    <IconVolumeOff className="h-4 w-4" />
                  ) : (
                    <IconVolume className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? 'Unmute' : 'Mute'}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>

        {/* Status indicators */}
        <div className="flex items-center gap-2 ml-auto">
          {isGenerating && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <IconLoader2 className="h-3 w-3 animate-spin" />
              Generating...
            </Badge>
          )}
          
          {isPlaying && (
            <Badge variant="default" className="flex items-center gap-1 text-xs">
              <IconVolume className="h-3 w-3" />
              Playing
            </Badge>
          )}

          {hasAudio && !isPlaying && !isGenerating && (
            <Badge variant="outline" className="text-xs">
              Ready
            </Badge>
          )}
        </div>
      </div>

      {/* Progress bar and time */}
      {hasAudio && duration > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="min-w-[35px]">{formatTime(currentTime)}</span>
          <Progress value={progressPercentage} className="flex-1 h-1" />
          <span className="min-w-[35px]">{formatTime(duration)}</span>
        </div>
      )}

      {/* Text preview */}
      {showText && text && (
        <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded border-l-2 border-primary/20">
          <div className="flex items-center gap-1 mb-1">
            <IconSpeakerphone className="h-3 w-3" />
            <span className="font-medium">Audio Text:</span>
          </div>
          <p className="line-clamp-2">{text}</p>
        </div>
      )}
    </div>
  )
} 
 
 