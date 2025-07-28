Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
strPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Change to the application directory
objShell.CurrentDirectory = strPath

' Run the application
objShell.Run "npm start", 1, False

' Wait a moment for the application to start
WScript.Sleep 2000

' Check if the application is running
Set objProcesses = GetObject("winmgmts:").ExecQuery("Select * From Win32_Process Where Name = 'electron.exe'")

If objProcesses.Count > 0 Then
    WScript.Echo "ColinTvii IPTV Player is now running!"
Else
    WScript.Echo "Failed to start ColinTvii. Please check the console for errors."
End If 