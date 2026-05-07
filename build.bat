@echo off
REM Wrapper that runs `make` under a POSIX bash so the canonical Makefile
REM works on a double-click or from cmd. Forwards any args to `make`.
REM
REM We prefer MSYS2 because it ships GNU Make in its default install. Git
REM for Windows ships bash but NOT make, so it's only usable when the user
REM has separately installed make and put it on bash's PATH.

setlocal

set "BASH_EXE="

REM 1. MSYS2 first — ships make out of the box.
if exist "C:\msys64\usr\bin\bash.exe" set "BASH_EXE=C:\msys64\usr\bin\bash.exe"
if not defined BASH_EXE if exist "C:\msys32\usr\bin\bash.exe" set "BASH_EXE=C:\msys32\usr\bin\bash.exe"

REM 2. Git Bash fallback — works only if make is separately installed.
if not defined BASH_EXE if exist "C:\Program Files\Git\bin\bash.exe" set "BASH_EXE=C:\Program Files\Git\bin\bash.exe"
if not defined BASH_EXE if exist "C:\Program Files (x86)\Git\bin\bash.exe" set "BASH_EXE=C:\Program Files (x86)\Git\bin\bash.exe"

if not defined BASH_EXE (
  echo [build.bat] error: no compatible bash found. Install MSYS2 -- recommended, ships make -- or Git for Windows plus make. 1>&2
  exit /b 1
)

REM MSYS2 strips the Windows PATH by default, so dotnet (installed under
REM C:\Program Files\dotnet) wouldn't be reachable from the spawned bash.
REM Setting MSYS2_PATH_TYPE=inherit tells msys2 to keep the parent's PATH.
set "MSYS2_PATH_TYPE=inherit"

REM Run from this script's directory.
"%BASH_EXE%" -lc "cd '%~dp0' && make %*"
exit /b %ERRORLEVEL%
