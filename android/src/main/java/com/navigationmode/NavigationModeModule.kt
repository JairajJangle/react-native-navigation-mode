package com.navigationmode

import android.app.Activity
import android.content.Context
import android.content.res.Resources
import android.os.Build
import android.provider.Settings
import android.view.WindowInsets
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = NavigationModeModule.NAME)
class NavigationModeModule(reactContext: ReactApplicationContext) :
    NativeNavigationModeSpec(reactContext) {

    companion object {
        const val NAME = "NavigationMode"
    }

    override fun getName(): String = NAME

    private fun getNavigationBarHeight(context: Context): Int {
        // Try to get Activity for WindowInsets
        val activity = if (context is Activity) context else reactApplicationContext.currentActivity
        val density = context.resources.displayMetrics.density // Get device density

        if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val insets = activity.window.decorView.rootWindowInsets
            if (insets != null) {
                val navBar = insets.getInsets(WindowInsets.Type.navigationBars()) ?: return 0
                return (navBar.bottom / density).toInt() // Convert pixels to dp
            }
        }

        // Fallback to resource-based approach for API < 30
        val resources = context.resources
        val resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android")
        return if (resourceId > 0) {
            // getDimensionPixelSize returns pixels, convert to dp
            (resources.getDimensionPixelSize(resourceId) / density).toInt()
        } else {
            0 // Fallback for devices without a navigation bar
        }
    }

    override fun getNavigationBarHeight(promise: Promise) {
        try {
            val context = reactApplicationContext
            val navBarHeight = getNavigationBarHeight(context)
            promise.resolve(navBarHeight)
        } catch (e: Exception) {
            promise.reject("NAV_BAR_HEIGHT_ERROR", "Failed to get navigation bar height: ${e.message}", e)
        }
    }

    override fun getNavigationMode(promise: Promise) {
        try {
            val result = Arguments.createMap()
            val context = reactApplicationContext

            // Use reactApplicationContext for navigation bar height
            val navBarHeight = getNavigationBarHeight(context)
            result.putInt("navigationBarHeight", navBarHeight)

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val navBarInteractionMode = getNavBarInteractionMode(context)
                val isGesture = if (navBarInteractionMode == 2) true else isGestureNavigationEnabledLegacy(context)
                result.putInt("interactionMode", navBarInteractionMode)
                result.putString(
                    "type",
                    if (isGesture) "gesture" else getNavigationTypeFromInteractionMode(navBarInteractionMode)
                )
                result.putBoolean("isGestureNavigation", isGesture)
            } else {
                val gestureNavEnabled = isGestureNavigationEnabledLegacy(context)
                result.putBoolean("isGestureNavigation", gestureNavEnabled)
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("NAVIGATION_MODE_ERROR", "Failed to get navigation mode: ${e.message}", e)
        }
    }

    override fun isGestureNavigation(promise: Promise) {
        try {
            val context = reactApplicationContext

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val navBarInteractionMode = getNavBarInteractionMode(context)
                val isGesture = if (navBarInteractionMode == 2) true else isGestureNavigationEnabledLegacy(context)
                promise.resolve(isGesture)
            } else {
                val gestureEnabled = isGestureNavigationEnabledLegacy(context)
                promise.resolve(gestureEnabled)
            }
        } catch (e: Exception) {
            promise.reject("GESTURE_NAV_ERROR", "Failed to check gesture navigation: ${e.message}", e)
        }
    }

    private fun getNavBarInteractionMode(context: Context): Int {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                val resources = context.resources
                val resourceId = resources.getIdentifier("config_navBarInteractionMode", "integer", "android")
                if (resourceId > 0) {
                    resources.getInteger(resourceId)
                } else -1
            } catch (e: Exception) {
                -1
            }
        } else -1
    }

    private fun getNavigationTypeFromInteractionMode(mode: Int): String {
        return when (mode) {
            0 -> "3_button"
            1 -> "2_button"
            2 -> "gesture"
            else -> "unknown"
        }
    }

  private fun isGestureNavigationEnabledLegacy(context: Context): Boolean {
    // Legacy fallback using Settings.Secure (for pre-Android Q devices)
    // or as a backup when config_navBarInteractionMode is not available
    try {
      val navBarMode = Settings.Secure.getString(
        context.contentResolver,
        "navigation_mode"
      )
      if ("2" == navBarMode) {
        return true
      }
      if ("0" == navBarMode || "1" == navBarMode) {
        return false
      }
    } catch (e: Exception) {
      // Ignore and continue with OEM-specific fallbacks
    }

    val huaweiNavigationBarMinGlobal = getGlobalIntSetting(context, "navigationbar_is_min")
    if (huaweiNavigationBarMinGlobal != null) {
      return huaweiNavigationBarMinGlobal == 1
    }

    val huaweiSecureGesture = getSecureIntSetting(context, "secure_gesture_navigation")
    if (huaweiSecureGesture != null) {
      return huaweiSecureGesture == 1
    }

    val xiaomiForceGesture = getGlobalIntSetting(context, "force_fsg_nav_bar")
    if (xiaomiForceGesture != null) {
      return xiaomiForceGesture == 1
    }

    val samsungNavigationGesture = getSecureIntSetting(context, "navigation_gesture_on")
    if (samsungNavigationGesture != null) {
      return samsungNavigationGesture == 1
    }

    return false
  }

  private fun getSecureIntSetting(context: Context, key: String): Int? {
    return try {
      Settings.Secure.getInt(context.contentResolver, key)
    } catch (e: Exception) {
      null
    }
  }

  private fun getGlobalIntSetting(context: Context, key: String): Int? {
    return try {
      Settings.Global.getInt(context.contentResolver, key)
    } catch (e: Exception) {
      null
    }
  }
}
