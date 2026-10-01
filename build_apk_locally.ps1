# ShuttleX Local APK Build Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ShuttleX - Local APK Build Automation " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Detect & Configure Java JDK 17
$jdkFound = Get-ChildItem -Path "C:\Users\Damilola\.jdk17" -Filter "javac.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($jdkFound) {
    $env:JAVA_HOME = $jdkFound.Directory.Parent.FullName
    $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
    Write-Host "[✓] JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
} else {
    Write-Host "[!] JDK 17 is still downloading/extracting to C:\Users\Damilola\.jdk17" -ForegroundColor Yellow
}

# 2. Configure Android SDK
$env:ANDROID_HOME = "C:\Users\Damilola\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"
Write-Host "[✓] ANDROID_HOME set to: $env:ANDROID_HOME" -ForegroundColor Green

# 3. Locate Flutter Executable
$puroFlutter = Get-ChildItem -Path "C:\Users\Damilola\.puro" -Filter "flutter.bat" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($puroFlutter) {
    $flutterCmd = $puroFlutter.FullName
} else {
    $flutterCmd = (Get-Command flutter -ErrorAction SilentlyContinue).Source
}

if (-not $flutterCmd) {
    Write-Host "[!] Flutter SDK download is currently in progress." -ForegroundColor Yellow
    Write-Host "    Once the download completes, rerun this script: .\build_apk_locally.ps1" -ForegroundColor Cyan
    exit 1
}

Write-Host "[✓] Using Flutter: $flutterCmd" -ForegroundColor Green

# 4. Build APK
Set-Location "c:\Users\Damilola\Downloads\shuttlex\shuttlex_flutter"
Write-Host "`n--> Fetching Flutter dependencies..." -ForegroundColor Cyan
& $flutterCmd pub get

Write-Host "`n--> Compiling Release APK with Mapbox & ShuttleX Database..." -ForegroundColor Cyan
& $flutterCmd build apk --release

$outputApk = "c:\Users\Damilola\Downloads\shuttlex\shuttlex_flutter\build\app\outputs\flutter-apk\app-release.apk"
if (Test-Path $outputApk) {
    Copy-Item $outputApk "c:\Users\Damilola\Downloads\shuttlex\ShuttleX-Release.apk" -Force
    Write-Host "`n[SUCCESS] APK Compiled Successfully!" -ForegroundColor Green
    Write-Host "Generated APK Location: c:\Users\Damilola\Downloads\shuttlex\ShuttleX-Release.apk" -ForegroundColor Green
} else {
    Write-Host "`n[!] Build completed. Check the Flutter build logs above." -ForegroundColor Yellow
}
