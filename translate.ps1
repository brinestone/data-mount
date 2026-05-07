$locales = @("fr");
$localesDir = Join-Path "src" "locales";

Write-Host "Extracting i18n messages";
# Use direct command if ng is in your path, or keep Invoke-Expression
ng extract-i18n --output-path $localesDir;
Write-Host "Messages extracted to $localesDir"

# Simple mock translation function
function Get-Translation {
  param([string]$Text, [string]$TargetLocale)

  $cleanText = $Text -replace " ", "+"
  $response = Invoke-WebRequest -Uri "https://ftapi.pythonanywhere.com/translate?sl=en&dl=$TargetLocale&text=$cleanText" -Method Get

  $responseObject = $response.Content | ConvertFrom-Json -AsHashtable

  return $responseObject."destination-text";
  # return "[$TargetLocale] $Text"
}

function Out-Truncated {
  param([string]$Text, [int]$Length = 10)
  if ($Text.Length -le $Length) { return $Text }
  return ($Text.Substring(0, $Length).Trim() + "...")
}

function Translate-File {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [Parameter(Mandatory = $true)]
    [string]$Locale
  )

  $xml = New-Object System.Xml.XmlDocument
  $xml.Load($Path)

  # XLIFF files use a namespace. We need this to query nodes.
  $nsManager = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
  $nsManager.AddNamespace("x", "urn:oasis:names:tc:xliff:document:1.2")

  # Find all translation units
  $units = $xml.SelectNodes("//x:trans-unit", $nsManager)

  foreach ($unit in $units) {
    $processed = $true
    $source = $unit.SelectSingleNode("x:source", $nsManager)

    if ($null -ne $source) {
      # Check if target already exists, if not, create it
      $target = $unit.SelectSingleNode("x:target", $nsManager)
      if ($null -eq $target) {
        $target = $xml.CreateElement("target", $xml.DocumentElement.NamespaceURI)
        $unit.AppendChild($target) | Out-Null

        # Perform the translation
        $translatedText = Get-Translation -Text $source.InnerText -TargetLocale $Locale
        if ($translatedText.Length -gt 0) {
          Write-Host "Translated en:'$(Out-Truncated -Text $source.InnerText -Length 10)' to $($Locale):'$(Out-Truncated -text $translatedText)'"
          $target.InnerText = $translatedText
          $processed = $true
        }
        else {
          Write-Warning "Failed to translate en:'$(Out-Truncated -Text $source.InnerText -Length 10)' to $locale"
        }
        Start-Sleep -Milliseconds 800
      }
    }
  }

  $xml.Save($Path)

  return $processed
}

if ($(Test-Path "angular.backup.json") -ne $true) {
  Write-Host "Backing up angular configuration..."
  Copy-Item .\angular.json ".\angular.backup.json"
}

foreach ($locale in $locales) {
  $filename = Join-Path $localesDir "messages.$locale.xlf"
  $baseFile = Join-Path $localesDir "messages.xlf"

  Write-Host "Processing locale: $locale";


  if ($(Test-Path $filename) -eq $false) {
    Write-Host "Creating resource file for locale: $locale"
    Copy-Item $baseFile $filename;
  }
  else {
    Write-Warning "Resource file for locale $($locale): '$filename' already exists. Skipping..."
  }

  # Translate the newly created file
  Translate-File -Path $filename -Locale $locale
  Write-Host "Translation completed for: $locale" -ForegroundColor Green

}
