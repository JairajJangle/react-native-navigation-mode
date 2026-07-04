import { renderHook, waitFor, act } from '@testing-library/react-native';
import {
  Platform,
  Dimensions,
  AppState,
  type EmitterSubscription,
} from 'react-native';
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

  afterEach(() => {
    // Restore any spies installed by individual tests (e.g. on Dimensions/AppState).
    jest.restoreAllMocks();
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

    it('re-fetches navigation mode on a Dimensions change (rotation)', async () => {
      let dimsHandler: ((e: unknown) => void) | undefined;
      jest
        .spyOn(Dimensions, 'addEventListener')
        .mockImplementation((_type, handler) => {
          dimsHandler = handler as (e: unknown) => void;
          return { remove: jest.fn() } as unknown as EmitterSubscription;
        });

      const mock = NativeNavigationMode!.getNavigationMode as jest.Mock;
      mock
        .mockResolvedValueOnce({ type: '3_button', navigationBarHeight: 48 }) // portrait
        .mockResolvedValueOnce({ type: '3_button', navigationBarHeight: 24 }); // landscape

      const { result } = renderHook(() => Module.useNavigationMode());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.navigationMode).toEqual({
        type: '3_button',
        navigationBarHeight: 48,
      });

      // Simulate an orientation change firing the Dimensions 'change' event.
      await act(async () => {
        dimsHandler?.({
          window: { width: 800, height: 360, scale: 2, fontScale: 1 },
          screen: { width: 800, height: 360, scale: 2, fontScale: 1 },
        });
      });

      await waitFor(() =>
        expect(result.current.navigationMode).toEqual({
          type: '3_button',
          navigationBarHeight: 24,
        })
      );
      expect(mock).toHaveBeenCalledTimes(2);
      expect(result.current.loading).toBe(false); // never flips back to true
      expect(result.current.error).toBeNull();
    });

    it('does not flip loading to false from a superseded fetch', async () => {
      let dimsHandler: ((e: unknown) => void) | undefined;
      jest
        .spyOn(Dimensions, 'addEventListener')
        .mockImplementation((_type, handler) => {
          dimsHandler = handler as (e: unknown) => void;
          return { remove: jest.fn() } as unknown as EmitterSubscription;
        });

      const mock = NativeNavigationMode!.getNavigationMode as jest.Mock;
      let resolveFirst!: (v: unknown) => void;
      let resolveSecond!: (v: unknown) => void;
      mock
        .mockImplementationOnce(
          () => new Promise((resolve) => (resolveFirst = resolve))
        )
        .mockImplementationOnce(
          () => new Promise((resolve) => (resolveSecond = resolve))
        )
        .mockResolvedValue({ type: '3_button', navigationBarHeight: 24 });

      const { result } = renderHook(() => Module.useNavigationMode());
      expect(result.current.loading).toBe(true);

      // Rotation fires while the initial fetch is still in flight, superseding it.
      await act(async () => {
        dimsHandler?.({
          window: { width: 800, height: 360, scale: 2, fontScale: 1 },
          screen: { width: 800, height: 360, scale: 2, fontScale: 1 },
        });
      });

      // The superseded initial fetch resolving must not end the loading state:
      // consumers would briefly see loading=false with navigationMode=null.
      await act(async () => {
        resolveFirst({ type: '3_button', navigationBarHeight: 48 });
      });
      expect(result.current.loading).toBe(true);
      expect(result.current.navigationMode).toBeNull();

      await act(async () => {
        resolveSecond({ type: '3_button', navigationBarHeight: 24 });
      });
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.navigationMode).toEqual({
        type: '3_button',
        navigationBarHeight: 24,
      });
    });

    it('re-fetches again after a short delay post-rotation to catch late inset updates', async () => {
      jest.useFakeTimers();
      try {
        let dimsHandler: ((e: unknown) => void) | undefined;
        jest
          .spyOn(Dimensions, 'addEventListener')
          .mockImplementation((_type, handler) => {
            dimsHandler = handler as (e: unknown) => void;
            return { remove: jest.fn() } as unknown as EmitterSubscription;
          });

        const mock = NativeNavigationMode!.getNavigationMode as jest.Mock;
        mock
          .mockResolvedValueOnce({ type: '3_button', navigationBarHeight: 48 }) // initial (portrait)
          // Rotation fetch: on some devices rootWindowInsets has not updated
          // yet when Dimensions 'change' fires, so this still reads the
          // pre-rotation value.
          .mockResolvedValueOnce({ type: '3_button', navigationBarHeight: 48 })
          .mockResolvedValue({ type: '3_button', navigationBarHeight: 24 }); // settled

        const { result } = renderHook(() => Module.useNavigationMode());
        await act(async () => {}); // flush the initial fetch
        expect(result.current.loading).toBe(false);

        await act(async () => {
          dimsHandler?.({
            window: { width: 800, height: 360, scale: 2, fontScale: 1 },
            screen: { width: 800, height: 360, scale: 2, fontScale: 1 },
          });
        });
        expect(mock).toHaveBeenCalledTimes(2);
        expect(result.current.navigationMode).toEqual({
          type: '3_button',
          navigationBarHeight: 48, // stale — insets had not settled
        });

        // The delayed settle re-fetch picks up the corrected insets.
        await act(async () => {
          jest.advanceTimersByTime(1000);
        });
        expect(mock).toHaveBeenCalledTimes(3);
        expect(result.current.navigationMode).toEqual({
          type: '3_button',
          navigationBarHeight: 24,
        });
      } finally {
        jest.useRealTimers();
      }
    });

    it('cancels the pending post-rotation settle re-fetch on unmount', async () => {
      jest.useFakeTimers();
      try {
        let dimsHandler: ((e: unknown) => void) | undefined;
        jest
          .spyOn(Dimensions, 'addEventListener')
          .mockImplementation((_type, handler) => {
            dimsHandler = handler as (e: unknown) => void;
            return { remove: jest.fn() } as unknown as EmitterSubscription;
          });

        const mock = NativeNavigationMode!.getNavigationMode as jest.Mock;
        mock.mockResolvedValue({ type: '3_button', navigationBarHeight: 48 });

        const { unmount } = renderHook(() => Module.useNavigationMode());
        await act(async () => {}); // flush the initial fetch

        await act(async () => {
          dimsHandler?.({
            window: { width: 800, height: 360, scale: 2, fontScale: 1 },
            screen: { width: 800, height: 360, scale: 2, fontScale: 1 },
          });
        });
        expect(mock).toHaveBeenCalledTimes(2);

        unmount();
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        expect(mock).toHaveBeenCalledTimes(2); // no fetch after unmount
      } finally {
        jest.useRealTimers();
      }
    });

    it('re-fetches only when AppState becomes active, not on background', async () => {
      let appHandler: ((s: string) => void) | undefined;
      jest
        .spyOn(AppState, 'addEventListener')
        .mockImplementation((_type, handler) => {
          appHandler = handler as (s: string) => void;
          return { remove: jest.fn() };
        });

      const mock = NativeNavigationMode!.getNavigationMode as jest.Mock;
      mock
        .mockResolvedValueOnce({ type: '3_button', navigationBarHeight: 48 })
        .mockResolvedValueOnce({ type: 'gesture', navigationBarHeight: 0 });

      const { result } = renderHook(() => Module.useNavigationMode());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(mock).toHaveBeenCalledTimes(1);

      // Backgrounding must not trigger a re-fetch.
      await act(async () => appHandler?.('background'));
      expect(mock).toHaveBeenCalledTimes(1);

      // Returning to the foreground re-fetches (nav mode may have changed in Settings).
      await act(async () => appHandler?.('active'));
      await waitFor(() =>
        expect(result.current.navigationMode).toEqual({
          type: 'gesture',
          navigationBarHeight: 0,
        })
      );
      expect(mock).toHaveBeenCalledTimes(2);
    });

    it('removes Dimensions and AppState listeners on unmount', async () => {
      const dimsRemove = jest.fn();
      const appRemove = jest.fn();
      jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({
        remove: dimsRemove,
      } as unknown as EmitterSubscription);
      jest
        .spyOn(AppState, 'addEventListener')
        .mockReturnValue({ remove: appRemove });
      (NativeNavigationMode!.getNavigationMode as jest.Mock).mockResolvedValue({
        type: '3_button',
        navigationBarHeight: 48,
      });

      const { result, unmount } = renderHook(() => Module.useNavigationMode());
      await waitFor(() => expect(result.current.loading).toBe(false));

      unmount();
      expect(dimsRemove).toHaveBeenCalledTimes(1);
      expect(appRemove).toHaveBeenCalledTimes(1);
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
