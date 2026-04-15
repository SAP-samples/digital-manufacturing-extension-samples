# Package POD 2.0 Custom Extension

Create a deployment-ready zip artifact from the `custom-pod2-examples` directory.

## Steps

1. Detect the operating system using the Bash tool:
   ```bash
   uname -s 2>/dev/null || echo "Windows"
   ```

2. Locate the `custom-pod2-examples` directory. Search from the git repo root if inside a git repo, otherwise search from the filesystem root. This ensures the directory is found regardless of the current working directory.
   - On macOS/Linux:
     ```bash
     SEARCH_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "/")
     SOURCE=$(find "$SEARCH_ROOT" -type d -name "custom-pod2-examples" | head -1)
     echo "$SOURCE"
     ```
   - On Windows (PowerShell):
     ```powershell
     $repoRoot = git rev-parse --show-toplevel 2>$null
     $searchRoot = if ($repoRoot) { $repoRoot } else { "C:\" }
     $SOURCE = Get-ChildItem -Path $searchRoot -Recurse -Directory -Filter "custom-pod2-examples" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
     $SOURCE
     ```
   If `SOURCE` is empty, tell the user the directory could not be found and stop.

3. Delete any existing `*.zip` files inside that directory.
   - On macOS/Linux:
     ```bash
     find "$SOURCE" -maxdepth 1 -name "*.zip" -delete
     ```
   - On Windows (PowerShell):
     ```powershell
     Get-ChildItem -Path $SOURCE -MaxDepth 1 -Filter "*.zip" | Remove-Item
     ```

4. Create a new zip archive named `custom-pod2-extension.zip` containing **all content inside** the directory (not the directory itself). Exclude macOS metadata files and the `.claude` folder.
   - On macOS/Linux:
     ```bash
     cd "$SOURCE" && zip -r custom-pod2-extension.zip . --exclude "*.DS_Store" --exclude "__MACOSX/*" --exclude ".claude/*"
     ```
   - On Windows (PowerShell):
     ```powershell
     $items = Get-ChildItem -Path $SOURCE | Where-Object { $_.Name -ne ".claude" }
     Compress-Archive -Path $items.FullName -DestinationPath "$SOURCE\custom-pod2-extension.zip" -Force
     ```

5. Confirm the archive was created and report its size.
   - On macOS/Linux:
     ```bash
     ls -lh "$SOURCE/custom-pod2-extension.zip"
     ```
   - On Windows (PowerShell):
     ```powershell
     Get-Item "$SOURCE\custom-pod2-extension.zip" | Select-Object Name, @{Name="Size";Expression={"{0:N0} KB" -f ($_.Length/1KB)}}
     ```

6. Tell the user the full path to the zip file.

7. Print the **Manage POD 2.0 → Extensions upload values**:

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║  Manage POD 2.0 → Extensions — Upload values                                            ║
╠══════════════════════════════════════════════════════════════════════════════════════════╣
║  Name:        custom-pod2-examples                                                       ║
║  Description: Sample POD 2.0 custom extension: Equipment History widget, Enhanced Data  ║
║               Collection Table, Component Verification widget, External Data Fetch       ║
║               action, and Server Notification Handler action.                            ║
║  Namespace:   custom.pod2.example                                                        ║
║  Source Code: custom-pod2-extension.zip  (upload the zip)                               ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝
```
