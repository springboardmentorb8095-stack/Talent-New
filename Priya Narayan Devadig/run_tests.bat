@echo off
REM Freelance Marketplace - Test Runner Script (Windows)
REM This script runs all backend and frontend tests with coverage

echo ==================================
echo Freelance Marketplace Test Suite
echo ==================================
echo.

set BACKEND_SUCCESS=0
set FRONTEND_SUCCESS=0

REM Backend Tests
echo Running Backend Tests...
echo -----------------------------------

where pytest >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    pytest --cov=. --cov-report=html --cov-report=term-missing
    if %ERRORLEVEL% EQU 0 (
        echo [32m✓ Backend tests passed[0m
        set BACKEND_SUCCESS=1
    ) else (
        echo [31m✗ Backend tests failed[0m
    )
) else (
    echo [31mpytest not found. Please install: pip install -r requirements.txt[0m
)

echo.
echo -----------------------------------
echo.

REM Frontend Tests
echo Running Frontend Tests...
echo -----------------------------------

if exist "frontend" (
    cd frontend
    
    if exist "package.json" (
        where npm >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            call npm test -- --coverage --watchAll=false
            if %ERRORLEVEL% EQU 0 (
                echo [32m✓ Frontend tests passed[0m
                set FRONTEND_SUCCESS=1
            ) else (
                echo [31m✗ Frontend tests failed[0m
            )
        ) else (
            echo [31mnpm not found. Please install Node.js[0m
        )
    ) else (
        echo [33mNo package.json found in frontend directory[0m
    )
    
    cd ..
) else (
    echo [33mFrontend directory not found[0m
)

echo.
echo ==================================
echo Test Summary
echo ==================================

if %BACKEND_SUCCESS% EQU 1 if %FRONTEND_SUCCESS% EQU 1 (
    echo [32m✓ All tests passed![0m
    echo.
    echo Coverage reports generated:
    echo   Backend:  htmlcov\index.html
    echo   Frontend: frontend\coverage\lcov-report\index.html
    exit /b 0
) else (
    echo [31m✗ Some tests failed[0m
    if %BACKEND_SUCCESS% EQU 0 echo   [31mBackend tests failed[0m
    if %FRONTEND_SUCCESS% EQU 0 echo   [31mFrontend tests failed[0m
    exit /b 1
)
