import axiosInstance from '../axios-instance'

export interface VoiceConfig {
  model: 'whisper-1'
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed: number
}

export interface SpeechToTextResponse {
  success: boolean
  text: string
  error?: string
}

export interface TextToSpeechResponse {
  success: boolean
  audioUrl?: string
  error?: string
}

class VoiceService {
  private config: VoiceConfig = {
    model: 'whisper-1',
    voice: 'nova',
    speed: 1.0
  }

  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private isRecording = false

  /**
   * Check if browser supports voice features
   */
  isVoiceSupported(): boolean {
    return !!(navigator.mediaDevices && 
             navigator.mediaDevices.getUserMedia && 
             window.MediaRecorder &&
             window.speechSynthesis)
  }

  /**
   * Get microphone permission
   */
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      return false
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<boolean> {
    if (this.isRecording) return false

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      })

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start(1000) // Collect data every second
      this.isRecording = true
      
      return true
    } catch (error) {
      console.error('Failed to start recording:', error)
      return false
    }
  }

  /**
   * Stop recording and return audio blob
   */
  async stopRecording(): Promise<Blob | null> {
    if (!this.isRecording || !this.mediaRecorder) return null

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null)
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' })
        
        // Stop all tracks
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
        }
        
        this.isRecording = false
        this.mediaRecorder = null
        this.audioChunks = []
        
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
    })
  }

  /**
   * Convert speech to text using OpenAI Whisper
   */
  async speechToText(audioBlob: Blob): Promise<SpeechToTextResponse> {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('model', this.config.model)
      formData.append('language', 'auto') // Auto-detect language

      const response = await axiosInstance.post('/ai/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        success: true,
        text: response.data.text || ''
      }
    } catch (error: any) {
      console.error('Speech to text error:', error)
      return {
        success: false,
        text: '',
        error: error.response?.data?.error || error.message || 'Failed to convert speech to text'
      }
    }
  }

  /**
   * Convert text to speech using OpenAI TTS
   */
  async textToSpeech(text: string): Promise<TextToSpeechResponse> {
    try {
      const response = await axiosInstance.post('/ai/text-to-speech', {
        input: text,
        model: 'tts-1',
        voice: this.config.voice,
        speed: this.config.speed
      }, {
        responseType: 'blob'
      })

      // Create audio URL from blob
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)

      return {
        success: true,
        audioUrl
      }
    } catch (error: any) {
      console.error('Text to speech error:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to convert text to speech'
      }
    }
  }

  /**
   * Play audio from URL
   */
  async playAudio(audioUrl: string): Promise<boolean> {
    try {
      const audio = new Audio(audioUrl)
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl) // Clean up
          resolve(true)
        }
        
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl) // Clean up
          reject(new Error('Failed to play audio'))
        }
        
        audio.play().catch(reject)
      })
    } catch (error) {
      console.error('Failed to play audio:', error)
      return false
    }
  }

  /**
   * Update voice configuration
   */
  updateConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current voice configuration
   */
  getConfig(): VoiceConfig {
    return { ...this.config }
  }

  /**
   * Get recording status
   */
  getRecordingStatus(): boolean {
    return this.isRecording
  }

  /**
   * Cancel current recording
   */
  cancelRecording(): void {
    if (this.isRecording && this.mediaRecorder) {
      this.mediaRecorder.stop()
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
      }
      this.isRecording = false
      this.mediaRecorder = null
      this.audioChunks = []
    }
  }
}

export const voiceService = new VoiceService()
export default voiceService 
 
 