# ShuttleX Local APK Build Automation Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ShuttleX - Local APK Build Automation " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Detect & Configure Java JDK 17
$jdkFound = Get-ChildItem -Path "C:\Users\Damilola\.jdk17" -Filter "javac.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($jdkFound) {
    $env:JAVA_HOME = $jdkFound.Directory.Parent.FullName
    $env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
    Write-Host "[OK] JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
} else {
    Write-Host "[INFO] Standard JDK path will be used" -ForegroundColor Yellow
}

# 2. Configure Android SDK
$env:ANDROID_HOME = "C:\Users\Damilola\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;" + $env:PATH
Write-Host "[OK] ANDROID_HOME set to: $env:ANDROID_HOME" -ForegroundColor Green

# 3. Locate Flutter Executable
if (Test-Path "C:\Users\Damilola\flutter\bin\flutter.bat") {
    $flutterCmd = "C:\Users\Damilola\flutter\bin\flutter.bat"
} else {
    $puroFlutter = Get-ChildItem -Path "C:\Users\Damilola\.puro" -Filter "flutter.bat" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($puroFlutter) {
        $flutterCmd = $puroFlutter.FullName
    } else {
        $found = Get-Command flutter -ErrorAction SilentlyContinue
        if ($found) {
            $flutterCmd = $found.Source
        }
    }
}

if (-not $flutterCmd) {
    Write-Host "[!] Flutter executable not found in PATH or .puro." -ForegroundColor Yellow
    Write-Host "    You can also trigger automatic APK builds on GitHub Actions anytime by pushing to master!" -ForegroundColor Cyan
    exit 0
}

Write-Host "[OK] Using Flutter: $flutterCmd" -ForegroundColor Green

# 4. Build APK
Set-Location "c:\Users\Damilola\Downloads\shuttlex"
Write-Host "`n--> Fetching Flutter packages..." -ForegroundColor Cyan
& $flutterCmd pub get

Write-Host "`n--> Compiling Release APK with Mapbox Streets, Uber Splash, and Auth..." -ForegroundColor Cyan
& $flutterCmd build apk --release

$outputApk = "c:\Users\Damilola\Downloads\shuttlex\build\app\outputs\flutter-apk\app-release.apk"
if (Test-Path $outputApk) {
    Copy-Item $outputApk "c:\Users\Damilola\Downloads\shuttlex\ShuttleX-Release.apk" -Force
    Write-Host "`n[SUCCESS] APK Compiled Successfully!" -ForegroundColor Green
    Write-Host "Generated APK Location: c:\Users\Damilola\Downloads\shuttlex\ShuttleX-Release.apk" -ForegroundColor Green
} else {
    Write-Host "`n[INFO] Build process finished." -ForegroundColor Yellow
}
