# Design Tokens

This directory contains the design tokens for the EquiLib iOS app, following Doctolib's professional medical interface aesthetic.

## Overview

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They help maintain consistency across the application.

## Available Tokens

### Colors

Primary colors for the Doctolib-inspired interface:

- **Primary Colors**: `doctolibBlue`, `deepNightBlue`, `electricBlue`
- **Neutral Colors**: `white`, `gray50`, `gray100`, `gray200`, `gray700`, `gray900`
- **Semantic Colors**: `success`, `warning`, `error`, `crisis`

### Typography

Typography scale with font sizes, weights, and line heights:

- `h1`: 32px, bold (700), 40px line height
- `h2`: 24px, semibold (600), 32px line height
- `h3`: 20px, semibold (600), 28px line height
- `body`: 16px, regular (400), 24px line height
- `bodyBold`: 16px, semibold (600), 24px line height
- `caption`: 14px, regular (400), 20px line height
- `small`: 12px, regular (400), 16px line height

### Spacing

Consistent spacing scale for margins, padding, and gaps:

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Border Radius

Corner radius values for UI elements:

- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `full`: 9999px (for circular elements)

## Usage Examples

### Importing Tokens

```typescript
import { Colors, Typography, Spacing, BorderRadius } from '@/styles';
```

### Using in StyleSheet

```typescript
import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.doctolibBlue,
    marginBottom: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.doctolibBlue,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
  },
});
```

### Using in Components

```typescript
import { View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '@/styles';

export const Card = ({ title, children }) => (
  <View
    style={{
      backgroundColor: Colors.white,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      shadowColor: Colors.gray900,
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }}
  >
    <Text style={{ ...Typography.h3, color: Colors.deepNightBlue }}>
      {title}
    </Text>
    {children}
  </View>
);
```

### Crisis Alert Example

```typescript
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/styles';

export const CrisisAlert = () => (
  <View
    style={{
      backgroundColor: Colors.crisis,
      padding: Spacing.lg,
      borderRadius: BorderRadius.md,
      margin: Spacing.md,
    }}
  >
    <Text style={{ ...Typography.h3, color: Colors.white }}>
      🚨 Aide Immédiate Disponible
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: BorderRadius.sm,
        marginTop: Spacing.sm,
      }}
    >
      <Text style={{ ...Typography.bodyBold, color: Colors.crisis }}>
        📞 Appeler le 3114
      </Text>
    </TouchableOpacity>
  </View>
);
```

## Design Principles

1. **Consistency**: Always use tokens instead of hardcoded values
2. **Accessibility**: Maintain minimum 4.5:1 contrast ratio for text
3. **Professional**: Follow Doctolib's medical interface aesthetic
4. **Scalability**: Use spacing scale for consistent visual rhythm

## Requirements Validation

This implementation validates the following requirements:

- **Requirement 12.1**: Professional medical interface with Doctolib blue (#0596DE)
- **Requirement 12.2**: Clean white backgrounds with gray separators
- **Requirement 12.3**: Card-based layouts with subtle shadows and rounded corners
- **Requirement 12.4**: Clean sans-serif typography with clear hierarchy
