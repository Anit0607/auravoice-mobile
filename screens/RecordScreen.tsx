import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useAuth } from '../context/AuthContext';
import { uploadRecording, analyzeRecording } from '../api/client';

const SPEAKING_PROMPTS = [
  'Tell me about a time you had to convince someone.',
  'Describe your biggest achievement.',
  'What inspires you the most?',
  'Share your vision for the future.',
  'Tell me about a challenge you overcame.',
  'What makes you unique?',
  'Describe your ideal day.',
  'What are you passionate about?',
];

interface RecordScreenProps {
  navigation: any;
}

export const RecordScreen: React.FC<RecordScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Select random prompt
    setCurrentPrompt(SPEAKING_PROMPTS[Math.floor(Math.random() * SPEAKING_PROMPTS.length)]);
    
    // Request audio permissions
    requestAudioPermission();
  }, []);

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      stopRecording();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRecording, timeLeft]);

  const requestAudioPermission = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone access is required to record your voice.');
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      setTimeLeft(60);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!recordingRef.current) {
      Alert.alert('Error', 'No recording found');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Get the recording URI
      const uri = recordingRef.current.getURI();
      if (!uri) {
        Alert.alert('Error', 'Failed to get recording');
        return;
      }

      // Read the file and convert to base64
      const fileInfo = await fetch(uri);
      const blob = await fileInfo.blob();
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];

          // Upload recording
          const uploadResult = await uploadRecording(base64Audio);

          // Analyze recording
          const analysisResult = await analyzeRecording(uploadResult.recordingId);

          // Navigate to results
          navigation.navigate('Results', {
            score: analysisResult,
          });
        } catch (error) {
          console.error('Analysis error:', error);
          Alert.alert('Error', 'Failed to analyze recording. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to process recording');
      setIsAnalyzing(false);
    }
  };

  const handleReset = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
      setIsRecording(false);
      setTimeLeft(60);
      setCurrentPrompt(SPEAKING_PROMPTS[Math.floor(Math.random() * SPEAKING_PROMPTS.length)]);
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Record Your Voice</Text>
        </View>

        {/* Prompt Section */}
        <View style={styles.promptSection}>
          <Text style={styles.promptLabel}>Your Speaking Prompt:</Text>
          <Text style={styles.prompt}>{currentPrompt}</Text>
        </View>

        {/* Recording Visualization */}
        <View style={styles.visualizer}>
          {isRecording && (
            <>
              {[...Array(12)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    {
                      height: `${30 + Math.random() * 70}%`,
                      opacity: 0.5 + Math.random() * 0.5,
                    },
                  ]}
                />
              ))}
            </>
          )}
        </View>

        {/* Timer */}
        <View style={styles.timerSection}>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>
            {isRecording ? 'Recording...' : 'Ready to record'}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controls}>
          {!isRecording ? (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={startRecording}
              disabled={isAnalyzing}
            >
              <Text style={styles.recordButtonText}>🎤 Start Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.recordButton, styles.stopButton]}
              onPress={stopRecording}
            >
              <Text style={styles.recordButtonText}>⏹ Stop Recording</Text>
            </TouchableOpacity>
          )}

          {!isRecording && recordingRef.current && (
            <>
              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.analyzeButtonText}>Analyze My Aura</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                disabled={isAnalyzing}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Tips for Best Results:</Text>
          <Text style={styles.tip}>✓ Speak clearly and naturally</Text>
          <Text style={styles.tip}>✓ Avoid background noise</Text>
          <Text style={styles.tip}>✓ Use a steady pace</Text>
          <Text style={styles.tip}>✓ Be confident and authentic</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    color: '#d946ef',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  promptSection: {
    backgroundColor: 'rgba(217, 70, 239, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(217, 70, 239, 0.3)',
  },
  promptLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 120,
    marginBottom: 30,
    gap: 4,
  },
  bar: {
    width: 6,
    backgroundColor: '#d946ef',
    borderRadius: 3,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#d946ef',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  controls: {
    gap: 12,
    marginBottom: 30,
  },
  recordButton: {
    backgroundColor: '#d946ef',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  recordButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  analyzeButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0a0a0',
  },
  tips: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  tip: {
    fontSize: 13,
    color: '#a0a0a0',
    marginBottom: 6,
    lineHeight: 18,
  },
});
