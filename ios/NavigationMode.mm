#import "NavigationMode.h"

@implementation NavigationMode

RCT_EXPORT_MODULE()

- (void)getNavigationMode:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject {
    // iOS always uses gesture navigation - handled in TypeScript
    NSDictionary *result = @{
        @"type": @"gesture",
        @"isGestureNavigation": @YES,
        @"hasNavigationBar": @NO,
        @"sdkVersion": @([[NSProcessInfo processInfo] operatingSystemVersion].majorVersion),
        @"deviceModel": @"iOS"
    };
    resolve(result);
}

- (void)isGestureNavigation:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject {
    // iOS always uses gesture navigation - handled in TypeScript
    resolve(@YES);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeNavigationModeSpecJSI>(params);
}

@end