// =========================================================================
// NetPulse Studio - Professional Extensible Localization System (i18n)
// Supports English ('en' - Default LTR) and Arabic ('ar' - RTL)
// Designed for instant reactive updates and extensible for future locales
// =========================================================================

export type LanguageCode = 'en' | 'ar' | string;

export interface LanguageOption {
  code: LanguageCode;
  name: string;          // English display name
  nativeName: string;    // Native script name
  flag: string;          // Emoji flag
  dir: 'ltr' | 'rtl';    // Layout direction
  isDefault?: boolean;
  description: string;   // Short helper description
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    isDefault: true,
    description: 'Default • Left-to-Right (LTR)'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    description: 'اختيارية • من اليمين إلى اليسار (RTL)'
  }
];

export interface Translations {
  // Common & Generic
  appName: string;
  appDescription: string;
  ready: string;
  close: string;
  cancel: string;
  confirm: string;
  apply: string;
  save: string;
  delete: string;
  edit: string;
  rename: string;
  duplicate: string;
  status: string;
  online: string;
  offline: string;
  vendor: string;
  model: string;
  iosVersion: string;
  power: string;
  powerOn: string;
  powerOff: string;
  restart: string;
  factoryReset: string;

  // Header & Tools
  selectTool: string;
  panTool: string;
  deleteTool: string;
  inspectTool: string;
  notesTool: string;
  zoomIn: string;
  zoomOut: string;
  fitToScreen: string;
  undo: string;
  redo: string;
  newProject: string;
  openProject: string;
  saveProject: string;
  settings: string;
  realtime: string;
  simulation: string;
  quickLangToggleTitle: string;

  // Settings Modal
  settingsTitle: string;
  languageSectionTitle: string;
  languageSectionDesc: string;
  englishOption: string;
  arabicOption: string;
  englishBadge: string;
  arabicBadge: string;
  languageNotice: string;
  preferencesSection: string;
  showGrid: string;
  showLinkLabels: string;
  animationSpeed: string;

  // Context Menu
  renameDevice: string;
  duplicateDevice: string;
  powerOnDevice: string;
  powerOffDevice: string;
  deviceProperties: string;
  deleteDevice: string;
  enterNewName: string;
  renamePlaceholder: string;

  // Notes Prompt
  enterNotePrompt: string;
  defaultNoteText: string;

  // Bottom Device Shelf & Categories
  cablesTitle: string;
  categories: {
    routers: string;
    switches: string;
    hubs: string;
    wireless: string;
    security: string;
    wan: string;
    endDevices: string;
    smartDevices: string;
    servers: string;
    connections: string;
  };

  // Cables
  connAuto: string;
  connAutoDesc: string;
  connStraight: string;
  connStraightDesc: string;
  connCrossover: string;
  connCrossoverDesc: string;
  connFiber: string;
  connFiberDesc: string;
  connSerialDce: string;
  connSerialDceDesc: string;
  connSerialDte: string;
  connSerialDteDesc: string;
  connConsole: string;
  connConsoleDesc: string;
  connPhone: string;
  connPhoneDesc: string;
  connCoaxial: string;
  connCoaxialDesc: string;
  connUsb: string;
  connUsbDesc: string;

  // Device Models Descriptions
  modelDescriptions: Record<string, string>;

  // Expansion Modules Descriptions
  moduleDescriptions: Record<string, string>;

  // Device Properties Modal
  physicalTab: string;
  configTab: string;
  cliTab: string;
  desktopTab: string;
  servicesTab: string;
  powerOnBtn: string;
  powerOffBtn: string;
  restartBtn: string;
  factoryResetBtn: string;
  chassisView: string;
  rearPanel: string;
  powerSwitch: string;
  powerLed: string;
  expansionSlots: string;
  modulesActive: string;
  noModulesInstalled: string;
  removeModule: string;
  installModule: string;
  availableModulesTitle: string;
  availableModulesDesc: string;
  powerOnModuleWarningBadge: string;
  powerOffModuleReadyBadge: string;
  installedBadge: string;
  notInstalledBadge: string;
  addedPorts: string;
  noModulesSupported: string;
  removeModuleBtn: string;
  installModuleBtn: string;

  // Port LEDs
  ledLegendTitle: string;
  ledGreenUp: string;
  ledOrangeInit: string;
  ledRedDown: string;
  ledGrayOff: string;

  // Warnings & Dialogs in Properties Modal
  cannotAddModuleTitle: string;
  cannotAddModuleCiscoSubtitle: string;
  cannotAddModuleBody: string;
  powerOffAndProceed: string;
  cancelBtn: string;
  confirmResetTitle: string;
  confirmResetSubtitle: string;
  confirmResetBody: (name: string) => string;
  yesReset: string;

  // Config Tab
  globalSettings: string;
  hostname: string;
  defaultGateway: string;
  dnsServer: string;
  interfaces: string;
  portStatus: string;
  staticIp: string;
  dhcp: string;
  ipAddress: string;
  subnetMask: string;
  vlanId: string;
  selectPortHint: string;
  portShutdown: string;
  portNoShutdown: string;

  // CLI Tab
  cliPowerOffWarning: string;
  cliInputPlaceholder: string;
  sendCmd: string;
  cliClear: string;
  cliHelpHint: string;

  // Desktop Tab
  pcPowerOffWarning: string;
  ipConfigApp: string;
  cmdApp: string;
  browserApp: string;
  editorApp: string;
  browserGo: string;
  browserPlaceholder: string;
  editorSave: string;

  // Services Tab
  serviceStatusActive: string;
  htmlContentLabel: string;
  dnsRecordsLabel: string;
  serviceRunningMsg: string;
  serverPowerOffWarning: string;
  serviceEnabled: string;
  serviceDisabled: string;

  // Simulation Engine & Event List
  simPlay: string;
  simPause: string;
  simStepForward: string;
  simSpeedToggle: string;
  simResetPackets: string;
  simSendNewPacket: string;
  simulationPanelTitle: string;
  eventListTime: string;
  eventListLastDev: string;
  eventListAtDev: string;
  eventListType: string;
  eventListStatus: string;
  eventListInfo: string;
  eventListPdu: string;
  viewPduBtn: string;
  pduModalTitle: string;
  inLayers: string;
  outLayers: string;
  successfulStatus: string;
  failedStatus: string;

  // Test Launcher Modal
  testLauncherTitle: string;
  packetTestType: string;
  sourceDevice: string;
  destDevice: string;
  launchTestBtn: string;
  pingDesc: string;
  arpDesc: string;
  dhcpDesc: string;
  dnsDesc: string;
  httpDesc: string;

  // Simulation Error & Status Messages
  simErrors: {
    deviceNotFound: string;
    sourcePoweredOff: (name: string) => string;
    destPoweredOff: (name: string) => string;
    sourcePortDown: (name: string) => string;
    destPortDown: (name: string) => string;
    sourceNoIp: (name: string) => string;
    destNoIp: (name: string) => string;
    noRoute: (src: string, dst: string) => string;
    cantRebootOff: string;
    connectionFailed: string;
  };
  simMessages: {
    testStarted: (type: string, src: string, dst: string) => string;
    testSuccess: (type: string) => string;
    requestDesc: (type: string, from: string, to: string) => string;
    replyDesc: (type: string, from: string, to: string) => string;
    stepInfo: (type: string, from: string, to: string) => string;
    completeInfo: (type: string) => string;
  };

