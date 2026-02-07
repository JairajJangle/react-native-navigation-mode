import { renderHook, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';
import * as Module from '../index';
import NativeNavigationMode from '../NativeNavigationMode';

// Mock the native module
jest.mock('../NativeNavigationMode', () => ({
  __esModule: true,
  default: {
    getNavigationMode: jest.fn(),
    isGestureNavigation: jest.fn(),
    getNavigationBarHeight: jest.fn(),
  },
}));

describe('index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
  });

  describe('iOS implementation', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
    });

    it('getNavigationMode returns gesture navigation info for iOS', async () => {
      const result = await Module.getNavigationMode();
      expect(result).toEqual({
        type: 'gesture',
        isGestureNavigation: true,
        navigationBarHeight: 0,
      });
      expect(NativeNavigationMode!.getNavigationMode).not.toHaveBeenCalled();
    });

    it('isGestureNavigation returns true for iOS', async () => {
      const result = await Module.isGestureNavigation();
      expect(result).toBe(true);
      expect(NativeNavigationMode!.isGestureNavigation).not.toHaveBeenCalled();
    });

    it('getNavigationBarHeight returns 0 for iOS', async () => {
      const result = await Module.getNavigationBarHeight();
      expect(result).toBe(0);
      expect(
        NativeNavigationMode!.getNavigationBarHeight
      ).not.toHaveBeenCalled();
    });
  });

  describe('Android implementation', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('getNavigationMode delegates to native module', async () => {
      const mockInfo = { some: 'info' };
      (NativeNavigationMode!.getNavigationMode as jest.Mock).mockResolvedValue(
        mockInfo
      );

      const result = await Module.getNavigationMode();
      expect(result).toBe(mockInfo);
      expect(NativeNavigationMode!.getNavigationMode).toHaveBeenCalled();
    });

    it('isGestureNavigation delegates to native module', async () => {
      (
        NativeNavigationMode!.isGestureNavigation as jest.Mock
      ).mockResolvedValue(true);

      const result = await Module.isGestureNavigation();
      expect(result).toBe(true);
      expect(NativeNavigationMode!.isGestureNavigation).toHaveBeenCalled();
    });

    it('getNavigationBarHeight delegates to native module', async () => {
      (
        NativeNavigationMode!.getNavigationBarHeight as jest.Mock
      ).mockResolvedValue(48);

      const result = await Module.getNavigationBarHeight();
      expect(result).toBe(48);
      expect(NativeNavigationMode!.getNavigationBarHeight).toHaveBeenCalled();
    });
  });

  describe('useNavigationMode hook', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('should return loading initially', async () => {
      (NativeNavigationMode!.getNavigationMode as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => Module.useNavigationMode());
      expect(result.current.loading).toBe(true);
      expect(result.current.navigationMode).toBeNull();
    });

    it('should return data on success', async () => {
      const mockData = { type: '3_button' };
      (NativeNavigationMode!.getNavigationMode as jest.Mock).mockResolvedValue(
        mockData
      );

      const { result } = renderHook(() => Module.useNavigationMode());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.navigationMode).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should return error on failure', async () => {
      const mockError = new Error('Test error');
      (NativeNavigationMode!.getNavigationMode as jest.Mock).mockRejectedValue(
        mockError
      );

      const { result } = renderHook(() => Module.useNavigationMode());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.navigationMode).toBeNull();
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('Android fallback (NativeModule is null)', () => {
    beforeEach(() => {
      jest.resetModules();
      Platform.OS = 'android';
      jest.mock('../NativeNavigationMode', () => ({
        __esModule: true,
        default: null,
      }));
    });

    it('getNavigationMode returns default gesture info if module is null', async () => {
      const ReRequiredModule = require('../index');
      const result = await ReRequiredModule.getNavigationMode();
      expect(result).toEqual({
        type: 'gesture',
        isGestureNavigation: true,
        navigationBarHeight: 0,
      });
    });

    it('isGestureNavigation returns true if module is null', async () => {
      const ReRequiredModule = require('../index');
      const result = await ReRequiredModule.isGestureNavigation();
      expect(result).toBe(true);
    });

    it('getNavigationBarHeight returns 0 if module is null', async () => {
      const ReRequiredModule = require('../index');
      const result = await ReRequiredModule.getNavigationBarHeight();
      expect(result).toBe(0);
    });
  });
});
