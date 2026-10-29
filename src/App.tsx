import React, { useState, useRef, useEffect } from 'react';
import { DevicePropertiesModal } from './DevicePropertiesModal';
import { SettingsModal } from './SettingsModal';
import {
  LanguageCode,
  getTranslations,
  getLanguageDir,
  getInitialLanguage,
  saveLanguage,
  SUPPORTED_LANGUAGES
} from './i18n';
import {
  MousePointer,
  Hand,
  Trash2,
  Search,
  StickyNote,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  FilePlus,
  FolderOpen,
  Save,
  Play,
  Pause,
  RotateCcw,
  X,
  Copy,
  Edit2,
  Sliders,
  Zap,
  Check,
  AlertTriangle,
  Cable,
  Clock,
  Settings2,
  Power,
  Cpu,
  Monitor,
  Terminal as TerminalIcon,
  Globe,
  FileText,
  Server as ServerIcon,
  HardDrive,
  Network as NetworkIcon,
  ShieldAlert,
  Send,
  Plus,
  ArrowRight,
  FastForward,
  StepForward,
  Mail,
  ChevronDown,
  Layers,
  Info
} from 'lucide-react';

// فئات أجهزة Packet Tracer المطلوبة (10 فئات)
export type CategoryId =
  | 'routers'
  | 'switches'
  | 'hubs'
  | 'wireless'
  | 'security'
  | 'wan'
  | 'end_devices'
  | 'smart_devices'
  | 'servers'
  | 'connections';

export type ActiveTool = 'select' | 'pan' | 'delete' | 'inspect' | 'notes';

// أنواع الكابلات العشرة
export type CableTypeId =
  | 'conn-auto'
  | 'conn-straight'
  | 'conn-crossover'
  | 'conn-fiber'
  | 'conn-serial-dce'
  | 'conn-serial-dte'
  | 'conn-console'
  | 'conn-phone'
  | 'conn-coaxial'
  | 'conn-usb';

export type PortType = 'Ethernet' | 'Fiber' | 'Serial' | 'Console' | 'Phone' | 'Coaxial' | 'USB';

export interface DevicePort {
  id: string;
  name: string;
  type: PortType;
  ipAddress?: string;
  subnetMask?: string;
  isUp?: boolean;
  vlanId?: number;
  isDhcp?: boolean;
  macAddress?: string;
}

export interface AvailableModule {
  id: string;
  name: string;
  description: string;
  addedPorts: DevicePort[];
}

export interface DeviceModel {
  id: string;
  name: string;
  category: CategoryId;
  iconType:
    | 'router'
    | 'switch'
    | 'hub'
    | 'wireless'
    | 'security'
    | 'wan'
    | 'pc'
    | 'smart'
    | 'server'
    | 'cable_auto'
    | 'cable_copper'
    | 'cable_fiber'
    | 'cable_serial'
    | 'cable_console'
    | 'cable_phone'
    | 'cable_coaxial'
    | 'cable_usb';
  portsSummary: string;
  description: string;
  defaultPorts: DevicePort[];
  supportedModules: AvailableModule[];
}

export interface CableDefinition {
  id: CableTypeId;
  name: string;
  category: 'connections';
  iconType: DeviceModel['iconType'];
  color: string;
  lineStyle: 'solid' | 'dashed' | 'dotted' | 'zigzag';
  supportedPortType: PortType | 'all';
  description: string;
}

// كائن الإعدادات الكامل المحفوظ لكل جهاز
export interface DeviceConfiguration {
  powerOn: boolean;
  hostname: string;
  defaultGateway: string;
  dnsServer: string;
  installedModules: string[];
  vlans: Array<{ id: number; name: string }>;
  cliHistory: string[];
  cliLogs: string[];
  cliMode: 'user' | 'priv' | 'config' | 'config-if';
  cliSelectedInterface?: string;
  desktopActiveApp?: 'none' | 'ipconfig' | 'cmd' | 'terminal' | 'browser' | 'editor';
  cmdLogs: string[];
  desktopFiles: Array<{ name: string; content: string }>;
  browserUrl: string;
  browserRenderContent?: string;
  services: {
    dhcp: {
      enabled: boolean;
      poolName: string;
      gateway: string;
      dns: string;
      startIp: string;
      subnetMask: string;
      maxUsers: number;
    };
    dns: {
      enabled: boolean;
      records: Array<{ name: string; type: string; address: string }>;
    };
    http: {
      enabled: boolean;
      httpsEnabled: boolean;
      htmlContent: string;
    };
    ftp: {
      enabled: boolean;
      users: Array<{ username: string; password: string; permissions: string }>;
    };
    email: {
      enabled: boolean;
      domainName: string;
      users: Array<{ username: string; password: string }>;
    };
    ssh: {
      enabled: boolean;
      port: number;
      keyGenerated: boolean;
    };
    ntp: {
      enabled: boolean;
      currentTime: string;
    };
  };
}

export interface PlacedDevice {
  id: string;
  modelId: string;
  name: string;
  x: number;
  y: number;
  iconType: DeviceModel['iconType'];
  ports: DevicePort[];
  config: DeviceConfiguration;
}

export interface PlacedConnection {
  id: string;
  cableType: CableTypeId;
  fromDeviceId: string;
  fromPortId: string;
  toDeviceId: string;
  toPortId: string;
  isDCE?: boolean;
}

export interface PlacedNote {
  id: string;
  x: number;
  y: number;
  text: string;
}

// =========================================================================
// 🌟 أنواع وهياكل محرك المحاكاة (Phase 5: Simulation Engine Types) 🌟
// =========================================================================
export type SimulationTestType = 'Ping' | 'ARP' | 'DHCP' | 'DNS' | 'HTTP';

export interface SimulationHop {
  fromDevId: string;
  toDevId: string;
  viaConnId?: string;
  description: string;
  isReturn?: boolean;
}

export interface SimulationPacket {
  id: string;
  type: SimulationTestType;
  sourceDevId: string;
  targetDevId: string;
  status: 'In Progress' | 'Successful' | 'Failed';
  failureReason?: string;
  currentHopIndex: number;
  hops: SimulationHop[];
  progress: number; // 0 to 1 between current hop
}

export interface SimulationEvent {
  id: string;
  timestamp: string;
  lastDeviceName: string;
  atDeviceName: string;
  packetType: SimulationTestType;
  status: 'Successful' | 'In Progress' | 'Failed';
  info: string;
  details?: {
    inLayers?: string[];
    outLayers?: string[];
  };
}

// قائمة الموديولات القابلة للإضافة
export const ROUTER_MODULES: AvailableModule[] = [
  {
    id: 'HWIC-2T',
    name: 'HWIC-2T',
    description: 'موديول منفذين تسلسليين Serial عالي السرعة للربط بين الفروع عبر WAN.',
    addedPorts: [
      { id: 'Ser0/1/0', name: 'Serial0/1/0', type: 'Serial' },
      { id: 'Ser0/1/1', name: 'Serial0/1/1', type: 'Serial' }
    ]
  },
  {
    id: 'WIC-1AM',
    name: 'WIC-1AM',
    description: 'موديول منفذ مودم تناظري RJ-11 للمكالمات والاتصال الهاتفي.',
    addedPorts: [{ id: 'Modem0', name: 'Modem0', type: 'Phone' }]
  },
  {
    id: 'GLC-LH-SMD',
    name: 'GLC-LH-SMD',
    description: 'موديول منفذ ألياف ضوئية SFP بصرية 1000BASE-LX لمسافات بعيدة.',
    addedPorts: [{ id: 'Fiber0/2', name: 'FiberGigabit0/2', type: 'Fiber' }]
  }
];

// قائمة الكابلات العشرة المعتمدة
const CABLE_DEFINITIONS: CableDefinition[] = [
  {
    id: 'conn-auto',
    name: 'Automatic',
    category: 'connections',
    iconType: 'cable_auto',
    color: '#f59e0b',
    lineStyle: 'solid',
    supportedPortType: 'all',
    description: 'يختار تلقائياً نوع الكابل والمنافذ المتوافقة المناسبة بين الجهازين'
  },
  {
    id: 'conn-straight',
    name: 'Copper Straight-Through',
    category: 'connections',
    iconType: 'cable_copper',
    color: '#00bceb',
    lineStyle: 'solid',
    supportedPortType: 'Ethernet',
    description: 'كابل إيثرنت مستقيم لربط الأجهزة المختلفة (PC to Switch, Switch to Router)'
  },
  {
    id: 'conn-crossover',
    name: 'Copper Cross-Over',
    category: 'connections',
    iconType: 'cable_copper',
    color: '#f97316',
    lineStyle: 'dashed',
    supportedPortType: 'Ethernet',
    description: 'كابل إيثرنت متقاطع لربط الأجهزة المتشابهة (Switch to Switch, PC to PC, Router to Router)'
  },
  {
    id: 'conn-fiber',
    name: 'Fiber Optic',
    category: 'connections',
    iconType: 'cable_fiber',
    color: '#ea580c',
    lineStyle: 'dashed',
    supportedPortType: 'Fiber',
    description: 'كابل ألياف ضوئية فائق السرعة لربط منافذ الـ SFP / Fiber البصرية'
  },
  {
    id: 'conn-serial-dce',
    name: 'Serial DCE',
    category: 'connections',
    iconType: 'cable_serial',
    color: '#ef4444',
    lineStyle: 'solid',
    supportedPortType: 'Serial',
    description: 'كابل تسلسلي للراوترات يحدد سرعة التردد والتزامن (Clock Rate) من طرف الـ DCE'
  },
  {
    id: 'conn-serial-dte',
    name: 'Serial DTE',
    category: 'connections',
    iconType: 'cable_serial',
    color: '#b91c1c',
    lineStyle: 'solid',
    supportedPortType: 'Serial',
    description: 'كابل تسلسلي للراوترات كطرف تابع (Terminal Endpoint)'
  },
  {
    id: 'conn-console',
    name: 'Console',
    category: 'connections',
    iconType: 'cable_console',
    color: '#06b6d4',
    lineStyle: 'solid',
    supportedPortType: 'Console',
    description: 'كابل الإدارة والتهيئة بين منفذ RS-232/USB بالحاسوب ومنفذ Console بالراوتر/السويتش'
  },
  {
    id: 'conn-phone',
    name: 'Phone',
    category: 'connections',
    iconType: 'cable_phone',
    color: '#9333ea',
    lineStyle: 'solid',
    supportedPortType: 'Phone',
    description: 'كابل الهاتف التناظري RJ-11 لتوصيل المودم ومحاكاة خطوط الهاتف'
  },
  {
    id: 'conn-coaxial',
    name: 'Coaxial',
    category: 'connections',
    iconType: 'cable_coaxial',
    color: '#3b82f6',
    lineStyle: 'solid',
    supportedPortType: 'Coaxial',
    description: 'كابل محوري عالي التردد لمودم الكابل وتوزيع خدمات الإنترنت'
  },
  {
    id: 'conn-usb',
    name: 'USB',
    category: 'connections',
    iconType: 'cable_usb',
    color: '#10b981',
    lineStyle: 'solid',
    supportedPortType: 'USB',
    description: 'كابل الناقل التسلسلي العام USB لتوصيل الحواسيب بالطابعات والأجهزة الذكية'
  }
];