  // Toasts
  toastNewWorkspace: string;
  toastProjectOpened: string;
  toastProjectSaved: string;
  toastSimulationReset: string;
  toastCableDeleted: string;
  toastModuleInstalled: (name: string) => string;
  toastModuleRemoved: (name: string) => string;
  toastModuleAlreadyInstalled: (name: string) => string;
  toastPowerOn: (name: string) => string;
  toastPowerOff: (name: string) => string;
  toastRebooting: (name: string) => string;
  toastRebootComplete: (name: string) => string;
  toastFactoryResetComplete: (name: string) => string;
  toastPortShutdown: (port: string) => string;
  toastPortNoShutdown: (port: string) => string;
  toastConnectingStep1: (name: string) => string;
  toastConnectingSuccess: (src: string, srcPort: string, dst: string, dstPort: string) => string;
  toastConnectionCanceled: string;
  toastDeviceRenamed: string;
  toastDeviceDuplicated: string;
  toastDeviceDeleted: (name: string) => string;
  toastDeviceAdded: (name: string) => string;
  toastDeviceSelectedForCanvas: (name: string) => string;
  toastFitToScreen: string;
  toastDeleteToolHint: string;
  toastInspectToolHint: string;
  toastNotesToolHint: string;
  toastCableToolHint: (name: string) => string;
  toastNoteAdded: string;
  toastDhcpRequested: string;
  toastVlanAssigned: (port: string, vlan: number) => string;
  toastLangSwitchedEn: string;
  toastLangSwitchedAr: string;

  // UI/UX Network Simulator Navigation & Sections
  simulatorTitle: string;
  navHome: string;
  navWorkspace: string;
  navDevices: string;
  navLearn: string;
  navSettings: string;
  btnNewProject: string;
  btnOpenSaved: string;
  btnBack: string;
  btnHome: string;
  sectionDevices: string;
  sectionLessons: string;
  sectionQuizzes: string;
  sectionSettings: string;
  lightMode: string;
  darkMode: string;
  deviceDetailTitle: string;
  openDeviceDetail: string;
  deviceCatalogDesc: string;
  lessonsDesc: string;
  quizzesDesc: string;
  sampleProjectsTitle: string;
  ciscoGlossaryTitle: string;
  ciscoGlossarySubtitle: string;
  startLabInWorkspace: string;
  takeQuiz: string;
  quizScore: string;
  quizReset: string;
  quizNext: string;
  quizPrev: string;
  deviceChassis: string;
  deviceCli: string;
  deviceConfig: string;
  deviceDesktop: string;
  deviceServices: string;
  powerSwitch: string;
  backToWorkspace: string;
  backToHome: string;
  activeTopologyCount: string;
  totalDevices: string;
  completedLessons: string;
}

