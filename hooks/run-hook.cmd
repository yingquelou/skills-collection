@echo off
REM Cross-platform polyglot wrapper for hook scripts.
REM
REM DESIGN:
REM   Windows (cmd.exe): executes lines 1-47 (batch section) then exits.
REM   Unix (bash):       sees @echo off fail, then the entire Windows
REM                      batch section (lines 2-47) is consumed by a
REM                      bash heredoc (silently skipped), and finally
REM                      the Unix section (lines 49+) runs.
REM
REM Usage: run-hook.cmd <script-name> [args...]

if "%~1"=="" (
    echo run-hook.cmd: missing script name >&2
    exit /b 1
)

set "HOOK_DIR=%~dp0"

REM Try Git for Windows bash in standard locations
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)
if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    "C:\Program Files (x86)\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM Try bash on PATH (e.g. user-installed Git Bash, MSYS2, Cygwin)
where bash >nul 2>nul
if %ERRORLEVEL% equ 0 (
    bash "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)

REM No bash found -- exit silently rather than error.
REM (plugin still works, just without SessionStart context injection)
exit /b 0
: <<'__UNIX__'

REM Everything above is consumed as heredoc body by bash on Unix.
REM On Windows this line and below are never reached (exited above).

__UNIX__

# === Unix section (reached by bash after heredoc ends) ===
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_NAME="$1"
shift
exec bash "${SCRIPT_DIR}/${SCRIPT_NAME}" "$@"
