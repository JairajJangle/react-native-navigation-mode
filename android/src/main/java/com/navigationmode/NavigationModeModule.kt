package com.navigationmode

import android.content.Context
import android.content.res.Resources
import android.os.Build
import android.provider.Settings
import android.view.ViewConfiguration
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = NavigationModeModule.NAME)
class NavigationModeModule(reactContext: ReactApplicationContext) : 
    NativeNavigationModeSpec(reactContext) {
    
    companion object {
        const val NAME = "NavigationMode"
    }

    override fun getName(): String = NAME

    override fun getNavigationMode(promise: Promise) {
        try {
            val result = Arguments.createMap()
            val context = reactApplicationContext
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val navBarInteractionMode = getNavBarInteractionMode(context)
                result.putInt("interactionMode", navBarInteractionMode)
                result.putString("type", getNavigationTypeFromInteractionMode(navBarInteractionMode))
            }
            
            val gestureNavEnabled = isGestureNavigationEnabled(context)
            result.putBoolean("isGestureNavigation", gestureNavEnabled)
                        
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
                promise.resolve(navBarInteractionMode == 2)
            } else {
                val gestureEnabled = isGestureNavigationEnabled(context)
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

    private fun isGestureNavigationEnabled(context: Context): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                val navBarMode = Settings.Secure.getString(
                    context.contentResolver,
                    "navigation_mode"
                )
                "2" == navBarMode
            } catch (e: Exception) {
                false
            }
        } else false
    }
}