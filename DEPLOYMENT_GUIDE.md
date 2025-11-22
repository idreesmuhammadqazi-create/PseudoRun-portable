# PseudoRun Desktop - Deployment Guide 📦

## 🚀 Deployment Options

### Option 1: Windows Installer (Recommended for Educational Institutions)

#### Prerequisites
- Windows 10/11 development machine
- Node.js 18+ installed
- Git for cloning the repository

#### Step 1: Build the Installer
```bash
# Navigate to project directory
cd PseudoRun-portable

# Install dependencies (if not already done)
npm install

# Build the production version
npm run build

# Create Windows installer
npm run dist-win
```

#### Step 2: Distribute the Installer
- **Location**: `dist/PseudoRun Setup 1.0.0.exe` (or similar)
- **Size**: ~50-80 MB (includes Electron runtime)
- **Installation**: User-friendly wizard with desktop shortcut

#### Step 3: Administrator Deployment
```bash
# For silent installation across multiple machines
"PseudoRun Setup 1.0.0.exe" /S /D=C:\Program Files\PseudoRun
```

---

### Option 2: Portable Version (For USB/CNetwork Sharing)

#### Create Portable Package
```bash
# Build the application
npm run build

# Package for portable distribution
npm run dist

# Create portable ZIP from the output
```

#### Portable Structure
```
PseudoRun-Portable/
├── PseudoRun.exe           # Application executable
├── resources/              # Application resources
└── data/                   # User data directory (auto-created)
```

---

### Option 3: Network Deployment (For School Networks)

#### Shared Network Drive
1. **Create shared folder**: `\\school-server\PseudoRun`
2. **Copy portable version** to shared folder
3. **Create batch file** for easy access:
```batch
@echo off
start "\\school-server\PseudoRun\PseudoRun.exe"
```

#### Student Access
- Map network drive on student machines
- Create desktop shortcuts pointing to network version
- Updates managed centrally by IT administrator

---

## 🔧 Deployment Configuration

### Custom Application Branding
```json
// package.json - Update for your institution
{
  "name": "school-name-pseudorun",
  "productName": "School Name PseudoRun",
  "description": "IGCSE Pseudocode Interpreter - School Edition"
}
```

### Custom Installer Settings
```json
// package.json build configuration
"build": {
  "appId": "com.school.pseudorun",
  "productName": "School PseudoRun",
  "win": {
    "target": "nsis",
    "icon": "assets/school-icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "School PseudoRun",
    "include": "installer.nsh"
  }
}
```

### Custom Installer Script (installer.nsh)
```nsis
; Custom installer script for school deployment
!macro customInstall
  ; Add to PATH (optional)
  ${EnvVarUpdate} $0 "PATH" "A" "HKLM" "$INSTDIR"

  ; Set file associations
  WriteRegStr HKCR ".pseudo" "" "PseudoCode.File"
  WriteRegStr HKCR "PseudoCode.File" "" "PseudoCode File"
  WriteRegStr HKCR "PseudoCode.File\DefaultIcon" "" "$INSTDIR\PseudoRun.exe,0"
  WriteRegStr HKCR "PseudoCode.File\shell\open\command" "" '"$INSTDIR\PseudoRun.exe" "%1"'
!macroend
```

---

## 📚 Educational Deployment Scenarios

### Scenario 1: Computer Lab Deployment

#### IT Administrator Setup
```powershell
# Deploy to all lab computers via script
$computers = Get-ADComputer -Filter "OperatingSystem -like '*Windows*'"
foreach ($computer in $computers) {
    Copy-Item "\\server\deploy\PseudoRun-Setup.exe" "\\$computer\C$\temp\"
    Invoke-Command -ComputerName $computer.Name -ScriptBlock {
        Start-Process "C:\temp\PseudoRun-Setup.exe" -ArgumentList "/S" -Wait
    }
}
```

#### Classroom Management
- Pre-install with standard lab image
- Include in software deployment package (SCCM, PDQ Deploy)
- Create shortcuts in Start Menu > Programs > Education

### Scenario 2: Student Laptop Program

#### Individual Installation
1. **Provide download link** to installer
2. **Installation instructions** for students
3. **Licensing considerations** (MIT License allows redistribution)

#### Support Package
- Quick reference guide PDF
- Tutorial video links
- Contact information for technical support

### Scenario 3: Distance Learning

#### Web Download Portal
```html
<!-- Download page example -->
<div class="download-section">
    <h3>Download PseudoRun Desktop</h3>
    <a href="downloads/PseudoRun-Setup.exe" class="download-btn">
        Download for Windows (80 MB)
    </a>
    <p>Compatible with Windows 10/11</p>
</div>
```

#### Automated Updates
```javascript
// Auto-update configuration (future feature)
const updateConfig = {
  autoDownload: true,
  autoInstallOnAppQuit: true,
  updateCheckInterval: 'daily'
}
```

