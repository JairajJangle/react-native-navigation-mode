require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "NavigationMode"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

  # No source files needed for iOS since we handle everything in JS
  s.source_files = "ios/NavigationMode.h"
  
  install_modules_dependencies(s)
end