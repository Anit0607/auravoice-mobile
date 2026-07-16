import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../context/AuthContext';

interface ResultsScreenProps {
  route: any;
  navigation: any;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ route, navigation }) => {
  const { user } = useAuth();
  const score = route.params?.score;
  const [isPremium] = useState(false);

  if (!score) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No score data available</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎤 Check out my Aura Score! I got ${score.overallScore}/100 as "${score.archetype}". Test yours on AuraVoice! 🌟`,
        url: 'https://auravoice.app',
        title: 'My Aura Score',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleDownload = async () => {
    Alert.alert('Download', 'Scorecard download feature coming soon!');
  };

  const getArchetypeColor = (archetype: string) => {
    const colors: { [key: string]: string } = {
      'The Velvet Rebel': '#d946ef',
      'The Magnetic Leader': '#ec4899',
      'The Thoughtful Analyst': '#6366f1',
      'The Creative Dreamer': '#f59e0b',
      'The Confident Communicator': '#10b981',
    };
    return colors[archetype] || '#d946ef';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your Aura Score</Text>
        </View>

        {/* Scorecard */}
        <View style={styles.scorecard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{score.overallScore}</Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>

          <Text style={[styles.archetype, { color: getArchetypeColor(score.archetype) }]}>
            {score.archetype}
          </Text>
          <Text style={styles.archetypeDesc}>{score.archetypeDescription}</Text>
        </View>

        {/* Metrics (Free Tier) */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Your Metrics</Text>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Confidence</Text>
              <View style={styles.metricBar}>
                <View
                  style={[
                    styles.metricFill,
                    { width: `${score.confidenceScore}%`, backgroundColor: '#d946ef' },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{score.confidenceScore}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Clarity</Text>
              <View style={styles.metricBar}>
                <View
                  style={[
                    styles.metricFill,
                    { width: `${score.clarityScore}%`, backgroundColor: '#ec4899' },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{score.clarityScore}</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Pace</Text>
              <View style={styles.metricBar}>
                <View
                  style={[
                    styles.metricFill,
                    { width: `${score.paceScore}%`, backgroundColor: '#6366f1' },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{score.paceScore}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Filler Words</Text>
              <View style={styles.metricBar}>
                <View
                  style={[
                    styles.metricFill,
                    { width: `${score.fillerWordsScore}%`, backgroundColor: '#10b981' },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>{score.fillerWordsScore}</Text>
            </View>
          </View>
        </View>

        {/* Premium Features (Gated) */}
        {!isPremium && (
          <View style={styles.premiumSection}>
            <Text style={styles.premiumTitle}>✨ Unlock Premium Features</Text>
            <Text style={styles.premiumDesc}>
              Get personalized coaching tips, improvement roadmap, and detailed analysis
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade - ₹99/week</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Coaching Tips (Premium) */}
        {isPremium && score.coachingTips && (
          <View style={styles.coachingSection}>
            <Text style={styles.sectionTitle}>AI Coaching Tips</Text>
            {score.coachingTips.map((tip: string, index: number) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipNumber}>{index + 1}</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>📤 Share My Aura</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownload}
          >
            <Text style={styles.downloadButtonText}>⬇ Download Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.navigate('Record')}
          >
            <Text style={styles.retryButtonText}>🎤 Try Again</Text>
          </TouchableOpacity>
        </View>

        {/* Dashboard Link */}
        <TouchableOpacity
          style={styles.dashboardLink}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.dashboardLinkText}>View Your Score History →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  scorecard: {
    backgroundColor: 'rgba(217, 70, 239, 0.1)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(217, 70, 239, 0.3)',
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(217, 70, 239, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#d946ef',
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#d946ef',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  archetype: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  archetypeDesc: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 20,
  },
  metricsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  metricBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumSection: {
    backgroundColor: 'rgba(217, 70, 239, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(217, 70, 239, 0.4)',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  premiumDesc: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#d946ef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  coachingSection: {
    marginBottom: 30,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d946ef',
    marginRight: 12,
    minWidth: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#d946ef',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  downloadButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a0a0a0',
  },
  dashboardLink: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dashboardLinkText: {
    fontSize: 14,
    color: '#d946ef',
    fontWeight: '600',
  },
});
