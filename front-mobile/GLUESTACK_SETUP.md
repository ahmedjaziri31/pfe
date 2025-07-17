# Gluestack UI Setup Guide

## Installation

To use the enhanced login form with Gluestack UI, you need to install the following dependencies:

```bash
# Core Gluestack UI packages
npm install @gluestack-ui/themed @gluestack-ui/config

# Form handling
npm install react-hook-form @hookform/resolvers zod

# If you encounter any icon issues, you may also need:
npm install react-native-svg
```

## Configuration

The app is already configured with:
- ✅ GluestackUIProvider in `src/app/_layout.tsx`
- ✅ Custom color configuration in `src/config/gluestack-ui.config.js`
- ✅ Enhanced LoginCard component with modern design

## Features Implemented

### ✨ Enhanced Login Form
- Modern card-based design matching backoffice
- Form validation with Zod schema
- React Hook Form integration
- Custom color palette
- Loading states and error handling
- Responsive design with proper spacing

### 🎨 Design Elements
- Blue color scheme matching backoffice (`#2563eb`, `#3b82f6`)
- Consistent typography and spacing
- Shadow effects and rounded corners
- Focus states with blue accents
- Error states with red highlighting

### 🔧 Components Used
- `Box` - Container with styling
- `VStack`, `HStack` - Layout components
- `Input`, `InputField` - Form inputs
- `Button`, `ButtonText` - Interactive buttons
- `FormControl` - Form validation display
- `Checkbox` - Remember me functionality
- `Text` - Typography with consistent styling

## Troubleshooting

### SVG Errors
If you see SVG-related errors, make sure `react-native-svg` is installed and properly linked.

### Color Tokens
The custom color configuration is in `src/config/gluestack-ui.config.js`. All colors follow the format `$colorName` in components.

### Icons
The app uses Ionicons which are already configured. The Google icon uses `logo-google` from Ionicons. 