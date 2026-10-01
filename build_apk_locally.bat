@echo off
title ShuttleX - Local APK Builder
echo ========================================
echo   ShuttleX - Local APK Builder
echo ========================================
powershell -ExecutionPolicy Bypass -File "%~dp0build_apk_locally.ps1"
pause
