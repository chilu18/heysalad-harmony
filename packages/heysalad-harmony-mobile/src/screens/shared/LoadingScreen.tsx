import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Getting your workspace ready' }) => {
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate the progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../../assets/bereit.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressWidth }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: SPACING.xxl,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.xl,
  },
  progressBarContainer: {
    width: 250,
    height: 6,
    backgroundColor: COLORS.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});

export default LoadingScreen;