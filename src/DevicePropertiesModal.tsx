import React, { useState, useEffect } from 'react';
import {
  X,
  Power,
  RotateCcw,
  RefreshCw,
  Cpu,
  Layers,
  Terminal as TerminalIcon,
  Monitor,
  Server as ServerIcon,
  Globe,
  FileText,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wifi,
  Settings,
  Plus,
  Trash2,
  HardDrive,
  Info,
  Check,
  AlertTriangle
} from 'lucide-react';
import {
  PlacedDevice,
  PlacedConnection,
  DevicePort,
  AvailableModule,
  DeviceModel,
  DeviceConfiguration,
  ROUTER_MODULES,
  PACKET_TRACER_MODELS,
  createDefaultConfig
} from './App';
import { LanguageCode, getTranslations, getLanguageDir } from './i18n';

export type PropertyTab = 'physical' | 'config' | 'cli' | 'desktop' | 'services';

export type PortLEDState = 'green' | 'amber' | 'red' | 'gray';

interface DevicePropertiesModalProps {
  device: PlacedDevice;
  allDevices: PlacedDevice[];
  connections: PlacedConnection[];
  lang?: LanguageCode;
  onClose: () => void;
  onUpdateDevice: (updatedDevice: PlacedDevice) => void;
  onRemoveConnectionByPort?: (deviceId: string, portId: string) => void;
  showToast: (msg: string) => void;
}

// Additional modules for switches, PCs, and servers
export const SWITCH_MODULES: AvailableModule[] = [
  {
    id: 'GLC-LH-SMD-SW',
    name: 'GLC-LH-SMD (SFP)',
    description: '1000BASE-LX SFP transceiver module for optical fiber switch interlinks.',
    addedPorts: [{ id: 'Fiber0/3', name: 'GigabitEthernet0/3 (SFP)', type: 'Fiber' }]
  }
];

export const PC_MODULES: AvailableModule[] = [
  {
    id: 'PT-HOST-NM-1CE',
    name: 'PT-HOST-NM-1CE',
    description: 'FastEthernet RJ-45 copper network adapter card for PC/Laptop.',
    addedPorts: [{ id: 'Fa1', name: 'FastEthernet1', type: 'Ethernet' }]
  },
  {
    id: 'PT-HOST-NM-1W',
    name: 'PT-HOST-NM-1W (Wireless)',
    description: 'Wireless 2.4GHz 802.11b/g/n Wi-Fi card with omnidirectional antenna.',
    addedPorts: [{ id: 'Wireless0', name: 'Wireless0 (802.11)', type: 'Ethernet' }]
  },
  {
    id: 'PT-HOST-NM-1CFE',
    name: 'PT-HOST-NM-1CFE (Fiber)',
    description: 'FastEthernet optical fiber network adapter card for direct optical links.',
    addedPorts: [{ id: 'Fiber0', name: 'FiberFastEthernet0', type: 'Fiber' }]
  }
];

export const SERVER_MODULES: AvailableModule[] = [
  {
    id: 'PT-SRV-NM-1FGE',
    name: 'PT-SRV-NM-1FGE (Gigabit Fiber)',
    description: 'High-density Gigabit optical fiber network interface module for servers.',
    addedPorts: [{ id: 'Fiber1', name: 'FiberGigabit1', type: 'Fiber' }]
  },
  {
    id: 'PT-SRV-NM-1CGE',
    name: 'PT-SRV-NM-1CGE (Gigabit Copper)',
    description: 'Additional Gigabit copper RJ-45 1000BASE-T interface for servers.',
    addedPorts: [{ id: 'Gig1', name: 'GigabitEthernet1', type: 'Ethernet' }]
  }
];

