@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: KUDU Deployment Script
:: Version: 1.0.17
:: ----------------------

:: Prerequisites
:: -------------

:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
  goto error
)

:: Setup
:: -----

setlocal enabledelayedexpansion

SET ARTIFACTS=%~dp0%..\artifacts

IF NOT DEFINED DEPLOYMENT_SOURCE (
  SET DEPLOYMENT_SOURCE=%~dp0%.
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

IF NOT DEFINED KUDU_SYNC_CMD (
  :: Install kudu sync
  echo Installing Kudu Sync
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "kuduSync" would also work
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)
goto Deployment

:: Utility Functions
:: -----------------

:SelectNodeVersion

IF DEFINED KUDU_SELECT_NODE_VERSION_CMD (
  :: The following are done only on Windows Azure Websites environment
  call %KUDU_SELECT_NODE_VERSION_CMD% "%DEPLOYMENT_SOURCE%" "%DEPLOYMENT_TARGET%" "%DEPLOYMENT_TEMP%"
  IF !ERRORLEVEL! NEQ 0 goto error

  IF EXIST "%DEPLOYMENT_TEMP%\__nodeVersion.tmp" (
    SET /p NODE_EXE=<"%DEPLOYMENT_TEMP%\__nodeVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )
  
  IF EXIST "%DEPLOYMENT_TEMP%\__npmVersion.tmp" (
    SET /p NPM_JS_PATH=<"%DEPLOYMENT_TEMP%\__npmVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )

  IF NOT DEFINED NODE_EXE (
    SET NODE_EXE=node
  )

  SET NPM_CMD="!NODE_EXE!" "!NPM_JS_PATH!"
) ELSE (
  SET NPM_CMD=npm
  SET NODE_EXE=node
)

goto :EOF

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

:Deployment
echo Handling node.js deployment.

:: 0. Create empty lib\app.js to make KuduSync happy
:: see https://github.com/projectkudu/kudu/issues/1753
call :ExecuteCmd mkdir "%DEPLOYMENT_SOURCE%\lib"
call :ExecuteCmd copy NUL "%DEPLOYMENT_SOURCE%\lib\app.js"

:: 1. Select node version
call :SelectNodeVersion

:: 2. Install npm packages
IF EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  pushd "%DEPLOYMENT_SOURCE%"
  call :ExecuteCmd !NPM_CMD! install --production
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 3. Angular Prod Build
IF EXIST "%DEPLOYMENT_SOURCE%\angular.json" (
echo Building App in %DEPLOYMENT_SOURCE%…
pushd "%DEPLOYMENT_SOURCE%"
call :ExecuteCmd !NPM_CMD! run build
:: If the above command fails comment above and uncomment below one
:: call ./node_modules/.bin/ng build –prod
IF !ERRORLEVEL! NEQ 0 goto error
popd
)

:: 4. KuduSync
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%\dist" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

:: 5. Javascript files copy
mkdir "%DEPLOYMENT_TARGET%\javascripts"
mkdir "%DEPLOYMENT_TARGET%\stylesheets"
mkdir "%DEPLOYMENT_TARGET%\IoThub"
xcopy "%DEPLOYMENT_SOURCE%\src\javascripts" "%DEPLOYMENT_TARGET%\javascripts" /S /Y
xcopy "%DEPLOYMENT_SOURCE%\src\stylesheets" "%DEPLOYMENT_TARGET%\stylesheets" /S /Y
xcopy "%DEPLOYMENT_SOURCE%\IoThub" "%DEPLOYMENT_TARGET%\IoThub" /S /Y

xcopy "%DEPLOYMENT_SOURCE%\server.js" "%DEPLOYMENT_TARGET%" /Y
xcopy "%DEPLOYMENT_SOURCE%\package.js.json" "%DEPLOYMENT_TARGET%/package.json" /Y

IF EXIST "%DEPLOYMENT_TARGET%\package.json" (
  pushd "%DEPLOYMENT_TARGET%"
  call :ExecuteCmd !NPM_CMD! install 
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: mkdir .\wwwroot\javascripts
:: mkdir .\wwwroot\stylesheets 
:: mkdir .\wwwroot\IoThub 
:: xcopy .\repository\src\javascripts .\wwwroot\javascripts /S /Y 
:: xcopy .\repository\src\stylesheets .\wwwroot\stylesheets /S /Y 
:: xcopy .\repository\IoThub .\wwwroot\IoThub /S /Y 
:: xcopy .\repository\server.js .\wwwroot

:: mkdir .\wwwroot\node_modules
:: xcopy .\repository\node_modules .\wwwroot\node_modules  /S /Y 
:: mklink /D .\repository\node_modules .\wwwroot\node_modules

:: xcopy .\repository\package.json .\wwwroot\ /Y


::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.
