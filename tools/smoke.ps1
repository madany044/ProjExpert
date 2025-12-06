$base='http://localhost:5000'
$session=New-Object Microsoft.PowerShell.Commands.WebRequestSession
Write-Host 'Registering user...'
$reg=Invoke-RestMethod -Uri ($base + '/api/auth/register') -Method Post -Body (ConvertTo-Json @{ name='Smoke'; email='smoke@example.com'; password='secret123' }) -ContentType 'application/json' -WebSession $session
Write-Host 'Register response:'; $reg | Format-List
Write-Host 'Uploading file...'
$upload=Invoke-RestMethod -Uri ($base + '/api/uploads') -Method Post -Form @{ file = Get-Item 'C:\Users\admin\ProjXpert\tools\upload.txt' } -WebSession $session
Write-Host 'Upload response:'; $upload | Format-List
Write-Host 'Creating task with attachment...'
$taskBody = @{ title='Smoke Task'; description='Created by smoke test'; attachments = @($upload) }
$task = Invoke-RestMethod -Uri ($base + '/api/tasks') -Method Post -Body ($taskBody | ConvertTo-Json -Depth 5) -ContentType 'application/json' -WebSession $session
Write-Host 'Task created:'; $task | Format-List
Write-Host 'Smoke script completed.'
