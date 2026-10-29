import { LessonItem, QuizQuestion, SampleTopology, CiscoGlossaryEntry } from '../types/simulator';
import { PlacedDevice, PlacedConnection, createDefaultConfig, PACKET_TRACER_MODELS } from '../App';

export const LESSONS_DATA: LessonItem[] = [
  {
    id: 'lesson-ip-subnetting',
    number: '01',
    titleEn: 'IP Addressing & Subnetting Fundamentals',
    titleAr: 'أساسيات عنونة IP وتقسيم الشبكات الفرعية (Subnetting)',
    duration: '15 min',
    levelEn: 'Beginner',
    levelAr: 'مبتدئ',
    summaryEn: 'Learn IPv4 structure, Classless Inter-Domain Routing (CIDR), network masks, and default gateways.',
    summaryAr: 'تعرف على بنية عنوان IPv4 وأقنعة الشبكات الفرعية والبوابة الافتراضية وكيف تتواصل الأجهزة داخل وخارج الشبكة.',
    keyConceptsEn: ['IPv4 Address', 'Subnet Mask', 'Default Gateway', 'Broadcast Domain', 'Network ID & Host ID'],
    keyConceptsAr: ['عنوان IPv4', 'قناع الشبكة Subnet Mask', 'البوابة الافتراضية Default Gateway', 'نطاق البث Broadcast Domain', 'معرف الشبكة والمضيف'],
    ciscoCommands: [
      'ipconfig',
      'ip address 192.168.1.1 255.255.255.0',
      'ping 192.168.1.2',
      'show ip interface brief'
    ],
    sampleTopologyId: 'sample-lan-basic',
    contentEn: {
      overview: 'Every network interface attached to an IP network requires a unique IP address and subnet mask to determine which part identifies the local subnet and which specifies the host.',
      howItWorks: 'Devices in the same subnet (e.g. 192.168.1.10/24 and 192.168.1.20/24) communicate directly through Layer 2 switches using ARP. Traffic destined for other subnets must be forwarded to the Default Gateway (Router interface).',
      labExercise: 'Set PC0 to 192.168.1.10 / 255.255.255.0 and PC1 to 192.168.1.20 / 255.255.255.0. Send a Ping packet between them to verify ARP resolution and ICMP Echo Reply.'
    },
    contentAr: {
      overview: 'يحتاج كل جهاز متصل بشبكة IP إلى عنوان IP فريد وقناع شبكة (Subnet Mask) لمعرفة عنوان الشبكة وعنوان المضيف وتحديد ما إذا كان الجهاز الهدف في نفس الشبكة المحلية أو يتطلب التوجيه.',
      howItWorks: 'الأجهزة الواقعة في نفس الشبكة الفرعية (مثل 192.168.1.10/24 و 192.168.1.20/24) تتخاطب مباشرة عبر المبدل Switch باستخدام بروتوكول ARP دون الحاجة لراوتر. بينما الحزم المتجهة إلى شبكات أخرى يتم توجيهها للبوابة الافتراضية (Default Gateway).',
      labExercise: 'قم بضبط عنوان PC0 إلى 192.168.1.10 وقناع 255.255.255.0، وضبط PC1 إلى 192.168.1.20. ثم أرسل حزمة Ping للتحقق من سلامة الاتصال وتبادل رسائل ICMP.'
    }
  },
  {
    id: 'lesson-switching-mac',
    number: '02',
    titleEn: 'Cisco Catalyst Switch Fundamentals & MAC Tables',
    titleAr: 'مبادئ المبدلات (Switch) وجدول عناوين MAC',
    duration: '20 min',
    levelEn: 'Beginner',
    levelAr: 'مبتدئ',
    summaryEn: 'Understand Layer 2 Ethernet switching, frame forwarding, MAC learning, and collision isolation.',
    summaryAr: 'فهم عمل مبدلات الطبقة الثانية (Layer 2) وكيفية بناء جدول MAC وتمرير الإطارات وعزل نطاقات التصادم.',
    keyConceptsEn: ['Layer 2 Switching', 'MAC Address Table', 'Frame Flooding', 'Collision Domain', 'Full Duplex'],
    keyConceptsAr: ['تبديل الطبقة الثانية Layer 2', 'جدول عناوين MAC', 'الإغراق Frame Flooding', 'نطاق التصادم Collision Domain', 'الازدواج الكامل Full Duplex'],
    ciscoCommands: [
      'show mac address-table',
      'show interfaces status',
      'show spanning-tree',
      'reload'
    ],
    sampleTopologyId: 'sample-lan-basic',
    contentEn: {
      overview: 'Unlike hubs that replicate bits across every physical port, a Cisco Catalyst switch reads the source MAC address of inbound Ethernet frames to learn which port connects to each device.',
      howItWorks: 'When a frame arrives, the switch inspects the destination MAC. If found in the MAC table, the frame is sent only out that specific egress port (Forwarding). If unknown, the switch floods the frame out all ports except the ingress port.',
      labExercise: 'Inspect the Switch in the device page. Open the CLI tab, enter privileged mode ("enable"), and run "show mac address-table" after pinging between hosts.'
    },
    contentAr: {
      overview: 'بخلاف الموزعات القديمة (Hubs) التي تعيد بث البيانات لكل المنافذ مسببة تصادمات، يقوم مبدل سيسكو بفحص عنوان المصدر MAC لكل إطار يتعلمه ويخزنه في جدول MAC ليوجه البيانات لمنفذ الهدف فقط.',
      howItWorks: 'عند وصول إطار، يبحث المبدل عن عنوان الوجهة (Destination MAC) في جدوله الداخلي. فإذا وجده أرسل الإطار مباشرة لذلك المنفذ، وإن لم يجده قام بعملية Flooding (إغراق) لجميع المنافذ عدا منفذ الاستلام.',
      labExercise: 'افتح صفحة المبدل Switch0، توجه لتبويب CLI، اكتب أمر "enable" ثم نفّذ "show mac address-table" بعد إرسال حزمة Ping لمشاهدة عناوين MAC المسجلة.'
    }
  },
  {
    id: 'lesson-router-gateway',
    number: '03',
    titleEn: 'Cisco Router Configuration & Inter-Network Routing',
    titleAr: 'إعداد راوتر سيسكو والتوجيه بين الشبكات',
    duration: '25 min',
    levelEn: 'Intermediate',
    levelAr: 'متوسط',
    summaryEn: 'Configure router interfaces, assign IP addresses, activate ports with "no shutdown", and verify routing tables.',
    summaryAr: 'تهيئة منافذ الراوتر وتعيين عناوين IP وتفعيلها بأمر "no shutdown" وفحص جدول التوجيه Routing Table.',
    keyConceptsEn: ['Layer 3 Routing', 'Default Gateway', 'Routing Table', 'Interface Configuration', 'No Shutdown'],
    keyConceptsAr: ['توجيه الطبقة الثالثة Layer 3', 'البوابة الافتراضية Default Gateway', 'جدول التوجيه Routing Table', 'تهيئة المنافذ Interface Config', 'أمر No Shutdown'],
    ciscoCommands: [
      'enable',
      'configure terminal',
      'interface GigabitEthernet0/0',
      'ip address 192.168.1.1 255.255.255.0',
      'no shutdown',
      'show ip route'
    ],
    sampleTopologyId: 'sample-office-network',
    contentEn: {
      overview: 'Routers connect separate subnets and determine optimal packet forwarding paths across Layer 3. By default, Cisco router interfaces are administratively shutdown until enabled.',
      howItWorks: 'When a packet arrives with a destination IP outside the local subnet, the router examines its Routing Table. If a matching route is found, it decrements the TTL, re-encapsulates the packet into Layer 2, and forwards it to the next hop.',
      labExercise: 'Open Router0 page, inspect GigabitEthernet0/0, verify the IP is set to 192.168.1.1, and verify the interface status is ON (Up).'
    },
    contentAr: {
      overview: 'تربط الموجهات (Routers) بين شبكات فرعية مختلفة وتقوم باختيار أفضل مسار لحزم البيانات. تكون منافذ راوتر سيسكو معطلة تلقائيًا (Administratively Down) ويجب تفعيلها بأمر no shutdown.',
      howItWorks: 'عند استلام حزمة موجهة لشبكة خارجية، يطابق الراوتر عنوان الوجهة مع جدول التوجيه الخاص به (Routing Table)، وينقص حقل TTL ثم يغلف الحزمة في إطار Layer 2 ويرسلها عبر المنفذ المناسب.',
      labExercise: 'افتح صفحة الراوتر Router0، وتحقق من منفذ GigabitEthernet0/0 وتأكد من ضبط IP على 192.168.1.1 وأن حالة المنفذ مفعلة (Port Status: ON).'
    }
  },
  {
    id: 'lesson-vlans-trunking',
    number: '04',
    titleEn: 'VLANs & 802.1Q Trunking',
    titleAr: 'الشبكات الافتراضية (VLANs) وخطوط Trunk',
    duration: '30 min',
    levelEn: 'Intermediate',
    levelAr: 'متوسط',
    summaryEn: 'Segment single physical switches into isolated broadcast domains using Virtual LANs and 802.1Q trunks.',
    summaryAr: 'تقسيم المبدل الواحد إلى شبكات وهمية معزولة برمجياً لتقليص نطاقات البث وزيادة الأمان واستخدام خطوط Trunk.',
    keyConceptsEn: ['VLAN 802.1Q', 'Access Port', 'Trunk Port', 'VLAN Tagging', 'Broadcast Domain Isolation'],
    keyConceptsAr: ['بروتوكول 802.1Q', 'منفذ Access Port', 'منفذ Trunk Port', 'تغليف الوسم VLAN Tagging', 'عزل نطاق البث'],
    ciscoCommands: [
      'vlan 10',
      'name SALES',
      'interface FastEthernet0/1',
      'switchport mode access',
      'switchport access vlan 10',
      'switchport mode trunk',
      'show vlan brief'
    ],
    sampleTopologyId: 'sample-vlan-stick',
    contentEn: {
      overview: 'VLANs allow network administrators to partition a switch logically rather than purchasing separate hardware for different departments (e.g. VLAN 10 for HR, VLAN 20 for Engineering).',
      howItWorks: 'Traffic in VLAN 10 cannot directly reach VLAN 20 without a Layer 3 router. Trunk ports use the IEEE 802.1Q standard to add a 4-byte tag containing the VLAN ID so multiple VLANs share one physical inter-switch link.',
      labExercise: 'Open Switch0, check the Config tab, examine VLAN 10 and VLAN 20, and test inter-VLAN routing through the router sub-interfaces.'
    },
    contentAr: {
      overview: 'تتيح شبكات VLAN لمهندسي الشبكات تقسيم المبدل منطقياً إلى شبكات مستقلة دون الحاجة لشراء أجهزة منفصلة لكل قسم (مثال: VLAN 10 للإدارة، VLAN 20 للمبيعات).',
      howItWorks: 'لا يمكن للأجهزة في VLAN 10 التواصل مباشرة مع VLAN 20 إلا عبر راوتر (Inter-VLAN Routing). وتستخدم منافذ Trunk معيار 802.1Q لإضافة وسم Tag يحمل رقم VLAN لنقل بيانات عدة شبكات عبر كابل واحد.',
      labExercise: 'افتح صفحة المبدل Switch0، تفقد تبويب Config، وعاين المنافذ المخصصة لـ VLAN 10 و VLAN 20 واختبر التوجيه بينها عبر الراوتر.'
    }
  },
  {
    id: 'lesson-dhcp-dns',
    number: '05',
    titleEn: 'Core Network Services: DHCP & DNS',
    titleAr: 'خدمات الشبكة الأساسية: خوادم DHCP و DNS',
    duration: '20 min',
    levelEn: 'Beginner',
    levelAr: 'مبتدئ',
    summaryEn: 'Explore automatic IP address provisioning using DHCP (DORA) and domain name resolution with DNS.',
    summaryAr: 'استكشاف التوزيع التلقائي لعناوين IP عبر بروتوكول DHCP (عملية DORA) وترجمة أسماء النطاقات بواسطة خادم DNS.',
    keyConceptsEn: ['DHCP DORA Process', 'IP Pool & Lease', 'DNS A Record', 'Client-Server Model', 'UDP Ports 67/68 & 53'],
    keyConceptsAr: ['عملية DORA في DHCP', 'تجمع العناوين IP Pool', 'سجل DNS من نوع A', 'نموذج العميل والخادم', 'منافذ UDP 67/68 و 53'],
    ciscoCommands: [
      'ip dhcp pool LAN-POOL',
      'network 192.168.1.0 255.255.255.0',
      'default-router 192.168.1.1',
      'dns-server 192.168.1.100',
      'nslookup cisco.com'
    ],
    sampleTopologyId: 'sample-server-lab',
    contentEn: {
      overview: 'Manual IP configuration on hundreds of host devices is error-prone. DHCP automates IP, mask, gateway, and DNS configuration through Discover, Offer, Request, and Acknowledgment (DORA).',
      howItWorks: 'A client broadcasts a DHCP Discover. The server offers an available IP. The client accepts, and the server commits the lease. DNS translates human-friendly domain names like "cisco.com" into IP addresses so browsers can fetch web pages.',
      labExercise: 'Open Server0, go to Services tab, ensure DHCP service is ON. Next, open PC0, select Desktop > IP Configuration, and click DHCP to watch it obtain an IP automatically.'
    },
    contentAr: {
      overview: 'التهيئة اليدوية لعناوين IP على مئات الأجهزة متعبة وعرضة للأخطاء. يقوم بروتوكول DHCP بأتمتة توزيع العناوين وأقنعة الشبكة والبوابات الافتراضية عبر مراحل DORA الأربع.',
      howItWorks: 'يبث الجهاز طلب DHCP Discover، فيرد الخادم بعرض IP متاح (Offer)، يطلب العميل العنوان (Request)، ويؤكد الخادم الحجز (Acknowledge). بينما يترجم DNS أسماء النطاقات مثل cisco.com إلى عناوين IP.',
      labExercise: 'افتح صفحة الخادم Server0، توجه لتبويب Services، تأكد من تفعيل DHCP. ثم افتح PC0 وتوجه لـ Desktop > IP Configuration واختر DHCP لمشاهدة استلام الـ IP تلقائياً.'
    }
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    ciscoTermTopic: 'Switch / Collision Domain',
    questionEn: 'Which statement accurately describes how a Cisco Layer 2 Switch handles collision domains and broadcast domains?',
    questionAr: 'أي من العبارات التالية تصف بدقة كيفية تعامل مبدل سيسكو (Switch) في الطبقة الثانية مع نطاقات التصادم ونطاقات البث؟',
    optionsEn: [
      'Each port is a separate collision domain, but all ports share one broadcast domain.',
      'All ports share a single collision domain and a single broadcast domain.',
      'Each port is a separate broadcast domain, but all ports share one collision domain.',
      'Switches break both collision domains and broadcast domains per port.'
    ],
    optionsAr: [
      'كل منفذ يمثل نطاق تصادم منفصل، لكن جميع المنافذ تشترك في نطاق بث واحد.',
      'تشترك جميع المنافذ في نطاق تصادم واحد ونطاق بث واحد (مثل الـ Hub).',
      'كل منفذ يمثل نطاق بث منفصل، لكن تشترك جميع المنافذ في نطاق تصادم واحد.',
      'يقوم المبدل بفصل نطاقات التصادم ونطاقات البث معاً في كل منفذ.'
    ],
    correctIndex: 0,
    explanationEn: 'Cisco switches provide microsegmentation: each port is its own dedicated Collision Domain (operating in Full Duplex). However, by default without VLANs, all switch ports belong to a single Broadcast Domain.',
    explanationAr: 'توفر مبدلات سيسكو تجزئة دقيقة: كل منفذ يعتبر نطاق تصادم مستقل تماماً (Collision Domain) مع دعم Full Duplex. بينما تشترك جميع منافذ المبدل تلقائياً في نطاق بث واحد (Broadcast Domain) ما لم يتم تقسيمها لشبكات VLAN.'
  },
  {
    id: 'q2',
    ciscoTermTopic: 'Router / Default Gateway',
    questionEn: 'What command in Cisco IOS is required to enable an administratively shutdown interface?',
    questionAr: 'ما هو الأمر المستخدم في نظام Cisco IOS لتفعيل منفذ معطل إدارياً (Administratively Down)؟',
    optionsEn: [
      'no shutdown',
      'port enable',
      'interface activate',
      'ip up'
    ],
    optionsAr: [
      'no shutdown',
      'port enable',
      'interface activate',
      'ip up'
    ],
    correctIndex: 0,
    explanationEn: 'Cisco router interfaces default to "shutdown" status. To bring the line protocol up, an administrator enters interface configuration mode and executes the "no shutdown" command.',
    explanationAr: 'تكون منافذ موجهات سيسكو في حالة إيقاف تلقائية (shutdown). ولتفعيل المنفذ ورفع حالة البروتوكول إلى Up، يدخل المهندس لوضع المنفذ ويكتب أمر "no shutdown".'
  },
  {
    id: 'q3',
    ciscoTermTopic: 'IP Address / Subnet Mask',
    questionEn: 'Given the IP address 192.168.1.130 with subnet mask 255.255.255.192 (/26), what is the valid Subnet (Network) ID?',
    questionAr: 'إذا كان عنوان الجهاز 192.168.1.130 مع قناع الشبكة 255.255.255.192 (/26)، فما هو عنوان الشبكة (Network ID) الصحيح؟',
    optionsEn: [
      '192.168.1.128',
      '192.168.1.0',
      '192.168.1.64',
      '192.168.1.192'
    ],
    optionsAr: [
      '192.168.1.128',
      '192.168.1.0',
      '192.168.1.64',
      '192.168.1.192'
    ],
    correctIndex: 0,
    explanationEn: 'Subnet mask 255.255.255.192 has a block size of 256 - 192 = 64. The subnets are .0, .64, .128, .192. Since 130 falls between 128 and 191, the Network ID is 192.168.1.128.',
    explanationAr: 'قناع الشبكة 255.255.255.192 يعطي حجم كتلة (Block Size) مقداره 256 - 192 = 64. الشبكات الفرعية هي .0 و .64 و .128 و .192. وبما أن 130 يقع بين 128 و 191، فإن عنوان الشبكة هو 192.168.1.128.'
  },
  {
    id: 'q4',
    ciscoTermTopic: 'VLAN / 802.1Q',
    questionEn: 'Which port mode should be configured on a switch port connecting one Cisco switch to another switch carrying multiple VLANs?',
    questionAr: 'ما هو النمط (Mode) الذي يجب ضبطه على منفذ المبدل المتصل بمبدل آخر لنقل حركة عدة شبكات VLAN في سيسكو؟',
    optionsEn: [
      'switchport mode trunk',
      'switchport mode access',
      'switchport mode dynamic auto',
      'switchport mode routing'
    ],
    optionsAr: [
      'switchport mode trunk',
      'switchport mode access',
      'switchport mode dynamic auto',
      'switchport mode routing'
    ],
    correctIndex: 0,
    explanationEn: 'Trunk ports use IEEE 802.1Q tagging to multiplex frames from multiple VLANs over a single link between switches.',
    explanationAr: 'تُضبط منافذ الربط بين المبدلات كـ Trunk باستخدام أمر "switchport mode trunk" حيث يتم وسم كل إطار برقم الـ VLAN المقابل عبر معيار IEEE 802.1Q.'
  },
  {
    id: 'q5',
    ciscoTermTopic: 'DHCP / Protocol Ports',
    questionEn: 'What is the correct four-step handshake sequence for DHCP IPv4 automatic address assignment?',
    questionAr: 'ما هو الترتيب الصحيح للمراحل الأربع لعملية المصافحة في بروتوكول DHCP لتعيين عنوان IPv4 تلقائياً؟',
    optionsEn: [
      'Discover -> Offer -> Request -> Acknowledge (DORA)',
      'Request -> Offer -> Discover -> Acknowledge (RODA)',
      'Discover -> Request -> Offer -> Acknowledge (DROA)',
      'Offer -> Discover -> Acknowledge -> Request (ODAR)'
    ],
    optionsAr: [
      'Discover -> Offer -> Request -> Acknowledge (DORA)',
      'Request -> Offer -> Discover -> Acknowledge (RODA)',
      'Discover -> Request -> Offer -> Acknowledge (DROA)',
      'Offer -> Discover -> Acknowledge -> Request (ODAR)'
    ],
    correctIndex: 0,
    explanationEn: 'The client broadcasts a DHCP Discover, the server replies with DHCP Offer, the client responds with DHCP Request, and the server finalizes with DHCP Acknowledge (DORA).',
    explanationAr: 'تبدأ العملية ببث العميل لرسالة Discover، ثم يقدم الخادم عرض IP (Offer)، ثم يطلب العميل حجز العنوان (Request)، ويختم الخادم بتأكيد التأجير (Acknowledge)، وتعرف اختصاراً بـ DORA.'
  }
];

