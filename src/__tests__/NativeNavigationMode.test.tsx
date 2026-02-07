describe('Issue #20 Reproduction', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should log an error and return null when TurboModuleRegistry.getEnforcing is undefined on Android', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    jest.doMock('react-native', () => ({
      Platform: { OS: 'android', select: jest.fn() },
      TurboModuleRegistry: {
        // getEnforcing is undefined
      },
    }));

    const NativeModule = require('../NativeNavigationMode').default;

    expect(NativeModule).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "['react-native-navigation-mode'] TurboModuleRegistry.getEnforcing is not available. Make sure you have enabled the New Architecture (TurboModules) in your project."
    );

    consoleErrorSpy.mockRestore();
  });

  it('should return null if TurboModuleRegistry is undefined (paranoid check)', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    jest.doMock('react-native', () => ({
      Platform: { OS: 'android', select: jest.fn() },
      TurboModuleRegistry: undefined,
    }));

    const NativeModule = require('../NativeNavigationMode').default;
    expect(NativeModule).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "['react-native-navigation-mode'] TurboModuleRegistry.getEnforcing is not available. Make sure you have enabled the New Architecture (TurboModules) in your project."
    );
    consoleErrorSpy.mockRestore();
  });

  it('should return the module when TurboModuleRegistry.getEnforcing works', () => {
    const mockModule = {};
    jest.doMock('react-native', () => ({
      Platform: { OS: 'android', select: jest.fn() },
      TurboModuleRegistry: {
        getEnforcing: jest.fn(() => mockModule),
      },
    }));

    const NativeModule = require('../NativeNavigationMode').default;
    expect(NativeModule).toBe(mockModule);
  });
});
