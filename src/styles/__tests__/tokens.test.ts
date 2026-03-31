/**
 * Unit tests for design tokens
 * 
 * Validates that all design tokens are correctly defined and accessible.
 */

import { Colors, Typography, Spacing, BorderRadius } from '../tokens';

describe('Design Tokens', () => {
  describe('Colors', () => {
    it('should define Doctolib blue primary color', () => {
      expect(Colors.doctolibBlue).toBe('#0596DE');
    });

    it('should define deep night blue', () => {
      expect(Colors.deepNightBlue).toBe('#0A1628');
    });

    it('should define electric blue', () => {
      expect(Colors.electricBlue).toBe('#2563EB');
    });

    it('should define all neutral colors', () => {
      expect(Colors.white).toBe('#FFFFFF');
      expect(Colors.gray50).toBe('#F9FAFB');
      expect(Colors.gray100).toBe('#F3F4F6');
      expect(Colors.gray200).toBe('#E5E7EB');
      expect(Colors.gray700).toBe('#374151');
      expect(Colors.gray900).toBe('#111827');
    });

    it('should define all semantic colors', () => {
      expect(Colors.success).toBe('#10B981');
      expect(Colors.warning).toBe('#F59E0B');
      expect(Colors.error).toBe('#EF4444');
      expect(Colors.crisis).toBe('#DC2626');
    });
  });

  describe('Typography', () => {
    it('should define h1 typography', () => {
      expect(Typography.h1).toEqual({
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
      });
    });

    it('should define h2 typography', () => {
      expect(Typography.h2).toEqual({
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
      });
    });

    it('should define h3 typography', () => {
      expect(Typography.h3).toEqual({
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
      });
    });

    it('should define body typography', () => {
      expect(Typography.body).toEqual({
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
      });
    });

    it('should define bodyBold typography', () => {
      expect(Typography.bodyBold).toEqual({
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
      });
    });

    it('should define caption typography', () => {
      expect(Typography.caption).toEqual({
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
      });
    });

    it('should define small typography', () => {
      expect(Typography.small).toEqual({
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
      });
    });
  });

  describe('Spacing', () => {
    it('should define all spacing values', () => {
      expect(Spacing.xs).toBe(4);
      expect(Spacing.sm).toBe(8);
      expect(Spacing.md).toBe(16);
      expect(Spacing.lg).toBe(24);
      expect(Spacing.xl).toBe(32);
      expect(Spacing.xxl).toBe(48);
    });

    it('should follow a consistent scale', () => {
      // Verify spacing roughly doubles at each step
      expect(Spacing.sm).toBe(Spacing.xs * 2);
      expect(Spacing.md).toBe(Spacing.sm * 2);
      expect(Spacing.lg).toBe(Spacing.md * 1.5);
      expect(Spacing.xl).toBe(Spacing.lg * 4 / 3);
      expect(Spacing.xxl).toBe(Spacing.xl * 1.5);
    });
  });

  describe('BorderRadius', () => {
    it('should define all border radius values', () => {
      expect(BorderRadius.sm).toBe(8);
      expect(BorderRadius.md).toBe(12);
      expect(BorderRadius.lg).toBe(16);
      expect(BorderRadius.full).toBe(9999);
    });

    it('should have full radius for circular elements', () => {
      expect(BorderRadius.full).toBeGreaterThan(1000);
    });
  });
});