export const CISCO_GLOSSARY: CiscoGlossaryEntry[] = [
  {
    term: 'Router',
    pronunciationAr: 'الموجّه',
    layer: 'Layer 3',
    definitionEn: 'A network hardware device that forwards data packets between computer networks based on IP addresses and routing tables.',
    definitionAr: 'جهاز شبكي يعمل في الطبقة الثالثة (Layer 3) لتوجيه حزم البيانات بين الشبكات المختلفة واختيار أفضل مسار بناءً على جداول التوجيه.',
    exampleCommand: 'show ip route'
  },
  {
    term: 'Switch',
    pronunciationAr: 'المبدّل',
    layer: 'Layer 2',
    definitionEn: 'A multiport network bridge that connects devices together on a computer network by using packet switching to receive and forward data at the data link layer.',
    definitionAr: 'جهاز شبكي يربط الأجهزة في نفس الشبكة المحلية (LAN) ويمرر الإطارات بسرعة بناءً على جدول عناوين MAC في طبقة ربط البيانات.',
    exampleCommand: 'show mac address-table'
  },
  {
    term: 'Hub',
    pronunciationAr: 'الموزّع',
    layer: 'Layer 1',
    definitionEn: 'A legacy physical layer device that repeats incoming bits across all ports, causing high collision rates.',
    definitionAr: 'جهاز قديم يعمل في الطبقة الأولى (Layer 1) يعيد إرسال كل إشارة كهربائية إلى جميع المنافذ مما يسبب تصادمات متكررة في الشبكة.'
  },
  {
    term: 'Firewall',
    pronunciationAr: 'جدار الحماية',
    layer: 'Layer 3',
    definitionEn: 'A security device that monitors and filters incoming and outgoing network traffic based on an organization’s previously established security policies.',
    definitionAr: 'جهاز أو نظام أمني يفحص حركة المرور الواردة والصادرة ويسمح بها أو يحظرها طبقاً لقواعد الأمان وقوائم التحكم بالوصول (ACLs).'
  },
  {
    term: 'Access Point',
    pronunciationAr: 'نقطة الوصول اللاسلكية',
    layer: 'Layer 2',
    definitionEn: 'A networking hardware device that allows other Wi-Fi devices to connect to a wired network.',
    definitionAr: 'جهاز شبكي يتيح للأجهزة اللاسلكية (Wi-Fi) الاتصال بالشبكة السلكية وتوسيع نطاق التغطية اللاسلكية.'
  },
  {
    term: 'Server',
    pronunciationAr: 'الخادم',
    layer: 'Layer 7',
    definitionEn: 'A dedicated computer system that provides functionality, resources, and services (HTTP, DHCP, DNS, FTP) to client devices.',
    definitionAr: 'حاسوب مخصص يقدم خدمات وموارد مركزية للأجهزة المتصلة مثل تصفح الويب (HTTP) وتوزيع العناوين (DHCP) وترجمة النطاقات (DNS).'
  },
  {
    term: 'CLI',
    pronunciationAr: 'واجهة سطر الأوامر',
    layer: 'Management',
    definitionEn: 'Command Line Interface: The text-based shell used to configure and monitor Cisco IOS network devices.',
    definitionAr: 'واجهة تفاعلية نصية مخصصة لإدخال أوامر الضبط والمراقبة لأجهزة Cisco عبر نظام التشغيل Cisco IOS.',
    exampleCommand: 'configure terminal'
  },
  {
    term: 'VLAN',
    pronunciationAr: 'الشبكة الافتراضية',
    layer: 'Layer 2',
    definitionEn: 'Virtual Local Area Network: Any broadcast domain that is partitioned and isolated in a computer network at the data link layer.',
    definitionAr: 'تقسيم منطقي للمبدل إلى شبكات محلية افتراضية معزولة لتقليل حركة البث وزيادة الأمان وتسهيل الإدارة.',
    exampleCommand: 'vlan 10'
  },
  {
    term: 'OSPF',
    pronunciationAr: 'بروتوكول أقصر مسار أولاً',
    layer: 'Layer 3',
    definitionEn: 'Open Shortest Path First: A standard link-state routing protocol using Dijkstra’s algorithm to calculate the best path.',
    definitionAr: 'بروتوكول توجيه ديناميكي قياسي يعتمد على حالة الارتباط وخوارزمية ديكسترا لتحديد المسار الأقصر والأسرع.',
    exampleCommand: 'router ospf 1'
  },
  {
    term: 'DHCP',
    pronunciationAr: 'بروتوكول التهيئة التلقائية',
    layer: 'Layer 7',
    definitionEn: 'Dynamic Host Configuration Protocol: Automatically assigns IP addresses, default gateways, and DNS settings to hosts.',
    definitionAr: 'بروتوكول يمنح أجهزة الشبكة عناوين IP وأقنعة الشبكات الفرعية والبوابات الافتراضية تلقائياً دون تدخل يدوي.',
    exampleCommand: 'ip dhcp pool LAN'
  },
  {
    term: 'DNS',
    pronunciationAr: 'نظام أسماء النطاقات',
    layer: 'Layer 7',
    definitionEn: 'Domain Name System: The hierarchical database translating human-readable domain names into numerical IP addresses.',
    definitionAr: 'دليل هرمي موزع يترجم أسماء النطاقات السهلة (مثل cisco.com) إلى عناوين IP الرقمية لتتمكن الأجهزة من الاتصال بها.'
  },
  {
    term: 'Ping',
    pronunciationAr: 'أداة فحص الاتصال',
    layer: 'Layer 3',
    definitionEn: 'A network administration utility used to test the reachability of a host on an IP network using ICMP Echo requests.',
    definitionAr: 'أداة أساسية لفحص الاتصال والتأكد من إمكانية الوصول إلى جهاز معين عبر إرسال رسائل ICMP Echo وقياس زمن الاستجابة.',
    exampleCommand: 'ping 192.168.1.1'
  },
  {
    term: 'FastEthernet',
    pronunciationAr: 'إيثرنت سريع',
    layer: 'Layer 1',
    definitionEn: 'An Ethernet physical standard that carries traffic at the nominal rate of 100 Megabits per second (100BASE-TX).',
    definitionAr: 'معيار إيثرنت سلكي لنقل البيانات بسرعة 100 ميجابت في الثانية عبر كابلات الأزواج الملتوية RJ-45.'
  },
  {
    term: 'GigabitEthernet',
    pronunciationAr: 'إيثرنت جيجابت',
    layer: 'Layer 1',
    definitionEn: 'An Ethernet physical standard that transmits traffic at a rate of 1 Gigabit per second (1000BASE-T or 1000BASE-LX).',
    definitionAr: 'معيار إيثرنت فائق السرعة ينقل البيانات بمعدل 1000 ميجابت (1 جيجابت) في الثانية عبر النحاس أو الألياف الضوئية.'
  },
  {
    term: 'Serial',
    pronunciationAr: 'المنفذ التسلسلي',
    layer: 'Layer 1',
    definitionEn: 'A point-to-point physical connection commonly used in WAN links connecting enterprise branch routers.',
    definitionAr: 'منفذ تسلسلي نقطة لنقطة (Point-to-Point) يُستخدم تقليدياً لربط فروع الشركات عبر شبكات WAN الواسعة.'
  },
  {
    term: 'Console',
    pronunciationAr: 'منفذ التحكم المباشر',
    layer: 'Management',
    definitionEn: 'A dedicated physical serial management port used by administrators for out-of-band initial configuration of Cisco gear.',
    definitionAr: 'منفذ إدارة مادي مباشر مخصص لربط حاسوب المهندس بجهاز Cisco عبر كابل Console أزرق للتهيئة الأولية دون الحاجة لشبكة.'
  }
];