---

## 🛠️ Testing Before Deployment

### Pre-Deployment Checklist
- [ ] Application builds without errors
- [ ] Installer runs on clean Windows machine
- [ ] All features work in offline mode
- [ ] File associations work correctly
- [ ] Performance on minimum spec machines
- [ ] Antivirus compatibility testing

### System Requirements
```
Minimum Requirements:
- Windows 10 (Version 1903) or Windows 11
- 4 GB RAM
- 500 MB free disk space
- Display resolution 1024x768

Recommended Requirements:
- Windows 11
- 8 GB RAM
- 2 GB free disk space
- Display resolution 1920x1080
```

### Performance Testing
```bash
# Test with large pseudocode files
# Open files with 1000+ lines of code
# Test execution time for complex algorithms
# Verify memory usage stays reasonable (<200MB)
```

---

## 🔐 Security Considerations

### Application Security
- ✅ No internet connectivity required
- ✅ All data stored locally
- ✅ No external dependencies at runtime
- ✅ Sandboxed execution environment
- ✅ No telemetry or data collection

### Network Deployment Security
- Use HTTPS for download links
- Verify installer integrity with checksums
```bash
# Generate SHA256 checksum
sha256sum PseudoRun-Setup.exe > PseudoRun-Setup.exe.sha256
```

---

## 📊 Monitoring and Analytics (Optional)

### Usage Tracking (Privacy-Respecting)
```javascript
// Local usage analytics (optional, opt-in)
const analytics = {
  trackUsage: () => {
    const stats = {
      sessionsToday: localStorage.getItem('sessionsToday') || 0,
      codeLinesWritten: localStorage.getItem('linesWritten') || 0,
      filesCreated: localStorage.getItem('filesCreated') || 0
    };
    // Store locally, no transmission
  }
};
```

### Feedback Collection
```javascript
// Feedback form integration (optional)
const feedbackConfig = {
  feedbackUrl: "mailto:it-support@school.edu",
  autoBugReporting: false,
  userFeedbackEnabled: true
};
```

---

## 🎯 Deployment Best Practices

### For IT Administrators
1. **Test on pilot group** before full deployment
2. **Document installation process** for support staff
3. **Create backup plan** for application failures
4. **Monitor system performance** after deployment
5. **Plan for updates** and version management

### For Teachers
1. **Test classroom activities** before lessons
2. **Create example pseudocode files** for students
3. **Understand basic troubleshooting** common issues
4. **Have backup offline activities** ready

### For Students
1. **Save work frequently** to local files
2. **Learn keyboard shortcuts** for efficiency
3. **Understand file organization** for pseudocode files
4. **Know basic error handling** and debugging

---

## 🆘 Support and Troubleshooting

### Common Issues and Solutions

#### Installation Issues
```bash
# If installer fails with permission error
# Run as administrator
# Disable antivirus temporarily during installation
# Check Windows SmartScreen settings
```

#### Runtime Issues
```bash
# If application won't start
# Check Windows version compatibility
# Verify .NET Framework 4.7.2+ is installed
# Check for missing Visual C++ redistributables
```

#### Performance Issues
```bash
# If application is slow
# Close other applications
# Check available disk space
- Restart the application
```

### Support Contact Template
```
PseudoRun Desktop Support

Technical Support:
Email: it-support@school.edu
Phone: ext. 1234
Response Time: 24 hours

Educational Support:
Email: pseudocode-help@school.edu
Response Time: 48 hours
```

---

## 📈 Success Metrics

### Deployment Success Indicators
- **Installation completion rate** >95%
- **Application launch success rate** >98%
- **User satisfaction score** >4.0/5
- **Support ticket reduction** >50% vs previous tools
- **Student performance improvement** measurable

### Continuous Improvement
- Collect user feedback regularly
- Monitor usage patterns and performance
- Plan regular updates and feature additions
- Maintain compatibility with curriculum changes

---

## 🎓 Educational Integration

### Curriculum Alignment
- IGCSE Computer Science (0478)
- O Level Computer Science (2210)
- A Level Computer Science (9608)
- Custom curriculum adaptation possible

### Teacher Resources
```markdown
## Teacher Deployment Guide
1. Install on teacher workstation first
2. Create sample pseudocode files
3. Test with classroom activities
4. Plan student orientation session
5. Prepare troubleshooting guide
```

### Student Resources
```markdown
## Student Quick Start Guide
1. Launch PseudoRun from Start Menu
2. Click "New File" to start coding
3. Write pseudocode in the editor
4. Click "Run" to execute your code
5. Save your work with "Save As"
6. Use "Open" to load previous work
```

---

**This deployment guide provides comprehensive options for rolling out PseudoRun Desktop in educational environments of all sizes. Choose the deployment method that best fits your institution's infrastructure and policies.**