// مكتبة الأجهزة مع تعريف منافذ كل جهاز بدقة
export const PACKET_TRACER_MODELS: DeviceModel[] = [
  // 1. Routers
  {
    id: 'router-2911',
    name: '2911',
    category: 'routers',
    iconType: 'router',
    portsSummary: '3x GE, 2x Serial, Console',
    description: 'موجه شبكي قياسي Cisco 2911 ISR',
    supportedModules: ROUTER_MODULES,
    defaultPorts: [
      { id: 'Gig0/0', name: 'GigabitEthernet0/0', type: 'Ethernet', ipAddress: '192.168.1.1', subnetMask: '255.255.255.0', isUp: true, macAddress: '0001.9682.01A1' },
      { id: 'Gig0/1', name: 'GigabitEthernet0/1', type: 'Ethernet', isUp: false, macAddress: '0001.9682.01A2' },
      { id: 'Gig0/2', name: 'GigabitEthernet0/2', type: 'Ethernet', isUp: false, macAddress: '0001.9682.01A3' },
      { id: 'Ser0/0/0', name: 'Serial0/0/0', type: 'Serial', isUp: false, macAddress: '0001.9682.01A4' },
      { id: 'Ser0/0/1', name: 'Serial0/0/1', type: 'Serial', isUp: false, macAddress: '0001.9682.01A5' },
      { id: 'Console', name: 'Console', type: 'Console' }
    ]
  },
  {
    id: 'router-1941',
    name: '1941',
    category: 'routers',
    iconType: 'router',
    portsSummary: '2x GE, 1x Serial, Console',
    description: 'موجه شبكي تركيبي Cisco 1941',
    supportedModules: ROUTER_MODULES,
    defaultPorts: [
      { id: 'Gig0/0', name: 'GigabitEthernet0/0', type: 'Ethernet', isUp: false, macAddress: '0060.7011.1941' },
      { id: 'Gig0/1', name: 'GigabitEthernet0/1', type: 'Ethernet', isUp: false, macAddress: '0060.7011.1942' },
      { id: 'Ser0/0/0', name: 'Serial0/0/0', type: 'Serial', isUp: false, macAddress: '0060.7011.1943' },
      { id: 'Console', name: 'Console', type: 'Console' }
    ]
  },
  {
    id: 'router-4331',
    name: '4331',
    category: 'routers',
    iconType: 'router',
    portsSummary: '2x GE, 1x Fiber, 1x Serial',
    description: 'موجه Gigabit عالي السرعة ISR 4331',
    supportedModules: ROUTER_MODULES,
    defaultPorts: [
      { id: 'Gig0/0/0', name: 'GigabitEthernet0/0/0', type: 'Ethernet', isUp: false, macAddress: '000C.8543.0001' },
      { id: 'Gig0/0/1', name: 'GigabitEthernet0/0/1', type: 'Ethernet', isUp: false, macAddress: '000C.8543.0002' },
      { id: 'Fiber0/0/2', name: 'FiberGigabit0/0/2', type: 'Fiber', isUp: false, macAddress: '000C.8543.0003' },
      { id: 'Ser0/1/0', name: 'Serial0/1/0', type: 'Serial', isUp: false, macAddress: '000C.8543.0004' },
      { id: 'Console', name: 'Console', type: 'Console' }
    ]
  },

  // 2. Switches
  {
    id: 'switch-2960',
    name: '2960-24TT',
    category: 'switches',
    iconType: 'switch',
    portsSummary: '24x FE, 2x GE, Console',
    description: 'محول سويتش الطبقة الثانية Catalyst 2960',
    supportedModules: [],
    defaultPorts: [
      { id: 'Fa0/1', name: 'FastEthernet0/1', type: 'Ethernet', isUp: true, vlanId: 1, macAddress: '000A.4129.6001' },
      { id: 'Fa0/2', name: 'FastEthernet0/2', type: 'Ethernet', isUp: true, vlanId: 1, macAddress: '000A.4129.6002' },
      { id: 'Fa0/3', name: 'FastEthernet0/3', type: 'Ethernet', isUp: true, vlanId: 1, macAddress: '000A.4129.6003' },
      { id: 'Fa0/4', name: 'FastEthernet0/4', type: 'Ethernet', isUp: false, vlanId: 1, macAddress: '000A.4129.6004' },
      { id: 'Fa0/5', name: 'FastEthernet0/5', type: 'Ethernet', isUp: false, vlanId: 1, macAddress: '000A.4129.6005' },
      { id: 'Fa0/6', name: 'FastEthernet0/6', type: 'Ethernet', isUp: false, vlanId: 1, macAddress: '000A.4129.6006' },
      { id: 'Gig0/1', name: 'GigabitEthernet0/1', type: 'Ethernet', isUp: true, vlanId: 1, macAddress: '000A.4129.6007' },
      { id: 'Gig0/2', name: 'GigabitEthernet0/2', type: 'Ethernet', isUp: false, vlanId: 1, macAddress: '000A.4129.6008' },
      { id: 'Console', name: 'Console', type: 'Console' }
    ]
  },
  {
    id: 'switch-3560',
    name: '3560-24PS',
    category: 'switches',
    iconType: 'switch',
    portsSummary: '24x FE, 2x Fiber SFP',
    description: 'محول سويتش متعدد الطبقات Layer 3',
    supportedModules: [],
    defaultPorts: [
      { id: 'Fa0/1', name: 'FastEthernet0/1', type: 'Ethernet', isUp: false, vlanId: 1, macAddress: '00D0.9735.6001' },
      { id: 'Fa0/2', name: 'FastEthernet0/2', type: 'Ethernet', isUp: false, vlanId: 1, macAddress: '00D0.9735.6002' },
      { id: 'Fiber0/1', name: 'GigabitEthernet0/1 (SFP)', type: 'Fiber', isUp: false, vlanId: 1, macAddress: '00D0.9735.6003' },
      { id: 'Fiber0/2', name: 'GigabitEthernet0/2 (SFP)', type: 'Fiber', isUp: false, vlanId: 1, macAddress: '00D0.9735.6004' },
      { id: 'Console', name: 'Console', type: 'Console' }
    ]
  },

  // 3. Hubs
  {
    id: 'hub-pt',
    name: 'Hub-PT',
    category: 'hubs',
    iconType: 'hub',
    portsSummary: '6x FastEthernet',
    description: 'موزع شبكي كلاسيكي Hub للطبقة الفيزيائية',
    supportedModules: [],
    defaultPorts: [
      { id: 'Port0', name: 'FastEthernet0', type: 'Ethernet', isUp: true },
      { id: 'Port1', name: 'FastEthernet1', type: 'Ethernet', isUp: true },
      { id: 'Port2', name: 'FastEthernet2', type: 'Ethernet', isUp: false },
      { id: 'Port3', name: 'FastEthernet3', type: 'Ethernet', isUp: false }
    ]
  },

  // 4. Wireless
  {
    id: 'wrt300n',
    name: 'WRT300N',
    category: 'wireless',
    iconType: 'wireless',
    portsSummary: '4x Ethernet, 1x Internet',
    description: 'راوتر لاسلكي منزلي مع توزيع DHCP',
    supportedModules: [],
    defaultPorts: [
      { id: 'Internet', name: 'Internet (WAN)', type: 'Ethernet', isUp: false },
      { id: 'Ethernet1', name: 'Ethernet 1', type: 'Ethernet', isUp: false },
      { id: 'Ethernet2', name: 'Ethernet 2', type: 'Ethernet', isUp: false }
    ]
  },
  {
    id: 'ap-pt',
    name: 'AccessPoint',
    category: 'wireless',
    iconType: 'wireless',
    portsSummary: '1x Eth (Port 0)',
    description: 'نقطة بث وتوزيع لاسلكية AP',
    supportedModules: [],
    defaultPorts: [{ id: 'Port0', name: 'Port 0 (LAN)', type: 'Ethernet', isUp: true }]
  },

  // 5. Security
  {
    id: 'asa-5506',
    name: 'ASA 5506-X',
    category: 'security',
    iconType: 'security',
    portsSummary: '8x GE Firewall, Console',
    description: 'جدار حماية أمني وفحص متقدم Cisco ASA',
    supportedModules: [],
    defaultPorts: [
      { id: 'Gig1/1', name: 'GigabitEthernet1/1', type: 'Ethernet', isUp: false },
      { id: 'Gig1/2', name: 'GigabitEthernet1/2', type: 'Ethernet', isUp: false },
      { id: 'Console', name: 'Console', type: 'Console' }
    ]
  },

  // 6. WAN
  {
    id: 'cloud-pt',
    name: 'Cloud-PT',
    category: 'wan',
    iconType: 'wan',
    portsSummary: 'Serial, Phone, Coaxial, Eth',
    description: 'سحابة WAN لمحاكاة الإنترنت والمزودين',
    supportedModules: [],
    defaultPorts: [
      { id: 'Eth6', name: 'Ethernet6', type: 'Ethernet', isUp: true },
      { id: 'Ser0', name: 'Serial0', type: 'Serial', isUp: false },
      { id: 'Modem4', name: 'Modem4 (RJ-11)', type: 'Phone', isUp: false },
      { id: 'Coax7', name: 'Coaxial7', type: 'Coaxial', isUp: false }
    ]
  },
  {
    id: 'dsl-modem',
    name: 'DSL Modem',
    category: 'wan',
    iconType: 'wan',
    portsSummary: '1x Phone, 1x Eth',
    description: 'مودم DSL لتحويل خطوط الهاتف',
    supportedModules: [],
    defaultPorts: [
      { id: 'Port0', name: 'Port 0 (Line RJ-11)', type: 'Phone', isUp: false },
      { id: 'Port1', name: 'Port 1 (Ethernet)', type: 'Ethernet', isUp: false }
    ]
  },

  // 7. End Devices
  {
    id: 'pc-pt',
    name: 'PC-PT',
    category: 'end_devices',
    iconType: 'pc',
    portsSummary: '1x FE, RS-232, USB',
    description: 'حاسوب شخصي مكتبي Standard Desktop',
    supportedModules: [],
    defaultPorts: [
      { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.10', subnetMask: '255.255.255.0', isUp: true, isDhcp: false, macAddress: '00E0.F726.89D2' },
      { id: 'RS232', name: 'RS-232 (Serial/Console)', type: 'Console' },
      { id: 'USB0', name: 'USB0', type: 'USB' }
    ]
  },
  {
    id: 'laptop-pt',
    name: 'Laptop-PT',
    category: 'end_devices',
    iconType: 'pc',
    portsSummary: '1x FE, RS-232, USB',
    description: 'حاسوب محمول متنقل',
    supportedModules: [],
    defaultPorts: [
      { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.11', subnetMask: '255.255.255.0', isUp: true, isDhcp: false, macAddress: '0002.162B.443C' },
      { id: 'RS232', name: 'RS-232', type: 'Console' },
      { id: 'USB0', name: 'USB0', type: 'USB' }
    ]
  },
  {
    id: 'printer-pt',
    name: 'Printer-PT',
    category: 'end_devices',
    iconType: 'pc',
    portsSummary: '1x FE, 1x USB',
    description: 'طابعة شبكية مشتركة',
    supportedModules: [],
    defaultPorts: [
      { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.50', subnetMask: '255.255.255.0', isUp: true },
      { id: 'USB0', name: 'USB0', type: 'USB' }
    ]
  },

  // 8. Smart Devices
  {
    id: 'smart-phone',
    name: 'Smart Phone',
    category: 'smart_devices',
    iconType: 'smart',
    portsSummary: '1x USB-C',
    description: 'هاتف ذكي لاسلكي',
    supportedModules: [],
    defaultPorts: [{ id: 'USB-C', name: 'USB-C Port', type: 'USB' }]
  },
  {
    id: 'tablet-pt',
    name: 'Tablet-PT',
    category: 'smart_devices',
    iconType: 'smart',
    portsSummary: '1x USB-C',
    description: 'جهاز لوحي ذكي متصل بالشبكة',
    supportedModules: [],
    defaultPorts: [{ id: 'USB-C', name: 'USB-C Port', type: 'USB' }]
  },

  // 9. Servers
  {
    id: 'server-pt',
    name: 'Server-PT',
    category: 'servers',
    iconType: 'server',
    portsSummary: '2x FE, 1x Fiber, RS-232',
    description: 'خادم خدمات مركزي (DNS / Web / DHCP)',
    supportedModules: [],
    defaultPorts: [
      { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.100', subnetMask: '255.255.255.0', isUp: true, macAddress: '0001.96C2.3789' },
      { id: 'Fa1', name: 'FastEthernet1', type: 'Ethernet', isUp: false, macAddress: '0001.96C2.378A' },
      { id: 'Fiber0', name: 'FiberGigabit0', type: 'Fiber', isUp: false, macAddress: '0001.96C2.378B' },
      { id: 'RS232', name: 'RS-232 (Console)', type: 'Console' }
    ]
  }
];

// دالة توليد التهيئة الافتراضية
export function createDefaultConfig(name: string, category: CategoryId): DeviceConfiguration {
  return {
    powerOn: true,
    hostname: name,
    defaultGateway: '192.168.1.1',
    dnsServer: '192.168.1.100',
    installedModules: [],
    vlans: [
      { id: 1, name: 'default' },
      { id: 10, name: 'MANAGEMENT' },
      { id: 20, name: 'USERS' }
    ],
    cliHistory: [],
    cliLogs: [
      'Cisco IOS Software, C2900 Software Version 15.1(4)M4',
      'Technical Support: http://www.cisco.com/techsupport',
      'Copyright (c) 1986-2026 by Cisco Systems, Inc.',
      '',
      'Press RETURN to get started!'
    ],
    cliMode: 'user',
    desktopActiveApp: 'none',
    cmdLogs: [
      'Microsoft Windows [Version 10.0.19045]',
      '(c) Microsoft Corporation. All rights reserved.',
      ''
    ],
    desktopFiles: [
      { name: 'notes.txt', content: 'Network topology testing notes - Phase 5.' }
    ],
    browserUrl: 'http://192.168.1.100',
    services: {
      dhcp: {
        enabled: true,
        poolName: 'LAN-POOL-1',
        gateway: '192.168.1.1',
        dns: '192.168.1.100',
        startIp: '192.168.1.10',
        subnetMask: '255.255.255.0',
        maxUsers: 50
      },
      dns: {
        enabled: true,
        records: [
          { name: 'cisco.com', type: 'A Record', address: '192.168.1.100' },
          { name: 'netpulse.lan', type: 'A Record', address: '192.168.1.1' }
        ]
      },
      http: {
        enabled: true,
        httpsEnabled: true,
        htmlContent: '<!DOCTYPE html><html><head><title>Cisco Packet Tracer Web Server</title></head><body style="background:#070e1b; color:#38bdf8; font-family:sans-serif; padding:24px;"><h1>Welcome to NetPulse Server</h1><p>HTTP Service is active and responding.</p><hr/><small>Cisco IOS Multi-Service Engine</small></body></html>'
      },
      ftp: {
        enabled: true,
        users: [
          { username: 'cisco', password: 'cisco', permissions: 'RWDN' },
          { username: 'admin', password: 'admin', permissions: 'RWD' }
        ]
      },
      email: {
        enabled: true,
        domainName: 'netpulse.com',
        users: [
          { username: 'user1', password: 'password' },
          { username: 'admin', password: 'admin' }
        ]
      },
      ssh: {
        enabled: true,
        port: 22,
        keyGenerated: true
      },
      ntp: {
        enabled: true,
        currentTime: '2026-10-12 12:00:00 UTC'
      }
    }
  };
}

// فئات شريط Packet Tracer السفلي (10 فئات)
const CATEGORIES: { id: CategoryId; label: string; iconType: DeviceModel['iconType'] }[] = [
  { id: 'routers', label: 'Routers', iconType: 'router' },
  { id: 'switches', label: 'Switches', iconType: 'switch' },
  { id: 'hubs', label: 'Hubs', iconType: 'hub' },
  { id: 'wireless', label: 'Wireless', iconType: 'wireless' },
  { id: 'security', label: 'Security', iconType: 'security' },
  { id: 'wan', label: 'WAN', iconType: 'wan' },
  { id: 'end_devices', label: 'End Devices', iconType: 'pc' },
  { id: 'smart_devices', label: 'Smart Devices', iconType: 'smart' },
  { id: 'servers', label: 'Servers', iconType: 'server' },
  { id: 'connections', label: 'Connections', iconType: 'cable_auto' }
];

export default function App() {
  // نظام اللغات المتعدد (Default: English 'en', Optional: Arabic 'ar')
  const [lang, setLang] = useState<LanguageCode>(getInitialLanguage());
  const t = getTranslations(lang);
  const dir = getLanguageDir(lang);

  useEffect(() => {
    saveLanguage(lang);
  }, [lang]);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLang(newLang);
    saveLanguage(newLang);
    showToast(newLang === 'en' ? t.toastLangSwitchedEn : t.toastLangSwitchedAr);
  };

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLinkLabels, setShowLinkLabels] = useState<boolean>(true);

  // 1. أداة العمل العلوية النشطة ووضع المحاكاة
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [mode, setMode] = useState<'realtime' | 'simulation'>('simulation'); // 1. وضعين: Realtime / Simulation

  // 2. إحداثيات ومقياس مساحة العمل (Pan & Zoom)
  const [viewport, setViewport] = useState<{ x: number; y: number; zoom: number }>({
    x: 0,
    y: 0,
    zoom: 1.0
  });

  // 3. فئة الأجهزة المحددة في الشريط السفلي + جهاز الختم المختار
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>('routers');
  const [activeStampModel, setActiveStampModel] = useState<DeviceModel | null>(null);

  // 4. حالة أداة التوصيل الحالية
  const [activeCableType, setActiveCableType] = useState<CableTypeId | null>(null);
  const [connectingSource, setConnectingSource] = useState<{
    deviceId: string;
    portId?: string;
  } | null>(null);

  const [portPickerState, setPortPickerState] = useState<{
    deviceId: string;
    step: 'source' | 'target';
  } | null>(null);

  const [selectedConnection, setSelectedConnection] = useState<PlacedConnection | null>(null);

  // 5. الأجهزة والوصلات والملاحظات الموضوعة في مساحة العمل
  const [placedDevices, setPlacedDevices] = useState<PlacedDevice[]>([
    {
      id: 'init-router',
      modelId: 'router-2911',
      name: 'Router0',
      x: 230,
      y: 170,
      iconType: 'router',
      ports: PACKET_TRACER_MODELS.find((m) => m.id === 'router-2911')?.defaultPorts || [],
      config: createDefaultConfig('Router0', 'routers')
    },
    {
      id: 'init-switch',
      modelId: 'switch-2960',
      name: 'Switch0',
      x: 230,
      y: 310,
      iconType: 'switch',
      ports: PACKET_TRACER_MODELS.find((m) => m.id === 'switch-2960')?.defaultPorts || [],
      config: createDefaultConfig('Switch0', 'switches')
    },
    {
      id: 'init-pc',
      modelId: 'pc-pt',
      name: 'PC0',
      x: 110,
      y: 440,
      iconType: 'pc',
      ports: PACKET_TRACER_MODELS.find((m) => m.id === 'pc-pt')?.defaultPorts || [],
      config: createDefaultConfig('PC0', 'end_devices')
    },
    {
      id: 'init-server',
      modelId: 'server-pt',
      name: 'Server0',
      x: 350,
      y: 440,
      iconType: 'server',
      ports: PACKET_TRACER_MODELS.find((m) => m.id === 'server-pt')?.defaultPorts || [],
      config: createDefaultConfig('Server0', 'servers')
    }
  ]);

  // قائمة الوصلات الفعالة
  const [connections, setConnections] = useState<PlacedConnection[]>([
    {
      id: 'conn-init-1',
      cableType: 'conn-straight',
      fromDeviceId: 'init-router',
      fromPortId: 'Gig0/0',
      toDeviceId: 'init-switch',
      toPortId: 'Gig0/1'
    },
    {
      id: 'conn-init-2',
      cableType: 'conn-straight',
      fromDeviceId: 'init-switch',
      fromPortId: 'Fa0/1',
      toDeviceId: 'init-pc',
      toPortId: 'Fa0'
    },
    {
      id: 'conn-init-3',
      cableType: 'conn-straight',
      fromDeviceId: 'init-switch',
      fromPortId: 'Fa0/2',
      toDeviceId: 'init-server',
      toPortId: 'Fa0'
    }
  ]);

  const [notes, setNotes] = useState<PlacedNote[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // =========================================================================
  // 🌟 حالات محرك المحاكاة (Phase 5 State Management) 🌟
  // =========================================================================
  const [simPlaying, setSimPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [activePackets, setActivePackets] = useState<SimulationPacket[]>([]);
  const [eventList, setEventList] = useState<SimulationEvent[]>([
    {
      id: 'ev-0',
      timestamp: '0.000s',
      lastDeviceName: 'PC0',
      atDeviceName: 'PC0',
      packetType: 'Ping',
      status: 'Successful',
      info: 'Simulation engine initialized and ready.',
      details: {
        inLayers: ['Layer 1: Port FastEthernet0 up', 'Layer 2: Ethernet II framing', 'Layer 3: IP 192.168.1.10'],
        outLayers: ['Layer 3: ICMP Echo Request prepared', 'Layer 2: Dest MAC resolved', 'Layer 1: FastEthernet0 tx']
      }
    }
  ]);
  const [selectedEvent, setSelectedEvent] = useState<SimulationEvent | null>(null);

  // نافذة إرسال حزمة جديدة (New Packet Launcher Modal)
  const [testLauncherOpen, setTestLauncherOpen] = useState<boolean>(false);
  const [testType, setTestType] = useState<SimulationTestType>('Ping');
  const [testSourceId, setTestSourceId] = useState<string>('init-pc');
  const [testTargetId, setTestTargetId] = useState<string>('init-server');

  // نافذة خصائص الأجهزة (Phase 4)
  const [propertiesDeviceId, setPropertiesDeviceId] = useState<string | null>(null);
  const [activePropertyTab, setActivePropertyTab] = useState<'physical' | 'config' | 'cli' | 'desktop' | 'services'>('config');

  // قائمة الضغط المطول
  const [contextMenu, setContextMenu] = useState<{
    device: PlacedDevice;
    x: number;
    y: number;
  } | null>(null);

  // حالات السحب
  const [dragNewModel, setDragNewModel] = useState<DeviceModel | null>(null);
  const [dragGhostPos, setDragGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [movingDeviceId, setMovingDeviceId] = useState<string | null>(null);
  const moveOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; viewX: number; viewY: number }>({
    x: 0,
    y: 0,
    viewX: 0,
    viewY: 0
  });

  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const pointerDownInfo = useRef<{ x: number; y: number; time: number; moved: boolean }>({
    x: 0,
    y: 0,
    time: 0,
    moved: false
  });
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef<{ [key: string]: number }>({});

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentInspectDevice = placedDevices.find((d) => d.id === propertiesDeviceId) || null;

  // =========================================================================
  // 🌟 محرك بناء مسار الحزم والتحقق الشبكي (Pathfinding & Packet Logic) 🌟
  // =========================================================================
  const buildSimulationPath = (
    srcId: string,
    dstId: string,
    type: SimulationTestType
  ): { success: boolean; error?: string; hops: SimulationHop[] } => {
    const srcDev = placedDevices.find((d) => d.id === srcId);
    const dstDev = placedDevices.find((d) => d.id === dstId);

    if (!srcDev || !dstDev) {
      return { success: false, error: t.simErrors.deviceNotFound, hops: [] };
    }

    // 3. التحقق من سبب الفشل: الجهاز مطفأ
    if (!srcDev.config.powerOn) {
      return { success: false, error: t.simErrors.sourcePoweredOff(srcDev.name), hops: [] };
    }
    if (!dstDev.config.powerOn) {
      return { success: false, error: t.simErrors.destPoweredOff(dstDev.name), hops: [] };
    }

    // التحقق من منافذ المصدر والهدف
    const srcPort = srcDev.ports.find((p) => p.type === 'Ethernet' || p.type === 'Fiber');
    const dstPort = dstDev.ports.find((p) => p.type === 'Ethernet' || p.type === 'Fiber');

    if (!srcPort || !srcPort.isUp) {
      return { success: false, error: t.simErrors.sourcePortDown(srcDev.name), hops: [] };
    }
    if (!dstPort || !dstPort.isUp) {
      return { success: false, error: t.simErrors.destPortDown(dstDev.name), hops: [] };
    }

    // التحقق من عناوين الـ IP (لاختبارات Ping, DNS, HTTP)
    if (type === 'Ping' || type === 'DNS' || type === 'HTTP') {
      if (!srcPort.ipAddress || srcPort.ipAddress === '0.0.0.0') {
        return { success: false, error: t.simErrors.sourceNoIp(srcDev.name), hops: [] };
      }
      if (!dstPort.ipAddress || dstPort.ipAddress === '0.0.0.0') {
        return { success: false, error: t.simErrors.destNoIp(dstDev.name), hops: [] };
      }
    }

    // فحص المسار الفيزيائي عبر الروابط (BFS Search)
    const queue: { devId: string; path: string[] }[] = [{ devId: srcId, path: [srcId] }];
    const visited = new Set<string>([srcId]);
    let foundPath: string[] | null = null;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.devId === dstId) {
        foundPath = current.path;
        break;
      }

      // إيجاد جميع الأجهزة المجاورة المتصلة برابط نشط
      const neighborConns = connections.filter(
        (c) => c.fromDeviceId === current.devId || c.toDeviceId === current.devId
      );

      for (const conn of neighborConns) {
        const nextId = conn.fromDeviceId === current.devId ? conn.toDeviceId : conn.fromDeviceId;
        const nextDev = placedDevices.find((d) => d.id === nextId);
        // لا يمكن للحزم المرور عبر جهاز وسيط مطفأ الطاقة (Powered OFF)
        if (nextDev && !nextDev.config.powerOn && nextId !== dstId) {
          continue;
        }
        if (!visited.has(nextId)) {
          visited.add(nextId);
          queue.push({ devId: nextId, path: [...current.path, nextId] });
        }
      }
    }

    if (!foundPath || foundPath.length < 2) {
      return {
        success: false,
        error: t.simErrors.noRoute(srcDev.name, dstDev.name),
        hops: []
      };
    }

    // بناء قائمة القفزات ذهاباً وإياباً (Forward & Return Hops)
    const hops: SimulationHop[] = [];

    // قفزات الذهاب (Request)
    for (let i = 0; i < foundPath.length - 1; i++) {
      const from = foundPath[i];
      const to = foundPath[i + 1];
      const fromName = placedDevices.find((d) => d.id === from)?.name || '';
      const toName = placedDevices.find((d) => d.id === to)?.name || '';

      hops.push({
        fromDevId: from,
        toDevId: to,
        description: t.simMessages.requestDesc(type, fromName, toName),
        isReturn: false
      });
    }

    // قفزات الإياب (Reply)
    for (let i = foundPath.length - 1; i > 0; i--) {
      const from = foundPath[i];
      const to = foundPath[i - 1];
      const fromName = placedDevices.find((d) => d.id === from)?.name || '';
      const toName = placedDevices.find((d) => d.id === to)?.name || '';

      hops.push({
        fromDevId: from,
        toDevId: to,
        description: t.simMessages.replyDesc(type, fromName, toName),
        isReturn: true
      });
    }

    return { success: true, hops };
  };

  // إطلاق اختبار حزمة جديد
  const handleLaunchTest = (type: SimulationTestType, srcId: string, dstId: string) => {
    const srcDev = placedDevices.find((d) => d.id === srcId);
    const dstDev = placedDevices.find((d) => d.id === dstId);
    if (!srcDev || !dstDev) return;

    const result = buildSimulationPath(srcId, dstId, type);

    const nowTime = `${(eventList.length * 0.05).toFixed(3)}s`;

    if (!result.success) {
      // 3. عند فشل الاتصال: عرض سبب الفشل
      const failEvent: SimulationEvent = {
        id: `ev-${Date.now()}`,
        timestamp: nowTime,
        lastDeviceName: srcDev.name,
        atDeviceName: srcDev.name,
        packetType: type,
        status: 'Failed',
        info: result.error || t.simErrors.connectionFailed,
        details: {
          inLayers: ['Layer 1: Checking interface', 'Layer 2: Checking framing'],
          outLayers: [`Layer 3: Packet Drop -> ${result.error}`]
        }
      };

      setEventList((prev) => [failEvent, ...prev]);
      showToast(result.error || t.simErrors.connectionFailed);
      setTestLauncherOpen(false);
      return;
    }

    // إنشاء الحزمة النشطة
    const newPacket: SimulationPacket = {
      id: `pkt-${Date.now()}`,
      type,
      sourceDevId: srcId,
      targetDevId: dstId,
      status: 'In Progress',
      currentHopIndex: 0,
      hops: result.hops,
      progress: 0
    };

    setActivePackets([newPacket]);
    setSimPlaying(true);
    setTestLauncherOpen(false);

    // إضافة أول حدث في قائمة الأحداث
    const startEvent: SimulationEvent = {
      id: `ev-${Date.now()}`,
      timestamp: nowTime,
      lastDeviceName: srcDev.name,
      atDeviceName: srcDev.name,
      packetType: type,
      status: 'In Progress',
      info: t.simMessages.testStarted(type, srcDev.name, dstDev.name),
      details: {
        inLayers: ['Layer 1: Port Active', 'Layer 2: Frame created', 'Layer 3: Packet Header ready'],
        outLayers: [`Layer 3: ${type} Request generated`, 'Layer 2: Dest MAC populated', 'Layer 1: Transmitting frame']
      }
    };

    setEventList((prev) => [startEvent, ...prev]);
    showToast(t.simMessages.testStarted(type, srcDev.name, dstDev.name));
  };

  // 2. خطوة واحدة للأمام (Step Forward) في المحاكاة
  const handleStepForward = () => {
    if (activePackets.length === 0) return;

    setActivePackets((prev) =>
      prev.map((pkt) => {
        const nextHopIndex = pkt.currentHopIndex + 1;
        const currentHop = pkt.hops[pkt.currentHopIndex];
        const nextDev = placedDevices.find((d) => d.id === currentHop?.toDevId);
        const fromDev = placedDevices.find((d) => d.id === currentHop?.fromDevId);

        const nowTime = `${(eventList.length * 0.05 + 0.02).toFixed(3)}s`;

        if (nextHopIndex >= pkt.hops.length) {
          // 4. عند نجاح الاتصال بالكامل
          const successEvent: SimulationEvent = {
            id: `ev-${Date.now()}`,
            timestamp: nowTime,
            lastDeviceName: fromDev?.name || '',
            atDeviceName: nextDev?.name || '',
            packetType: pkt.type,
            status: 'Successful',
            info: t.simMessages.completeInfo(pkt.type),
            details: {
              inLayers: ['Layer 1: Port Up', 'Layer 2: Frame verified', 'Layer 3: ICMP Reply received'],
              outLayers: ['Layer 7: Application verified', 'Status: Success']
            }
          };

          setEventList((el) => [successEvent, ...el]);
          showToast(t.simMessages.testSuccess(pkt.type));

          return { ...pkt, status: 'Successful', progress: 1 };
        } else {
          // تسجيل خطوة جديدة في قائمة الأحداث
          const stepEvent: SimulationEvent = {
            id: `ev-${Date.now()}`,
            timestamp: nowTime,
            lastDeviceName: fromDev?.name || '',
            atDeviceName: nextDev?.name || '',
            packetType: pkt.type,
            status: 'In Progress',
            info: currentHop.description,
            details: {
              inLayers: ['Layer 1: Port rx frame', 'Layer 2: Dest MAC match', 'Layer 3: Processing IP header'],
              outLayers: ['Layer 3: Forwarding decision made', 'Layer 2: Next-hop framing', 'Layer 1: Port tx frame']
            }
          };

          setEventList((el) => [stepEvent, ...el]);

          return {
            ...pkt,
            currentHopIndex: nextHopIndex,
            progress: 0
          };
        }
      })
    );
  };

  // مؤقت التشغيل التلقائي لمحرك المحاكاة
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (simPlaying && activePackets.length > 0 && activePackets[0].status === 'In Progress') {
      const stepDuration = 900 / simSpeed;
      interval = setInterval(() => {
        handleStepForward();
      }, stepDuration);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simPlaying, activePackets, simSpeed, eventList]);

  // 7. مسح جميع الحزم وإعادة بدء المحاكاة
  const handleResetSimulation = () => {
    setActivePackets([]);
    setSimPlaying(false);
    setEventList([]);
    showToast('تم مسح جميع الحزم وإعادة تهيئة المحاكاة.');
  };

  // وظائف التكبير والتصغير
  const handleZoomIn = () => {
    setViewport((prev) => ({ ...prev, zoom: Math.min(2.5, +(prev.zoom + 0.15).toFixed(2)) }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({ ...prev, zoom: Math.max(0.4, +(prev.zoom - 0.15).toFixed(2)) }));
  };

  const handleFitToScreen = () => {
    setViewport({ x: 0, y: 0, zoom: 1.0 });
    showToast('ملاءمة الشاشة 100%');
  };

  // تحويل إحداثيات الشاشة إلى إحداثيات الـ World
  const screenToWorld = (screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: screenX, y: screenY };
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = screenX - rect.left - viewport.x;
    const relativeY = screenY - rect.top - viewport.y;
    return {
      x: Math.round(relativeX / viewport.zoom),
      y: Math.round(relativeY / viewport.zoom)
    };
  };

  // إنشاء جهاز جديد عند نقطة معينة
  const createDeviceInstance = (model: DeviceModel, worldX: number, worldY: number) => {
    const defaultBase =
      model.category === 'routers'
        ? 'Router'
        : model.category === 'switches'
        ? 'Switch'
        : model.category === 'hubs'
        ? 'Hub'
        : model.category === 'servers'
        ? 'Server'
        : model.category === 'wireless'
        ? 'Wireless'
        : model.category === 'security'
        ? 'Firewall'
        : model.category === 'wan'
        ? 'WAN'
        : 'PC';

    const count = placedDevices.filter((d) => d.name.startsWith(defaultBase)).length;
    const newName = `${defaultBase}${count}`;

    const newDevice: PlacedDevice = {
      id: `dev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      modelId: model.id,
      name: newName,
      x: worldX,
      y: worldY,
      iconType: model.iconType,
      ports: model.defaultPorts.map((p) => ({ ...p })),
      config: createDefaultConfig(newName, model.category)
    };

    setPlacedDevices((prev) => [...prev, newDevice]);
    setSelectedDeviceId(newDevice.id);
    showToast(t.toastDeviceAdded(newDevice.name));
  };

  // معالجة النقر داخل مساحة العمل
  const handleCanvasInteraction = (clientX: number, clientY: number) => {
    if (pointerDownInfo.current.moved) return;

    const { x: worldX, y: worldY } = screenToWorld(clientX, clientY);

    if (activeTool === 'notes') {
      const noteText = prompt(t.enterNotePrompt, t.defaultNoteText);
      if (noteText && noteText.trim()) {
        setNotes((prev) => [
          ...prev,
          {
            id: `note-${Date.now()}`,
            x: worldX,
            y: worldY,
            text: noteText.trim()
          }
        ]);
        showToast(t.toastNoteAdded);
      }
      return;
    }

    if (activeStampModel) {
      createDeviceInstance(activeStampModel, worldX, worldY);
      return;
    }

    setSelectedDeviceId(null);
    setContextMenu(null);
    setSelectedConnection(null);
    setPortPickerState(null);
    if (connectingSource) {
      setConnectingSource(null);
      showToast(t.toastConnectionCanceled);
    }
  };

  // بدء سحب جهاز من الرف
  const handleStartDragFromShelf = (model: DeviceModel, clientX: number, clientY: number) => {
    setDragNewModel(model);
    setDragGhostPos({ x: clientX, y: clientY });
  };

  // النقر على جهاز في الرف لاختياره كختم
  const handleSelectStampModel = (model: DeviceModel) => {
    if (activeStampModel?.id === model.id) {
      setActiveStampModel(null);
    } else {
      setActiveStampModel(model);
      setActiveCableType(null);
      showToast(t.toastDeviceSelectedForCanvas(model.name));
    }
  };

  // معالجة بدء لمس / ضغط جهاز موجود على الـ Canvas
  const handleDevicePointerDown = (
    device: PlacedDevice,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    setContextMenu(null);

    // 1. أداة الحذف Delete Tool
    if (activeTool === 'delete') {
      setPlacedDevices((prev) => prev.filter((d) => d.id !== device.id));
      setConnections((prev) => prev.filter((c) => c.fromDeviceId !== device.id && c.toDeviceId !== device.id));
      showToast(t.toastDeviceDeleted(device.name));
      return;
    }

    // 2. أداة الفحص والتفتيش Inspect Tool
    if (activeTool === 'inspect') {
      setPropertiesDeviceId(device.id);
      return;
    }

    // 3. أداة التوصيل بالكابلات Connections Tool
    if (activeCableType) {
      if (!connectingSource) {
        setConnectingSource({ deviceId: device.id });
        showToast(t.toastConnectingStep1(device.name));
        return;
      } else if (connectingSource.deviceId !== device.id) {
        const srcDev = placedDevices.find((d) => d.id === connectingSource.deviceId);
        const dstDev = device;
        if (srcDev && dstDev) {
          const usedSrcPorts = new Set(
            connections
              .filter((c) => c.fromDeviceId === srcDev.id || c.toDeviceId === srcDev.id)
              .map((c) => (c.fromDeviceId === srcDev.id ? c.fromPortId : c.toPortId))
          );
          const usedDstPorts = new Set(
            connections
              .filter((c) => c.fromDeviceId === dstDev.id || c.toDeviceId === dstDev.id)
              .map((c) => (c.fromDeviceId === dstDev.id ? c.fromPortId : c.toPortId))
          );

          const availSrcPort = srcDev.ports.find((p) => !usedSrcPorts.has(p.id) && (p.type === 'Ethernet' || p.type === 'Fiber' || p.type === 'Serial')) || srcDev.ports[0];
          const availDstPort = dstDev.ports.find((p) => !usedDstPorts.has(p.id) && (p.type === 'Ethernet' || p.type === 'Fiber' || p.type === 'Serial')) || dstDev.ports[0];

          if (availSrcPort && availDstPort) {
            const newConn: PlacedConnection = {
              id: `conn-${Date.now()}`,
              cableType: activeCableType,
              fromDeviceId: srcDev.id,
              fromPortId: availSrcPort.id,
              toDeviceId: dstDev.id,
              toPortId: availDstPort.id
            };
            setConnections((prev) => [...prev, newConn]);
            showToast(t.toastConnectingSuccess(srcDev.name, availSrcPort.id, dstDev.name, availDstPort.id));
            setConnectingSource(null);
          }
        }
        return;
      }
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    pointerDownInfo.current = { x: clientX, y: clientY, time: Date.now(), moved: false };

    const { x: worldX, y: worldY } = screenToWorld(clientX, clientY);
    moveOffsetRef.current = {
      offsetX: worldX - device.x,
      offsetY: worldY - device.y
    };

    setMovingDeviceId(device.id);

    // النقر المزدوج لفتح نافذة الخصائص
    const now = Date.now();
    const lastTap = lastTapTimeRef.current[device.id] || 0;
    if (now - lastTap < 350) {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      setPropertiesDeviceId(device.id);
      return;
    }
    lastTapTimeRef.current[device.id] = now;

    // مؤقت الضغط المطول
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      if (!pointerDownInfo.current.moved) {
        setMovingDeviceId(null);
        setSelectedDeviceId(device.id);
        setContextMenu({
          device,
          x: Math.min(window.innerWidth - 180, Math.max(12, clientX - 80)),
          y: Math.min(window.innerHeight - 220, Math.max(60, clientY - 80))
        });
      }
    }, 550);
  };

  // معالجة بدء تحريك اللوحة (Pan / Touch Canvas)
  const handleCanvasPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      pinchStartDistanceRef.current = dist;
      pinchStartZoomRef.current = viewport.zoom;
      return;
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    pointerDownInfo.current = { x: clientX, y: clientY, time: Date.now(), moved: false };

    if (activeTool === 'pan' || ('button' in e && e.button === 1)) {
      setIsPanning(true);
      panStartRef.current = {
        x: clientX,
        y: clientY,
        viewX: viewport.x,
        viewY: viewport.y
      };
    }
  };

  // متابعة الأحداث الشاملة على مستوى Window
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length === 2 && pinchStartDistanceRef.current !== null) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDist = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const factor = currentDist / pinchStartDistanceRef.current;
        const newZoom = Math.max(0.4, Math.min(2.5, +(pinchStartZoomRef.current * factor).toFixed(2)));
        setViewport((prev) => ({ ...prev, zoom: newZoom }));
        return;
      }

      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const dx = Math.abs(clientX - pointerDownInfo.current.x);
      const dy = Math.abs(clientY - pointerDownInfo.current.y);
      if (dx > 4 || dy > 4) {
        pointerDownInfo.current.moved = true;
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }

      if (dragNewModel) {
        setDragGhostPos({ x: clientX, y: clientY });
      }

      if (movingDeviceId && pointerDownInfo.current.moved && canvasRef.current) {
        const { x: worldX, y: worldY } = screenToWorld(clientX, clientY);
        const targetX = worldX - moveOffsetRef.current.offsetX;
        const targetY = worldY - moveOffsetRef.current.offsetY;

        setPlacedDevices((prev) =>
          prev.map((dev) =>
            dev.id === movingDeviceId ? { ...dev, x: targetX, y: targetY } : dev
          )
        );
      }

      if (isPanning) {
        const deltaX = clientX - panStartRef.current.x;
        const deltaY = clientY - panStartRef.current.y;
        setViewport((prev) => ({
          ...prev,
          x: panStartRef.current.viewX + deltaX,
          y: panStartRef.current.viewY + deltaY
        }));
      }
    };

    const handleGlobalUp = (e: MouseEvent | TouchEvent) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      pinchStartDistanceRef.current = null;

      let clientX = 0;
      let clientY = 0;
      if ('changedTouches' in e && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (dragGhostPos) {
        clientX = dragGhostPos.x;
        clientY = dragGhostPos.y;
      }

      if (dragNewModel && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          const { x: worldX, y: worldY } = screenToWorld(clientX, clientY);
          createDeviceInstance(dragNewModel, worldX, worldY);
        }
        setDragNewModel(null);
        setDragGhostPos(null);
      }

      if (movingDeviceId) {
        if (!pointerDownInfo.current.moved) {
          setSelectedDeviceId(movingDeviceId);
        }
        setMovingDeviceId(null);
      }

      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('touchend', handleGlobalUp);
    window.addEventListener('touchcancel', handleGlobalUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
      window.removeEventListener('touchcancel', handleGlobalUp);
    };
  }, [dragNewModel, dragGhostPos, movingDeviceId, isPanning, viewport]);

  // رسم أيقونات Cisco الاحترافية بنمط SVG
  const renderCiscoIcon = (iconType: DeviceModel['iconType'], className = 'w-7 h-7') => {
    switch (iconType) {
      case 'router':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" fill="#005073" stroke="#00bceb" strokeWidth="2" />
            <path d="M12 20h16M20 12v16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 18l-2 2 2 2M26 18l2 2-2 2M18 14l2-2 2 2M18 26l2 2 2-2" stroke="#00bceb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'switch':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <rect x="5" y="10" width="30" height="20" rx="3" fill="#00405c" stroke="#00bceb" strokeWidth="2" />
            <path d="M10 16h16M14 13l-4 3 4 3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 24H14M26 21l4 3-4 3" stroke="#00bceb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'hub':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <rect x="6" y="12" width="28" height="16" rx="2" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <path d="M12 20h16M12 20l4-3M28 20l-4 3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'server':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <rect x="8" y="7" width="24" height="26" rx="2" fill="#1b2a4a" stroke="#38bdf8" strokeWidth="2" />
            <line x1="12" y1="13" x2="28" y2="13" stroke="#60a5fa" strokeWidth="2" />
            <line x1="12" y1="19" x2="28" y2="19" stroke="#60a5fa" strokeWidth="2" />
            <line x1="12" y1="25" x2="28" y2="25" stroke="#60a5fa" strokeWidth="2" />
            <circle cx="25" cy="13" r="1.5" fill="#22c55e" />
            <circle cx="25" cy="19" r="1.5" fill="#22c55e" />
            <circle cx="25" cy="25" r="1.5" fill="#38bdf8" />
          </svg>
        );
      case 'wireless':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <rect x="10" y="18" width="20" height="14" rx="2" fill="#0d274c" stroke="#00bceb" strokeWidth="2" />
            <line x1="15" y1="18" x2="12" y2="9" stroke="#00bceb" strokeWidth="2" strokeLinecap="round" />
            <line x1="25" y1="18" x2="28" y2="9" stroke="#00bceb" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 25h12" stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      case 'security':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <path d="M20 6L9 11v9c0 8 4.7 13.5 11 15 6.3-1.5 11-7 11-15v-9L20 6z" fill="#781d1d" stroke="#f87171" strokeWidth="2" />
            <path d="M15 20h10M17 16h6M18 24h4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'wan':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <path d="M12 28a7 7 0 01-1-13.9 9 9 0 0117.8-2A6.5 6.5 0 0132 28H12z" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="16" cy="21" r="1.5" fill="#ffffff" />
            <circle cx="24" cy="21" r="1.5" fill="#ffffff" />
          </svg>
        );
      case 'smart':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <rect x="12" y="6" width="16" height="28" rx="3" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
            <rect x="14" y="9" width="12" height="20" fill="#083344" />
            <circle cx="20" cy="31.5" r="1" fill="#22d3ee" />
          </svg>
        );
      case 'cable_auto':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
            <path d="M22 8L11 22h8l-2 10 11-14h-8l2-10z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        );
      case 'cable_copper':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <line x1="8" y1="32" x2="32" y2="8" stroke="#00bceb" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="10" cy="30" r="3.5" fill="#0284c7" />
            <circle cx="30" cy="10" r="3.5" fill="#0284c7" />
          </svg>
        );
      case 'cable_fiber':
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <line x1="8" y1="32" x2="32" y2="8" stroke="#ea580c" strokeWidth="3" strokeDasharray="3 3" />
            <circle cx="10" cy="30" r="3" fill="#ea580c" />
            <circle cx="30" cy="10" r="3" fill="#ea580c" />
          </svg>
        );
      case 'pc':
      default:
        return (
          <svg className={className} viewBox="0 0 40 40" fill="none">
            <rect x="7" y="8" width="26" height="18" rx="2" fill="#0f172a" stroke="#00bceb" strokeWidth="2" />
            <rect x="11" y="12" width="18" height="10" fill="#0284c7" opacity="0.3" />
            <path d="M16 26v5M24 26v5M12 31h16" stroke="#00bceb" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  const shelfDevices = activeCategory
    ? PACKET_TRACER_MODELS.filter((m) => m.category === activeCategory)
    : [];

  const getCategoryLabel = (id: CategoryId) => {
    switch (id) {
      case 'routers':
        return t.categories.routers;
      case 'switches':
        return t.categories.switches;
      case 'hubs':
        return t.categories.hubs;
      case 'wireless':
        return t.categories.wireless;
      case 'security':
        return t.categories.security;
      case 'wan':
        return t.categories.wan;
      case 'end_devices':
        return t.categories.endDevices;
      case 'smart_devices':
        return t.categories.smartDevices;
      case 'servers':
        return t.categories.servers;
      case 'connections':
        return t.categories.connections;
    }
  };

  const getCableName = (cableId: CableTypeId) => {
    switch (cableId) {
      case 'conn-auto':
        return t.connAuto;
      case 'conn-straight':
        return t.connStraight;
      case 'conn-crossover':
        return t.connCrossover;
      case 'conn-fiber':
        return t.connFiber;
      case 'conn-serial-dce':
        return t.connSerialDce;
      case 'conn-serial-dte':
        return t.connSerialDte;
      case 'conn-console':
        return t.connConsole;
      case 'conn-phone':
        return t.connPhone;
      case 'conn-coaxial':
        return t.connCoaxial;
      case 'conn-usb':
        return t.connUsb;
    }
  };

  return (
    <div
      dir={dir}
      key={lang}
      className="flex flex-col h-screen w-screen bg-[#070e1b] text-slate-100 font-sans select-none overflow-hidden touch-manipulation lang-switch-anim"
    >
      
      {/* 1. أعلى الشاشة: شريط الأدوات بالترتيب الدقيق المطلوب */}
      <header className="h-12 bg-[#0c1628] border-b border-[#1b2b48] px-2 flex items-center justify-between shrink-0 z-30 shadow-md overflow-x-auto gap-1">
        
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          
          {/* Select Tool */}
          <button
            type="button"
            onClick={() => {
              setActiveTool('select');
              setActiveStampModel(null);
              setActiveCableType(null);
            }}
            title={t.selectTool}
            className={`w-9 h-9 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
              activeTool === 'select' && !activeCableType
                ? 'bg-[#005073] text-[#00bceb] border border-[#00bceb]/80 shadow'
                : 'text-slate-300 hover:text-white hover:bg-[#162744]'
            }`}
          >
            <MousePointer className="w-4 h-4" />
          </button>

          {/* Move/Pan Tool */}
          <button
            type="button"
            onClick={() => {
              setActiveTool('pan');
              setActiveStampModel(null);
              setActiveCableType(null);
            }}
            title={t.panTool}
            className={`w-9 h-9 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
              activeTool === 'pan'
                ? 'bg-[#005073] text-[#00bceb] border border-[#00bceb]/80 shadow'
                : 'text-slate-300 hover:text-white hover:bg-[#162744]'
            }`}
          >
            <Hand className="w-4 h-4" />
          </button>

          {/* Delete Tool */}
          <button
            type="button"
            onClick={() => {
              setActiveTool('delete');
              setActiveStampModel(null);
              setActiveCableType(null);
              showToast(t.toastDeleteToolHint);
            }}
            title={t.deleteTool}
            className={`w-9 h-9 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
              activeTool === 'delete'
                ? 'bg-rose-900/60 text-rose-400 border border-rose-500 shadow'
                : 'text-slate-300 hover:text-rose-400 hover:bg-[#162744]'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Inspect Tool */}
          <button
            type="button"
            onClick={() => {
              setActiveTool('inspect');
              setActiveStampModel(null);
              setActiveCableType(null);
              showToast(t.toastInspectToolHint);
            }}
            title={t.inspectTool}
            className={`w-9 h-9 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
              activeTool === 'inspect'
                ? 'bg-[#005073] text-[#00bceb] border border-[#00bceb]/80 shadow'
                : 'text-slate-300 hover:text-white hover:bg-[#162744]'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notes Tool */}
          <button
            type="button"
            onClick={() => {
              setActiveTool('notes');
              setActiveStampModel(null);
              setActiveCableType(null);
              showToast(t.toastNotesToolHint);
            }}
            title={t.notesTool}
            className={`w-9 h-9 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
              activeTool === 'notes'
                ? 'bg-amber-950/60 text-amber-400 border border-amber-500 shadow'
                : 'text-slate-300 hover:text-amber-400 hover:bg-[#162744]'
            }`}
          >
            <StickyNote className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-[#1e3458] mx-0.5" />

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            title={t.zoomIn}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            title={t.zoomOut}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Fit to Screen */}
          <button
            type="button"
            onClick={handleFitToScreen}
            title={t.fitToScreen}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all font-mono text-[11px]"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-[#1e3458] mx-0.5" />

          {/* Undo */}
          <button
            type="button"
            onClick={() => showToast(t.undo)}
            title={t.undo}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={() => showToast(t.redo)}
            title={t.redo}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-[#1e3458] mx-0.5" />

          {/* New */}
          <button
            type="button"
            onClick={() => {
              setPlacedDevices([]);
              setConnections([]);
              setNotes([]);
              handleResetSimulation();
              showToast(t.toastNewWorkspace);
            }}
            title={t.newProject}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all"
          >
            <FilePlus className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Open */}
          <button
            type="button"
            onClick={() => showToast(t.toastProjectOpened)}
            title={t.openProject}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={() => showToast(t.toastProjectSaved)}
            title={t.saveProject}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#162744] active:scale-95 transition-all"
          >
            <Save className="w-4 h-4 text-blue-400" />
          </button>
        </div>

        {/* 1. التبديل بين وضع Realtime و وضع Simulation + زر Settings + زر تبديل اللغة */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              const next = mode === 'realtime' ? 'simulation' : 'realtime';
              setMode(next);
              showToast(next === 'realtime' ? `${t.realtime} Mode` : `${t.simulation} Mode`);
            }}
            title="Realtime / Simulation"
            className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold active:scale-95 transition-all shadow-md ${
              mode === 'simulation'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-500/25 ring-1 ring-amber-300'
                : 'bg-[#005073] text-[#00bceb] border border-[#00bceb]/60'
            }`}
          >
            {mode === 'simulation' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Zap className="w-3.5 h-3.5" />}
            <span>{mode === 'simulation' ? t.simulation : t.realtime}</span>
          </button>

          {/* زر التبديل السريع للغة (Quick Language Toggle) */}
          <button
            type="button"
            onClick={() => handleLanguageChange(lang === 'en' ? 'ar' : 'en')}
            title={lang === 'en' ? 'Switch to العربية' : 'Switch to English'}
            className="h-8 px-2 rounded-lg flex items-center gap-1 text-xs font-bold bg-[#0c1a30] hover:bg-[#142848] text-cyan-300 border border-[#00bceb]/40 active:scale-95 transition-all shadow"
          >
            <span>{lang === 'en' ? '🇺🇸 EN' : '🇸🇦 AR'}</span>
          </button>

          {/* 2. زر Settings لفتح نافذة الإعدادات */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            title={t.settings}
            className="h-8 px-2 sm:px-2.5 rounded-lg flex items-center gap-1 text-xs font-semibold bg-[#162744] hover:bg-[#203a66] text-slate-300 hover:text-white border border-[#1b2b48] active:scale-95 transition-all shadow"
          >
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.settings}</span>
          </button>
        </div>
      </header>

      {/* 2. وسط الشاشة: مساحة Canvas كبيرة */}
      <main
        ref={canvasRef}
        onClick={(e) => handleCanvasInteraction(e.clientX, e.clientY)}
        onMouseDown={handleCanvasPointerDown}
        onTouchStart={handleCanvasPointerDown}
        className={`flex-1 relative overflow-hidden bg-[#0a1220] select-none ${
          activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        style={{
          touchAction: 'none',
          backgroundImage: showGrid ? `
            radial-gradient(circle, rgba(0, 188, 235, 0.15) 1.2px, transparent 1.2px),
            linear-gradient(to right, rgba(27, 43, 72, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(27, 43, 72, 0.3) 1px, transparent 1px)
          ` : 'none',
          backgroundSize: `${24 * viewport.zoom}px ${24 * viewport.zoom}px, ${120 * viewport.zoom}px ${120 * viewport.zoom}px, ${120 * viewport.zoom}px ${120 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`
        }}
      >
        
        {/* إشعار عائم Toast */}
        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-[#0c1a32]/95 border border-[#00bceb]/60 px-4 py-1.5 rounded-full text-xs text-white shadow-xl flex items-center gap-2 backdrop-blur animate-in fade-in pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#00bceb] animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* حاوية العناصر داخل العالم المترجم بالإحداثيات والزووم */}
        <div
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          }}
        >
          {/* رسم خطوط التوصيلات */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {connections.map((conn) => {
              const fromDev = placedDevices.find((d) => d.id === conn.fromDeviceId);
              const toDev = placedDevices.find((d) => d.id === conn.toDeviceId);
              if (!fromDev || !toDev) return null;

              const cableDef = CABLE_DEFINITIONS.find((c) => c.id === conn.cableType) || CABLE_DEFINITIONS[1];

              // 4. تتحول الوصلة إلى اللون الأخضر الزاهي عند نجاح الاتصال
              const isLinkSuccess = activePackets.some((p) => p.status === 'Successful');

              const fromPortObj = fromDev.ports.find((p) => p.id === conn.fromPortId);
              const toPortObj = toDev.ports.find((p) => p.id === conn.toPortId);

              const fromPower = fromDev.config.powerOn;
              const toPower = toDev.config.powerOn;

              // 5. ألوان مؤشرات LED: أخضر = Up، أحمر = Down، رمادي = مطفأ الطاقة
              const led1Color = !fromPower ? '#64748b' : (!fromPortObj?.isUp ? '#ef4444' : '#22c55e');
              const led2Color = !toPower ? '#64748b' : (!toPortObj?.isUp ? '#ef4444' : '#22c55e');
              const strokeColor = (!fromPower || !toPower) ? '#475569' : (isLinkSuccess ? '#22c55e' : cableDef.color);

              const angle = Math.atan2(toDev.y - fromDev.y, toDev.x - fromDev.x);
              const offset = 26;
              const led1X = fromDev.x + Math.cos(angle) * offset;
              const led1Y = fromDev.y + Math.sin(angle) * offset;
              const led2X = toDev.x - Math.cos(angle) * offset;
              const led2Y = toDev.y - Math.sin(angle) * offset;

              return (
                <g
                  key={conn.id}
                  onClick={(e) => {
                    if (activeTool === 'delete') {
                      e.stopPropagation();
                      setConnections((prev) => prev.filter((c) => c.id !== conn.id));
                      showToast(t.toastCableDeleted);
                    }
                  }}
                  className="cursor-pointer pointer-events-auto"
                >
                  <line
                    x1={fromDev.x}
                    y1={fromDev.y}
                    x2={toDev.x}
                    y2={toDev.y}
                    stroke={strokeColor}
                    strokeWidth={isLinkSuccess ? '3.5' : '2.5'}
                    strokeDasharray={
                      cableDef.lineStyle === 'dashed' ? '6 4' : cableDef.lineStyle === 'dotted' ? '2 3' : undefined
                    }
                    className="transition-colors duration-300"
                  />

                  {/* مصابيح الاتصال الديناميكية */}
                  <circle cx={led1X} cy={led1Y} r="4" fill={led1Color} stroke="#052e16" strokeWidth="1" />
                  <circle cx={led2X} cy={led2Y} r="4" fill={led2Color} stroke="#052e16" strokeWidth="1" />

                  {showLinkLabels && (
                    <>
                      <text
                        x={led1X + Math.sin(angle) * 10}
                        y={led1Y - Math.cos(angle) * 10}
                        fill="#38bdf8"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        className="select-none font-mono"
                      >
                        {conn.fromPortId}
                      </text>
                      <text
                        x={led2X + Math.sin(angle) * 10}
                        y={led2Y - Math.cos(angle) * 10}
                        fill="#38bdf8"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        className="select-none font-mono"
                      >
                        {conn.toPortId}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 2. إظهار الحزمة تتحرك بين الأجهزة (Animated Simulation Packet Envelopes) */}
          {activePackets.map((pkt) => {
            const currentHop = pkt.hops[pkt.currentHopIndex];
            if (!currentHop) return null;

            const fromDev = placedDevices.find((d) => d.id === currentHop.fromDevId);
            const toDev = placedDevices.find((d) => d.id === currentHop.toDevId);
            if (!fromDev || !toDev) return null;

            // حساب موضع الحزمة أثناء الحركة
            const currentX = fromDev.x + (toDev.x - fromDev.x) * (pkt.progress || 0.5);
            const currentY = fromDev.y + (toDev.y - fromDev.y) * (pkt.progress || 0.5);

            return (
              <div
                key={pkt.id}
                style={{
                  left: `${currentX}px`,
                  top: `${currentY}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none'
                }}
                className="absolute z-30 flex flex-col items-center gap-0.5 animate-bounce"
              >
                <div
                  className={`w-7 h-7 rounded-lg border-2 shadow-2xl flex items-center justify-center transition-all ${
                    pkt.status === 'Failed'
                      ? 'bg-rose-950 border-rose-500 text-rose-400 shadow-rose-900/80 scale-125'
                      : pkt.status === 'Successful'
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-emerald-900/80'
                      : 'bg-amber-950 border-amber-400 text-amber-300 shadow-amber-900/80'
                  }`}
                >
                  {pkt.status === 'Failed' ? (
                    <X className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-black/90 border border-slate-700 text-cyan-300 shadow">
                  {pkt.type}
                </span>
              </div>
            );
          })}

          {/* الملاحظات النصية */}
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto'
              }}
              className="absolute z-10 bg-amber-200 text-slate-900 px-3 py-1.5 rounded-md shadow-md text-xs font-mono border border-amber-400 max-w-xs"
            >
              {note.text}
            </div>
          ))}

          {/* الأجهزة الموضوعة في مساحة العمل */}
          {placedDevices.map((device) => {
            const isSelected = selectedDeviceId === device.id;

            return (
              <div
                key={device.id}
                style={{
                  left: `${device.x}px`,
                  top: `${device.y}px`,
                  transform: 'translate(-50%, -50%)',
                  touchAction: 'none',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => handleDevicePointerDown(device, e)}
                onTouchStart={(e) => handleDevicePointerDown(device, e)}
                className="absolute z-20 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="relative flex flex-col items-center">
                  
                  {/* إطار التحديد الأزرق */}
                  <div
                    className={`p-2 rounded-xl transition-all relative ${
                      !device.config.powerOn ? 'opacity-70 grayscale-[25%]' : ''
                    } ${
                      isSelected
                        ? 'bg-[#00bceb]/10 border-2 border-[#00bceb] shadow-[0_0_15px_rgba(0,188,235,0.5)]'
                        : 'hover:bg-[#162744]/40 border border-transparent'
                    }`}
                  >
                    {/* مؤشر تشغيل الطاقة */}
                    <div
                      className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-black/40 ${
                        device.config.powerOn ? 'bg-emerald-400 shadow-[0_0_6px_#22c55e]' : 'bg-slate-600'
                      }`}
                      title={device.config.powerOn ? 'Power: ON' : 'Power: OFF'}
                    />

                    {/* نقاط التحكم المربعة عند الزوايا */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#00bceb] border border-white rounded-sm shadow-sm" />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00bceb] border border-white rounded-sm shadow-sm" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#00bceb] border border-white rounded-sm shadow-sm" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#00bceb] border border-white rounded-sm shadow-sm" />
                      </>
                    )}

                    <div className="w-12 h-12 flex items-center justify-center pointer-events-none">
                      {renderCiscoIcon(device.iconType, 'w-11 h-11')}
                    </div>
                  </div>

                  {/* الاسم أسفل الجهاز */}
                  <div className="mt-1 flex flex-col items-center pointer-events-none">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#005073] text-white border border-[#00bceb]/80 shadow'
                          : 'bg-[#081220]/90 text-slate-200 border border-[#1b2b48]'
                      }`}
                    >
                      {device.name}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 🌟 لوحة المحاكاة وقائمة الأحداث (Simulation Panel & Event List) 🌟 */}
      {/* ========================================================================= */}
      {mode === 'simulation' && (
        <div className="h-56 bg-[#08111e] border-t-2 border-[#00bceb]/60 flex flex-col shrink-0 z-30 shadow-2xl">
          
          {/* شريط تحكم المحاكاة (Simulation Controls: Play/Pause, Step, Speed, Clear, New Packet) */}
          <div className="h-10 bg-[#0c1628] border-b border-[#1b2b48] px-3 flex items-center justify-between shrink-0">
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* زر التشغيل والإيقاف المؤقت */}
              <button
                type="button"
                onClick={() => setSimPlaying(!simPlaying)}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow ${
                  simPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {simPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{simPlaying ? t.simPause : t.simPlay}</span>
              </button>

              {/* خطوة للأمام (Step Forward) */}
              <button
                type="button"
                onClick={handleStepForward}
                disabled={activePackets.length === 0}
                className="px-2.5 py-1 rounded-lg bg-[#162744] hover:bg-[#203a66] disabled:opacity-50 text-cyan-300 text-xs font-semibold flex items-center gap-1"
                title={t.simStepForward}
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>{t.simStepForward}</span>
              </button>

              {/* زر التسريع (Speed Slider/Toggle) */}
              <div className="flex items-center gap-1 bg-[#060c18] border border-[#1c3358] px-2 py-0.5 rounded-lg text-xs">
                <FastForward className="w-3 h-3 text-cyan-400" />
                <button
                  type="button"
                  onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
                  className="font-mono text-cyan-300 hover:text-white font-bold"
                >
                  {simSpeed}x {t.simSpeedToggle}
                </button>
              </div>

              {/* 7. مسح جميع الحزم وإعادة البدء */}
              <button
                type="button"
                onClick={handleResetSimulation}
                className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1"
                title={t.simResetPackets}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.simResetPackets}</span>
              </button>
            </div>

            {/* زر إطلاق اختبار حزمة جديد (Add New Packet Test) */}
            <button
              type="button"
              onClick={() => setTestLauncherOpen(true)}
              className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.simSendNewPacket}</span>
            </button>
          </div>

          {/* 5. جدول قائمة الأحداث بالترتيب الزمني (Event List) */}
          <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px]">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-[#1b2b48] pb-1">
                  <th className="py-1 px-2 font-semibold">{t.eventListTime}</th>
                  <th className="py-1 px-2 font-semibold">{t.eventListLastDev}</th>
                  <th className="py-1 px-2 font-semibold">{t.eventListAtDev}</th>
                  <th className="py-1 px-2 font-semibold">{t.eventListType}</th>
                  <th className="py-1 px-2 font-semibold">{t.eventListStatus}</th>
                  <th className="py-1 px-2 font-semibold">{t.eventListInfo}</th>
                  <th className="py-1 px-2 font-semibold">{t.eventListPdu}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162744]">
                {eventList.map((ev) => (
                  <tr
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="hover:bg-[#0e1d33] cursor-pointer transition-colors"
                  >
                    <td className="py-1 px-2 text-cyan-400">{ev.timestamp}</td>
                    <td className="py-1 px-2 text-slate-200">{ev.lastDeviceName}</td>
                    <td className="py-1 px-2 text-white font-bold">{ev.atDeviceName}</td>
                    <td className="py-1 px-2">
                      <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                        {ev.packetType}
                      </span>
                    </td>
                    <td className="py-1 px-2">
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold ${
                          ev.status === 'Successful'
                            ? 'text-emerald-400'
                            : ev.status === 'Failed'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {ev.status === 'Successful' ? '● Success' : ev.status === 'Failed' ? '✕ Failed' : '◌ Progress'}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-slate-300 font-sans truncate max-w-xs">{ev.info}</td>
                    <td className="py-1 px-2 text-cyan-400 hover:underline">{t.viewPduBtn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 6. نافذة إطلاق الاختبارات الخمسة (Ping, ARP, DHCP, DNS, HTTP) */}
      {testLauncherOpen && (
        <div
          dir={dir}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-[#0c1628] border-2 border-[#00bceb]/70 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="h-12 bg-[#003852] px-4 flex items-center justify-between border-b border-[#00bceb]/40">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#00bceb]" />
                <h3 className="font-bold text-sm text-white">{t.testLauncherTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setTestLauncherOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs text-slate-300">
              
              {/* اختيار نوع الاختبار (6. Ping, ARP, DHCP, DNS, HTTP) */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{t.packetTestType}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Ping', 'ARP', 'DHCP', 'DNS', 'HTTP'] as SimulationTestType[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTestType(st)}
                      className={`py-1.5 px-2 rounded-lg font-bold transition-all ${
                        testType === st
                          ? 'bg-[#005073] text-white border border-[#00bceb] shadow'
                          : 'bg-[#081220] border border-[#1b2b48] text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* الجهاز المصدر (Source Device) */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{t.sourceDevice}</label>
                <select
                  value={testSourceId}
                  onChange={(e) => setTestSourceId(e.target.value)}
                  className="w-full bg-[#081220] border border-[#1c3358] p-2 rounded-lg text-white font-mono outline-none"
                >
                  {placedDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.ports[0]?.ipAddress || 'No IP'})
                    </option>
                  ))}
                </select>
              </div>

              {/* الجهاز الهدف (Target Device) */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{t.destDevice}</label>
                <select
                  value={testTargetId}
                  onChange={(e) => setTestTargetId(e.target.value)}
                  className="w-full bg-[#081220] border border-[#1c3358] p-2 rounded-lg text-white font-mono outline-none"
                >
                  {placedDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.ports[0]?.ipAddress || 'No IP'})
                    </option>
                  ))}
                </select>
              </div>

              {/* شرح موجز للاختبار */}
              <div className="p-2.5 rounded-xl bg-[#050b14] border border-[#1c3358] text-[11px] text-slate-400">
                {testType === 'Ping' && t.pingDesc}
                {testType === 'ARP' && t.arpDesc}
                {testType === 'DHCP' && t.dhcpDesc}
                {testType === 'DNS' && t.dnsDesc}
                {testType === 'HTTP' && t.httpDesc}
              </div>

              <button
                type="button"
                onClick={() => handleLaunchTest(testType, testSourceId, testTargetId)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60"
              >
                {t.launchTestBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* تفاصيل الـ PDU لحدث معين */}
      {selectedEvent && (
        <div
          dir={dir}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-[#0c1628] border-2 border-[#00bceb]/70 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="h-12 bg-[#003852] px-4 flex items-center justify-between border-b border-[#00bceb]/40">
              <h3 className="font-bold text-sm text-white">{t.pduModalTitle}</h3>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-[#060c18] border border-[#1c3358] space-y-1">
                <div>Type: <strong className="text-cyan-400">{selectedEvent.packetType}</strong></div>
                <div>Device: <strong className="text-white">{selectedEvent.atDeviceName}</strong></div>
                <div>Status: <strong className={selectedEvent.status === 'Successful' ? 'text-emerald-400' : 'text-rose-400'}>{selectedEvent.status}</strong></div>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">{t.inLayers}</span>
                <div className="p-2 rounded-lg bg-[#050b14] border border-[#1c3358] font-mono space-y-1">
                  {selectedEvent.details?.inLayers?.map((l, i) => (
                    <div key={i} className="text-emerald-400">{l}</div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">{t.outLayers}</span>
                <div className="p-2 rounded-lg bg-[#050b14] border border-[#1c3358] font-mono space-y-1">
                  {selectedEvent.details?.outLayers?.map((l, i) => (
                    <div key={i} className="text-cyan-400">{l}</div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="w-full py-2 rounded-xl bg-[#005073] hover:bg-[#00bceb] text-white font-bold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة خصائص الأجهزة الكاملة (Device Properties Modal - Physical, Config, CLI, Desktop, Services) */}
      {currentInspectDevice && (
        <DevicePropertiesModal
          device={currentInspectDevice}
          allDevices={placedDevices}
          connections={connections}
          lang={lang}
          onClose={() => setPropertiesDeviceId(null)}
          onUpdateDevice={(updatedDevice) => {
            setPlacedDevices((prev) =>
              prev.map((d) => (d.id === updatedDevice.id ? updatedDevice : d))
            );
          }}
          onRemoveConnectionByPort={(deviceId, portId) => {
            setConnections((prev) =>
              prev.filter(
                (c) =>
                  !(
                    (c.fromDeviceId === deviceId && c.fromPortId === portId) ||
                    (c.toDeviceId === deviceId && c.toPortId === portId)
                  )
              )
            );
          }}
          showToast={showToast}
        />
      )}

      {/* قائمة الضغط المطول السريعة على الأجهزة (Context Menu) */}
      {contextMenu && (
        <div
          dir={dir}
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          className="fixed z-50 bg-[#0c1628] border border-[#00bceb]/80 rounded-xl shadow-2xl p-1.5 min-w-[170px] text-xs font-semibold space-y-0.5 animate-in fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] font-mono text-cyan-400 border-b border-[#1b2b48] mb-1 flex items-center justify-between">
            <span>{contextMenu.device.name}</span>
            <span className={contextMenu.device.config.powerOn ? 'text-emerald-400' : 'text-rose-400'}>
              {contextMenu.device.config.powerOn ? t.online : t.offline}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const newName = prompt(t.enterNewName, contextMenu.device.name);
              if (newName && newName.trim()) {
                setPlacedDevices((prev) =>
                  prev.map((d) =>
                    d.id === contextMenu.device.id
                      ? { ...d, name: newName.trim(), config: { ...d.config, hostname: newName.trim() } }
                      : d
                  )
                );
                showToast(t.toastDeviceRenamed);
              }
              setContextMenu(null);
            }}
            className="w-full text-start rtl:text-right ltr:text-left px-2.5 py-1.5 rounded-lg hover:bg-[#162744] text-slate-200 hover:text-white flex items-center gap-2"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.renameDevice}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const srcDev = contextMenu.device;
              const newDev: PlacedDevice = {
                ...srcDev,
                id: `dev-${Date.now()}`,
                name: `${srcDev.name}_copy`,
                x: srcDev.x + 40,
                y: srcDev.y + 40,
                config: {
                  ...srcDev.config,
                  hostname: `${srcDev.config.hostname}_copy`
                }
              };
              setPlacedDevices((prev) => [...prev, newDev]);
              showToast(t.toastDeviceDuplicated);
              setContextMenu(null);
            }}
            className="w-full text-start rtl:text-right ltr:text-left px-2.5 py-1.5 rounded-lg hover:bg-[#162744] text-slate-200 hover:text-white flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.duplicateDevice}</span>
          </button>

          {/* تبديل حالة الطاقة السريع من القائمة */}
          <button
            type="button"
            onClick={() => {
              const nextPower = !contextMenu.device.config.powerOn;
              setPlacedDevices((prev) =>
                prev.map((d) =>
                  d.id === contextMenu.device.id
                    ? {
                        ...d,
                        ports: d.ports.map((p) => ({ ...p, isUp: nextPower })),
                        config: { ...d.config, powerOn: nextPower }
                      }
                    : d
                )
              );
              showToast(nextPower ? t.toastPowerOn(contextMenu.device.name) : t.toastPowerOff(contextMenu.device.name));
              setContextMenu(null);
            }}
            className="w-full text-start rtl:text-right ltr:text-left px-2.5 py-1.5 rounded-lg hover:bg-[#162744] text-slate-200 hover:text-white flex items-center gap-2"
          >
            <Power className={`w-3.5 h-3.5 ${contextMenu.device.config.powerOn ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span>{contextMenu.device.config.powerOn ? t.powerOffDevice : t.powerOnDevice}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPropertiesDeviceId(contextMenu.device.id);
              setContextMenu(null);
            }}
            className="w-full text-start rtl:text-right ltr:text-left px-2.5 py-1.5 rounded-lg hover:bg-[#162744] text-cyan-300 hover:text-cyan-200 flex items-center gap-2 font-bold"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.deviceProperties}</span>
          </button>

          <div className="border-t border-[#1b2b48] my-1" />

          <button
            type="button"
            onClick={() => {
              const devId = contextMenu.device.id;
              const devName = contextMenu.device.name;
              setPlacedDevices((prev) => prev.filter((d) => d.id !== devId));
              setConnections((prev) => prev.filter((c) => c.fromDeviceId !== devId && c.toDeviceId !== devId));
              showToast(t.toastDeviceDeleted(devName));
              setContextMenu(null);
            }}
            className="w-full text-start rtl:text-right ltr:text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950 text-rose-400 hover:text-rose-300 flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.deleteDevice}</span>
          </button>
        </div>
      )}

      {/* نافذة الإعدادات وقسم اللغة المطلوب (Settings Modal & Language Section) */}
      {settingsOpen && (
        <SettingsModal
          currentLang={lang}
          onLanguageChange={handleLanguageChange}
          showGrid={showGrid}
          onToggleGrid={setShowGrid}
          showLinkLabels={showLinkLabels}
          onToggleLinkLabels={setShowLinkLabels}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* 2 & 4. الصف الثاني المدمج للأجهزة */}
      {mode === 'realtime' && activeCategory && (
        <div className="h-16 bg-[#091322] border-t border-[#1b2b48] px-3 flex items-center gap-2.5 overflow-x-auto shrink-0 z-30 shadow-inner">
          <div className="text-[10px] font-mono text-[#00bceb] whitespace-nowrap pl-1">
            {activeCategory === 'connections' ? `${t.cablesTitle}:` : `${getCategoryLabel(activeCategory)}:`}
          </div>

          {activeCategory === 'connections'
            ? CABLE_DEFINITIONS.map((cable) => (
                <button
                  key={cable.id}
                  type="button"
                  onClick={() => {
                    setActiveCableType(cable.id);
                    showToast(t.toastCableToolHint(getCableName(cable.id)));
                  }}
                  className={`flex-shrink-0 h-13 px-2.5 py-1 rounded-xl flex items-center gap-2 border transition-all active:scale-95 ${
                    activeCableType === cable.id
                      ? 'bg-[#005073] border-[#00bceb] shadow-md shadow-cyan-900/50'
                      : 'bg-[#0c1628] border-[#1b2b48] hover:border-[#00bceb]/60'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center pointer-events-none">
                    {renderCiscoIcon(cable.iconType, 'w-7 h-7')}
                  </div>
                  <div className="flex flex-col text-left rtl:text-right pointer-events-none">
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                      {getCableName(cable.id)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">
                      {cable.supportedPortType === 'all' ? 'Auto Select' : cable.supportedPortType}
                    </span>
                  </div>
                </button>
              ))
            : shelfDevices.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleSelectStampModel(model)}
                  onMouseDown={(e) => handleStartDragFromShelf(model, e.clientX, e.clientY)}
                  onTouchStart={(e) => {
                    if (e.touches.length > 0) {
                      handleStartDragFromShelf(model, e.touches[0].clientX, e.touches[0].clientY);
                    }
                  }}
                  className={`flex-shrink-0 h-13 px-2.5 py-1 rounded-xl flex items-center gap-2 cursor-pointer border transition-all active:scale-95 ${
                    activeStampModel?.id === model.id
                      ? 'bg-[#005073] border-[#00bceb] shadow-md shadow-cyan-900/50'
                      : 'bg-[#0c1628] border-[#1b2b48] hover:border-[#00bceb]/60'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center pointer-events-none">
                    {renderCiscoIcon(model.iconType, 'w-7 h-7')}
                  </div>
                  <div className="flex flex-col pointer-events-none text-left rtl:text-right">
                    <span className="text-xs font-bold text-white truncate max-w-[80px]">
                      {model.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono truncate max-w-[80px]">
                      {model.portsSummary.split(',')[0]}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* 3. أسفل الشاشة: شريط فئات الأجهزة في الوضع الحقيقي */}
      {mode === 'realtime' && (
        <footer className="h-16 bg-[#0a1220] border-t border-[#1b2b48] px-2 flex items-center gap-1 overflow-x-auto shrink-0 z-30 shadow-2xl">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveStampModel(null);
                }}
                className={`flex-shrink-0 min-w-[70px] sm:min-w-[76px] h-13 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all ${
                  isActive
                    ? 'bg-[#005073] text-white border border-[#00bceb] shadow-md shadow-cyan-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-[#162744]/60'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
                  {renderCiscoIcon(cat.iconType, 'w-5 h-5')}
                </div>
                <span className="text-[9px] font-bold tracking-tight whitespace-nowrap">
                  {getCategoryLabel(cat.id)}
                </span>
              </button>
            );
          })}
        </footer>
      )}

    </div>
  );
}
