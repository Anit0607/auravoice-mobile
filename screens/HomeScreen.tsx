import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, isAuthenticated, login } = useAuth();

  const handleTestMyAura = () => {
    if (isAuthenticated) {
      navigation.navigate('Record');
    } else {
      login();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✨ AuraVoice</Text>
          {isAuthenticated && user && (
            <Text style={styles.greeting}>Welcome, {user.name}</Text>
          )}
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Discover Your</Text>
          <Text style={styles.heroAura}>Aura Score</Text>
          <Text style={styles.heroSubtitle}>
            Record your voice. Let AI analyze your confidence, clarity, and charisma. Get your personalized Aura archetype and share it with the world.
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleTestMyAura}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Test My Aura</Text>
        </TouchableOpacity>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why AuraVoice?</Text>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎤</Text>
            <Text style={styles.featureTitle}>AI Voice Analysis</Text>
            <Text style={styles.featureDesc}>
              Advanced AI analyzes your voice for confidence, clarity, pace, and more
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Personality Archetype</Text>
            <Text style={styles.featureDesc}>
              Get a unique AI-generated personality archetype based on your voice
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureTitle}>Track Progress</Text>
            <Text style={styles.featureDesc}>
              Monitor your aura score over time and watch yourself improve
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔗</Text>
            <Text style={styles.featureTitle}>Share & Flex</Text>
            <Text style={styles.featureDesc}>
              Download your scorecard and share it on Instagram, WhatsApp, and more
            </Text>
          </View>
        </View>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Auras Analyzed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8★</Text>
            <Text style={styles.statLabel}>User Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100K+</Text>
            <Text style={styles.statLabel}>Shares</Text>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Simple Pricing</Text>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingTier}>Free</Text>
            <Text style={styles.pricingPrice}>₹0</Text>
            <Text style={styles.pricingFeature}>✓ Aura Score</Text>
            <Text style={styles.pricingFeature}>✓ Personality Archetype</Text>
            <Text style={styles.pricingFeature}>✓ Shareable Card</Text>
          </View>

          <View style={[styles.pricingCard, styles.premiumCard]}>
            <Text style={styles.pricingTier}>Premium</Text>
            <Text style={styles.pricingPrice}>₹99/week</Text>
            <Text style={styles.pricingFeature}>✓ Everything in Free</Text>
            <Text style={styles.pricingFeature}>✓ Detailed Metrics</Text>
            <Text style={styles.pricingFeature}>✓ AI Coaching Tips</Text>
            <Text style={styles.pricingFeature}>✓ Improvement Roadmap</Text>
          </View>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          style={styles.bottomCTA}
          onPress={handleTestMyAura}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomCTAText}>Start Your Aura Journey</Text>
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
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 8,
  },
  heroSection: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroAura: {
    fontSize: 40,
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #d946ef, #ec4899)',
    color: '#d946ef',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#d946ef',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(217, 70, 239, 0.2)',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
  socialProof: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(217, 70, 239, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d946ef',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  pricingSection: {
    marginBottom: 40,
  },
  pricingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(217, 70, 239, 0.2)',
  },
  premiumCard: {
    borderColor: '#d946ef',
    borderWidth: 2,
  },
  pricingTier: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d946ef',
    marginBottom: 16,
  },
  pricingFeature: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 8,
  },
  bottomCTA: {
    backgroundColor: '#d946ef',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  bottomCTAText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
