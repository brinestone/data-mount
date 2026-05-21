$locales = @("fr")
$localesDir = Join-Path "src" "locales"
$baseFile = Join-Path $localesDir "messages.xlf"
$ns = @{ x = "urn:oasis:names:tc:xliff:document:1.2" }

Write-Host "Extracting i18n messages"
ng extract-i18n --output-path $localesDir
Write-Host "Messages extracted to $localesDir"

function Get-Translation
{
  param([string]$Text, [string]$TargetLocale)
  if ([string]::IsNullOrWhiteSpace($Text))
  { return "" 
  }

  $cleanText = [uri]::EscapeDataString($Text)
  try
  {
    $response = Invoke-WebRequest -Uri "https://ftapi.pythonanywhere.com/translate?sl=en&dl=$TargetLocale&text=$cleanText" -Method Get -UseBasicParsing
    $responseObject = $response.Content | ConvertFrom-Json -AsHashtable
    return $responseObject."destination-text"
  } catch
  {
    Write-Warning "Translation request failed for '$Text' to '$TargetLocale': $_"
    return ""
  }
}

function Out-Truncated
{
  param([string]$Text, [int]$Length = 10)
  if ([string]::IsNullOrWhiteSpace($Text))
  { return $Text 
  }
  if ($Text.Length -le $Length)
  { return $Text 
  }
  return ($Text.Substring(0, $Length).Trim() + "...")
}

function Update-TranslationsFromBase
{
  param(
    [Parameter(Mandatory = $true)][string]$LocalePath,
    [Parameter(Mandatory = $true)][string]$Locale,
    [Parameter(Mandatory = $true)]$BaseUnits
  )

  # Load the local file XML
  $localeDoc = New-Object System.Xml.XmlDocument
  $localeDoc.Load($LocalePath)

  # Use Select-Xml to find the body
  $body = (Select-Xml -Xml $localeDoc -XPath "//x:body" -Namespace $ns).Node

  if ($null -eq $body)
  {
    throw "Could not find <body> in locale file '$LocalePath'"
  }

  foreach ($baseUnit in $BaseUnits)
  {
    $id = $baseUnit.GetAttribute("id")
    if ([string]::IsNullOrWhiteSpace($id))
    { continue 
    }

    $xpath = "//x:trans-unit[@id='$id']"
    $localeUnit = (Select-Xml -Xml $localeDoc -XPath $xpath -Namespace $ns).Node

    # Get source text from base unit
    $baseSourceNode = (Select-Xml -Xml $baseUnit -XPath "x:source" -Namespace $ns).Node
    $baseSource = $baseSourceNode.InnerText

    if ($null -eq $localeUnit)
    {
      # Import new unit if it doesn't exist
      $localeUnit = $localeDoc.ImportNode($baseUnit, $true)
      $body.AppendChild($localeUnit) | Out-Null
    } else
    {
      $localeSource = (Select-Xml -Xml $localeUnit -XPath "x:source" -Namespace $ns).Node
      if ($null -eq $localeSource)
      {
        $localeSource = $localeDoc.CreateElement("source", $localeDoc.DocumentElement.NamespaceURI)
        $localeSource.InnerText = $baseSource
        $localeUnit.PrependChild($localeSource) | Out-Null
      } elseif ($localeSource.InnerText -ne $baseSource)
      {
        $localeSource.InnerText = $baseSource
        $target = (Select-Xml -Xml $localeUnit -XPath "x:target" -Namespace $ns).Node
        if ($null -ne $target)
        { $target.InnerText = "" 
        }
      }
    }

    # Ensure target node exists
    $target = (Select-Xml -Xml $localeUnit -XPath "x:target" -Namespace $ns).Node
    if ($null -eq $target)
    {
      $target = $localeDoc.CreateElement("target", $localeDoc.DocumentElement.NamespaceURI)
      $localeUnit.AppendChild($target) | Out-Null
    }

    if ([string]::IsNullOrWhiteSpace($target.InnerText))
    {
      $translatedText = Get-Translation -Text $baseSource -TargetLocale $Locale
      if ($translatedText.Length -gt 0)
      {
        Write-Host "Translated en:'$(Out-Truncated -Text $baseSource)' to ${Locale}:'$(Out-Truncated -Text $translatedText)'"
        $target.InnerText = $translatedText
      }
      Start-Sleep -Milliseconds 800
    }
  }

  # Cleanup obsolete IDs
  $baseIds = @{}
  foreach ($bu in $BaseUnits)
  { $baseIds[$bu.GetAttribute("id")] = $true 
  }

  $localeUnits = Select-Xml -Xml $localeDoc -XPath "//x:trans-unit" -Namespace $ns | Select-Object -ExpandProperty Node
  foreach ($lu in $localeUnits)
  {
    $lid = $lu.GetAttribute("id")
    if (-not $baseIds.ContainsKey($lid))
    {
      Write-Host "Removing obsolete ID: $lid"
      $lu.ParentNode.RemoveChild($lu) | Out-Null
    }
  }

  $localeDoc.Save($LocalePath)
}

# --- Main Execution ---

# Extract base units from messages.xlf
$baseUnits = Select-Xml -Path $baseFile -XPath "//x:trans-unit" -Namespace $ns | Select-Object -ExpandProperty Node

if ($null -eq $baseUnits -or ($baseUnits | Measure-Object).Count -eq 0)
{
  Write-Error "No translation units found in $baseFile. Aborting."
  exit
}

foreach ($locale in $locales)
{
  $filename = Join-Path $localesDir "messages.$locale.xlf"
  Write-Host "Processing locale: $locale"

  if (-not (Test-Path $filename))
  {
    Copy-Item $baseFile $filename
  }

  Update-TranslationsFromBase -LocalePath $filename -Locale $locale -BaseUnits $baseUnits
  Write-Host "Done: $locale" -ForegroundColor Green
}