export const translations: Record<'en' | 'ar', Translations> = {
  // =========================================================================
  // ENGLISH (Default - LTR)
  // =========================================================================
  en: {
    appName: 'NetPulse Studio',
    appDescription: 'Professional Cisco Packet Tracer inspired network simulator',
    ready: 'Ready',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    apply: 'Apply',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    rename: 'Rename',
    duplicate: 'Duplicate',
    status: 'Status',
    online: 'ONLINE',
    offline: 'OFFLINE',
    vendor: 'Vendor',
    model: 'Model',
    iosVersion: 'IOS Version',
    power: 'Power',
    powerOn: 'Power ON',
    powerOff: 'Power OFF',
    restart: 'Restart',
    factoryReset: 'Factory Reset',

    // Header & Tools
    selectTool: 'Select Tool (Pointer)',
    panTool: 'Move/Pan Tool (Hand)',
    deleteTool: 'Delete Tool',
    inspectTool: 'Inspect Tool',
    notesTool: 'Notes Tool',
    zoomIn: 'Zoom In (+)',
    zoomOut: 'Zoom Out (-)',
    fitToScreen: 'Fit to Screen',
    undo: 'Undo (Ctrl+Z)',
    redo: 'Redo (Ctrl+Y)',
    newProject: 'New Workspace',
    openProject: 'Open Project',
    saveProject: 'Save Project',
    settings: 'Settings',
    realtime: 'Realtime',
    simulation: 'Simulation',
    quickLangToggleTitle: 'Switch Language / تغيير اللغة',

    // Settings Modal
    settingsTitle: 'Studio Settings',
    languageSectionTitle: '🌐 Language',
    languageSectionDesc: 'Choose interface language and layout orientation.',
    englishOption: 'English',
    arabicOption: 'العربية',
    englishBadge: 'Default (LTR)',
    arabicBadge: 'Optional (RTL)',
    languageNotice: 'Cisco standard technical terminology (Router, Switch, CLI, IP, etc.) is preserved for industry standard fidelity.',
    preferencesSection: 'Visual Preferences',
    showGrid: 'Show Background Grid',
    showLinkLabels: 'Show Port & Cable Labels',
    animationSpeed: 'Simulation Animation Speed',

    // Context Menu
    renameDevice: 'Rename Device',
    duplicateDevice: 'Duplicate Device',
    powerOnDevice: 'Power ON Device',
    powerOffDevice: 'Power OFF Device',
    deviceProperties: 'Device Properties',
    deleteDevice: 'Delete Device',
    enterNewName: 'Enter new device hostname:',
    renamePlaceholder: 'e.g. Router-HQ',

    // Notes Prompt
    enterNotePrompt: 'Enter annotation or note text:',
    defaultNoteText: 'Network Segment Notes',

    // Categories
    cablesTitle: 'Cable Types',
    categories: {
      routers: 'Routers',
      switches: 'Switches',
      hubs: 'Hubs',
      wireless: 'Wireless',
      security: 'Security',
      wan: 'WAN',
      endDevices: 'End Devices',
      smartDevices: 'Smart Devices',
      servers: 'Servers',
      connections: 'Connections'
    },

    // Cables
    connAuto: 'Automatically Choose Connection Type',
    connAutoDesc: 'Automatically selects suitable cable type and available ports between devices.',
    connStraight: 'Copper Straight-Through',
    connStraightDesc: 'Standard Ethernet cable connecting unlike devices (PC to Switch, Switch to Router).',
    connCrossover: 'Copper Cross-Over',
    connCrossoverDesc: 'Ethernet crossover cable connecting like devices (Switch to Switch, PC to PC, Router to Router).',
    connFiber: 'Fiber Optic',
    connFiberDesc: 'High-speed optical cable connecting SFP and Fiber interfaces over long distances.',
    connSerialDce: 'Serial DCE',
    connSerialDceDesc: 'Serial WAN cable providing clocking and synchronization from DCE endpoint.',
    connSerialDte: 'Serial DTE',
    connSerialDteDesc: 'Serial WAN cable connecting to router as a DTE terminal endpoint.',
    connConsole: 'Console Cable',
    connConsoleDesc: 'Management rollover cable from workstation RS-232/USB to device Console port.',
    connPhone: 'Telephone Line (RJ-11)',
    connPhoneDesc: 'Analog telephone cable connecting analog modems to telephone networks.',
    connCoaxial: 'Coaxial Cable',
    connCoaxialDesc: 'High-frequency shielded cable for cable modems and ISP distribution.',
    connUsb: 'USB Cable',
    connUsbDesc: 'Universal Serial Bus connecting computers to printers and smart peripherals.',

    // Device Model Descriptions
    modelDescriptions: {
      'cisco-2911': 'Cisco 2911 Integrated Services Router with 3 GE ports and EHWIC expansion slots.',
      'cisco-1941': 'Cisco 1941 Modular ISR Router with dual Gigabit Ethernet ports.',
      'cisco-4331': 'Cisco ISR 4331 High-Performance Multicore Enterprise Router.',
      'cisco-2960': 'Cisco Catalyst 2960 24-Port FastEthernet + 2 GE Layer 2 Switch.',
      'cisco-3560': 'Cisco Catalyst 3560 24-Port Multilayer Layer 3 Gigabit Switch.',
      'generic-hub': 'Classic Layer 1 physical hub with multi-port broadcast repetition.',
      'generic-wrouter': 'Broadband 802.11ac wireless router with integrated 4-port switch & DHCP.',
      'generic-ap': 'Lightweight Enterprise 802.11ac Access Point for wireless coverage.',
      'cisco-asa5506': 'Cisco ASA 5506-X Next-Generation Security Firewall with FirePOWER.',
      'cloud-wan': 'Frame Relay and Internet WAN multipoint cloud simulator.',
      'dsl-modem': 'Digital Subscriber Line (DSL) broadband telephone modem converter.',
      'pc-desktop': 'Standard Desktop Workstation PC with Ethernet NIC and desktop utilities.',
      'laptop': 'Portable Laptop Workstation with integrated Wi-Fi and Ethernet NIC.',
      'printer': 'Network laser printer with static IP configuration.',
      'smartphone': 'Wireless smartphone device connecting to Wi-Fi access points.',
      'tablet': 'Touch tablet smart device with wireless connectivity.',
      'server-standard': 'Enterprise multi-service server host (DNS, HTTP, DHCP, FTP, Email, SSH, NTP).'
    },

    // Module Descriptions
    moduleDescriptions: {
      'HWIC-2T': 'Dual-port high-speed serial WAN interface module for branch interconnects.',
      'WIC-1AM': 'Single-port RJ-11 analog modem interface card.',
      'HWIC-1GE-SFP': 'Single-port Gigabit Ethernet SFP optical transceiver module.',
      'GLC-LH-SMD-SW': 'SFP 1000BASE-LX long-range optical fiber transceiver module.',
      'PT-HOST-NM-1FE': 'Single-port FastEthernet RJ-45 copper network adapter card.',
      'PT-HOST-NM-1W': 'Wireless 2.4GHz 802.11b/g/n Wi-Fi card with omnidirectional antenna.',
      'PT-HOST-NM-1FGE': 'Single-port FastEthernet optical fiber network interface card.',
      'PT-SRV-NM-1FGE': 'High-density Gigabit optical fiber network interface module for servers.',
      'PT-SRV-NM-1CGE': 'Additional Gigabit copper RJ-45 1000BASE-T interface for servers.'
    },

    // Device Properties Modal
    physicalTab: 'Physical',
    configTab: 'Config',
    cliTab: 'CLI',
    desktopTab: 'Desktop',
    servicesTab: 'Services',
    powerOnBtn: 'Power ON',
    powerOffBtn: 'Power OFF',
    restartBtn: 'Restart',
    factoryResetBtn: 'Reset to Defaults',
    chassisView: 'Hardware Chassis Front/Rear Panel',
    rearPanel: 'Hardware Panel',
    powerSwitch: 'Power Switch',
    powerLed: 'PWR LED',
    expansionSlots: 'Modular Expansion Slots',
    modulesActive: 'Active Modules in Slots',
    noModulesInstalled: 'No expansion modules currently installed in this chassis.',
    removeModule: 'Remove Module',
    installModule: 'Install Module',
    availableModulesTitle: 'Available Expansion Modules',
    availableModulesDesc: 'Select compatible hardware modules to install into chassis expansion bays.',
    powerOnModuleWarningBadge: 'Power is ON (Must power OFF before inserting or removing modules)',
    powerOffModuleReadyBadge: 'Chassis Powered OFF (Ready for safe module insertion)',
    installedBadge: 'Installed',
    notInstalledBadge: 'Available',
    addedPorts: 'Added Ports:',
    noModulesSupported: 'This hardware model features fixed onboard interfaces and does not support expansion bays.',
    removeModuleBtn: 'Remove Module',
    installModuleBtn: 'Install Module (+)',

    // Port LEDs
    ledLegendTitle: 'Port LED Indicators Legend',
    ledGreenUp: 'Green: Link Up & Active',
    ledOrangeInit: 'Amber: Initializing / Spanning Tree',
    ledRedDown: 'Red: Administratively Down',
    ledGrayOff: 'Gray: Disabled / Powered OFF',

    // Warnings & Dialogs
    cannotAddModuleTitle: 'Security Warning: Cannot Modify Modules While Powered On',
    cannotAddModuleCiscoSubtitle: 'Cisco Packet Tracer Hardware Safety Protocol',
    cannotAddModuleBody: 'In authentic Cisco hardware and Packet Tracer, inserting or removing modular cards while the chassis is powered ON is strictly prohibited to prevent circuit damage. Please turn OFF the power switch first.',
    powerOffAndProceed: 'Power OFF Now & Continue',
    cancelBtn: 'Cancel',
    confirmResetTitle: 'Confirm Factory Reset',
    confirmResetSubtitle: 'Restore Default Configuration',
    confirmResetBody: (name: string) => `Are you sure you want to restore device [${name}] to factory default settings? All IP configurations, hostnames, installed modules, and CLI history will be wiped.`,
    yesReset: 'Yes, Factory Reset',

    // Config Tab
    globalSettings: 'Global Settings',
    hostname: 'Device Hostname',
    defaultGateway: 'Default Gateway',
    dnsServer: 'DNS Server',
    interfaces: 'Network Interfaces',
    portStatus: 'Port Status',
    staticIp: 'Static IP',
    dhcp: 'DHCP',
    ipAddress: 'IP Address',
    subnetMask: 'Subnet Mask',
    vlanId: 'VLAN ID',
    selectPortHint: 'Select an interface from the list to view and configure its parameters.',
    portShutdown: 'Port administratively disabled (shutdown)',
    portNoShutdown: 'Port administratively enabled (no shutdown)',

    // CLI Tab
    cliPowerOffWarning: 'Device is powered OFF. Switch the hardware power ON to boot Cisco IOS Terminal.',
    cliInputPlaceholder: 'Type Cisco command (e.g. enable, show ip int brief, conf t, ping)...',
    sendCmd: 'Send',
    cliClear: 'Clear Screen',
    cliHelpHint: 'Supported: enable, show ip int brief, show running-config, configure terminal, interface, ip address, no shutdown, ping, exit',

    // Desktop Tab
    pcPowerOffWarning: 'Computer is powered OFF. Turn on system power in the Physical tab to access Desktop apps.',
    ipConfigApp: 'IP Configuration',
    cmdApp: 'Command Prompt',
    browserApp: 'Web Browser',
    editorApp: 'Text Editor',
    browserGo: 'Go',
    browserPlaceholder: 'Enter URL (e.g. http://192.168.1.100)',
    editorSave: 'Save File',

    // Services Tab
    serviceStatusActive: 'Active & Listening',
    htmlContentLabel: 'Web Server HTML Root Page Content:',
    dnsRecordsLabel: 'Configured DNS Domain Records:',
    serviceRunningMsg: 'Service is active, running, and listening for client requests on the network.',
    serverPowerOffWarning: 'Server is powered OFF. Turn ON system power to activate network services.',
    serviceEnabled: 'Enabled (ON)',
    serviceDisabled: 'Disabled (OFF)',

    // Simulation Engine & Event List
    simPlay: 'Auto Capture / Play',
    simPause: 'Pause Simulation',
    simStepForward: 'Capture / Forward Step',
    simSpeedToggle: 'Simulation Speed',
    simResetPackets: 'Clear All Packets',
    simSendNewPacket: 'Send New Packet Test',
    simulationPanelTitle: 'Simulation Engine & Event Timeline',
    eventListTime: 'Time',
    eventListLastDev: 'Last Device',
    eventListAtDev: 'At Device',
    eventListType: 'Type',
    eventListStatus: 'Status',
    eventListInfo: 'Event Info',
    eventListPdu: 'PDU Details',
    viewPduBtn: 'Inspect PDU',
    pduModalTitle: 'PDU Information at Device',
    inLayers: 'Inbound OSI Layers (In Layers)',
    outLayers: 'Outbound OSI Layers (Out Layers)',
    successfulStatus: 'Successful',
    failedStatus: 'Failed',

    // Test Launcher Modal
    testLauncherTitle: 'Launch Network Protocol Simulation',
    packetTestType: 'Protocol Test Type',
    sourceDevice: 'Source Device:',
    destDevice: 'Destination Device:',
    launchTestBtn: 'Launch Simulation Test Now',
    pingDesc: 'Sends ICMP Echo Request and awaits Echo Reply to verify round-trip connectivity.',
    arpDesc: 'Broadcasts ARP Request to resolve physical MAC address for target IP.',
    dhcpDesc: 'Transmits DHCP DORA sequence to dynamically acquire an IP address from DHCP server.',
    dnsDesc: 'Sends DNS Query to resolve domain name to target IP address.',
    httpDesc: 'Transmits HTTP GET Request to fetch web page content from server.',

    // Simulation Errors & Status
    simErrors: {
      deviceNotFound: 'One or both selected devices do not exist on the canvas.',
      sourcePoweredOff: (name: string) => `Failure: Source device [${name}] is powered OFF. Turn it ON first.`,
      destPoweredOff: (name: string) => `Failure: Destination device [${name}] is powered OFF.`,
      sourcePortDown: (name: string) => `Failure: Interface on [${name}] is administratively down (shutdown).`,
      destPortDown: (name: string) => `Failure: Interface on [${name}] is administratively down (shutdown).`,
      sourceNoIp: (name: string) => `Failure: Source device [${name}] has no configured IP address.`,
      destNoIp: (name: string) => `Failure: Destination device [${name}] has no configured IP address.`,
      noRoute: (src: string, dst: string) => `Failure: No physical cable route connects [${src}] to [${dst}] (No Physical Route).`,
      cantRebootOff: 'Cannot reboot a powered OFF device! Turn system power ON first.',
      connectionFailed: 'Connection Test Failed'
    },
    simMessages: {
      testStarted: (type: string, src: string, dst: string) => `${type} test initiated: Transmitting packet from [${src}] to [${dst}].`,
      testSuccess: (type: string) => `${type} test completed successfully with round-trip response (Status: Successful) 🟢`,
      requestDesc: (type: string, from: string, to: string) => `${type} Request: From [${from}] to [${to}]`,
      replyDesc: (type: string, from: string, to: string) => `${type} Reply: From [${from}] returning to [${to}]`,
      stepInfo: (type: string, from: string, to: string) => `${type} Packet forwarded from [${from}] to [${to}]`,
      completeInfo: (type: string) => `${type} round-trip completed successfully (Status: Successful).`
    },

    // Toasts
    toastNewWorkspace: 'New workspace created.',
    toastProjectOpened: 'Project opened successfully.',
    toastProjectSaved: 'Topology and device configurations saved.',
    toastSimulationReset: 'All packets cleared and simulation reset.',
    toastCableDeleted: 'Cable removed from devices.',
    toastModuleInstalled: (name: string) => `Module [${name}] successfully installed in expansion slot.`,
    toastModuleRemoved: (name: string) => `Module [${name}] removed from expansion bay.`,
    toastModuleAlreadyInstalled: (name: string) => `Module [${name}] is already installed in this device.`,
    toastPowerOn: (name: string) => `Device [${name}] powered ON 🟢`,
    toastPowerOff: (name: string) => `Device [${name}] powered OFF 🔴`,
    toastRebooting: (name: string) => `Rebooting device [${name}]... ⏳`,
    toastRebootComplete: (name: string) => `Device [${name}] reboot complete (System Up) 🟢`,
    toastFactoryResetComplete: (name: string) => `Device [${name}] restored to factory defaults.`,
    toastPortShutdown: (port: string) => `Port [${port}] administratively disabled (shutdown).`,
    toastPortNoShutdown: (port: string) => `Port [${port}] administratively enabled (no shutdown).`,
    toastConnectingStep1: (name: string) => `Selected [${name}] as first endpoint. Now click destination device.`,
    toastConnectingSuccess: (src: string, srcPort: string, dst: string, dstPort: string) => `Connected [${src}:${srcPort}] with [${dst}:${dstPort}] successfully 🟢`,
    toastConnectionCanceled: 'Connection process canceled.',
    toastDeviceRenamed: 'Device hostname updated successfully.',
    toastDeviceDuplicated: 'Device duplicated successfully.',
    toastDeviceDeleted: (name: string) => `Device [${name}] and its links removed.`,
    toastDeviceAdded: (name: string) => `Added device [${name}] to canvas.`,
    toastDeviceSelectedForCanvas: (name: string) => `Selected [${name}] — click canvas to place.`,
    toastFitToScreen: 'Canvas view fitted 100%.',
    toastDeleteToolHint: 'Delete Tool: Click any device or cable to remove it.',
    toastInspectToolHint: 'Inspect Tool: Click any device to open its properties.',
    toastNotesToolHint: 'Notes Tool: Click workspace to place an annotation.',
    toastCableToolHint: (name: string) => `Connection Tool active: [${name}]`,
    toastNoteAdded: 'Annotation note added to canvas.',
    toastDhcpRequested: 'DHCP IP address lease requested successfully.',
    toastVlanAssigned: (port: string, vlan: number) => `Port [${port}] assigned to VLAN ${vlan}.`,
    toastLangSwitchedEn: 'Language switched to English 🇺🇸',
    toastLangSwitchedAr: 'تم تغيير اللغة إلى العربية 🇸🇦',

    // UI/UX Network Simulator Navigation & Sections (English)
    simulatorTitle: 'Network Simulator',
    navHome: 'Home',
    navWorkspace: 'Workspace',
    navDevices: 'Devices',
    navLearn: 'Learn',
    navSettings: 'Settings',
    btnNewProject: 'New Project',
    btnOpenSaved: 'Open Saved Project',
    btnBack: 'Back',
    btnHome: 'Home',
    sectionDevices: 'Devices',
    sectionLessons: 'Lessons',
    sectionQuizzes: 'Quizzes & Tests',
    sectionSettings: 'Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    deviceDetailTitle: 'Device Inspection',
    openDeviceDetail: 'Inspect Device',
    deviceCatalogDesc: 'Cisco enterprise routing, switching, host, and server hardware.',
    lessonsDesc: 'Interactive CCNA networking tutorials and packet walk-throughs.',
    quizzesDesc: 'Test your knowledge in networking, IP addressing, and routing.',
    sampleProjectsTitle: 'Sample Topologies',
    ciscoGlossaryTitle: 'Cisco Terminology Glossary',
    ciscoGlossarySubtitle: 'Standard Cisco and networking terminology preserved in English with educational guidance.',
    startLabInWorkspace: 'Open Lab in Workspace',
    takeQuiz: 'Start Quiz',
    quizScore: 'Your Score',
    quizReset: 'Reset Quiz',
    quizNext: 'Next Question',
    quizPrev: 'Previous Question',
    deviceChassis: 'Chassis & Physical',
    deviceCli: 'CLI Terminal',
    deviceConfig: 'Config & Interfaces',
    deviceDesktop: 'Desktop Tools',
    deviceServices: 'Network Services',
    powerSwitch: 'Power Switch',
    backToWorkspace: 'Back to Workspace',
    backToHome: 'Back to Home',
    activeTopologyCount: 'Sample Topologies',
    totalDevices: 'Hardware Models',
    completedLessons: 'Lessons Available'
  },

  // =========================================================================
  // ARABIC (اختيارية - RTL)
  // =========================================================================
  ar: {
    appName: 'NetPulse Studio',
    appDescription: 'مختبر احترافي لمحاكاة شبكات سيسكو مستوحى من Cisco Packet Tracer',
    ready: 'جاهز',
    close: 'إغلاق',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    apply: 'تطبيق',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    rename: 'إعادة تسمية',
    duplicate: 'نسخ مكرر',
    status: 'الحالة',
    online: 'متصل (Online)',
    offline: 'مطفأ (Offline)',
    vendor: 'المصنّع',
    model: 'الموديل',
    iosVersion: 'إصدار IOS',
    power: 'الطاقة',
    powerOn: 'تشغيل الطاقة (Power ON)',
    powerOff: 'إيقاف الطاقة (Power OFF)',
    restart: 'إعادة التشغيل (Restart)',
    factoryReset: 'استعادة ضبط المصنع',

    // Header & Tools
    selectTool: 'أداة التحديد (Select Tool)',
    panTool: 'أداة التحريك والسحب (Move/Pan Tool)',
    deleteTool: 'أداة الحذف (Delete Tool)',
    inspectTool: 'أداة الفحص والخصائص (Inspect Tool)',
    notesTool: 'أداة الملاحظات (Notes Tool)',
    zoomIn: 'تكبير (+ Zoom In)',
    zoomOut: 'تصغير (- Zoom Out)',
    fitToScreen: 'ملاءمة الشاشة (Fit to Screen)',
    undo: 'تراجع (Undo)',
    redo: 'إعادة (Redo)',
    newProject: 'مشروع جديد (New)',
    openProject: 'فتح مشروع (Open)',
    saveProject: 'حفظ المشروع (Save)',
    settings: 'الإعدادات (Settings)',
    realtime: 'الوقت الفعلي (Realtime)',
    simulation: 'المحاكاة (Simulation)',
    quickLangToggleTitle: 'Switch Language / تغيير اللغة',

    // Settings Modal
    settingsTitle: 'إعدادات NetPulse Studio',
    languageSectionTitle: '🌐 Language',
    languageSectionDesc: 'اختر لغة واجهة التطبيق واتجاه العرض المفضل لديك.',
    englishOption: 'English',
    arabicOption: 'العربية',
    englishBadge: 'افتراضية (LTR)',
    arabicBadge: 'اختيارية (RTL)',
    languageNotice: 'تم الحفاظ على كافة مصطلحات سيسكو القياسية (Router, Switch, CLI, IP, إلخ) بالإنجليزية لمطابقة بيئة العمل الحقيقية مع شروحات عربية واضحة.',
    preferencesSection: 'تفضيلات العرض والمظهر',
    showGrid: 'إظهار شبكة الخلفية (Grid)',
    showLinkLabels: 'إظهار تسميات المنافذ والكابلات',
    animationSpeed: 'سرعة حركة الحزم والمحاكاة',

    // Context Menu
    renameDevice: 'إعادة تسمية الجهاز (Rename)',
    duplicateDevice: 'نسخ الجهاز (Duplicate)',
    powerOnDevice: 'تشغيل الجهاز (Power ON)',
    powerOffDevice: 'إيقاف تشغيل الجهاز (Power OFF)',
    deviceProperties: 'خصائص الجهاز (Properties)',
    deleteDevice: 'حذف الجهاز (Delete)',
    enterNewName: 'أدخل الاسم الجديد للجهاز (Hostname):',
    renamePlaceholder: 'مثال: Router-Branch',

    // Notes Prompt
    enterNotePrompt: 'أدخل نص الملاحظة التوضيحية:',
    defaultNoteText: 'ملاحظة تخطيط الشبكة',

    // Categories
    cablesTitle: 'أنواع الكابلات والتوصيلات',
    categories: {
      routers: 'Routers (الموجهات)',
      switches: 'Switches (المحولات)',
      hubs: 'Hubs (الموزعات)',
      wireless: 'Wireless (اللاسلكي)',
      security: 'Security (جدران الحماية)',
      wan: 'WAN (الشبكات الواسعة)',
      endDevices: 'End Devices (الأجهزة الطرفية)',
      smartDevices: 'Smart Devices (الأجهزة الذكية)',
      servers: 'Servers (الخوادم)',
      connections: 'Connections (التوصيلات)'
    },

    // Cables
    connAuto: 'Automatic (توصيل تلقائي)',
    connAutoDesc: 'يختار تلقائياً نوع الكابل والمنافذ المتوافقة المناسبة بين الجهازين.',
    connStraight: 'Copper Straight-Through (كابل مستقيم)',
    connStraightDesc: 'كابل إيثرنت مستقيم لربط الأجهزة المختلفة (PC إلى Switch، Switch إلى Router).',
    connCrossover: 'Copper Cross-Over (كابل متقاطع)',
    connCrossoverDesc: 'كابل إيثرنت متقاطع لربط الأجهزة المتشابهة (Switch إلى Switch، PC إلى PC، Router إلى Router).',
    connFiber: 'Fiber Optic (ألياف ضوئية)',
    connFiberDesc: 'كابل ألياف ضوئية فائق السرعة لربط منافذ الـ SFP / Fiber لمسافات بعيدة.',
    connSerialDce: 'Serial DCE (تسلسلي DCE)',
    connSerialDceDesc: 'كابل تسلسلي للراوترات يحدد سرعة التردد والتزامن (Clock Rate) من طرف الـ DCE.',
    connSerialDte: 'Serial DTE (تسلسلي DTE)',
    connSerialDteDesc: 'كابل تسلسلي للراوترات كطرف تابع (Terminal Endpoint).',
    connConsole: 'Console (كابل إدارة وتهيئة)',
    connConsoleDesc: 'كابل الإدارة والتهيئة بين منفذ RS-232 بالحاسوب ومنفذ Console بالراوتر أو السويتش.',
    connPhone: 'Phone Line (خط هاتف RJ-11)',
    connPhoneDesc: 'كابل الهاتف التناظري RJ-11 لتوصيل المودم ومحاكاة خطوط الهاتف.',
    connCoaxial: 'Coaxial (كابل محوري)',
    connCoaxialDesc: 'كابل محوري عالي التردد لمودم الكابل وتوزيع خدمات الإنترنت.',
    connUsb: 'USB (ناقل عام)',
    connUsbDesc: 'كابل الناقل التسلسلي العام USB لتوصيل الحواسيب بالطابعات والأجهزة الذكية.',

    // Device Model Descriptions
    modelDescriptions: {
      'cisco-2911': 'موجه سيسكو قياسي Cisco 2911 ISR مزود بثلاثة منافذ Gigabit Ethernet وفتحات توسعة EHWIC.',
      'cisco-1941': 'موجه شبكي تركيبي Cisco 1941 ISR ثنائي المنافذ جيجابت.',
      'cisco-4331': 'موجه عالي السرعة والأداء Cisco ISR 4331 للمؤسسات والشركات.',
      'cisco-2960': 'محول سويتش الطبقة الثانية Cisco Catalyst 2960 مزود بـ 24 منفذ 100M ومنفذي جيجابت.',
      'cisco-3560': 'محول سويتش متعدد الطبقات Layer 3 Cisco Catalyst 3560 جيجابت.',
      'generic-hub': 'موزع شبكي كلاسيكي Hub يعمل في الطبقة الفيزيائية مع إعادة البث لكافة المنافذ.',
      'generic-wrouter': 'راوتر لاسلكي منزلي مع توزيع DHCP ومحول 4 منافذ مدمج.',
      'generic-ap': 'نقطة بث وتوزيع لاسلكية Access Point لتغطية الأجهزة المحمولة.',
      'cisco-asa5506': 'جدار حماية أمني وفحص متقدم للحزم Cisco ASA 5506-X مع FirePOWER.',
      'cloud-wan': 'سحابة WAN لمحاكاة شبكة الإنترنت ومزودي الخدمة Frame Relay.',
      'dsl-modem': 'مودم DSL لتحويل خطوط الهاتف التناظرية إلى إيثرنت رقمي.',
      'pc-desktop': 'حاسوب شخصي مكتبي PC مزود ببطاقة شبكة Ethernet وأدوات تشغيل.',
      'laptop': 'حاسوب محمول متنقل Laptop مزود بـ Wi-Fi وبطاقة شبكة سلكية.',
      'printer': 'طابعة شبكية ليزرية مشتركة مع عنوان IP ثابت.',
      'smartphone': 'هاتف ذكي لاسلكي يتصل تلقائياً بنقاط البث والراوتر اللاسلكي.',
      'tablet': 'جهاز لوحي ذكي متصل بالشبكة اللاسلكية.',
      'server-standard': 'خادم خدمات مركزي متعدد الوظائف (DNS, Web, DHCP, FTP, Email, SSH, NTP).'
    },

    // Module Descriptions
    moduleDescriptions: {
      'HWIC-2T': 'موديول منفذين تسلسليين Serial عالي السرعة للربط بين الفروع عبر WAN.',
      'WIC-1AM': 'موديول منفذ مودم تناظري RJ-11 للمكالمات والاتصال الهاتفي.',
      'HWIC-1GE-SFP': 'موديول منفذ ألياف ضوئية SFP بصرية 1000BASE-LX لمسافات بعيدة.',
      'GLC-LH-SMD-SW': 'وحدة SFP بصرية 1000BASE-LX للربط الضوئي عالي السرعة بين السويتشات.',
      'PT-HOST-NM-1FE': 'بطاقة شبكة سلكية RJ-45 FastEthernet أحادية المنفذ.',
      'PT-HOST-NM-1W': 'هوائي وبطاقة شبكة لاسلكية 2.4GHz 802.11b/g/n للاتصال بنقاط البث.',
      'PT-HOST-NM-1FGE': 'بطاقة شبكة ألياف ضوئية بصرية FastEthernet FX للربط المباشر.',
      'PT-SRV-NM-1FGE': 'بطاقة سيرفر ألياف ضوئية جيجابت للاتصالات المركزية عالية الكثافة.',
      'PT-SRV-NM-1CGE': 'منفذ شبكة سلكي إضافي 1000BASE-T للخدمات المعزولة.'
    },

    // Device Properties Modal
    physicalTab: 'Physical (الفيزيائي)',
    configTab: 'Config (التهيئة)',
    cliTab: 'CLI (الأوامر)',
    desktopTab: 'Desktop (سطح المكتب)',
    servicesTab: 'Services (الخدمات)',
    powerOnBtn: 'تشغيل الطاقة (Power ON)',
    powerOffBtn: 'إيقاف الطاقة (Power OFF)',
    restartBtn: 'إعادة التشغيل (Restart)',
    factoryResetBtn: 'استعادة ضبط المصنع',
    chassisView: 'لوحة الشاسيه الفيزيائية والمنافذ',
    rearPanel: 'اللوحة الخلفية',
    powerSwitch: 'مفتاح الطاقة',
    powerLed: 'مؤشر الطاقة',
    expansionSlots: 'فتحات التوسعة للوحدات (Slots)',
    modulesActive: 'الوحدات المركبة حالياً في الجهاز',
    noModulesInstalled: 'لا توجد وحدات توسعة مركبة في هذا الشاسيه حالياً.',
    removeModule: 'إزالة الوحدة',
    installModule: 'تركيب الوحدة',
    availableModulesTitle: 'الوحدات والموديولات الإضافية (Available Modules)',
    availableModulesDesc: 'اختر الوحدة المناسبة لتركيبها داخل فتحات التوسعة بالشاسيه.',
    powerOnModuleWarningBadge: 'الطاقة قيد التشغيل (يجب إيقافها قبل تركيب/إزالة موديول)',
    powerOffModuleReadyBadge: 'الجهاز مطفأ (جاهز لتركيب الوحدات بأمان)',
    installedBadge: 'مثبت (Installed)',
    notInstalledBadge: 'متاح للتركيب',
    addedPorts: 'المنافذ المضافة:',
    noModulesSupported: 'هذا الجهاز مجهز بمنافذ مدمجة ولا يدعم فتحات توسعة خارجية حالياً.',
    removeModuleBtn: 'إزالة الوحدة',
    installModuleBtn: 'تركيب الوحدة (+)',

    // Port LEDs
    ledLegendTitle: 'دليل ألوان مؤشرات المنافذ (LED Legend)',
    ledGreenUp: 'أخضر: متصل ونشط (Link Up)',
    ledOrangeInit: 'برتقالي: تهيئة وفحص (Initializing / STP)',
    ledRedDown: 'أحمر: مغلق إدارياً (Admin Down)',
    ledGrayOff: 'رمادي: معطل أو الطاقة مطفأة (Disabled / OFF)',

    // Warnings & Dialogs
    cannotAddModuleTitle: 'تحذير أمني: لا يمكن تركيب أو إزالة موديول أثناء تشغيل الطاقة',
    cannotAddModuleCiscoSubtitle: 'بروتوكول سلامة العتاد في Cisco Packet Tracer',
    cannotAddModuleBody: 'في أجهزة Cisco الواقعية وبرنامج Packet Tracer، يُمنع تماماً نزع أو إدخال بطاقات وتوسعات الشبكة أثناء سريان التيار الكهربائي تجنباً لاحتراق الدوائر. يرجى إيقاف تشغيل مفتاح الطاقة (Power Switch) أولاً ثم المحاولة مرة أخرى.',
    powerOffAndProceed: 'إيقاف الطاقة الآن ومتابعة التركيب',
    cancelBtn: 'إلغاء',
    confirmResetTitle: 'تأكيد استعادة ضبط المصنع (Factory Reset)',
    confirmResetSubtitle: 'استعادة التهيئة الأولية للمصنع',
    confirmResetBody: (name: string) => `هل أنت متأكد من رغبتك في إعادة الجهاز [${name}] إلى إعدادات المصنع الأصلية؟ سيتم مسح كافة العناوين وسجلات الـ CLI وإزالة الوحدات المضافة.`,
    yesReset: 'نعم، استعادة ضبط المصنع',

    // Config Tab
    globalSettings: 'الإعدادات العامة (Global Settings)',
    hostname: 'اسم الجهاز (Hostname)',
    defaultGateway: 'البوابة الافتراضية (Default Gateway)',
    dnsServer: 'خادم الـ DNS Server',
    interfaces: 'منافذ الشبكة (Interfaces)',
    portStatus: 'حالة المنفذ (Port Status)',
    staticIp: 'ثابت (Static)',
    dhcp: 'تلقائي (DHCP)',
    ipAddress: 'عنوان الـ IP Address',
    subnetMask: 'قناع الشبكة (Subnet Mask)',
    vlanId: 'رقم الـ VLAN ID',
    selectPortHint: 'اختر منفذاً من القائمة لتعديل معايير الاتصال وعنوان الـ IP الخاص به.',
    portShutdown: 'المنفذ معطل إدارياً (shutdown)',
    portNoShutdown: 'المنفذ مفعل إدارياً (no shutdown)',

    // CLI Tab
    cliPowerOffWarning: 'الجهاز مطفأ حالياً (Powered OFF). قم بتشغيل مفتاح الطاقة من تبويب Physical لتشغيل شاشة الأوامر IOS.',
    cliInputPlaceholder: 'اكتب أمر سيسكو (مثال: enable, show ip int brief, conf t, ping)...',
    sendCmd: 'إرسال',
    cliClear: 'مسح الشاشة',
    cliHelpHint: 'الأوامر المدعومة: enable, show ip int brief, show running-config, configure terminal, interface, ip address, no shutdown, ping, exit',

    // Desktop Tab
    pcPowerOffWarning: 'الحاسوب مطفأ حالياً. قم بتشغيل زر الطاقة من تبويب Physical لفتح تطبيقات سطح المكتب.',
    ipConfigApp: 'تهيئة IP (IP Configuration)',
    cmdApp: 'موجه الأوامر (Command Prompt)',
    browserApp: 'متصفح الويب (Web Browser)',
    editorApp: 'محرر النصوص (Text Editor)',
    browserGo: 'انتقال',
    browserPlaceholder: 'أدخل العنوان (مثال: http://192.168.1.100)',
    editorSave: 'حفظ الملف',

    // Services Tab
    serviceStatusActive: 'نشطة وتستمع للطلبات',
    htmlContentLabel: 'محتوى صفحة الويب الرئيسية (HTML Root):',
    dnsRecordsLabel: 'سجلات النطاق المسجلة (DNS Records):',
    serviceRunningMsg: 'الخدمة مهيأة وتعمل بكفاءة في وضع الاستماع ومستعدة لاستقبال طلبات العملاء في الشبكة.',
    serverPowerOffWarning: 'الخادم مطفأ حالياً. قم بتشغيل مفتاح الطاقة لتفعيل الخدمات.',
    serviceEnabled: 'مفعلة (ON)',
    serviceDisabled: 'معطلة (OFF)',

    // Simulation Engine & Event List
    simPlay: 'تشغيل وتتبع الحزم (Play)',
    simPause: 'إيقاف مؤقت (Pause)',
    simStepForward: 'خطوة للأمام (Step Forward)',
    simSpeedToggle: 'سرعة المحاكاة (Speed)',
    simResetPackets: 'مسح جميع الحزم (Reset)',
    simSendNewPacket: 'إرسال حزمة جديدة (New Packet)',
    simulationPanelTitle: 'محرك المحاكاة والجدول الزمني للأحداث',
    eventListTime: 'الوقت',
    eventListLastDev: 'الجهاز السابق',
    eventListAtDev: 'عند الجهاز',
    eventListType: 'النوع',
    eventListStatus: 'الحالة',
    eventListInfo: 'تفاصيل الحدث',
    eventListPdu: 'بيانات PDU',
    viewPduBtn: 'فحص الـ PDU',
    pduModalTitle: 'تفاصيل طبقات الـ PDU عند الجهاز',
    inLayers: 'الطبقات الواردة (Inbound OSI Layers)',
    outLayers: 'الطبقات الصادرة (Outbound OSI Layers)',
    successfulStatus: 'ناجح (Successful)',
    failedStatus: 'فشل (Failed)',

    // Test Launcher Modal
    testLauncherTitle: 'إطلاق اختبار محاكاة بروتوكول جديد',
    packetTestType: 'نوع اختبار البروتوكول',
    sourceDevice: 'الجهاز المصدر (Source Device):',
    destDevice: 'الجهاز الهدف (Destination Device):',
    launchTestBtn: 'بدء المحاكاة الآن (Launch Test)',
    pingDesc: 'يرسل طلب ICMP Echo Request وينتظر رد Echo Reply للتحقق من الاتصال وسلامة المسار.',
    arpDesc: 'يبث طلب ARP Request لاكتشاف عنوان الـ MAC الفيزيائي المقابل لعنوان IP الجهاز الهدف.',
    dhcpDesc: 'يرسل طلب DORA لاستئجار عنوان IP تلقائي من خادم الـ DHCP في الشبكة.',
    dnsDesc: 'يستعلم عن عنوان IP المقابل لاسم النطاق من خادم الـ DNS.',
    httpDesc: 'يرسل طلب HTTP GET لتحميل وعرض صفحة الويب من الخادم.',

    // Simulation Errors & Status
    simErrors: {
      deviceNotFound: 'أحد الأجهزة المحددة أو كلاهما غير موجود في مساحة العمل.',
      sourcePoweredOff: (name: string) => `فشل: الجهاز المصدر [${name}] مطفأ (Powered OFF). قم بتشغيله أولاً.`,
      destPoweredOff: (name: string) => `فشل: الجهاز الهدف [${name}] مطفأ (Powered OFF).`,
      sourcePortDown: (name: string) => `فشل: المنفذ في [${name}] مغلق أو معطل إدارياً (Administratively Down).`,
      destPortDown: (name: string) => `فشل: المنفذ في [${name}] مغلق أو معطل إدارياً (Administratively Down).`,
      sourceNoIp: (name: string) => `فشل: الجهاز المصدر [${name}] لا يمتلك عنوان IP معين.`,
      destNoIp: (name: string) => `فشل: الجهاز الهدف [${name}] لا يمتلك عنوان IP معين.`,
      noRoute: (src: string, dst: string) => `فشل: لا يوجد اتصال أو كابل يصل بين [${src}] و [${dst}] (No Physical Route).`,
      cantRebootOff: 'لا يمكن إعادة تشغيل جهاز مطفأ! قم بتشغيل الطاقة أولاً.',
      connectionFailed: 'فشل اختبار الاتصال'
    },
    simMessages: {
      testStarted: (type: string, src: string, dst: string) => `بدأ اختبار ${type}: إرسال الحزمة من [${src}] إلى [${dst}].`,
      testSuccess: (type: string) => `اكتمل مسار ${type} وعادت الحزمة للمصدر بنجاح (Status: Successful) 🟢`,
      requestDesc: (type: string, from: string, to: string) => `${type} Request: من [${from}] إلى [${to}]`,
      replyDesc: (type: string, from: string, to: string) => `${type} Reply: من [${from}] عائداً إلى [${to}]`,
      stepInfo: (type: string, from: string, to: string) => `تم توجيه حزمة ${type} من [${from}] إلى [${to}]`,
      completeInfo: (type: string) => `اكتمل مسار ${type} بنجاح وعادت الحزمة للمصدر (Status: Successful).`
    },

    // Toasts
    toastNewWorkspace: 'تم إنشاء مساحة عمل جديدة.',
    toastProjectOpened: 'تم فتح المشروع بنجاح.',
    toastProjectSaved: 'تم حفظ طوبولوجيا الشبكة والتهيئة بنجاح.',
    toastSimulationReset: 'تم مسح جميع الحزم وإعادة تهيئة المحاكاة.',
    toastCableDeleted: 'تم حذف الكابل وفصل الاتصال بين الجهازين.',
    toastModuleInstalled: (name: string) => `تم تركيب الوحدة [${name}] بنجاح في فتحة التوسعة.`,
    toastModuleRemoved: (name: string) => `تمت إزالة الوحدة [${name}] وتفريغ فتحة التوسعة.`,
    toastModuleAlreadyInstalled: (name: string) => `الوحدة [${name}] مثبتة بالفعل في هذا الجهاز.`,
    toastPowerOn: (name: string) => `تم تشغيل الجهاز [${name}] (Power ON) 🟢`,
    toastPowerOff: (name: string) => `تم إيقاف تشغيل الجهاز [${name}] (Power OFF) 🔴`,
    toastRebooting: (name: string) => `جاري إعادة تشغيل الجهاز [${name}]... ⏳`,
    toastRebootComplete: (name: string) => `اكتملت إعادة تشغيل [${name}] بنجاح (System Up) 🟢`,
    toastFactoryResetComplete: (name: string) => `تمت استعادة إعدادات المصنع للجهاز [${name}] بالكامل.`,
    toastPortShutdown: (port: string) => `تم تعطيل المنفذ [${port}] إدارياً (shutdown).`,
    toastPortNoShutdown: (port: string) => `تم تفعيل المنفذ [${port}] إدارياً (no shutdown).`,
    toastConnectingStep1: (name: string) => `تم تحديد [${name}] كطرف أول. الآن انقر على الجهاز الثاني لإتمام التوصيل.`,
    toastConnectingSuccess: (src: string, srcPort: string, dst: string, dstPort: string) => `تم توصيل [${src}:${srcPort}] مع [${dst}:${dstPort}] بنجاح 🟢`,
    toastConnectionCanceled: 'تم إلغاء عملية التوصيل.',
    toastDeviceRenamed: 'تمت إعادة تسمية الجهاز بنجاح.',
    toastDeviceDuplicated: 'تم نسخ الجهاز بنجاح.',
    toastDeviceDeleted: (name: string) => `تم حذف الجهاز [${name}] وكافة كابلاته.`,
    toastDeviceAdded: (name: string) => `تمت إضافة الجهاز [${name}] إلى مساحة العمل.`,
    toastDeviceSelectedForCanvas: (name: string) => `تم اختيار [${name}] — انقر في مساحة العمل لوضعه.`,
    toastFitToScreen: 'تمت ملاءمة مساحة العمل 100%.',
    toastDeleteToolHint: 'أداة الحذف: اضغط على أي جهاز أو كابل لحذفه.',
    toastInspectToolHint: 'أداة الفحص: اضغط على أي جهاز لعرض خصائصه.',
    toastNotesToolHint: 'أداة الملاحظات: اضغط على مساحة العمل لكتابة ملاحظة.',
    toastCableToolHint: (name: string) => `أداة التوصيل نشطة: [${name}]`,
    toastNoteAdded: 'تمت إضافة ملاحظة توضيحية إلى مساحة العمل.',
    toastDhcpRequested: 'تم استئجار عنوان IP عبر DHCP بنجاح.',
    toastVlanAssigned: (port: string, vlan: number) => `تم تعيين المنفذ [${port}] في VLAN ${vlan}.`,
    toastLangSwitchedEn: 'Language switched to English 🇺🇸',
    toastLangSwitchedAr: 'تم تغيير اللغة إلى العربية 🇸🇦'
  }
};

