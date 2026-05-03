@echo off
REM Wrapper that runs `make` under Git Bash so the canonical Makefile
REM works on a double-click or from cmd. Forwards any args to `make`.
REM Requires Git for Windows (provides bash) and `make` on the PATH.

setlocal

REM Try common Git Bash locations.
set "BASH_EXE="
if exist "C:\Program Files\Git\bin\bash.exe" set "BASH_EXE=C:\Program Files\Git\bin\bash.exe"
if not defined BASH_EXE if exist "C:\Program Files (x86)\Git\bin\bash.exe" set "BASH_EXE=C:\Program Files (x86)\Git\bin\bash.exe"
if not defined BASH_EXE (
  echo [build.bat] error: Git Bash not found. Install Git for Windows. 1>&2
  exit /b 1
)

REM Run from this script's directory.
"%BASH_EXE%" -lc "cd '%~dp0' && make %*"
exit /b %ERRORLEVEL%
