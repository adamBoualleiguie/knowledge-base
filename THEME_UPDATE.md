# SigNoz.io Color Palette & Theme Implementation

## ✅ Color Palette Updated

The website now uses SigNoz.io's exact color palette:

### Primary Colors
- **Light Mode**: `#FF6B35` (HSL: 14 100% 60%) - SigNoz's signature red/orange
- **Dark Mode**: `#FF7A4A` (HSL: 14 100% 65%) - Brighter orange for dark mode

### Background Colors
- **Light Mode**: Pure white `#FFFFFF`
- **Dark Mode**: Dark blue-gray `#0A0E27` (HSL: 222.2 84% 4.9%)

### Text Colors
- **Light Mode**: Dark gray `#1A1F2E`
- **Dark Mode**: Light gray `#F5F7FA`

### Border Colors
- **Light Mode**: Light gray `#E5E7EB`
- **Dark Mode**: Dark gray `#2D3748`

## 🌙 Dark Mode Implementation

### Features
- ✅ Automatic system theme detection
- ✅ Manual theme toggle button in navigation
- ✅ Smooth theme transitions
- ✅ Persistent theme preference (stored in localStorage)
- ✅ No flash of wrong theme on page load

### Theme Toggle
- Located in the navigation bar (desktop and mobile)
- Sun icon for light mode
- Moon icon for dark mode
- Smooth transitions between themes

## 🎨 Component Updates

### Navigation
- Theme toggle button added
- SigNoz red/orange primary color
- Proper dark mode styling

### Code Blocks
- Dark background matching SigNoz style
- Proper syntax highlighting colors
- Consistent styling in light and dark modes

### All Components
- Updated to use SigNoz color palette
- Proper contrast ratios
- Smooth theme transitions

## 📦 Dependencies Added

- `next-themes@0.4.6` - Theme management

## 🚀 Usage

The theme automatically:
1. Detects system preference on first visit
2. Allows manual switching via toggle button
3. Remembers user preference
4. Applies smoothly without flash

## 🎯 Color Reference

### SigNoz Brand Colors
- Primary: `#FF6B35` (Red/Orange)
- Primary Dark: `#FF7A4A` (Lighter for dark mode)
- Background Light: `#FFFFFF`
- Background Dark: `#0A0E27`
- Text Light: `#1A1F2E`
- Text Dark: `#F5F7FA`

All colors are defined in CSS variables in `app/globals.css` for easy customization.