export const STORAGE_LANG_KEY = 'netpulse_lang';

// Extensible registry for third-party or future languages
const customLocales: Record<string, Translations> = {};

export function registerLanguage(option: LanguageOption, dict: Translations): void {
  const index = SUPPORTED_LANGUAGES.findIndex((l) => l.code === option.code);
  if (index >= 0) {
    SUPPORTED_LANGUAGES[index] = option;
  } else {
    SUPPORTED_LANGUAGES.push(option);
  }
  customLocales[option.code] = dict;
}

export function getLanguageOption(code: LanguageCode): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

export function getLanguageDir(code: LanguageCode): 'ltr' | 'rtl' {
  const option = getLanguageOption(code);
  return option.dir;
}

export function getInitialLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved && (saved in translations || saved in customLocales)) {
      return saved;
    }
  } catch (e) {
    // ignore
  }
  return 'en'; // 1. اللغة الافتراضية هي English
}

export function saveLanguage(lang: LanguageCode): void {
  try {
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  } catch (e) {
    // ignore
  }
  if (typeof document !== 'undefined') {
    const dir = getLanguageDir(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    
    // Add/refresh smooth animation class on body
    document.body.classList.remove('lang-switch-anim');
    void document.body.offsetWidth; // trigger reflow
    document.body.classList.add('lang-switch-anim');
  }
}

export function getTranslations(code: LanguageCode): Translations {
  if (code in translations) {
    return translations[code as 'en' | 'ar'];
  }
  if (code in customLocales) {
    return customLocales[code];
  }
  return translations.en;
}