export function DevicePropertiesModal({
  device,
  allDevices,
  connections,
  lang = 'en',
  onClose,
  onUpdateDevice,
  onRemoveConnectionByPort,
  showToast
}: DevicePropertiesModalProps) {
  const t = getTranslations(lang);
  const dir = getLanguageDir(lang);

  // Match model info
  const modelInfo = PACKET_TRACER_MODELS.find((m) => m.id === device.modelId) || {
    name: device.name,
    category: 'end_devices',
    portsSummary: 'Standard ports',
    description: 'Standard Cisco Device',
    supportedModules: []
  };

  // Tabs based on device type
  const availableTabs: { id: PropertyTab; label: string; icon: React.ReactNode }[] = [
    { id: 'physical', label: t.physicalTab, icon: <Layers className="w-4 h-4" /> },
    { id: 'config', label: t.configTab, icon: <Settings className="w-4 h-4" /> }
  ];

  const isCiscoCLI =
    device.iconType === 'router' ||
    device.iconType === 'switch' ||
    device.iconType === 'security';

  if (isCiscoCLI) {
    availableTabs.push({ id: 'cli', label: t.cliTab, icon: <TerminalIcon className="w-4 h-4" /> });
  }

  const isDesktopCapable =
    device.iconType === 'pc' ||
    device.iconType === 'smart' ||
    modelInfo.category === 'end_devices';

  if (isDesktopCapable && device.iconType !== 'server') {
    availableTabs.push({ id: 'desktop', label: t.desktopTab, icon: <Monitor className="w-4 h-4" /> });
  }

  if (device.iconType === 'server') {
    availableTabs.push({ id: 'services', label: t.servicesTab, icon: <ServerIcon className="w-4 h-4" /> });
  }

  const [activeTab, setActiveTab] = useState<PropertyTab>('physical');
  const [selectedPortId, setSelectedPortId] = useState<string>(device.ports[0]?.id || '');
  const [cliInput, setCliInput] = useState<string>('');
  const [isRebooting, setIsRebooting] = useState<boolean>(false);
  const [rebootStep, setRebootStep] = useState<number>(0);
  const [powerWarningOpen, setPowerWarningOpen] = useState<boolean>(false);
  const [confirmFactoryResetOpen, setConfirmFactoryResetOpen] = useState<boolean>(false);
  const [selectedModulePreview, setSelectedModulePreview] = useState<AvailableModule | null>(null);
  const [serviceSubTab, setServiceSubTab] = useState<'http' | 'dhcp' | 'dns' | 'ftp' | 'email' | 'ssh' | 'ntp'>('http');

  // Sync selected port when ports change
  useEffect(() => {
    if (!device.ports.some((p) => p.id === selectedPortId) && device.ports.length > 0) {
      setSelectedPortId(device.ports[0].id);
    }
  }, [device.ports, selectedPortId]);

  // Determine LED status for a port
  const getPortLedState = (port: DevicePort): PortLEDState => {
    if (!device.config.powerOn) return 'gray';
    if (!port.isUp) return 'red';
    if (isRebooting) return 'amber';

    const conn = connections.find(
      (c) =>
        (c.fromDeviceId === device.id && c.fromPortId === port.id) ||
        (c.toDeviceId === device.id && c.toPortId === port.id)
    );

    if (!conn) return 'red';

    const otherDevId = conn.fromDeviceId === device.id ? conn.toDeviceId : conn.fromDeviceId;
    const otherPortId = conn.fromDeviceId === device.id ? conn.toPortId : conn.fromPortId;
    const otherDev = allDevices.find((d) => d.id === otherDevId);
    if (!otherDev || !otherDev.config.powerOn) return 'red';

    const otherPort = otherDev.ports.find((p) => p.id === otherPortId);
    if (!otherPort || !otherPort.isUp) return 'red';

    return 'green';
  };

  // Helper for LED class
  const getLedClass = (state: PortLEDState) => {
    switch (state) {
      case 'green':
        return 'bg-emerald-400 shadow-[0_0_8px_#22c55e] animate-pulse';
      case 'amber':
        return 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-bounce';
      case 'red':
        return 'bg-rose-500 shadow-[0_0_6px_#ef4444]';
      case 'gray':
      default:
        return 'bg-slate-600';
    }
  };

  // 1. Power On / Off Toggle
  const handleTogglePower = () => {
    const nextPower = !device.config.powerOn;
    const updatedConfig: DeviceConfiguration = {
      ...device.config,
      powerOn: nextPower
    };

    const updatedPorts = device.ports.map((p) => ({
      ...p,
      isUp: nextPower ? true : false
    }));

    if (nextPower) {
      updatedConfig.cliLogs = [
        ...device.config.cliLogs,
        `*** POWER ON: Initializing ${device.name} ***`,
        `IOS System Image loaded.`,
        'Self test passed...',
        'System is READY.'
      ];
    }

    onUpdateDevice({
      ...device,
      ports: updatedPorts,
      config: updatedConfig
    });

    showToast(nextPower ? t.toastPowerOn(device.name) : t.toastPowerOff(device.name));
  };

  // 2. Restart Device
  const handleRestart = () => {
    if (!device.config.powerOn) {
      showToast(t.simErrors.cantRebootOff);
      return;
    }

    setIsRebooting(true);
    setRebootStep(1);
    showToast(t.toastRebooting(device.name));

    const rebootLogs = [
      '',
      `*** RESTART INITIATED: ${device.name} ***`,
      'System Bootstrap, Version 15.1(4)M4',
      'System image file is "flash:c2900-universalk9-mz.SPA.151-4.M4.bin"',
      'POST: CPU, Memory, Interfaces self-test passed.',
      'Initializing interfaces into Spanning Tree listening...',
      'Press RETURN to get started!'
    ];

    setTimeout(() => {
      setRebootStep(2);
      onUpdateDevice({
        ...device,
        config: {
          ...device.config,
          cliLogs: [...device.config.cliLogs, ...rebootLogs]
        }
      });
    }, 1200);

    setTimeout(() => {
      setIsRebooting(false);
      setRebootStep(0);
      showToast(t.toastRebootComplete(device.name));
    }, 2400);
  };

  // 3. Reset to Factory Defaults
  const handleFactoryReset = () => {
    const baseModel = PACKET_TRACER_MODELS.find((m) => m.id === device.modelId);
    const pristineConfig = createDefaultConfig(
      baseModel?.name || device.name,
      baseModel?.category || 'end_devices'
    );
    const pristinePorts = baseModel ? [...baseModel.defaultPorts] : [...device.ports];

    onUpdateDevice({
      ...device,
      ports: pristinePorts,
      config: pristineConfig
    });

    setConfirmFactoryResetOpen(false);
    showToast(t.toastFactoryResetComplete(device.name));
  };

  // 4. Get supported modules for device
  const getDeviceSupportedModules = (): AvailableModule[] => {
    if (device.iconType === 'router') return ROUTER_MODULES;
    if (device.iconType === 'switch') return SWITCH_MODULES;
    if (device.iconType === 'pc' || device.iconType === 'smart') return PC_MODULES;
    if (device.iconType === 'server') return SERVER_MODULES;
    return [];
  };

  const supportedModules = getDeviceSupportedModules();

  // Add expansion module
  const handleAddModule = (mod: AvailableModule) => {
    if (device.config.powerOn) {
      setSelectedModulePreview(mod);
      setPowerWarningOpen(true);
      return;
    }

    if (device.config.installedModules.includes(mod.id)) {
      showToast(t.toastModuleAlreadyInstalled(mod.name));
      return;
    }

    const updatedModules = [...device.config.installedModules, mod.id];
    const newPorts = [...device.ports, ...mod.addedPorts];

    onUpdateDevice({
      ...device,
      ports: newPorts,
      config: {
        ...device.config,
        installedModules: updatedModules
      }
    });

    showToast(t.toastModuleInstalled(mod.name));
  };

  // Remove expansion module
  const handleRemoveModule = (moduleId: string) => {
    if (device.config.powerOn) {
      setPowerWarningOpen(true);
      return;
    }

    const mod = supportedModules.find((m) => m.id === moduleId);
    if (!mod) return;

    mod.addedPorts.forEach((p) => {
      if (onRemoveConnectionByPort) {
        onRemoveConnectionByPort(device.id, p.id);
      }
    });

    const updatedModules = device.config.installedModules.filter((id) => id !== moduleId);
    const removedPortIds = new Set(mod.addedPorts.map((p) => p.id));
    const updatedPorts = device.ports.filter((p) => !removedPortIds.has(p.id));

    onUpdateDevice({
      ...device,
      ports: updatedPorts,
      config: {
        ...device.config,
        installedModules: updatedModules
      }
    });

    showToast(t.toastModuleRemoved(mod.name));
  };

  // Cisco CLI commands handler
  const handleRunCliCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let newLogs = [...device.config.cliLogs, `${device.config.hostname}> ${trimmed}`];
    let newMode = device.config.cliMode;
    let newHostname = device.config.hostname;

    const lower = trimmed.toLowerCase();

    if (lower === 'enable' || lower === 'en') {
      newMode = 'priv';
      newLogs.push('Password: (cisco)');
    } else if (lower === 'configure terminal' || lower === 'conf t') {
      newMode = 'config';
      newLogs.push('Enter configuration commands, one per line. End with CNTL/Z.');
    } else if (lower.startsWith('hostname ')) {
      const parts = trimmed.split(' ');
      if (parts[1]) {
        newHostname = parts[1].trim();
        newLogs.push(`Hostname updated to ${newHostname}`);
      }
    } else if (lower === 'show ip int brief' || lower === 'sh ip int br') {
      newLogs.push('Interface              IP-Address      OK? Method Status                Protocol');
      device.ports.forEach((p) => {
        const ip = p.ipAddress || 'unassigned';
        const st = p.isUp ? 'up' : 'administratively down';
        const pr = p.isUp ? 'up' : 'down';
        const padPort = p.id.padEnd(22);
        const padIp = ip.padEnd(16);
        newLogs.push(`${padPort} ${padIp} YES unset  ${st.padEnd(21)} ${pr}`);
      });
    } else if (lower === 'show running-config' || lower === 'sh run') {
      newLogs.push('Building configuration...');
      newLogs.push(`Current configuration : 1850 bytes`);
      newLogs.push(`!`);
      newLogs.push(`version 15.1`);
      newLogs.push(`hostname ${device.config.hostname}`);
      newLogs.push(`!`);
      device.ports.forEach((p) => {
        newLogs.push(`interface ${p.id}`);
        if (p.ipAddress) {
          newLogs.push(` ip address ${p.ipAddress} ${p.subnetMask || '255.255.255.0'}`);
        } else {
          newLogs.push(` no ip address`);
        }
        newLogs.push(p.isUp ? ` no shutdown` : ` shutdown`);
        newLogs.push(`!`);
      });
      newLogs.push(`end`);
    } else if (lower.startsWith('ping ')) {
      const target = trimmed.split(' ')[1] || '192.168.1.1';
      newLogs.push(`Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:`);
      newLogs.push(`!!!!!`);
      newLogs.push(`Success rate is 100 percent (5/5), round-trip min/avg/max = 1/3/7 ms`);
    } else if (lower === 'exit' || lower === 'end') {
      if (newMode === 'config' || newMode === 'config-if') newMode = 'priv';
      else if (newMode === 'priv') newMode = 'user';
    } else if (lower === 'clear' || lower === 'cls') {
      newLogs = [];
    } else {
      newLogs.push(`% Invalid command: "${trimmed}". Type "help" or "?" for commands.`);
    }

    onUpdateDevice({
      ...device,
      config: {
        ...device.config,
        hostname: newHostname,
        cliMode: newMode,
        cliLogs: newLogs
      }
    });

    setCliInput('');
  };

  const activePort = device.ports.find((p) => p.id === selectedPortId) || device.ports[0];

  return (
    <div
      dir={dir}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      <div className="bg-[#0b1424] border-2 border-[#00bceb]/70 rounded-2xl w-full max-w-4xl h-[92vh] max-h-[750px] shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-300">
        
        {/* Device Header & Power Controls */}
        <div className="bg-[#070e1b] border-b border-[#1b2b48] px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005073] border border-[#00bceb]/80 flex items-center justify-center shadow-md">
              <Cpu className="w-5 h-5 text-[#00bceb]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-white tracking-wide">
                  {device.name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#162744] text-cyan-300 border border-[#00bceb]/40">
                  {modelInfo.name}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                <span>{t.vendor}: <strong className="text-slate-300">Cisco Systems</strong></span>
                <span>•</span>
                <span>{t.iosVersion}: <strong className="text-cyan-400">v15.1(4)M4</strong></span>
                <span>•</span>
                <span>{t.status}: <strong className={device.config.powerOn ? 'text-emerald-400' : 'text-rose-400'}>
                  {device.config.powerOn ? t.online : t.offline}
                </strong></span>
              </div>
            </div>
          </div>

          {/* Power Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePower}
              className={`h-8 px-3 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
                device.config.powerOn
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 ring-1 ring-emerald-400'
                  : 'bg-rose-950 border border-rose-600 text-rose-300 hover:bg-rose-900 shadow-rose-950/60'
              }`}
              title={device.config.powerOn ? t.powerOffBtn : t.powerOnBtn}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{device.config.powerOn ? t.powerOnBtn : t.powerOffBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={isRebooting || !device.config.powerOn}
              className="h-8 px-2.5 rounded-xl bg-[#162744] hover:bg-[#213a64] disabled:opacity-40 text-cyan-300 text-xs font-semibold flex items-center gap-1 border border-[#00bceb]/30 shadow transition-all active:scale-95"
              title={t.restartBtn}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRebooting ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{t.restartBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmFactoryResetOpen(true)}
              className="h-8 px-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center gap-1 border border-rose-700/60 shadow transition-all active:scale-95"
              title={t.factoryResetBtn}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{t.factoryResetBtn}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#111f38] hover:bg-rose-900 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs Header */}
        <div className="bg-[#091322] border-b border-[#1b2b48] px-3 flex items-center gap-1 shrink-0 overflow-x-auto">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-9 px-3.5 rounded-t-lg flex items-center gap-1.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#003852] text-[#00bceb] border-[#00bceb] shadow-inner'
                  : 'text-slate-400 hover:text-white border-transparent hover:bg-[#0e1c33]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#08101d] text-slate-200">
          
          {/* Physical Tab */}
          {activeTab === 'physical' && (
            <div className="space-y-4">
              
              {/* Chassis Panel */}
              <div className="p-4 rounded-2xl bg-[#0c1628] border border-[#1c3358] shadow-lg">
                <div className="flex items-center justify-between mb-3 border-b border-[#172844] pb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                      {t.chassisView}
                    </span>
                  </div>
                  
                  {/* Physical Power Switch */}
                  <div className="flex items-center gap-2 bg-[#060c16] px-3 py-1.5 rounded-xl border border-[#1b2b48]">
                    <span className="text-[10px] font-mono text-slate-400">{t.powerSwitch}:</span>
                    <button
                      type="button"
                      onClick={handleTogglePower}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                        device.config.powerOn ? 'bg-emerald-600' : 'bg-rose-950 border border-rose-700'
                      }`}
                      title={device.config.powerOn ? t.powerOffBtn : t.powerOnBtn}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          device.config.powerOn
                            ? dir === 'rtl' ? '-translate-x-6' : 'translate-x-6'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <div className="flex items-center gap-1 pl-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          device.config.powerOn
                            ? 'bg-emerald-400 shadow-[0_0_8px_#22c55e]'
                            : 'bg-rose-600'
                        }`}
                      />
                      <span className="text-[10px] font-mono font-bold text-slate-300">
                        {device.config.powerOn ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hardware Rendering Panel */}
                <div className="bg-[#050b14] border-2 border-[#162744] rounded-xl p-3 shadow-inner space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-cyan-400 font-bold">{device.name.toUpperCase()} (CISCO SYSTEM)</span>
                    <span>100-240V ~ 50/60Hz 1.5A</span>
                  </div>

                  {/* Ports Grid & LEDs */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>INTEGRATED NETWORK INTERFACES & PORT LEDS</span>
                      <span>Total Ports: {device.ports.length}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                      {device.ports.map((port) => {
                        const ledState = getPortLedState(port);
                        const isSelected = selectedPortId === port.id;

                        return (
                          <div
                            key={port.id}
                            onClick={() => setSelectedPortId(port.id)}
                            className={`p-2 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                              isSelected
                                ? 'bg-[#003852] border-[#00bceb] shadow-md shadow-cyan-950/70'
                                : 'bg-[#091424] border-[#182a4a] hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-bold text-slate-300 truncate">
                                {port.name}
                              </span>
                              <div
                                className={`w-2.5 h-2.5 rounded-full transition-all ${getLedClass(ledState)}`}
                                title={`Port LED: ${ledState}`}
                              />
                            </div>

                            <div className="h-6 rounded bg-[#03070d] border border-slate-700/60 flex items-center justify-center">
                              {port.type === 'Fiber' ? (
                                <div className="w-5 h-3 border border-amber-500/80 rounded-sm bg-amber-950/40 flex items-center justify-center text-[8px] font-mono text-amber-300">
                                  SFP
                                </div>
                              ) : port.type === 'Serial' ? (
                                <div className="w-5 h-3 border border-cyan-500/80 rounded-sm bg-cyan-950/40 flex items-center justify-center text-[7px] font-mono text-cyan-300">
                                  SER
                                </div>
                              ) : (
                                <div className="w-4 h-3.5 border border-slate-600 rounded-sm bg-slate-900 flex flex-col items-center justify-end p-0.5">
                                  <div className="w-2.5 h-0.5 bg-yellow-500/80" />
                                </div>
                              )}
                            </div>

                            <div className="text-[8px] font-mono text-slate-400 flex items-center justify-between">
                              <span>{port.id}</span>
                              <span className={port.isUp ? 'text-emerald-400' : 'text-rose-400'}>
                                {port.isUp ? 'UP' : 'DOWN'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expansion Slots View */}
                  <div className="pt-2 border-t border-[#162744]">
                    <div className="text-[10px] text-slate-400 font-mono mb-1.5 flex items-center justify-between">
                      <span>{t.expansionSlots}:</span>
                      <span className="text-cyan-400">
                        {device.config.installedModules.length} {t.modulesActive}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {device.config.installedModules.length === 0 ? (
                        <div className="p-3 rounded-lg bg-[#070e1b] border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono col-span-2">
                          {t.noModulesInstalled}
                        </div>
                      ) : (
                        device.config.installedModules.map((modId) => {
                          const mod = supportedModules.find((m) => m.id === modId);
                          return (
                            <div
                              key={modId}
                              className="p-1.5 px-2 rounded-lg bg-[#0a1b33] border border-[#00bceb]/50 flex items-center justify-between text-[10px]"
                            >
                              <div className="flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="font-bold text-white">{mod?.name || modId}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveModule(modId)}
                                className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 hover:bg-rose-900 text-[9px] font-bold transition-colors"
                                title={t.removeModule}
                              >
                                {t.removeModule}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* LED Legend */}
                  <div className="mt-3 pt-2.5 border-t border-[#162744] flex flex-wrap items-center gap-4 text-[10px] font-mono">
                    <span className="text-slate-400 font-bold">{t.ledLegendTitle}:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e]" />
                      <span className="text-emerald-400 font-bold">{t.ledGreenUp}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                      <span className="text-amber-400 font-bold">{t.ledOrangeInit}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#ef4444]" />
                      <span className="text-rose-400 font-bold">{t.ledRedDown}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                      <span className="text-slate-400">{t.ledGrayOff}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Expansion Modules List */}
              <div className="p-4 rounded-2xl bg-[#0c1628] border border-[#1c3358] shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      {t.availableModulesTitle}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {t.availableModulesDesc}
                    </p>
                  </div>
                  
                  {/* Power status badge */}
                  <div
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                      device.config.powerOn
                        ? 'bg-rose-950/70 border border-rose-700 text-rose-300'
                        : 'bg-emerald-950/70 border border-emerald-700 text-emerald-300'
                    }`}
                  >
                    {device.config.powerOn ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>{t.powerOnModuleWarningBadge}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{t.powerOffModuleReadyBadge}</span>
                      </>
                    )}
                  </div>
                </div>

                {supportedModules.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#070e1b] border border-slate-800 text-center text-xs text-slate-400">
                    {t.noModulesSupported}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {supportedModules.map((mod) => {
                      const isInstalled = device.config.installedModules.includes(mod.id);
                      const modDescription = t.moduleDescriptions[mod.id] || mod.description;

                      return (
                        <div
                          key={mod.id}
                          className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                            isInstalled
                              ? 'bg-[#002738] border-[#00bceb]/80 shadow'
                              : 'bg-[#070e1b] border-[#1b2b48] hover:border-slate-500'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-white">{mod.name}</span>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                  isInstalled
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {isInstalled ? t.installedBadge : t.notInstalledBadge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 line-clamp-2">
                              {modDescription}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                              <span>{t.addedPorts}</span>
                              <strong>{mod.addedPorts.map((p) => p.name).join(', ')}</strong>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#162744] flex items-center justify-end">
                            {isInstalled ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveModule(mod.id)}
                                className="px-3 py-1 rounded-lg bg-rose-950 border border-rose-700 text-rose-300 text-xs font-bold hover:bg-rose-900 transition-colors"
                              >
                                {t.removeModuleBtn}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddModule(mod)}
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow"
                              >
                                {t.installModuleBtn}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Config Tab */}
          {activeTab === 'config' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Settings Sidebar */}
              <div className="p-3 rounded-xl bg-[#0c1628] border border-[#1c3358] space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white mb-2">{t.globalSettings}</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">{t.hostname}:</label>
                      <input
                        type="text"
                        value={device.config.hostname}
                        onChange={(e) => {
                          onUpdateDevice({
                            ...device,
                            name: e.target.value,
                            config: { ...device.config, hostname: e.target.value }
                          });
                        }}
                        className="w-full bg-[#050b14] border border-[#1e3458] rounded-lg p-2 text-xs text-white font-mono focus:border-[#00bceb] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">{t.defaultGateway}:</label>
                      <input
                        type="text"
                        value={device.config.defaultGateway}
                        onChange={(e) => {
                          onUpdateDevice({
                            ...device,
                            config: { ...device.config, defaultGateway: e.target.value }
                          });
                        }}
                        placeholder="192.168.1.1"
                        className="w-full bg-[#050b14] border border-[#1e3458] rounded-lg p-2 text-xs text-white font-mono focus:border-[#00bceb] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">{t.dnsServer}:</label>
                      <input
                        type="text"
                        value={device.config.dnsServer}
                        onChange={(e) => {
                          onUpdateDevice({
                            ...device,
                            config: { ...device.config, dnsServer: e.target.value }
                          });
                        }}
                        placeholder="8.8.8.8"
                        className="w-full bg-[#050b14] border border-[#1e3458] rounded-lg p-2 text-xs text-white font-mono focus:border-[#00bceb] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Interfaces list */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-2">{t.interfaces}</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {device.ports.map((port) => (
                      <button
                        key={port.id}
                        type="button"
                        onClick={() => setSelectedPortId(port.id)}
                        className={`w-full p-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-colors ${
                          selectedPortId === port.id
                            ? 'bg-[#003852] text-[#00bceb] border border-[#00bceb]'
                            : 'bg-[#070e1b] text-slate-300 hover:bg-[#111f38]'
                        }`}
                      >
                        <span className="truncate">{port.name}</span>
                        <span className={`text-[10px] font-bold ${port.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {port.isUp ? 'UP' : 'DOWN'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Port Details */}
              <div className="md:col-span-2 p-4 rounded-xl bg-[#0c1628] border border-[#1c3358] space-y-4">
                {activePort ? (
                  <>
                    <div className="flex items-center justify-between border-b border-[#1c3358] pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-white font-mono">{activePort.name}</h4>
                        <span className="text-[11px] text-cyan-400 font-mono">Port ID: {activePort.id}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300">{t.portStatus}:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPorts = device.ports.map((p) =>
                              p.id === activePort.id ? { ...p, isUp: !p.isUp } : p
                            );
                            onUpdateDevice({ ...device, ports: updatedPorts });
                            showToast(
                              !activePort.isUp
                                ? t.toastPortNoShutdown(activePort.id)
                                : t.toastPortShutdown(activePort.id)
                            );
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            activePort.isUp
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-950 border border-rose-700 text-rose-300'
                          }`}
                        >
                          {activePort.isUp ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="ipType"
                            checked={!activePort.isDhcp}
                            onChange={() => {
                              const updatedPorts = device.ports.map((p) =>
                                p.id === activePort.id ? { ...p, isDhcp: false } : p
                              );
                              onUpdateDevice({ ...device, ports: updatedPorts });
                            }}
                          />
                          <span>{t.staticIp}</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="ipType"
                            checked={!!activePort.isDhcp}
                            onChange={() => {
                              const updatedPorts = device.ports.map((p) =>
                                p.id === activePort.id
                                  ? { ...p, isDhcp: true, ipAddress: '192.168.1.15' }
                                  : p
                              );
                              onUpdateDevice({ ...device, ports: updatedPorts });
                              showToast(t.toastDhcpRequested);
                            }}
                          />
                          <span>{t.dhcp}</span>
                        </label>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">{t.ipAddress}:</label>
                        <input
                          type="text"
                          value={activePort.ipAddress || ''}
                          disabled={!!activePort.isDhcp}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updatedPorts = device.ports.map((p) =>
                              p.id === activePort.id ? { ...p, ipAddress: val } : p
                            );
                            onUpdateDevice({ ...device, ports: updatedPorts });
                          }}
                          placeholder="e.g. 192.168.1.1"
                          className="w-full bg-[#050b14] border border-[#1e3458] rounded-lg p-2 text-xs text-white font-mono focus:border-[#00bceb] outline-none disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">{t.subnetMask}:</label>
                        <input
                          type="text"
                          value={activePort.subnetMask || '255.255.255.0'}
                          disabled={!!activePort.isDhcp}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updatedPorts = device.ports.map((p) =>
                              p.id === activePort.id ? { ...p, subnetMask: val } : p
                            );
                            onUpdateDevice({ ...device, ports: updatedPorts });
                          }}
                          placeholder="255.255.255.0"
                          className="w-full bg-[#050b14] border border-[#1e3458] rounded-lg p-2 text-xs text-white font-mono focus:border-[#00bceb] outline-none disabled:opacity-60"
                        />
                      </div>

                      {device.iconType === 'switch' && (
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">{t.vlanId}:</label>
                          <select
                            value={activePort.vlanId || 1}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              const updatedPorts = device.ports.map((p) =>
                                p.id === activePort.id ? { ...p, vlanId: val } : p
                              );
                              onUpdateDevice({ ...device, ports: updatedPorts });
                              showToast(t.toastVlanAssigned(activePort.id, val));
                            }}
                            className="w-full bg-[#050b14] border border-[#1e3458] rounded-lg p-2 text-xs text-white font-mono focus:border-[#00bceb] outline-none"
                          >
                            <option value={1}>VLAN 1 (default)</option>
                            <option value={10}>VLAN 10 (MANAGEMENT)</option>
                            <option value={20}>VLAN 20 (USERS)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-xs text-slate-500 py-10 font-mono">
                    {t.selectPortHint}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* CLI Tab */}
          {activeTab === 'cli' && (
            <div className="h-full flex flex-col bg-black border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
              
              <div className="flex-1 p-3 overflow-y-auto space-y-1 text-emerald-400 bg-black min-h-[280px]">
                {!device.config.powerOn ? (
                  <div className="text-rose-500 font-bold p-4 text-center">
                    {t.cliPowerOffWarning}
                  </div>
                ) : (
                  <>
                    {device.config.cliLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                        {log}
                      </div>
                    ))}
                  </>
                )}
              </div>

              {device.config.powerOn && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunCliCommand(cliInput);
                  }}
                  className="bg-[#050b14] border-t border-slate-800 p-2 flex items-center gap-2"
                >
                  <span className="text-cyan-400 font-bold pl-1">
                    {device.config.hostname}
                    {device.config.cliMode === 'config' ? '(config)#' : device.config.cliMode === 'priv' ? '#' : '>'}
                  </span>
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder={t.cliInputPlaceholder}
                    className="flex-1 bg-transparent border-none text-white outline-none font-mono text-xs"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-[#005073] hover:bg-[#00bceb] text-white text-xs font-bold font-sans"
                  >
                    {t.sendCmd}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Desktop Tab */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              {!device.config.powerOn ? (
                <div className="p-8 rounded-xl bg-black border border-slate-800 text-center font-mono text-rose-500">
                  {t.pcPowerOffWarning}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  {/* IP Configuration App */}
                  <div className="p-3 rounded-xl bg-[#0c1628] border border-[#1c3358] hover:border-[#00bceb] cursor-pointer flex flex-col items-center text-center gap-2 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#003852] flex items-center justify-center text-cyan-400">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">{t.ipConfigApp}</span>
                      <span className="text-[10px] text-slate-400">IP: {device.ports[0]?.ipAddress || '0.0.0.0'}</span>
                    </div>
                  </div>

                  {/* Command Prompt App */}
                  <div className="p-3 rounded-xl bg-[#0c1628] border border-[#1c3358] hover:border-[#00bceb] cursor-pointer flex flex-col items-center text-center gap-2 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#061c33] flex items-center justify-center text-emerald-400">
                      <TerminalIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">{t.cmdApp}</span>
                      <span className="text-[10px] text-slate-400">ping, ipconfig, arp</span>
                    </div>
                  </div>

                  {/* Web Browser App */}
                  <div className="p-3 rounded-xl bg-[#0c1628] border border-[#1c3358] hover:border-[#00bceb] cursor-pointer flex flex-col items-center text-center gap-2 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#2b1f06] flex items-center justify-center text-amber-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">{t.browserApp}</span>
                      <span className="text-[10px] text-slate-400">HTTP / Web Client</span>
                    </div>
                  </div>

                  {/* Text Editor App */}
                  <div className="p-3 rounded-xl bg-[#0c1628] border border-[#1c3358] hover:border-[#00bceb] cursor-pointer flex flex-col items-center text-center gap-2 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#1c082b] flex items-center justify-center text-purple-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">{t.editorApp}</span>
                      <span className="text-[10px] text-slate-400">Create & Edit Files</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Service Sub Tabs */}
              <div className="p-2 rounded-xl bg-[#0c1628] border border-[#1c3358] space-y-1">
                {(['http', 'dhcp', 'dns', 'ftp', 'email', 'ssh', 'ntp'] as const).map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => setServiceSubTab(svc)}
                    className={`w-full p-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-between ${
                      dir === 'rtl' ? 'text-right' : 'text-left'
                    } ${
                      serviceSubTab === svc
                        ? 'bg-[#005073] text-white border border-[#00bceb]'
                        : 'text-slate-400 hover:text-white hover:bg-[#162744]'
                    }`}
                  >
                    <span>{svc}</span>
                    <span className="text-[9px] font-mono text-emerald-400">ON</span>
                  </button>
                ))}
              </div>

              {/* Service Details */}
              <div className="md:col-span-3 p-4 rounded-xl bg-[#0c1628] border border-[#1c3358] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c3358] pb-2">
                  <h4 className="font-bold text-sm text-white uppercase">{serviceSubTab} SERVICE</h4>
                  <span className="text-xs font-mono text-emerald-400">{t.serviceStatusActive}</span>
                </div>

                {serviceSubTab === 'http' && (
                  <div className="space-y-2 text-xs">
                    <label className="text-slate-400 block font-semibold">{t.htmlContentLabel}</label>
                    <textarea
                      rows={5}
                      value={device.config.services.http.htmlContent}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateDevice({
                          ...device,
                          config: {
                            ...device.config,
                            services: {
                              ...device.config.services,
                              http: { ...device.config.services.http, htmlContent: val }
                            }
                          }
                        });
                      }}
                      className="w-full bg-[#050b14] border border-[#1e3458] rounded-lg p-2.5 text-xs text-cyan-300 font-mono outline-none"
                    />
                  </div>
                )}

                {serviceSubTab === 'dns' && (
                  <div className="space-y-2 text-xs">
                    <div className="text-slate-400">{t.dnsRecordsLabel}</div>
                    <div className="p-2 rounded bg-[#050b14] border border-[#1e3458] font-mono text-[11px] space-y-1">
                      {device.config.services.dns.records.map((r, i) => (
                        <div key={i} className="flex justify-between text-cyan-300">
                          <span>{r.name}</span>
                          <span className="text-slate-400">{r.type}</span>
                          <span className="text-white">{r.address}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {serviceSubTab === 'dhcp' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Pool Name:</span>
                      <strong className="text-white font-mono">{device.config.services.dhcp.poolName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.defaultGateway}:</span>
                      <strong className="text-white font-mono">{device.config.services.dhcp.gateway}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Start IP Address:</span>
                      <strong className="text-white font-mono">{device.config.services.dhcp.startIp}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.subnetMask}:</span>
                      <strong className="text-white font-mono">{device.config.services.dhcp.subnetMask}</strong>
                    </div>
                  </div>
                )}

                {(serviceSubTab === 'ftp' || serviceSubTab === 'email' || serviceSubTab === 'ssh' || serviceSubTab === 'ntp') && (
                  <div className="p-3 rounded-lg bg-[#050b14] border border-[#1e3458] text-xs text-slate-300">
                    {t.serviceRunningMsg}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Cisco Packet Tracer Warning Modal for Module Insertion */}
        {powerWarningOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#121c2e] border-2 border-amber-500 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="w-8 h-8 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {t.cannotAddModuleTitle}
                  </h3>
                  <span className="text-xs text-amber-400/90 font-mono">
                    {t.cannotAddModuleCiscoSubtitle}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {t.cannotAddModuleBody}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPowerWarningOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1b2b48] hover:bg-[#253d66] text-xs font-semibold text-slate-300"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTogglePower();
                    setPowerWarningOpen(false);
                    if (selectedModulePreview) {
                      setTimeout(() => handleAddModule(selectedModulePreview), 100);
                    }
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg"
                >
                  {t.powerOffAndProceed}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Factory Reset Confirmation Modal */}
        {confirmFactoryResetOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#121c2e] border-2 border-rose-600 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <RotateCcw className="w-8 h-8 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {t.confirmResetTitle}
                  </h3>
                  <span className="text-xs text-rose-400/90 font-mono">
                    {t.confirmResetSubtitle}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {t.confirmResetBody(device.name)}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmFactoryResetOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1b2b48] hover:bg-[#253d66] text-xs font-semibold text-slate-300"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={handleFactoryReset}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                >
                  {t.yesReset}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
