import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Reusable Button component using TouchableOpacity.
 * Props:
 * - title: string or node (text shown inside button)
 * - onPress: function
 * - style: container style override
 * - textStyle: Text style override
 * - disabled: boolean
 * - loading: boolean (shows spinner)
 * - activeOpacity: number
 * - iconLeft / iconRight: React node (optional icons)
 * - accessibilityLabel: string
 */

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  activeOpacity = 0.7,
  iconLeft = null,
  iconRight = null,
  accessibilityLabel = 'button',
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <View style={styles.content}>
          {iconLeft ? <View style={styles.icon}>{iconLeft}</View> : null}
          {typeof title === 'string' ? (
            <Text style={[styles.text, textStyle]} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            title
          )}
          {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

Button.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onPress: PropTypes.func,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  activeOpacity: PropTypes.number,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  accessibilityLabel: PropTypes.string,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB', // default blue; override via style prop
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginHorizontal: 8,
  },
});

/*
Example usage:

import Button from './Button';
import { Ionicons } from '@expo/vector-icons';

<Button
  title="Sign in"
  onPress={() => console.log('pressed')}
  style={{ backgroundColor: '#10B981' }}
  iconLeft={<Ionicons name="log-in" size={18} color="#fff" />}
/>

Or with custom children (node):
<Button
  title={<View><Text>Left</Text><Text>Right</Text></View>}
  onPress={...}
/>
*/
