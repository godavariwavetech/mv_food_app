# Status Bar Background Color Fix

## Problem
The status bar was losing its background color when navigating between screens in the React Native app. This happened because each screen was setting its own StatusBar configuration, and the settings weren't being properly maintained during navigation transitions.

## Solution
I've implemented a comprehensive status bar management system that ensures consistent status bar behavior across all screens and navigation transitions.

## Components Created

### 1. StatusBarManager Component (`src/components/StatusBarManager.jsx`)
A reusable component that handles status bar configuration for individual screens.

**Usage:**
```jsx
// Option 1: Using screen name (recommended)
<StatusBarManager screenName="home" />

// Option 2: Using custom configuration
<StatusBarManager 
  backgroundColor="transparent" 
  barStyle="light-content" 
  translucent={true} 
/>
```

### 2. StatusBarListener Component (`src/navigation/StatusBarListener.jsx`)
A navigation listener that handles global status bar configuration and ensures proper reset during navigation.

### 3. Status Bar Configuration (`src/config/statusBarConfig.js`)
Centralized configuration for status bar settings across different screens.

**Available screen configurations:**
- `default` - Default transparent status bar
- `login` - Login screen
- `register` - Registration screen  
- `otpVerification` - OTP verification screen
- `home` - Home screen
- `categories` - Categories screen
- `restaurant` - Restaurant screen
- `cart` - Cart screen
- `profile` - Profile screen
- `onboarding` - Onboarding screens
- `support` - Support screen
- `feedback` - Feedback screen
- `address` - Address screens

## Implementation Steps

### 1. Update App.jsx
The main App component now includes:
- Global StatusBar configuration
- StatusBarListener for navigation state management

### 2. Update Individual Screens
Replace existing StatusBar components with StatusBarManager:

**Before:**
```jsx
<StatusBar backgroundColor={'transparent'} barStyle="light-content" translucent />
```

**After:**
```jsx
<StatusBarManager screenName="home" />
```

### 3. Add Import
Add the import statement to each screen:
```jsx
import StatusBarManager from '../../components/StatusBarManager';
```

## Key Features

1. **Navigation-Aware**: Uses `useFocusEffect` to reset status bar when screens come into focus
2. **Platform-Specific**: Handles Android and iOS differences automatically
3. **Centralized Configuration**: Easy to manage status bar settings for all screens
4. **Fallback Support**: Provides default configuration if screen-specific config is not found
5. **Animated Transitions**: Supports smooth status bar transitions

## How It Works

1. **Screen Focus**: When a screen comes into focus, the StatusBarManager automatically sets the correct status bar configuration
2. **Navigation State**: The StatusBarListener monitors navigation state changes and ensures proper status bar reset
3. **Configuration Lookup**: The system looks up the appropriate configuration based on screen name
4. **Platform Handling**: Automatically handles platform-specific status bar APIs

## Benefits

- ✅ Consistent status bar appearance across all screens
- ✅ No more lost background colors during navigation
- ✅ Easy to maintain and update status bar settings
- ✅ Platform-agnostic implementation
- ✅ Smooth transitions between screens

## Testing

To test the fix:
1. Navigate between different screens
2. Check that status bar background color is maintained
3. Verify that status bar style (light/dark content) is correct for each screen
4. Test on both Android and iOS devices

## Troubleshooting

If you still experience issues:

1. **Check Screen Names**: Ensure screen names in `statusBarConfig.js` match your actual screen names
2. **Import StatusBarManager**: Make sure StatusBarManager is imported in all screens
3. **Remove Old StatusBar**: Remove any existing StatusBar components from screens
4. **Check Navigation**: Ensure StatusBarListener is properly added to App.jsx

## Future Enhancements

- Add support for dynamic status bar configuration based on app theme
- Implement status bar animation configurations
- Add support for custom status bar styles per screen 