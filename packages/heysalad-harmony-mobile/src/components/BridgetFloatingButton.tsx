// src/components/BridgetFloatingButton.tsx
import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/colors';

interface BridgetFloatingButtonProps {
  position?: 'bottom-right' | 'bottom-center';
}

const BridgetFloatingButton: React.FC<BridgetFloatingButtonProps> = ({
  position = 'bottom-right',
}) => {
  const navigation = useNavigation();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePress = () => {
    navigation.navigate('BridgetCall' as never);
  };

  const handleLongPress = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getPositionStyle = () => {
    if (position === 'bottom-center') {
      return styles.positionBottomCenter;
    }
    return styles.positionBottomRight;
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          getPositionStyle(),
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          onLongPress={handleLongPress}
          onPressIn={startPulse}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="mic" size={28} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        {/* Tooltip */}
        {showTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>Talk to Bridget</Text>
          </View>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  positionBottomRight: {
    bottom: 90,
    right: 20,
  },
  positionBottomCenter: {
    bottom: 90,
    left: '50%',
    marginLeft: -32,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    position: 'absolute',
    bottom: 75,
    right: 0,
    backgroundColor: COLORS.text.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    ...SHADOWS.md,
  },
  tooltipText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default BridgetFloatingButton;