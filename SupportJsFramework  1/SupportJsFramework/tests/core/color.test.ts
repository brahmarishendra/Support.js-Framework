import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getLuminance,
  getContrastRatio,
  isAccessible,
  lighten,
  darken,
  saturate,
  desaturate,
  randomColor,
  generatePalette,
  parseColor
} from '../../src/core/color';

describe('Color utilities', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle hex without hash', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should handle 3-digit hex', () => {
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#00f')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBe(null);
      expect(hexToRgb('#gg0000')).toBe(null);
      expect(hexToRgb('#ff00')).toBe(null);
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('should handle values outside 0-255 range', () => {
      expect(rgbToHex(-10, 300, 128)).toBe('#00ff80');
    });

    it('should pad single digit hex values', () => {
      expect(rgbToHex(15, 15, 15)).toBe('#0f0f0f');
    });
  });

  describe('rgbToHsl', () => {
    it('should convert RGB to HSL', () => {
      expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
      expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
      expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
    });

    it('should handle grayscale colors', () => {
      expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 });
    });
  });

  describe('hslToRgb', () => {
    it('should convert HSL to RGB', () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
      expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
      expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle achromatic colors', () => {
      expect(hslToRgb(0, 0, 50)).toEqual({ r: 128, g: 128, b: 128 });
    });
  });

  describe('getLuminance', () => {
    it('should calculate luminance correctly', () => {
      expect(getLuminance(255, 255, 255)).toBeCloseTo(1);
      expect(getLuminance(0, 0, 0)).toBeCloseTo(0);
      expect(getLuminance(255, 0, 0)).toBeCloseTo(0.2126, 3);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio', () => {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      
      expect(getContrastRatio(white, black)).toBeCloseTo(21, 0);
      expect(getContrastRatio(white, white)).toBeCloseTo(1, 0);
      expect(getContrastRatio(black, black)).toBeCloseTo(1, 0);
    });
  });

  describe('isAccessible', () => {
    it('should check WCAG accessibility standards', () => {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      const gray = { r: 128, g: 128, b: 128 };
      
      expect(isAccessible(black, white, 'AA')).toBe(true);
      expect(isAccessible(black, white, 'AAA')).toBe(true);
      expect(isAccessible(gray, white, 'AA')).toBe(false);
    });
  });

  describe('lighten', () => {
    it('should lighten colors', () => {
      const result = lighten('#000000', 50);
      const rgb = hexToRgb(result);
      expect(rgb).not.toBeNull();
      if (rgb) {
        expect(rgb.r).toBeGreaterThan(0);
        expect(rgb.g).toBeGreaterThan(0);
        expect(rgb.b).toBeGreaterThan(0);
      }
    });

    it('should not exceed maximum lightness', () => {
      const result = lighten('#ffffff', 50);
      expect(result).toBe('#ffffff');
    });

    it('should handle invalid hex gracefully', () => {
      expect(lighten('invalid', 50)).toBe('invalid');
    });
  });

  describe('darken', () => {
    it('should darken colors', () => {
      const result = darken('#ffffff', 50);
      const rgb = hexToRgb(result);
      expect(rgb).not.toBeNull();
      if (rgb) {
        expect(rgb.r).toBeLessThan(255);
        expect(rgb.g).toBeLessThan(255);
        expect(rgb.b).toBeLessThan(255);
      }
    });

    it('should not go below minimum lightness', () => {
      const result = darken('#000000', 50);
      expect(result).toBe('#000000');
    });
  });

  describe('saturate', () => {
    it('should increase saturation', () => {
      const original = '#808080'; // Gray
      const saturated = saturate(original, 50);
      expect(saturated).not.toBe(original);
    });

    it('should not exceed maximum saturation', () => {
      const result = saturate('#ff0000', 50); // Already fully saturated
      expect(result).toBe('#ff0000');
    });
  });

  describe('desaturate', () => {
    it('should decrease saturation', () => {
      const original = '#ff0000'; // Fully saturated red
      const desaturated = desaturate(original, 50);
      expect(desaturated).not.toBe(original);
    });

    it('should not go below minimum saturation', () => {
      const gray = '#808080';
      const result = desaturate(gray, 50);
      expect(result).toBe(gray);
    });
  });

  describe('randomColor', () => {
    it('should generate valid hex colors', () => {
      for (let i = 0; i < 10; i++) {
        const color = randomColor();
        expect(color).toMatch(/^#[0-9A-F]{6}$/);
        expect(hexToRgb(color)).not.toBeNull();
      }
    });
  });

  describe('generatePalette', () => {
    it('should generate specified number of colors', () => {
      const palette = generatePalette('#ff0000', 5);
      expect(palette).toHaveLength(5);
      expect(palette[0]).toBe('#ff0000');
    });

    it('should generate different colors', () => {
      const palette = generatePalette('#ff0000', 3);
      expect(new Set(palette).size).toBe(3);
    });

    it('should handle invalid base color', () => {
      const palette = generatePalette('invalid', 3);
      expect(palette).toEqual(['invalid']);
    });
  });

  describe('parseColor', () => {
    it('should parse hex colors', () => {
      expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should parse rgb colors', () => {
      expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('rgba(255, 0, 0, 0.5)')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid colors', () => {
      expect(parseColor('invalid')).toBe(null);
      expect(parseColor('hsl(0, 100%, 50%)')).toBe(null);
    });
  });
});