export const SAMPLE_TOPOLOGIES: SampleTopology[] = [
  {
    id: 'sample-lan-basic',
    titleEn: 'Basic 2-PC LAN with Cisco Catalyst 2960',
    titleAr: 'شبكة LAN أساسية بجهازين ومبدل سيسكو 2960',
    descriptionEn: 'Starter CCNA lab: Two desktop computers connected via copper straight-through cables to a central 2960 Switch.',
    descriptionAr: 'مختبر CCNA للمبتدئين: حاسوبان متصلان بكابلات إيثرنت مستقيمة بمبدل مركزي Cisco 2960 لفحص تبادل حزم Ping.',
    deviceCount: 3,
    connectionCount: 2,
    category: 'LAN',
    buildDevices: () => {
      const swModel = PACKET_TRACER_MODELS.find(m => m.id === 'switch-2960')!;
      const pcModel = PACKET_TRACER_MODELS.find(m => m.id === 'pc-generic')!;

      const switchDev: PlacedDevice = {
        id: 'dev-sw0',
        modelId: swModel.id,
        name: 'Switch0',
        x: 440,
        y: 200,
        iconType: swModel.iconType,
        ports: JSON.parse(JSON.stringify(swModel.defaultPorts)),
        config: createDefaultConfig('Switch0', 'switches')
      };

      const pc0: PlacedDevice = {
        id: 'dev-pc0',
        modelId: pcModel.id,
        name: 'PC0',
        x: 220,
        y: 360,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.10', subnetMask: '255.255.255.0', isUp: true, macAddress: '00E0.F725.A101' }
        ],
        config: {
          ...createDefaultConfig('PC0', 'end_devices'),
          defaultGateway: '192.168.1.1'
        }
      };

      const pc1: PlacedDevice = {
        id: 'dev-pc1',
        modelId: pcModel.id,
        name: 'PC1',
        x: 660,
        y: 360,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.20', subnetMask: '255.255.255.0', isUp: true, macAddress: '00E0.F725.A102' }
        ],
        config: {
          ...createDefaultConfig('PC1', 'end_devices'),
          defaultGateway: '192.168.1.1'
        }
      };

      const connections: PlacedConnection[] = [
        {
          id: 'conn-pc0-sw',
          cableType: 'conn-straight',
          fromDeviceId: pc0.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/1'
        },
        {
          id: 'conn-pc1-sw',
          cableType: 'conn-straight',
          fromDeviceId: pc1.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/2'
        }
      ];

      return { devices: [switchDev, pc0, pc1], connections };
    }
  },
  {
    id: 'sample-office-network',
    titleEn: 'Small Office Network with Cisco Router 2911',
    titleAr: 'شبكة مكتب متكاملة مع راوتر سيسكو 2911 ومبدل',
    descriptionEn: 'Full branch office topology: Cisco 2911 Router serving as Default Gateway for local PCs through a Catalyst Switch.',
    descriptionAr: 'طوبولوجيا مكتبية كاملة: راوتر Cisco 2911 يعمل كبوابة افتراضية لحواسيب المكتب المتصلة بالمبدل.',
    deviceCount: 4,
    connectionCount: 3,
    category: 'LAN',
    buildDevices: () => {
      const rModel = PACKET_TRACER_MODELS.find(m => m.id === 'router-2911')!;
      const swModel = PACKET_TRACER_MODELS.find(m => m.id === 'switch-2960')!;
      const pcModel = PACKET_TRACER_MODELS.find(m => m.id === 'pc-generic')!;

      const routerDev: PlacedDevice = {
        id: 'dev-r0',
        modelId: rModel.id,
        name: 'Router0',
        x: 440,
        y: 110,
        iconType: rModel.iconType,
        ports: JSON.parse(JSON.stringify(rModel.defaultPorts)),
        config: createDefaultConfig('Router0', 'routers')
      };

      const switchDev: PlacedDevice = {
        id: 'dev-sw0',
        modelId: swModel.id,
        name: 'Switch0',
        x: 440,
        y: 260,
        iconType: swModel.iconType,
        ports: JSON.parse(JSON.stringify(swModel.defaultPorts)),
        config: createDefaultConfig('Switch0', 'switches')
      };

      const pc0: PlacedDevice = {
        id: 'dev-pc0',
        modelId: pcModel.id,
        name: 'PC0',
        x: 240,
        y: 410,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.10', subnetMask: '255.255.255.0', isUp: true, macAddress: '0002.1643.0010' }
        ],
        config: {
          ...createDefaultConfig('PC0', 'end_devices'),
          defaultGateway: '192.168.1.1'
        }
      };

      const pc1: PlacedDevice = {
        id: 'dev-pc1',
        modelId: pcModel.id,
        name: 'PC1',
        x: 640,
        y: 410,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.20', subnetMask: '255.255.255.0', isUp: true, macAddress: '0002.1643.0020' }
        ],
        config: {
          ...createDefaultConfig('PC1', 'end_devices'),
          defaultGateway: '192.168.1.1'
        }
      };

      const connections: PlacedConnection[] = [
        {
          id: 'conn-r-sw',
          cableType: 'conn-straight',
          fromDeviceId: routerDev.id,
          fromPortId: 'Gig0/0',
          toDeviceId: switchDev.id,
          toPortId: 'Gig0/1'
        },
        {
          id: 'conn-pc0-sw',
          cableType: 'conn-straight',
          fromDeviceId: pc0.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/1'
        },
        {
          id: 'conn-pc1-sw',
          cableType: 'conn-straight',
          fromDeviceId: pc1.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/2'
        }
      ];

      return { devices: [routerDev, switchDev, pc0, pc1], connections };
    }
  },
  {
    id: 'sample-server-lab',
    titleEn: 'Enterprise Client-Server (DHCP & Web DNS)',
    titleAr: 'شبكة خادم وعميل (خدمات DHCP وخادم الويب وDNS)',
    descriptionEn: 'Centralized Cisco Server hosting Web (HTTP), DNS, and DHCP services to dynamic clients.',
    descriptionAr: 'شبكة مؤسسية بخادم مركزي يقدم خدمات الويب وDNS وتوزيع عناوين DHCP للحواسيب التلقائية.',
    deviceCount: 4,
    connectionCount: 3,
    category: 'Server',
    buildDevices: () => {
      const srvModel = PACKET_TRACER_MODELS.find(m => m.id === 'server-generic')!;
      const swModel = PACKET_TRACER_MODELS.find(m => m.id === 'switch-2960')!;
      const pcModel = PACKET_TRACER_MODELS.find(m => m.id === 'pc-generic')!;

      const serverDev: PlacedDevice = {
        id: 'dev-srv0',
        modelId: srvModel.id,
        name: 'Server-PT',
        x: 440,
        y: 110,
        iconType: srvModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.100', subnetMask: '255.255.255.0', isUp: true, macAddress: '0060.5C32.0001' }
        ],
        config: {
          ...createDefaultConfig('Server-PT', 'servers'),
          services: {
            ...createDefaultConfig('Server-PT', 'servers').services,
            dhcp: {
              enabled: true,
              poolName: 'OFFICE-POOL',
              gateway: '192.168.1.1',
              dns: '192.168.1.100',
              startIp: '192.168.1.10',
              subnetMask: '255.255.255.0',
              maxUsers: 50
            },
            dns: {
              enabled: true,
              records: [
                { name: 'cisco.com', type: 'A', address: '192.168.1.100' },
                { name: 'netpulse.lab', type: 'A', address: '192.168.1.100' }
              ]
            },
            http: {
              enabled: true,
              httpsEnabled: true,
              htmlContent: '<html><head><title>Cisco Academy</title></head><body><h1>Welcome to NetPulse Cisco Lab!</h1><p>HTTP and DNS services operating normally.</p></body></html>'
            }
          }
        }
      };

      const switchDev: PlacedDevice = {
        id: 'dev-sw0',
        modelId: swModel.id,
        name: 'Switch0',
        x: 440,
        y: 260,
        iconType: swModel.iconType,
        ports: JSON.parse(JSON.stringify(swModel.defaultPorts)),
        config: createDefaultConfig('Switch0', 'switches')
      };

      const pc0: PlacedDevice = {
        id: 'dev-pc0',
        modelId: pcModel.id,
        name: 'PC-Finance',
        x: 230,
        y: 410,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.10', subnetMask: '255.255.255.0', isUp: true, macAddress: '00E0.F780.0010' }
        ],
        config: {
          ...createDefaultConfig('PC-Finance', 'end_devices'),
          defaultGateway: '192.168.1.1',
          dnsServer: '192.168.1.100'
        }
      };

      const pc1: PlacedDevice = {
        id: 'dev-pc1',
        modelId: pcModel.id,
        name: 'PC-Marketing',
        x: 650,
        y: 410,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.1.11', subnetMask: '255.255.255.0', isUp: true, macAddress: '00E0.F780.0011' }
        ],
        config: {
          ...createDefaultConfig('PC-Marketing', 'end_devices'),
          defaultGateway: '192.168.1.1',
          dnsServer: '192.168.1.100'
        }
      };

      const connections: PlacedConnection[] = [
        {
          id: 'conn-srv-sw',
          cableType: 'conn-straight',
          fromDeviceId: serverDev.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/24'
        },
        {
          id: 'conn-pc0-sw',
          cableType: 'conn-straight',
          fromDeviceId: pc0.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/1'
        },
        {
          id: 'conn-pc1-sw',
          cableType: 'conn-straight',
          fromDeviceId: pc1.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/2'
        }
      ];

      return { devices: [serverDev, switchDev, pc0, pc1], connections };
    }
  },
  {
    id: 'sample-vlan-stick',
    titleEn: 'Router-on-a-Stick Inter-VLAN Routing',
    titleAr: 'التوجيه بين شبكات VLAN عبر الراوتر (Router-on-a-Stick)',
    descriptionEn: 'Segmented VLAN 10 (Sales) and VLAN 20 (Engineering) routed via 802.1Q sub-interfaces on Cisco 2911.',
    descriptionAr: 'شبكتان معزولتان VLAN 10 و VLAN 20 يتم التوجيه بينهما عبر راوتر سيسكو 2911 باستخدام معيار 802.1Q.',
    deviceCount: 4,
    connectionCount: 3,
    category: 'VLAN',
    buildDevices: () => {
      const rModel = PACKET_TRACER_MODELS.find(m => m.id === 'router-2911')!;
      const swModel = PACKET_TRACER_MODELS.find(m => m.id === 'switch-2960')!;
      const pcModel = PACKET_TRACER_MODELS.find(m => m.id === 'pc-generic')!;

      const routerDev: PlacedDevice = {
        id: 'dev-r0',
        modelId: rModel.id,
        name: 'Router0',
        x: 440,
        y: 110,
        iconType: rModel.iconType,
        ports: JSON.parse(JSON.stringify(rModel.defaultPorts)),
        config: createDefaultConfig('Router0', 'routers')
      };

      const switchDev: PlacedDevice = {
        id: 'dev-sw0',
        modelId: swModel.id,
        name: 'Switch0',
        x: 440,
        y: 260,
        iconType: swModel.iconType,
        ports: JSON.parse(JSON.stringify(swModel.defaultPorts)),
        config: {
          ...createDefaultConfig('Switch0', 'switches'),
          vlans: [
            { id: 1, name: 'default' },
            { id: 10, name: 'SALES' },
            { id: 20, name: 'ENGINEERING' }
          ]
        }
      };

      const pcSales: PlacedDevice = {
        id: 'dev-pc-sales',
        modelId: pcModel.id,
        name: 'PC-Sales',
        x: 230,
        y: 410,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.10.5', subnetMask: '255.255.255.0', isUp: true, vlanId: 10 }
        ],
        config: {
          ...createDefaultConfig('PC-Sales', 'end_devices'),
          defaultGateway: '192.168.10.1'
        }
      };

      const pcEng: PlacedDevice = {
        id: 'dev-pc-eng',
        modelId: pcModel.id,
        name: 'PC-Eng',
        x: 650,
        y: 410,
        iconType: pcModel.iconType,
        ports: [
          { id: 'Fa0', name: 'FastEthernet0', type: 'Ethernet', ipAddress: '192.168.20.5', subnetMask: '255.255.255.0', isUp: true, vlanId: 20 }
        ],
        config: {
          ...createDefaultConfig('PC-Eng', 'end_devices'),
          defaultGateway: '192.168.20.1'
        }
      };

      const connections: PlacedConnection[] = [
        {
          id: 'conn-trunk',
          cableType: 'conn-straight',
          fromDeviceId: routerDev.id,
          fromPortId: 'Gig0/0',
          toDeviceId: switchDev.id,
          toPortId: 'Gig0/1'
        },
        {
          id: 'conn-sales',
          cableType: 'conn-straight',
          fromDeviceId: pcSales.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/1'
        },
        {
          id: 'conn-eng',
          cableType: 'conn-straight',
          fromDeviceId: pcEng.id,
          fromPortId: 'Fa0',
          toDeviceId: switchDev.id,
          toPortId: 'Fa0/2'
        }
      ];

      return { devices: [routerDev, switchDev, pcSales, pcEng], connections };
    }
  }
];
