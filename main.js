(function () {
  "use strict";

  // Device/performance constants.
  const MOBILE_QUERY = "(max-width: 760px)";
  const LOW_POWER_CPU_CORES = 4;
  const DESKTOP_SEGMENTS = 160;
  const MOBILE_SEGMENTS = 112;
  const DESKTOP_SPHERE_SEGMENTS = 32;
  const MOBILE_SPHERE_SEGMENTS = 24;

  // UI constants.
  const HUD_ID = "hudLabel";
  const HUD_HIDDEN_CLASS = "is-hidden";
  const HUD_DEFAULT_TEXT = "☀️ Hiro marker · switch systems · tap planets or ships for info";
  const HUD_LOST_TEXT = "Searching for the Hiro marker";
  const HUD_HIDE_DELAY_MS = 2800;
  const SUPPORT_MESSAGE_TEXT = "Camera AR needs a browser with WebRTC camera support. Use HTTPS or localhost if your browser blocks camera access.";
  const LOCALHOST_NAMES = ["localhost", "127.0.0.1", "::1"];
  let currentLanguage = "ar";
  const I18N = {
    en: {
      pageTitle: "AR Planetary System Visualizer",
      loadingText: "Starting AR camera...",
      loadingHint: "If your browser asks, allow camera access.",
      onboardingTitle: "Welcome, space explorer!",
      onboardingIntro: "Point your camera at the printed Hiro marker to see a planetary system appear in 3D.",
      onboardingStep1: "<strong>Print the marker.</strong> Tap the button below to download. Plain paper, any size - bigger is easier.",
      onboardingStep2: "<strong>Place it flat</strong> on a desk in good light, with white space around the black border.",
      onboardingStep3: "<strong>Point your camera</strong> at the marker. The 3D model appears on top!",
      onboardingMarkerTag: "Solar & Tau Ceti",
      onboardingMarkerName: "Hiro marker",
      onboardingMarkerDownload: "Download",
      onboardingTip: "Tip: Tap a planet or ship for fun facts. Drag to move it around. Pinch to zoom. Use the button to switch systems.",
      onboardingClose: "Got it - let's go!",
      hudDefault: "☀️ Hiro marker · drag to move · pinch to zoom · tap planets or ships for info",
      hudLost: "Searching for the Hiro marker",
      markerLostPersistent: "Marker out of view · system stays put. Drag, pinch & tap still work.",
      supportMessage: "Camera AR needs a browser with WebRTC camera support. Use HTTPS or localhost if your browser blocks camera access.",
      dependencyMessage: "AR libraries did not load. Check your internet connection, then refresh the page.",
      systemSwitchAria: "Switch planetary system",
      helpAria: "Show how-to instructions",
      languageButton: "العربية",
      languageAria: "Switch to Arabic",
      solarLabel: "Solar System",
      tauCetiLabel: "Tau Ceti",
      solarFound: "Solar System · tap planets for info",
      tauFound: "Tau Ceti System · tap planets or ships for info",
      closeInfo: "Close info",
      speak: "Speak",
      stop: "Stop",
      noVoice: "No voice",
      speakAria: "Read info out loud",
      stopAria: "Stop reading",
      quiz: "Quiz",
      restartQuiz: "Restart quiz",
      close: "Close",
      diameter: "Diameter",
      distance: "Distance",
      yearLength: "Year length",
      dayLength: "Day length",
      moons: "Moons",
      quizDiameter: "Diameter?",
      quizDistance: "Distance?",
      quizYearLength: "Year length?",
      quizDayLength: "Day length?",
      quizMoons: "Moons?",
      quizName: "Which one?",
      quizProgress: (current, total) => `Question ${current} of ${total}`,
      quizEmpty: "No quiz for this one yet.",
      quizPerfect: "Perfect score.",
      quizRetry: "Nice try. Tap Restart quiz to try again.",
      leaderboard: "Leaderboard",
      leaderboardAria: "Open leaderboard",
      leaderboardTitle: "Mission Leaderboard",
      leaderboardCloseAria: "Close leaderboard",
      leaderboardEmpty: "No scores saved yet. Complete a quiz to start the board.",
      leaderboardClear: "Clear",
      leaderboardClearAria: "Clear leaderboard",
      leaderboardClearConfirm: "Clear all saved leaderboard scores?",
      leaderboardRank: "Rank",
      leaderboardPlayer: "Student",
      leaderboardScore: "Score",
      leaderboardBody: "Body",
      leaderboardSystem: "System",
      leaderboardAccuracy: "Accuracy",
      leaderboardDate: "Date",
      leaderboardBest: "Best score",
      leaderboardQuizzes: "Quizzes",
      leaderboardCorrect: "Correct",
      leaderboardAverage: "Accuracy",
      scoreBreakdown: "Mission score",
      scoreCorrect: "Correct answers",
      scoreFastBonus: "Fast bonus",
      scoreStreakBonus: "Streak bonus",
      scorePerfectBonus: "Perfect bonus",
      scoreTotal: "Total",
      saveScoreTitle: "Save to leaderboard",
      playerNameLabel: "Student name",
      playerNamePlaceholder: "Type your name",
      playerNameRequired: "Enter a name first",
      saveScore: "Save score",
      scoreSaved: "Score saved.",
      pointsUnit: (points) => `${points} pts`,
      quizScoreHud: (score) => `Mission score: ${score} points`,
      exportCsv: "Export CSV",
      exportCsvAria: "Export leaderboard as CSV",
      missionControl: "Mission Control",
      missionControlAria: "Open mission control dashboard",
      missionControlTitle: "Mission Control",
      missionCloseAria: "Close mission control",
      lessonButton: "Start Journey",
      lessonButtonAria: "Start guided learning journey",
      tabLesson: "Journey",
      tabOverview: "Overview",
      tabProject: "Project",
      tabMissions: "Missions",
      tabBadges: "Badges",
      tabCompare: "Compare",
      tabSimulator: "Simulator",
      tabLearn: "Learn",
      progressDiscovered: "Discovered",
      progressQuizzes: "Quizzes",
      progressAccuracy: "Accuracy",
      progressBadges: "Badges",
      progressMissions: "Missions",
      progressSaved: "Saved scores",
      lessonTitle: "Guided Space Journey",
      lessonSubtitle: "A focused path for a classroom demo: set up AR, explore, compare, simulate, then prove learning.",
      lessonProgressLabel: "Journey readiness",
      lessonStepExploreTitle: "1. Anchor the system",
      lessonStepExploreText: "Use the Hiro marker, tap Earth or Mars, and build the first spatial connection.",
      lessonStepMissionTitle: "2. Complete a mission",
      lessonStepMissionText: "Follow the Solar Scout or Tau Ceti Researcher checklist to turn exploration into a task.",
      lessonStepCompareTitle: "3. Compare worlds",
      lessonStepCompareText: "Use side-by-side metrics to explain scale, distance, days, years, and moons.",
      lessonStepSimTitle: "4. Connect to real missions",
      lessonStepSimText: "Open mission simulations and source links to ground the AR scene in current space exploration.",
      lessonActionExplore: "Explore AR",
      lessonActionMissions: "Open missions",
      lessonActionCompare: "Compare bodies",
      lessonActionSim: "Run simulator",
      lessonActionLearn: "View sources",
      lessonStatusReady: "Ready",
      lessonStatusNext: "Next",
      lessonStatusDone: "Done",
      missionClaim: "Claim",
      missionClaimed: "Completed",
      missionBonus: (points) => `${points} mission bonus points`,
      missionSolarTitle: "Solar Scout",
      missionSolarText: "Identify key Solar System bodies and finish a quiz.",
      missionTauTitle: "Tau Ceti Researcher",
      missionTauText: "Explore the exoplanet system and the Hail Mary mission objects.",
      missionClassTitle: "Classroom Champion",
      missionClassText: "Show mastery by saving a strong quiz result.",
      missionStepEarth: "Discover Earth",
      missionStepMars: "Discover Mars",
      missionStepSolarQuiz: "Complete a Solar System quiz",
      missionStepTauE: "Discover Tau Ceti e",
      missionStepHailMary: "Discover Hail Mary",
      missionStepTauQuiz: "Complete a Tau Ceti quiz",
      missionStepPerfect: "Earn a perfect quiz",
      missionStepSave: "Save one leaderboard score",
      missionStepDiscoverEight: "Discover 8 objects",
      badgePlanetExplorer: "Planet Explorer",
      badgePlanetExplorerDesc: "Discover 5 different objects.",
      badgeSolarExpert: "Solar Expert",
      badgeSolarExpertDesc: "Complete a Solar System quiz.",
      badgeTauResearcher: "Tau Ceti Researcher",
      badgeTauResearcherDesc: "Complete a Tau Ceti quiz.",
      badgePerfectMission: "Perfect Mission",
      badgePerfectMissionDesc: "Get every question right in one quiz.",
      badgeFastThinker: "Fast Thinker",
      badgeFastThinkerDesc: "Earn a fast-answer bonus.",
      badgeMissionCommander: "Mission Commander",
      badgeMissionCommanderDesc: "Complete one guided mission.",
      noBadgesYet: "No badges yet. Start exploring and answering quizzes.",
      compareFirst: "First object",
      compareSecond: "Second object",
      compareMetric: "Metric",
      compareValueA: "Object A",
      compareValueB: "Object B",
      compareSystem: "System",
      simulatorMission: "Mission",
      simulatorVehicle: "Vehicle",
      simulatorStatus: "Status",
      simArtemisTitle: "Artemis II Lunar Flyby",
      simArtemisBody: "NASA launched Artemis II on April 1, 2026, sending four astronauts on a crewed lunar flyby.",
      simArtemisVehicle: "SLS / Orion",
      simArtemisStatus: "Crewed lunar flyby",
      simImapTitle: "IMAP Heliosphere Mapper",
      simImapBody: "IMAP began its primary science mission on Feb. 1, 2026, mapping the heliosphere boundary.",
      simImapVehicle: "IMAP observatory",
      simImapStatus: "Active science mission",
      simSpherexTitle: "SPHEREx + PUNCH Launch",
      simSpherexBody: "SPHEREx and PUNCH launched together on March 11, 2025, to study cosmic history and the solar wind.",
      simSpherexVehicle: "Falcon 9 rideshare",
      simSpherexStatus: "Active observatories",
      simBlueGhostTitle: "Blue Ghost Lunar Landing",
      simBlueGhostBody: "Firefly's Blue Ghost Mission 1 landed NASA payloads on the Moon on March 2, 2025.",
      simBlueGhostVehicle: "Commercial lunar lander",
      simBlueGhostStatus: "Lunar surface delivery",
      learningGoalsTitle: "Learning Goals",
      sourceTitle: "Research Sources",
      learningGoal1: "Recognize planets, exoplanets, ships, and mission routes in an AR scene.",
      learningGoal2: "Compare size, orbit, day length, year length, distance, and moons.",
      learningGoal3: "Use quiz score, accuracy, badges, and missions as measurable learning evidence.",
      learningGoal4: "Connect the model to current NASA missions and classroom assessment.",
      sourceArtemis: "NASA Artemis II mission",
      sourceImap: "NASA IMAP science mission",
      sourceSpherex: "NASA SPHEREx and PUNCH launch",
      sourceBlueGhost: "NASA Blue Ghost lunar landing",
      controlsAria: "Solar system controls",
      pauseButton: "⏸ Pause",
      playButton: "▶ Play",
      pauseAria: "Pause or play orbits",
      speedLabel: "Speed",
      speedAria: "Orbit speed multiplier",
      viewTitle: "3D View",
      tiltLabel: "Tilt",
      turnLabel: "Turn",
      rollLabel: "Roll",
      tiltAria: "Tilt view above and below",
      turnAria: "Turn view left and right",
      rollAria: "Roll the view angle",
      resetView: "Reset view",
      resetViewAria: "Reset 3D view, position and zoom",
      orbits: "Orbits",
      orbitsAria: "Toggle orbit rings",
      names: "Names",
      namesAria: "Toggle planet name labels",
      trueSize: "True size",
      trueSizeAria: "Toggle true relative size mode",
      calm: "Calm",
      calmAria: "Toggle reduced-motion calm mode",
      trueSizeOn: "True size on · planets are now to scale (orbits aren't!)",
      trueSizeOff: "True size off · stylized sizes for visibility"
    },
    ar: {
      pageTitle: "عارض النظام الكوكبي بالواقع المعزز",
      loadingText: "جارٍ تشغيل كاميرا الواقع المعزز...",
      loadingHint: "إذا طلب المتصفح الإذن، اسمح باستخدام الكاميرا.",
      onboardingTitle: "أهلًا يا مستكشف الفضاء!",
      onboardingIntro: "وجّه الكاميرا إلى علامة Hiro المطبوعة حتى يظهر النظام الكوكبي ثلاثي الأبعاد.",
      onboardingStep1: "<strong>اطبع العلامة.</strong> اضغط زر التحميل. ورق عادي يكفي، وكلما كبر الحجم كان أسهل.",
      onboardingStep2: "<strong>ضعها بشكل مسطح</strong> على طاولة بإضاءة جيدة، واترك مساحة بيضاء حول الإطار الأسود.",
      onboardingStep3: "<strong>وجّه الكاميرا</strong> نحو العلامة. سيظهر المجسم ثلاثي الأبعاد فوقها!",
      onboardingMarkerTag: "النظام الشمسي وتاو سيتي",
      onboardingMarkerName: "علامة Hiro",
      onboardingMarkerDownload: "تحميل",
      onboardingTip: "نصيحة: اضغط على كوكب أو سفينة لعرض معلومات ممتعة. اسحب للتحريك، واقرص للتكبير، واستخدم الزر لتبديل النظام.",
      onboardingClose: "فهمت، لنبدأ!",
      hudDefault: "☀️ علامة Hiro · اسحب للتحريك · اقرص للتكبير · اضغط على الكواكب أو السفن للمعلومات",
      hudLost: "جارٍ البحث عن علامة Hiro",
      markerLostPersistent: "العلامة خارج الكاميرا · النظام سيبقى ظاهرًا. اسحب أو كبّر أو اضغط كما تريد.",
      supportMessage: "الواقع المعزز يحتاج متصفحًا يدعم كاميرا WebRTC. استخدم HTTPS أو localhost إذا منع المتصفح تشغيل الكاميرا.",
      dependencyMessage: "لم يتم تحميل مكتبات الواقع المعزز. تحقق من اتصال الإنترنت ثم حدّث الصفحة.",
      systemSwitchAria: "تبديل النظام الكوكبي",
      helpAria: "عرض التعليمات",
      languageButton: "English",
      languageAria: "Switch to English",
      solarLabel: "النظام الشمسي",
      tauCetiLabel: "تاو سيتي",
      solarFound: "النظام الشمسي · اضغط على الكواكب للمعلومات",
      tauFound: "نظام تاو سيتي · اضغط على الكواكب أو السفن للمعلومات",
      closeInfo: "إغلاق المعلومات",
      speak: "استمع",
      stop: "إيقاف",
      noVoice: "لا يوجد صوت",
      speakAria: "قراءة المعلومات بصوت عالٍ",
      stopAria: "إيقاف القراءة",
      quiz: "اختبار",
      restartQuiz: "إعادة الاختبار",
      close: "إغلاق",
      diameter: "القطر",
      distance: "المسافة",
      yearLength: "مدة السنة",
      dayLength: "مدة اليوم",
      moons: "الأقمار",
      quizDiameter: "ما القطر؟",
      quizDistance: "ما المسافة؟",
      quizYearLength: "كم مدة السنة؟",
      quizDayLength: "كم مدة اليوم؟",
      quizMoons: "كم عدد الأقمار؟",
      quizName: "ما الاسم؟",
      quizProgress: (current, total) => `السؤال ${current} من ${total}`,
      quizEmpty: "لا يوجد اختبار لهذا الجسم بعد.",
      quizPerfect: "نتيجة كاملة!",
      quizRetry: "محاولة جيدة. اضغط إعادة الاختبار للمحاولة مرة أخرى.",
      leaderboard: "لوحة الصدارة",
      leaderboardAria: "فتح لوحة الصدارة",
      leaderboardTitle: "لوحة صدارة المهمات",
      leaderboardCloseAria: "إغلاق لوحة الصدارة",
      leaderboardEmpty: "لا توجد نتائج محفوظة بعد. أكمل اختبارًا لتبدأ اللوحة.",
      leaderboardClear: "مسح",
      leaderboardClearAria: "مسح لوحة الصدارة",
      leaderboardClearConfirm: "هل تريد مسح كل نتائج لوحة الصدارة؟",
      leaderboardRank: "الترتيب",
      leaderboardPlayer: "الطالب",
      leaderboardScore: "النقاط",
      leaderboardBody: "الجسم",
      leaderboardSystem: "النظام",
      leaderboardAccuracy: "الدقة",
      leaderboardDate: "التاريخ",
      leaderboardBest: "أفضل نتيجة",
      leaderboardQuizzes: "الاختبارات",
      leaderboardCorrect: "الصحيحة",
      leaderboardAverage: "الدقة",
      scoreBreakdown: "نتيجة المهمة",
      scoreCorrect: "الإجابات الصحيحة",
      scoreFastBonus: "مكافأة السرعة",
      scoreStreakBonus: "مكافأة التتابع",
      scorePerfectBonus: "مكافأة الكمال",
      scoreTotal: "المجموع",
      saveScoreTitle: "حفظ في لوحة الصدارة",
      playerNameLabel: "اسم الطالب",
      playerNamePlaceholder: "اكتب اسمك",
      playerNameRequired: "اكتب الاسم أولًا",
      saveScore: "حفظ النتيجة",
      scoreSaved: "تم حفظ النتيجة.",
      pointsUnit: (points) => `${points} نقطة`,
      quizScoreHud: (score) => `نتيجة المهمة: ${score} نقطة`,
      exportCsv: "تصدير CSV",
      exportCsvAria: "تصدير لوحة الصدارة كملف CSV",
      missionControl: "مركز المهمات",
      missionControlAria: "فتح لوحة مركز المهمات",
      missionControlTitle: "مركز المهمات",
      missionCloseAria: "إغلاق مركز المهمات",
      lessonButton: "ابدأ الرحلة",
      lessonButtonAria: "بدء الرحلة التعليمية الموجهة",
      tabLesson: "الرحلة",
      tabOverview: "نظرة عامة",
      tabProject: "المشروع",
      tabMissions: "المهمات",
      tabBadges: "الشارات",
      tabCompare: "المقارنة",
      tabSimulator: "المحاكي",
      tabLearn: "التعلم",
      progressDiscovered: "المكتشفة",
      progressQuizzes: "الاختبارات",
      progressAccuracy: "الدقة",
      progressBadges: "الشارات",
      progressMissions: "المهمات",
      progressSaved: "النتائج المحفوظة",
      lessonTitle: "رحلة فضائية موجهة",
      lessonSubtitle: "مسار واضح لعرض الصف: ابدأ بالواقع المعزز، استكشف، قارن، شغّل المحاكاة، ثم أثبت التعلم.",
      lessonProgressLabel: "جاهزية الرحلة",
      lessonStepExploreTitle: "1. ثبّت النظام",
      lessonStepExploreText: "استخدم علامة Hiro، واضغط على الأرض أو المريخ، وابنِ أول علاقة مكانية.",
      lessonStepMissionTitle: "2. أكمل مهمة",
      lessonStepMissionText: "اتبع قائمة كشاف النظام الشمسي أو باحث تاو سيتي لتحويل الاستكشاف إلى مهمة.",
      lessonStepCompareTitle: "3. قارن العوالم",
      lessonStepCompareText: "استخدم المقاييس جنبًا إلى جنب لشرح الحجم والمسافة واليوم والسنة والأقمار.",
      lessonStepSimTitle: "4. اربطها بمهمات حقيقية",
      lessonStepSimText: "افتح محاكاة المهمات وروابط المصادر لربط مشهد الواقع المعزز باستكشاف الفضاء الحالي.",
      lessonActionExplore: "استكشف AR",
      lessonActionMissions: "افتح المهمات",
      lessonActionCompare: "قارن الأجسام",
      lessonActionSim: "شغّل المحاكي",
      lessonActionLearn: "اعرض المصادر",
      lessonStatusReady: "جاهز",
      lessonStatusNext: "التالي",
      lessonStatusDone: "تم",
      missionClaim: "استلام",
      missionClaimed: "مكتملة",
      missionBonus: (points) => `${points} نقطة مكافأة مهمة`,
      missionSolarTitle: "كشاف النظام الشمسي",
      missionSolarText: "تعرّف على أجسام مهمة في النظام الشمسي وأنهِ اختبارًا.",
      missionTauTitle: "باحث تاو سيتي",
      missionTauText: "استكشف نظام الكواكب الخارجية وأجسام مهمة هيل ماري.",
      missionClassTitle: "بطل الصف",
      missionClassText: "أظهر إتقانك بحفظ نتيجة اختبار قوية.",
      missionStepEarth: "اكتشف الأرض",
      missionStepMars: "اكتشف المريخ",
      missionStepSolarQuiz: "أكمل اختبارًا في النظام الشمسي",
      missionStepTauE: "اكتشف تاو سيتي e",
      missionStepHailMary: "اكتشف هيل ماري",
      missionStepTauQuiz: "أكمل اختبارًا في تاو سيتي",
      missionStepPerfect: "احصل على نتيجة كاملة",
      missionStepSave: "احفظ نتيجة واحدة في لوحة الصدارة",
      missionStepDiscoverEight: "اكتشف 8 أجسام",
      badgePlanetExplorer: "مستكشف الكواكب",
      badgePlanetExplorerDesc: "اكتشف 5 أجسام مختلفة.",
      badgeSolarExpert: "خبير النظام الشمسي",
      badgeSolarExpertDesc: "أكمل اختبارًا في النظام الشمسي.",
      badgeTauResearcher: "باحث تاو سيتي",
      badgeTauResearcherDesc: "أكمل اختبارًا في نظام تاو سيتي.",
      badgePerfectMission: "مهمة كاملة",
      badgePerfectMissionDesc: "أجب عن كل الأسئلة بشكل صحيح في اختبار واحد.",
      badgeFastThinker: "سريع التفكير",
      badgeFastThinkerDesc: "احصل على مكافأة الإجابة السريعة.",
      badgeMissionCommander: "قائد المهمات",
      badgeMissionCommanderDesc: "أكمل مهمة موجهة واحدة.",
      noBadgesYet: "لا توجد شارات بعد. ابدأ بالاكتشاف وحل الاختبارات.",
      compareFirst: "الجسم الأول",
      compareSecond: "الجسم الثاني",
      compareMetric: "المعيار",
      compareValueA: "الجسم أ",
      compareValueB: "الجسم ب",
      compareSystem: "النظام",
      simulatorMission: "المهمة",
      simulatorVehicle: "المركبة",
      simulatorStatus: "الحالة",
      simArtemisTitle: "تحليق أرتميس II حول القمر",
      simArtemisBody: "أطلقت ناسا أرتميس II في 1 أبريل 2026، حاملة أربعة رواد في تحليق مأهول حول القمر.",
      simArtemisVehicle: "SLS / أوريون",
      simArtemisStatus: "تحليق مأهول حول القمر",
      simImapTitle: "مسبار IMAP للغلاف الشمسي",
      simImapBody: "بدأ IMAP مهمته العلمية الأساسية في 1 فبراير 2026 لرسم حدود الغلاف الشمسي.",
      simImapVehicle: "مرصد IMAP",
      simImapStatus: "مهمة علمية نشطة",
      simSpherexTitle: "إطلاق SPHEREx و PUNCH",
      simSpherexBody: "انطلق SPHEREx و PUNCH معًا في 11 مارس 2025 لدراسة تاريخ الكون والرياح الشمسية.",
      simSpherexVehicle: "رحلة مشتركة على فالكون 9",
      simSpherexStatus: "مراصد نشطة",
      simBlueGhostTitle: "هبوط Blue Ghost على القمر",
      simBlueGhostBody: "هبطت مهمة Blue Ghost 1 التابعة لشركة Firefly بحمولات ناسا على القمر في 2 مارس 2025.",
      simBlueGhostVehicle: "مركبة هبوط قمرية تجارية",
      simBlueGhostStatus: "توصيل إلى سطح القمر",
      learningGoalsTitle: "أهداف التعلم",
      sourceTitle: "مصادر البحث",
      learningGoal1: "التعرّف على الكواكب والكواكب الخارجية والسفن ومسارات المهمات في مشهد واقع معزز.",
      learningGoal2: "مقارنة الحجم والمدار وطول اليوم والسنة والمسافة والأقمار.",
      learningGoal3: "استخدام النتيجة والدقة والشارات والمهمات كدليل قابل للقياس على التعلم.",
      learningGoal4: "ربط النموذج بمهمات ناسا الحديثة والتقييم الصفي.",
      sourceArtemis: "مهمة أرتميس II من ناسا",
      sourceImap: "مهمة IMAP العلمية من ناسا",
      sourceSpherex: "إطلاق SPHEREx و PUNCH من ناسا",
      sourceBlueGhost: "هبوط Blue Ghost القمري من ناسا",
      controlsAria: "أدوات التحكم بالنظام الكوكبي",
      pauseButton: "⏸ إيقاف",
      playButton: "▶ تشغيل",
      pauseAria: "إيقاف أو تشغيل المدارات",
      speedLabel: "السرعة",
      speedAria: "مضاعف سرعة المدار",
      viewTitle: "عرض ثلاثي الأبعاد",
      tiltLabel: "الميل",
      turnLabel: "الدوران",
      rollLabel: "اللف",
      tiltAria: "تغيير العرض من الأعلى والأسفل",
      turnAria: "تدوير العرض يمينًا ويسارًا",
      rollAria: "لف زاوية العرض",
      resetView: "إعادة العرض",
      resetViewAria: "إعادة العرض ثلاثي الأبعاد والموضع والتكبير",
      orbits: "المدارات",
      orbitsAria: "إظهار أو إخفاء حلقات المدار",
      names: "الأسماء",
      namesAria: "إظهار أو إخفاء أسماء الكواكب",
      trueSize: "الحجم الحقيقي",
      trueSizeAria: "تفعيل الحجم النسبي الحقيقي",
      calm: "هادئ",
      calmAria: "تفعيل الحركة الهادئة",
      trueSizeOn: "الحجم الحقيقي يعمل · الكواكب الآن على مقياسها النسبي، لكن المدارات ليست كذلك!",
      trueSizeOff: "الحجم الحقيقي متوقف · الأحجام مرسومة بشكل واضح للمشاهدة"
    }
  };

  const t = (key, ...args) => {
    const value = (I18N[currentLanguage] && I18N[currentLanguage][key]) || I18N.en[key] || key;
    return typeof value === "function" ? value(...args) : value;
  };

  const PROJECT_BRIEF = {
    en: {
      title: "Project Brief",
      subtitle: "AR Planetary System Visualizer",
      problemTitle: "Problem Statement",
      problem: "Astronomy learners often memorize planet facts without understanding scale, orbit relationships, or spatial position. This prototype turns those relationships into a shared AR scene on a table so students can inspect, compare, and discuss planetary systems through movement and direct interaction.",
      usersTitle: "Users and Context",
      users: [
        "Primary users: CPIS-360 students and classmates attending the case show.",
        "Context: a classroom or lab table with a printed Hiro marker, phone camera, and short collaborative demo.",
        "Need: quick setup, readable labels, safe movement, and interaction that works for first-time AR users."
      ],
      goalsTitle: "Project Goals",
      goals: [
        "Create immersion and presence by anchoring a 3D planetary system to a physical marker.",
        "Support interactivity through tapping, dragging, pinch zoom, system switching, quizzes, and mission progress.",
        "Make learning measurable with score, accuracy, badges, leaderboard export, and guided missions."
      ],
      processTitle: "UX Design Process",
      process: [
        "Define: selected astronomy learners who need a spatial way to understand systems, not only a flat diagram.",
        "Storyboard: planned the flow from marker setup, to discovery, to comparison, to quiz reflection.",
        "Prototype: built an A-Frame/AR.js web prototype with Solar System and Tau Ceti scenes.",
        "Test: run short task-based tests: launch AR, find Earth, switch systems, compare two bodies, complete a quiz, and save a score.",
        "Iterate: improve controls, labels, comfort mode, and onboarding based on where users hesitate."
      ],
      principlesTitle: "AR/VE UX Principles",
      principles: [
        "Spatial awareness: orbit rings, labels, marker anchoring, and reset view keep orientation clear.",
        "Comfort and safety: calm mode, pause/play, limited motion, onboarding, and table-scale interaction reduce strain.",
        "Continuity: marker persistence keeps the system usable even if tracking briefly drops.",
        "Simplicity: first screen shows the camera and core controls instead of a landing page.",
        "Accessibility: bilingual Arabic/English UI, speech support, large touch targets, and keyboard-safe dialogs.",
        "Feedback: HUD messages, selected-object panels, quiz states, scores, badges, and progress updates."
      ],
      ethicsTitle: "Ethics",
      ethics: [
        "Camera use is explained before interaction; the prototype processes AR locally in the browser and does not upload camera images.",
        "Scores are saved locally on the device and can be cleared by the user.",
        "Estimated exoplanet values are presented as estimates, not as exact measurements.",
        "The app avoids unsafe movement by using a tabletop marker and visible controls."
      ],
      storyboardTitle: "Storyboard",
      storyboard: [
        { title: "1. Setup", text: "Student opens the page, allows camera access, and places the Hiro marker on a desk." },
        { title: "2. Presence", text: "A planetary system appears on the marker; the student moves around it and uses zoom/rotation." },
        { title: "3. Discovery", text: "Student taps a planet or ship, hears or reads facts, and compares it with another object." },
        { title: "4. Reflection", text: "Student completes a quiz, sees feedback, saves a score, and explains what changed in their understanding." }
      ],
      testTitle: "User Test Checklist",
      test: [
        "Can the user start the camera and find the marker within one minute?",
        "Can the user identify and select at least three bodies?",
        "Can the user explain one spatial relationship after using compare or true-size mode?",
        "Can the user complete a quiz without help and understand the score feedback?"
      ]
    },
    ar: {
      title: "ملخص المشروع",
      subtitle: "عارض النظام الكوكبي بالواقع المعزز",
      problemTitle: "بيان المشكلة",
      problem: "يتعلم كثير من الطلاب حقائق عن الكواكب بالحفظ، لكن يصعب عليهم تصور المقياس والعلاقات المدارية والموقع المكاني من الرسومات المسطحة. يحول هذا النموذج هذه العلاقات إلى مشهد واقع معزز مشترك على الطاولة ليستطيع الطلاب الفحص والمقارنة والنقاش بالحركة والتفاعل المباشر.",
      usersTitle: "المستخدمون والسياق",
      users: [
        "المستخدمون الأساسيون: طلاب CPIS-360 وزملاء العرض في يوم المشروع.",
        "السياق: طاولة صفية أو مختبرية مع علامة Hiro مطبوعة، وكاميرا هاتف، وعرض تعاوني قصير.",
        "الاحتياج: تشغيل سريع، تسميات واضحة، حركة آمنة، وتفاعل مناسب لمن يستخدم الواقع المعزز لأول مرة."
      ],
      goalsTitle: "أهداف المشروع",
      goals: [
        "بناء الانغماس والحضور من خلال تثبيت نظام كوكبي ثلاثي الأبعاد فوق علامة مادية.",
        "دعم التفاعلية عبر الضغط والسحب والتكبير وتبديل الأنظمة والاختبارات وتتبع المهمات.",
        "جعل التعلم قابلًا للقياس من خلال النقاط والدقة والشارات ولوحة الصدارة وتصدير النتائج."
      ],
      processTitle: "عملية تصميم تجربة المستخدم",
      process: [
        "التعريف: اختيار متعلمي الفلك الذين يحتاجون طريقة مكانية لفهم الأنظمة بدل الرسم المسطح فقط.",
        "السيناريو المصور: تخطيط المسار من تجهيز العلامة، إلى الاكتشاف، إلى المقارنة، ثم الاختبار والتأمل.",
        "النموذج الأولي: بناء نموذج ويب باستخدام A-Frame و AR.js لمشهدي النظام الشمسي وتاو سيتي.",
        "الاختبار: إجراء مهام قصيرة مثل تشغيل الواقع المعزز، العثور على الأرض، تبديل النظام، المقارنة، إنهاء اختبار، وحفظ نتيجة.",
        "التحسين: تعديل أدوات التحكم والتسميات والوضع الهادئ والإرشادات بناء على مواضع تردد المستخدمين."
      ],
      principlesTitle: "مبادئ UX للواقع المعزز والافتراضي",
      principles: [
        "الوعي المكاني: حلقات المدار والتسميات والتثبيت على العلامة وإعادة العرض تحفظ الاتجاه.",
        "الراحة والسلامة: الوضع الهادئ والإيقاف والتشغيل وتقليل الحركة والإرشادات والتفاعل على الطاولة تقلل الإجهاد.",
        "الاستمرارية: ثبات العلامة يحافظ على المشهد حتى لو انقطع التتبع لحظة قصيرة.",
        "البساطة: الشاشة الأولى هي تجربة الكاميرا والتحكم الأساسي بدل صفحة تسويقية.",
        "إمكانية الوصول: واجهة عربية/إنجليزية، دعم القراءة الصوتية، أهداف لمس كبيرة، وحوارات مناسبة للوحة المفاتيح.",
        "التغذية الراجعة: رسائل HUD ولوحات المعلومات وحالات الاختبار والنقاط والشارات وتحديثات التقدم."
      ],
      ethicsTitle: "الأخلاقيات",
      ethics: [
        "يوضح النموذج استخدام الكاميرا قبل التفاعل؛ تتم معالجة الواقع المعزز محليًا داخل المتصفح ولا ترفع صور الكاميرا.",
        "تحفظ النتائج محليًا على الجهاز ويمكن للمستخدم مسحها.",
        "تعرض قيم الكواكب الخارجية بوصفها تقديرية وليست قياسات نهائية.",
        "يتجنب التطبيق الحركة غير الآمنة لأنه يعتمد على علامة موضوعة على الطاولة مع أدوات تحكم واضحة."
      ],
      storyboardTitle: "السيناريو المصور",
      storyboard: [
        { title: "1. التجهيز", text: "يفتح الطالب الصفحة، يسمح للكاميرا، ويضع علامة Hiro على الطاولة." },
        { title: "2. الحضور", text: "يظهر النظام الكوكبي فوق العلامة؛ يتحرك الطالب حوله ويستخدم التكبير والدوران." },
        { title: "3. الاكتشاف", text: "يضغط الطالب على كوكب أو سفينة، يقرأ أو يستمع للمعلومات، ويقارنه بجسم آخر." },
        { title: "4. التأمل", text: "ينهي الطالب اختبارًا، يرى التغذية الراجعة، يحفظ النتيجة، ويشرح ما تغير في فهمه." }
      ],
      testTitle: "قائمة اختبار المستخدم",
      test: [
        "هل يستطيع المستخدم تشغيل الكاميرا والعثور على العلامة خلال دقيقة؟",
        "هل يستطيع المستخدم تحديد ثلاثة أجسام على الأقل؟",
        "هل يستطيع المستخدم شرح علاقة مكانية واحدة بعد استخدام المقارنة أو الحجم الحقيقي؟",
        "هل يستطيع المستخدم إنهاء اختبار دون مساعدة وفهم نتيجة الاختبار؟"
      ]
    }
  };

  const getProjectBrief = () => PROJECT_BRIEF[currentLanguage] || PROJECT_BRIEF.en;

  const DEFAULT_DELTA_MS = 16.67;

  // Solar system constants. (Per-system numbers like sun radius, scene scale,
  // and asteroid-belt geometry live inside the SYSTEMS map below.)
  const SOLAR_ORBIT_TILT_X = -90;
  const SOLAR_SUN_PULSE_SPEED = 0.002;
  const SOLAR_SUN_PULSE_AMOUNT = 0.045;
  const SOLAR_ORBIT_OPACITY = 0.28;
  const SOLAR_ORBIT_COLOR = "#9eb7ff";
  const SOLAR_STAR_COUNT_DESKTOP = 32;
  const SOLAR_STAR_COUNT_MOBILE = 18;
  const SOLAR_STAR_RADIUS = 1.05;
  const SOLAR_STAR_SIZE = 0.008;
  const SOLAR_SPIN_SPEED = 0.0016;
  // realSize is the planet's diameter relative to Earth (= 1.0). Used by the
  // "true relative size" toggle. axialTilt is in radians.
  const SOLAR_PLANETS = [
    { name: "Mercury", radius: 0.22, size: 0.025, realSize: 0.38, color: "#b8aaa0",
      texture: "mercury", modelUrl: "./mercury_enhanced_color.glb", speed: 0.00175, spinSpeed: 0.0008,
      axialTilt: 0.0006,
      diameter: "4,879 km", yearLength: "88 Earth days", dayLength: "59 Earth days",
      distance: "57.9 million km", moons: 0,
      info: "Smallest planet and closest to the Sun. A year on Mercury lasts only 88 Earth days." },
    { name: "Venus", radius: 0.31, size: 0.036, realSize: 0.95, color: "#e6b06a",
      texture: "venus", modelUrl: "./venus.glb", patchSpecGloss: true, speed: 0.00135, spinSpeed: -0.0004,
      axialTilt: 3.0962,
      diameter: "12,104 km", yearLength: "225 Earth days", dayLength: "243 Earth days",
      distance: "108.2 million km", moons: 0,
      info: "Hottest planet at about 465°C, with a thick CO₂ atmosphere. It spins backwards." },
    { name: "Earth", radius: 0.42, size: 0.04, realSize: 1.0, color: "#3b82ff",
      texture: "earth", modelUrl: "./earth.glb", patchSpecGloss: true, speed: 0.00108, spinSpeed: 0.004, moon: true,
      axialTilt: 0.4101,
      diameter: "12,742 km", yearLength: "365.25 days", dayLength: "24 hours",
      distance: "149.6 million km", moons: 1,
      info: "Our home. The only known planet with life and liquid surface water." },
    { name: "Mars", radius: 0.53, size: 0.032, realSize: 0.53, color: "#d35a36",
      texture: "mars", speed: 0.00088, spinSpeed: 0.0038,
      axialTilt: 0.4396,
      diameter: "6,779 km", yearLength: "687 Earth days", dayLength: "24h 37m",
      distance: "227.9 million km", moons: 2,
      info: "The Red Planet. Home to Olympus Mons, the tallest known volcano in the Solar System." },
    { name: "Jupiter", radius: 0.68, size: 0.072, realSize: 11.21, color: "#d4a46d",
      texture: "jupiter", modelUrl: "./jupiter_-_free_downloadable_model.glb", speed: 0.00062, spinSpeed: 0.009,
      axialTilt: 0.0546,
      diameter: "139,820 km", yearLength: "11.86 Earth years", dayLength: "9h 56m",
      distance: "778.5 million km", moons: 95,
      info: "Largest planet. A gas giant with 95+ moons and a centuries-old storm, the Great Red Spot." },
    { name: "Saturn", radius: 0.83, size: 0.064, realSize: 9.45, color: "#d9c38b",
      texture: "saturn", modelUrl: "./saturn.glb", patchSpecGloss: true, modelFitRadius: 0.12, modelIncludesRing: true, speed: 0.00048, spinSpeed: 0.0085, ring: true,
      axialTilt: 0.4665,
      diameter: "116,460 km", yearLength: "29.5 Earth years", dayLength: "10h 33m",
      distance: "1.43 billion km", moons: 146,
      info: "Famous for its bright rings made of ice and rock. Less dense than water." },
    { name: "Uranus", radius: 0.96, size: 0.048, realSize: 4.01, color: "#7dd3fc",
      texture: "uranus", modelUrl: "./uranus.glb", patchSpecGloss: true, modelCost: "ultra", speed: 0.00036, spinSpeed: -0.005,
      axialTilt: 1.7064,
      diameter: "50,724 km", yearLength: "84 Earth years", dayLength: "17h 14m",
      distance: "2.87 billion km", moons: 28,
      info: "An ice giant tilted ~98°, so it essentially rolls on its side as it orbits." },
    { name: "Neptune", radius: 1.08, size: 0.047, realSize: 3.88, color: "#4169e1",
      texture: "neptune", modelUrl: "./neptune.glb", modelCost: "heavy", speed: 0.00029, spinSpeed: 0.0048,
      axialTilt: 0.4944,
      diameter: "49,244 km", yearLength: "165 Earth years", dayLength: "16h 6m",
      distance: "4.50 billion km", moons: 16,
      info: "Farthest planet from the Sun. Has the fastest winds in the system, up to 2,100 km/h." }
  ];
  const SOLAR_MOON_RADIUS = 0.075;
  const SOLAR_MOON_SIZE = 0.01;
  const SOLAR_MOON_SPEED = 0.0036;
  const SOLAR_MOON_COLOR = "#d9d7ce";

  // Asteroid / debris belt count (the per-system geometry — radii, sizes,
  // colors — lives inside the SYSTEMS map).
  const ASTEROID_COUNT_DESKTOP = 96;
  const ASTEROID_COUNT_MOBILE = 48;

  // True-scale toggle: when on, planets are scaled to their real diameter
  // ratios using Earth's current visual size as 1.0. The star is scaled with a
  // gentle log compression so it stays inside the orbit view.
  const TRUE_SCALE_EARTH_BASE = 0.04;

  // Sun fact panel.
  const SOLAR_SUN_INFO = {
    name: "Sun",
    diameter: "1,391,400 km",
    yearLength: "—",
    dayLength: "~25 Earth days at equator",
    distance: "0 km (centre of system)",
    moons: 0,
    info: "A G-type main-sequence star and the heart of the Solar System. ~99.86% of the system's mass; surface temperature ~5,500°C."
  };

  // Tau Ceti System (G8V star ~12 light-years away with 4 confirmed super-Earths).
  const TAU_CETI_PLANETS = [
    { name: "Tau Ceti g", radius: 0.22, size: 0.036, realSize: 1.17, color: "#c97a4f",
      texture: "tauCetiG", speed: 0.0022, spinSpeed: 0.003,
      axialTilt: 0.18,
      diameter: "~14,900 km (estimated)", yearLength: "20 Earth days", dayLength: "Unknown",
      distance: "0.133 AU (~20 million km)", moons: 0,
      info: "Innermost confirmed planet. A scorched super-Earth orbiting close to Tau Ceti." },
    { name: "Tau Ceti h", radius: 0.34, size: 0.038, realSize: 1.19, color: "#b86045",
      texture: "tauCetiH", speed: 0.0016, spinSpeed: 0.0028,
      axialTilt: 0.22,
      diameter: "~15,200 km (estimated)", yearLength: "49 Earth days", dayLength: "Unknown",
      distance: "0.243 AU (~36 million km)", moons: 0,
      info: "A warm super-Earth, just inside the inner edge of the habitable zone." },
    { name: "Tau Ceti e", radius: 0.56, size: 0.058, realSize: 1.81, color: "#5e8fbf",
      texture: "tauCetiE", speed: 0.0011, spinSpeed: 0.0024,
      axialTilt: 0.4,
      diameter: "~23,000 km (estimated)", yearLength: "168 Earth days", dayLength: "Unknown",
      distance: "0.538 AU (~80 million km)", moons: 0,
      info: "Inner habitable zone. Could host liquid water depending on its atmosphere." },
    { name: "Tau Ceti f", radius: 0.92, size: 0.057, realSize: 1.83, color: "#7896b8",
      texture: "tauCetiF", speed: 0.00048, spinSpeed: 0.0022,
      axialTilt: 0.34,
      diameter: "~23,300 km (estimated)", yearLength: "642 Earth days", dayLength: "Unknown",
      distance: "1.334 AU (~200 million km)", moons: 0,
      info: "Outer habitable zone. Likely cold, but with a thick atmosphere it could be habitable." }
  ];
  const TAU_CETI_STAR_INFO = {
    name: "Tau Ceti",
    diameter: "~1,098,000 km (0.79 solar radii)",
    yearLength: "—",
    dayLength: "~34 Earth days at equator",
    distance: "Centre of system · 11.9 light-years from Earth",
    moons: 0,
    info: "A G8V yellow dwarf, slightly cooler and dimmer than the Sun. The closest solitary G-type star to Earth and a long-time SETI target."
  };

  // Project Hail Mary ships, stationed near Tau Ceti e (the habitable-zone
  // planet they're studying in the book). Coordinates are static — the planets
  // orbit past, the ships hold their position.
  //
  // To swap the procedural ship for an external 3D model:
  //   1. Host a .glb / .gltf model on a public URL (GitHub Pages, jsDelivr,
  //      Sketchfab download → re-uploaded somewhere CORS-permissive, etc.)
  //   2. Paste the URL into modelUrl below.
  //   3. Tweak modelScale (one number) and modelRotation ([x, y, z] radians)
  //      to fit the scene. The procedural ship is ~0.08 long, so models
  //      typically need scales between 0.001 and 0.05.
  // If modelUrl is empty or the load fails, the procedural ship renders.
  const TAU_CETI_SHIPS = [
    {
      name: "Hail Mary",
      kind: "hailMary",
      position: [-0.045, 0.045, 0.5],
      pickRadius: 0.06,
      modelUrl: "./Project%20Hail%20Mary.glb",
      modelCost: "heavy",
      modelScale: 0.002,
      modelRotation: [0, 0, 0],
      info: {
        name: "Hail Mary",
        diameter: "~47 m long (with radiators)",
        distance: "Stationed near Tau Ceti e",
        info: "Earth's interstellar emergency mission, captained by Dr. Ryland Grace. A spin-drive ship powered by astrophage, with a centrifuge for artificial gravity and two big radiators to dump waste heat."
      }
    },
    {
      name: "Blip-A",
      kind: "blipA",
      position: [0.06, 0.06, 0.51],
      pickRadius: 0.07,
      modelUrl: "", // e.g. "https://cdn.jsdelivr.net/gh/<user>/<repo>/models/blip-a.glb"
      modelScale: 0.02,
      modelRotation: [0, 0, 0],
      info: {
        name: "Blip-A",
        diameter: "~210 m across (xenonite hull)",
        distance: "Stationed near Tau Ceti e",
        info: "An Eridian starship made of xenonite — far tougher than any human alloy. No windows: Eridians sense the world by sound. Crewed by Rocky, the engineer who befriends Grace."
      }
    }
  ];

  const BODY_TRANSLATIONS = {
    ar: {
      "Sun": {
        name: "الشمس",
        diameter: "1,391,400 كم",
        yearLength: "—",
        dayLength: "حوالي 25 يومًا أرضيًا عند خط الاستواء",
        distance: "0 كم (مركز النظام)",
        info: "نجم من النوع G يقع في قلب النظام الشمسي. يحتوي على حوالي 99.86% من كتلة النظام، وتبلغ حرارة سطحه نحو 5,500 درجة مئوية."
      },
      "Mercury": {
        name: "عطارد",
        diameter: "4,879 كم",
        yearLength: "88 يومًا أرضيًا",
        dayLength: "59 يومًا أرضيًا",
        distance: "57.9 مليون كم",
        info: "أصغر كواكب النظام الشمسي وأقربها إلى الشمس. تستغرق سنته 88 يومًا أرضيًا فقط."
      },
      "Venus": {
        name: "الزهرة",
        diameter: "12,104 كم",
        yearLength: "225 يومًا أرضيًا",
        dayLength: "243 يومًا أرضيًا",
        distance: "108.2 مليون كم",
        info: "أكثر الكواكب حرارة، بنحو 465 درجة مئوية، وله غلاف جوي كثيف من ثاني أكسيد الكربون. كما أنه يدور بالعكس."
      },
      "Earth": {
        name: "الأرض",
        diameter: "12,742 كم",
        yearLength: "365.25 يومًا",
        dayLength: "24 ساعة",
        distance: "149.6 مليون كم",
        info: "كوكبنا. الكوكب الوحيد المعروف بوجود حياة وماء سائل على سطحه."
      },
      "Mars": {
        name: "المريخ",
        diameter: "6,779 كم",
        yearLength: "687 يومًا أرضيًا",
        dayLength: "24 ساعة و37 دقيقة",
        distance: "227.9 مليون كم",
        info: "الكوكب الأحمر. يوجد عليه أوليمبوس مونس، أطول بركان معروف في النظام الشمسي."
      },
      "Jupiter": {
        name: "المشتري",
        diameter: "139,820 كم",
        yearLength: "11.86 سنة أرضية",
        dayLength: "9 ساعات و56 دقيقة",
        distance: "778.5 مليون كم",
        info: "أكبر الكواكب. عملاق غازي لديه أكثر من 95 قمرًا وعاصفة قديمة اسمها البقعة الحمراء العظيمة."
      },
      "Saturn": {
        name: "زحل",
        diameter: "116,460 كم",
        yearLength: "29.5 سنة أرضية",
        dayLength: "10 ساعات و33 دقيقة",
        distance: "1.43 مليار كم",
        info: "مشهور بحلقاته اللامعة المصنوعة من الجليد والصخور. كثافته أقل من كثافة الماء."
      },
      "Uranus": {
        name: "أورانوس",
        diameter: "50,724 كم",
        yearLength: "84 سنة أرضية",
        dayLength: "17 ساعة و14 دقيقة",
        distance: "2.87 مليار كم",
        info: "عملاق جليدي مائل بنحو 98 درجة، لذلك يبدو كأنه يتدحرج على جانبه أثناء دورانه حول الشمس."
      },
      "Neptune": {
        name: "نبتون",
        diameter: "49,244 كم",
        yearLength: "165 سنة أرضية",
        dayLength: "16 ساعة و6 دقائق",
        distance: "4.50 مليار كم",
        info: "أبعد كوكب عن الشمس. لديه أسرع رياح في النظام، قد تصل إلى 2,100 كم/ساعة."
      },
      "Tau Ceti": {
        name: "تاو سيتي",
        diameter: "حوالي 1,098,000 كم (0.79 من نصف قطر الشمس)",
        yearLength: "—",
        dayLength: "حوالي 34 يومًا أرضيًا عند خط الاستواء",
        distance: "مركز النظام · يبعد 11.9 سنة ضوئية عن الأرض",
        info: "قزم أصفر من النوع G8V، أبرد وأخفت قليلًا من الشمس. وهو أقرب نجم منفرد من النوع G إلى الأرض وهدف قديم في أبحاث البحث عن ذكاء خارج الأرض."
      },
      "Tau Ceti g": {
        name: "تاو سيتي g",
        diameter: "حوالي 14,900 كم (تقديري)",
        yearLength: "20 يومًا أرضيًا",
        dayLength: "غير معروف",
        distance: "0.133 وحدة فلكية (حوالي 20 مليون كم)",
        info: "أقرب كوكب مؤكد للنجم. أرض فائقة شديدة الحرارة تدور بالقرب من تاو سيتي."
      },
      "Tau Ceti h": {
        name: "تاو سيتي h",
        diameter: "حوالي 15,200 كم (تقديري)",
        yearLength: "49 يومًا أرضيًا",
        dayLength: "غير معروف",
        distance: "0.243 وحدة فلكية (حوالي 36 مليون كم)",
        info: "أرض فائقة دافئة تقع داخل الحافة الداخلية للمنطقة الصالحة للحياة مباشرة."
      },
      "Tau Ceti e": {
        name: "تاو سيتي e",
        diameter: "حوالي 23,000 كم (تقديري)",
        yearLength: "168 يومًا أرضيًا",
        dayLength: "غير معروف",
        distance: "0.538 وحدة فلكية (حوالي 80 مليون كم)",
        info: "يقع في الجزء الداخلي من المنطقة الصالحة للحياة. قد يحتوي على ماء سائل حسب غلافه الجوي."
      },
      "Tau Ceti f": {
        name: "تاو سيتي f",
        diameter: "حوالي 23,300 كم (تقديري)",
        yearLength: "642 يومًا أرضيًا",
        dayLength: "غير معروف",
        distance: "1.334 وحدة فلكية (حوالي 200 مليون كم)",
        info: "يقع في الجزء الخارجي من المنطقة الصالحة للحياة. غالبًا بارد، لكن غلافًا جويًا كثيفًا قد يجعله صالحًا للحياة."
      },
      "Hail Mary": {
        name: "هيل ماري",
        diameter: "حوالي 47 مترًا طولًا (مع المشعات)",
        distance: "متمركزة قرب تاو سيتي e",
        info: "مهمة أرضية طارئة بين النجوم بقيادة الدكتور رايلاند غريس. سفينة تعمل بدافع السبين وبطاقة الأستروفاج، وبها جهاز طرد مركزي للجاذبية الصناعية ومشعان كبيران لتصريف الحرارة."
      },
      "Blip-A": {
        name: "بليب-أ",
        diameter: "حوالي 210 متر عرضًا (هيكل زينونايت)",
        distance: "متمركزة قرب تاو سيتي e",
        info: "سفينة إريدية مصنوعة من الزينونايت، وهو أقوى بكثير من أي سبيكة بشرية. لا توجد نوافذ لأن الإيريديين يدركون العالم بالصوت. يقودها روكي، المهندس الذي يصادق غريس."
      }
    }
  };

  // System definitions consumed by the planetary-system component. Each entry
  // describes the central star, its planets, and the surrounding debris ring.
  const SYSTEMS = {
    solar: {
      foundText: "Solar System · tap planets for info",
      foundTextKey: "solarFound",
      sceneScale: 0.62,
      sceneYOffset: 0.18,
      star: {
        info: null, // filled below to break the circular reference at parse time
        texture: "sun",
        modelUrl: "./sun.glb",
        modelScale: 0.013,
        modelRotation: [0, 0, 0],
        radius: 0.13,
        emissive: "#ff8a00",
        coronaColor: "#ffb04a",
        coronaOpacity: 0.18,
        ambientColor: 0x405070,
        pointColor: 0xffd47a,
        pointIntensity: 2.3,
        pointDistance: 3.2,
        trueScaleFactor: 8.5
      },
      planets: null,
      asteroidBelt: {
        innerRadius: 0.575,
        outerRadius: 0.645,
        heightVariance: 0.012,
        minSize: 0.0035,
        maxSize: 0.0085,
        minSpeed: 0.00045,
        maxSpeed: 0.0008,
        color: "#7d6e60"
      }
    },
    tauCeti: {
      foundText: "Tau Ceti System · tap planets or ships for info",
      foundTextKey: "tauFound",
      sceneScale: 0.82,
      // Star sits centered on the Hiro marker; planets orbit in the marker plane.
      sceneYOffset: 0,
      star: {
        info: null,
        texture: "tauCetiStar",
        radius: 0.115,
        emissive: "#ff7a18",
        coronaColor: "#ffb86b",
        coronaOpacity: 0.2,
        ambientColor: 0x4a4860,
        pointColor: 0xffc680,
        pointIntensity: 2.0,
        pointDistance: 3.0,
        trueScaleFactor: 6.7
      },
      planets: null,
      // Tau Ceti has a debris disk with ~10× the dust of the Solar System,
      // extending past the outermost planet.
      asteroidBelt: {
        innerRadius: 1.05,
        outerRadius: 1.32,
        heightVariance: 0.022,
        minSize: 0.003,
        maxSize: 0.0075,
        minSpeed: 0.00035,
        maxSpeed: 0.00065,
        color: "#9a8b7a"
      }
    }
  };
  SYSTEMS.solar.star.info = SOLAR_SUN_INFO;
  SYSTEMS.solar.planets = SOLAR_PLANETS;
  SYSTEMS.solar.ships = [];
  SYSTEMS.tauCeti.star.info = TAU_CETI_STAR_INFO;
  SYSTEMS.tauCeti.planets = TAU_CETI_PLANETS;
  SYSTEMS.tauCeti.ships = TAU_CETI_SHIPS;

  const SOLAR_SATURN_RING_INNER = 0.08;
  const SOLAR_SATURN_RING_OUTER = 0.12;
  const SOLAR_SATURN_RING_COLOR = "#f2db9d";
  const SOLAR_SATURN_RING_OPACITY = 0.48;
  const SOLAR_SATURN_RING_TILT_X = 68;
  const SOLAR_SATURN_RING_TILT_Z = 18;
  const SOLAR_STAR_MIN_HEIGHT = -0.32;
  const SOLAR_STAR_MAX_HEIGHT = 0.55;
  const SOLAR_STAR_MIN_RADIUS_SCALE = 0.65;
  const SOLAR_STAR_OPACITY = 0.72;
  const SOLAR_STAR_ROTATION_SPEED = 0.00006;

  // Planet labels (canvas sprites that follow each planet through its orbit).
  const LABEL_CANVAS_WIDTH = 256;
  const LABEL_CANVAS_HEIGHT = 72;
  const LABEL_FONT = "bold 36px system-ui, -apple-system, 'Segoe UI', sans-serif";
  const LABEL_BG_COLOR = "rgba(4, 5, 12, 0.78)";
  const LABEL_BORDER_COLOR = "rgba(255, 255, 255, 0.32)";
  const LABEL_TEXT_COLOR = "#ffffff";
  const LABEL_RADIUS = 20;
  const LABEL_BORDER_WIDTH = 2;
  const LABEL_SPRITE_SCALE_X = 0.16;
  const LABEL_SPRITE_SCALE_Y = 0.045;
  const LABEL_HEIGHT_PADDING = 0.025;
  const PLANET_PICK_TARGET_SCALE = 2.35;
  const PLANET_PICK_TARGET_MIN_SIZE = 0.075;
  const PLANET_PICK_TARGET_SEGMENTS = 18;
  // The sun is already a big visible sphere, so its pick target only needs a
  // small padding factor. Using PLANET_PICK_TARGET_SCALE here would extend the
  // invisible click sphere past the innermost planet orbits and swallow taps
  // on Mercury / Tau Ceti g.
  const SUN_PICK_TARGET_SCALE = 1.1;

  // Distance-based zoom: as the camera moves further from the marker, the
  // solar system grows so it stays comfortably readable on screen.
  const DISTANCE_REFERENCE = 1.0;
  const DISTANCE_SCALE_MIN = 0.55;
  const DISTANCE_SCALE_MAX = 2.6;
  const DISTANCE_SCALE_LERP = 0.12;

  // User-driven zoom (pinch on touch, wheel on desktop). Multiplies on top of
  // the auto distance scale.
  const USER_ZOOM_MIN = 0.4;
  const USER_ZOOM_MAX = 3.5;
  const WHEEL_ZOOM_STEP = 1.08;
  const VIEW_TILT_LIMIT = 90;
  const VIEW_ROTATION_LIMIT = 180;
  const VIEW_ROTATION_STEP = 1;

  // === Visual FX: atmospheres, sun halos, comets, ring bands =================
  // Per-planet atmosphere tint for the Fresnel rim shader. null = no atmosphere
  // (airless rocks). These are deliberately exaggerated for AR readability —
  // a hint of color at the silhouette is what sells the "this is a world"
  // illusion at the small scales we render here.
  const ATMOSPHERE_COLORS = {
    Mercury: null,
    Venus: "#ffd089",
    Earth: "#7ecbff",
    Mars: "#ff9b6e",
    Jupiter: "#ffe4a8",
    Saturn: "#f6e7b9",
    Uranus: "#9ce8ff",
    Neptune: "#7aa6ff",
    "Tau Ceti e": "#9be0ff",
    "Tau Ceti f": "#8ef0c8",
    "Tau Ceti g": "#ffb27d",
    "Tau Ceti h": "#ff8e6e"
  };
  // Atmosphere shell sits at (1 + ATMOSPHERE_SCALE_BOOST) × planet size,
  // i.e. ~16% larger. Power controls how tight the rim is; higher = thinner.
  const ATMOSPHERE_SCALE_BOOST = 0.16;
  const ATMOSPHERE_POWER = 2.6;
  const ATMOSPHERE_INTENSITY = 1.35;

  // Sun halo layers: four nested camera-facing additive sprites that fake a
  // bloom bloom + outer corona. Each layer rotates and pulses on its own
  // phase so the star feels alive rather than a flat decal.
  const SUN_HALO_LAYERS = [
    { scale: 1.95, color: "#fff5c0", opacity: 0.55, rotateSpeed:  0.00009 },
    { scale: 3.10, color: "#ffc26a", opacity: 0.32, rotateSpeed: -0.00006 },
    { scale: 4.80, color: "#ff7a33", opacity: 0.18, rotateSpeed:  0.00004 },
    { scale: 7.20, color: "#ff4818", opacity: 0.09, rotateSpeed: -0.00002 }
  ];
  const SUN_HALO_TEXTURE_SIZE = 256;

  // Comet/shooting-star system. We keep the pool tiny — the wow factor comes
  // from rarity and length, not density. Comets spawn at random arcs around
  // the marker and streak outward over ~1.6s.
  const COMET_POOL_SIZE = 3;
  const COMET_SPAWN_MIN_MS = 5200;
  const COMET_SPAWN_MAX_MS = 13000;
  const COMET_DURATION_MIN_MS = 1300;
  const COMET_DURATION_MAX_MS = 2100;
  const COMET_TRAIL_SEGMENTS = 14;
  const COMET_RADIUS_MIN = 0.55;
  const COMET_RADIUS_MAX = 0.95;
  const COMET_HEIGHT_MIN = 0.10;
  const COMET_HEIGHT_MAX = 0.55;
  const COMET_ARC_MIN = 0.55;
  const COMET_ARC_MAX = 1.30;
  const COMET_HEAD_SIZE = 0.012;
  const COMET_HEAD_COLOR = "#ffffff";
  const COMET_TAIL_COLOR = "#9bd4ff";

  // Twinkle shader knobs for the background star field.
  const STAR_TWINKLE_SPEED = 0.0011;
  const STAR_BASE_SIZE = 5.5; // gl_PointSize multiplier (pixels)

  // Saturn ring banded-shader knobs.
  const SATURN_RING_BAND_FREQUENCY = 64.0;
  const SATURN_RING_GLOW_OPACITY = 0.62;

  // GLSL — kept inline so the project remains a single-file drop. Each block
  // is one tiny program; if they grow further, split them into .glsl files.
  const ATMOSPHERE_VERTEX_SHADER = `
    varying vec3 vNormalW;
    varying vec3 vPositionW;
    void main() {
      vNormalW = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vPositionW = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;
  const ATMOSPHERE_FRAGMENT_SHADER = `
    uniform vec3 uColor;
    uniform float uPower;
    uniform float uIntensity;
    varying vec3 vNormalW;
    varying vec3 vPositionW;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vPositionW);
      float rim = 1.0 - max(dot(normalize(vNormalW), viewDir), 0.0);
      rim = pow(rim, uPower);
      gl_FragColor = vec4(uColor, rim * uIntensity);
    }
  `;
  const STAR_VERTEX_SHADER = `
    attribute float aPhase;
    attribute float aSize;
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uBaseSize;
    varying float vAlpha;
    void main() {
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      float twinkle = 0.5 + 0.5 * sin(uTime * 0.0009 + aPhase * 6.2831);
      vAlpha = 0.30 + 0.70 * twinkle;
      gl_PointSize = uBaseSize * aSize * uPixelRatio * (1.0 + twinkle * 0.7);
      gl_Position = projectionMatrix * mvPos;
    }
  `;
  const STAR_FRAGMENT_SHADER = `
    varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float soft = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vec3(1.0), vAlpha * soft);
    }
  `;
  const RING_VERTEX_SHADER = `
    varying vec2 vLocal;
    void main() {
      vLocal = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const COMET_VERTEX_SHADER = `
    attribute float aT;
    uniform float uHead;
    uniform float uTailLength;
    varying float vAlpha;
    void main() {
      float behind = uHead - aT;
      if (behind < 0.0 || behind > uTailLength) {
        vAlpha = 0.0;
      } else {
        float k = 1.0 - behind / uTailLength;
        vAlpha = k * k;
      }
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const COMET_FRAGMENT_SHADER = `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      if (vAlpha < 0.01) discard;
      gl_FragColor = vec4(uColor, vAlpha);
    }
  `;
  const RING_FRAGMENT_SHADER = `
    uniform float uInner;
    uniform float uOuter;
    uniform float uFrequency;
    uniform float uOpacity;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vLocal;
    void main() {
      float r = length(vLocal);
      float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
      // Banding: a few primary divisions + finer ridges on top.
      float bands = 0.55 + 0.45 * sin(t * uFrequency);
      bands *= 0.85 + 0.15 * sin(t * uFrequency * 4.7 + 1.2);
      // Edge fades so the inner/outer borders don't show as hard rings.
      float fade = smoothstep(0.0, 0.05, t) * smoothstep(0.0, 0.04, 1.0 - t);
      vec3 color = mix(uColorA, uColorB, t);
      gl_FragColor = vec4(color * bands, uOpacity * bands * fade);
    }
  `;
  // ===========================================================================

  const TWO_PI = Math.PI * 2;
  const IS_LOCAL_FILE = window.location.protocol === "file:";
  const IS_LOCALHOST = LOCALHOST_NAMES.includes(window.location.hostname);
  const IS_CAMERA_SECURE_CONTEXT = window.isSecureContext || IS_LOCAL_FILE || IS_LOCALHOST;
  const SUPPORTS_CAMERA = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && IS_CAMERA_SECURE_CONTEXT);
  const IS_SMALL_SCREEN = window.matchMedia(MOBILE_QUERY).matches;
  const IS_LOW_POWER = IS_SMALL_SCREEN || (navigator.hardwareConcurrency || LOW_POWER_CPU_CORES) <= LOW_POWER_CPU_CORES;
  const DISK_SEGMENTS = IS_LOW_POWER ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;
  const SPHERE_SEGMENTS = IS_LOW_POWER ? MOBILE_SPHERE_SEGMENTS : DESKTOP_SPHERE_SEGMENTS;
  const SOLAR_STAR_COUNT = IS_LOW_POWER ? SOLAR_STAR_COUNT_MOBILE : SOLAR_STAR_COUNT_DESKTOP;
  const ASTEROID_COUNT = IS_LOW_POWER ? ASTEROID_COUNT_MOBILE : ASTEROID_COUNT_DESKTOP;
  const PROCEDURAL_TEXTURE_WIDTH = IS_LOW_POWER ? 256 : 384;
  const PROCEDURAL_TEXTURE_HEIGHT = IS_LOW_POWER ? 128 : 192;
  const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SUPPORTS_SPEECH = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const SCREEN_PICK_PLANET_RADIUS = IS_SMALL_SCREEN ? 88 : 58;
  const SCREEN_PICK_SHIP_RADIUS = IS_SMALL_SCREEN ? 104 : 76;
  const SCREEN_PICK_STAR_RADIUS = IS_SMALL_SCREEN ? 76 : 52;
  const MOBILE_FLAT_ROOT_TILT_DEG = -90;
  const MISSION_SIM_STAR_COUNT = IS_LOW_POWER ? 90 : 180;
  const MISSION_SIM_DEVICE_PIXEL_RATIO = IS_LOW_POWER ? 1.4 : 2;
  const QUIZ_FALLBACKS = {
    diameter: ["4,879 km", "12,742 km", "49,244 km", "~47 m long"],
    distance: ["57.9 million km", "149.6 million km", "1.334 AU (~200 million km)", "Centre of system"],
    yearLength: ["88 Earth days", "365.25 days", "168 Earth days", "642 Earth days"],
    dayLength: ["24 hours", "10h 33m", "Unknown", "59 Earth days"],
    moons: ["0", "1", "2", "95", "146"],
    name: ["Mercury", "Earth", "Tau Ceti e", "Hail Mary"]
  };
  const QUIZ_FALLBACKS_AR = {
    diameter: ["4,879 كم", "12,742 كم", "49,244 كم", "حوالي 47 مترًا طولًا"],
    distance: ["57.9 مليون كم", "149.6 مليون كم", "1.334 وحدة فلكية", "مركز النظام"],
    yearLength: ["88 يومًا أرضيًا", "365.25 يومًا", "168 يومًا أرضيًا", "642 يومًا أرضيًا"],
    dayLength: ["24 ساعة", "10 ساعات و33 دقيقة", "غير معروف", "59 يومًا أرضيًا"],
    moons: ["0", "1", "2", "95", "146"],
    name: ["عطارد", "الأرض", "تاو سيتي e", "هيل ماري"]
  };
  const LEADERBOARD_STORAGE_KEY = "arPlanetaryLeaderboard.v1";
  const ONBOARDING_STORAGE_KEY = "arPlanetaryOnboardingSeen.v1";

  const showBootSupportMessage = (message) => {
    const render = () => {
      const loadingScreen = document.getElementById("loadingScreen");
      if (loadingScreen) {
        loadingScreen.classList.add("is-hidden");
        loadingScreen.hidden = true;
      }
      const existing = document.querySelector(".support-message");
      if (existing) {
        existing.textContent = message;
        return;
      }
      const support = document.createElement("div");
      support.className = "support-message";
      support.textContent = message;
      document.body.appendChild(support);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", render, { once: true });
    } else {
      render();
    }
  };

  if (!window.AFRAME || !window.AFRAME.THREE) {
    showBootSupportMessage(t("dependencyMessage"));
    return;
  }
  const LEADERBOARD_MAX_ENTRIES = 10;
  const PLAYER_NAME_MAX_LENGTH = 28;
  const SCORE_CORRECT_POINTS = 10;
  const SCORE_FAST_BONUS_POINTS = 5;
  const SCORE_FAST_THRESHOLD_MS = 5500;
  const SCORE_STREAK_BONUS_POINTS = 10;
  const SCORE_STREAK_LENGTH = 3;
  const SCORE_PERFECT_BONUS_POINTS = 20;
  let leaderboardMemoryEntries = [];
  let leaderboardUi = null;

  const getStorage = () => {
    try {
      return window.localStorage || null;
    } catch (err) {
      return null;
    }
  };

  const sanitizePlayerName = (name) => String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, PLAYER_NAME_MAX_LENGTH);

  const normalizeLeaderboardEntry = (entry) => {
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const score = Number(entry.score);
    const correct = Number(entry.correct);
    const total = Number(entry.total);
    if (!Number.isFinite(score) || !Number.isFinite(correct) || !Number.isFinite(total) || total <= 0) {
      return null;
    }

    return {
      id: String(entry.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`),
      playerName: sanitizePlayerName(entry.playerName) || t("leaderboardPlayer"),
      score: Math.max(0, Math.round(score)),
      correct: Math.max(0, Math.round(correct)),
      total: Math.max(1, Math.round(total)),
      accuracy: Math.max(0, Math.min(100, Math.round(Number(entry.accuracy) || 0))),
      systemKey: entry.systemKey === "tauCeti" ? "tauCeti" : "solar",
      bodyName: String(entry.bodyName || ""),
      savedAt: entry.savedAt || new Date().toISOString()
    };
  };

  const sortLeaderboardEntries = (entries) => entries
    .map(normalizeLeaderboardEntry)
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
    })
    .slice(0, LEADERBOARD_MAX_ENTRIES);

  const readLeaderboardEntries = () => {
    const storage = getStorage();
    if (!storage) {
      return sortLeaderboardEntries(leaderboardMemoryEntries);
    }

    try {
      const parsed = JSON.parse(storage.getItem(LEADERBOARD_STORAGE_KEY) || "[]");
      return sortLeaderboardEntries(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      return [];
    }
  };

  const writeLeaderboardEntries = (entries) => {
    const sorted = sortLeaderboardEntries(entries);
    leaderboardMemoryEntries = sorted;
    const storage = getStorage();
    if (!storage) {
      return sorted;
    }

    try {
      storage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(sorted));
    } catch (err) {
      // Private browsing or local-file restrictions can block storage; the
      // in-memory board still works for the current session.
    }
    return sorted;
  };

  const saveLeaderboardEntry = (entry) => {
    const saved = normalizeLeaderboardEntry(Object.assign({}, entry, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      savedAt: new Date().toISOString()
    }));
    if (!saved) {
      return null;
    }

    writeLeaderboardEntries(readLeaderboardEntries().concat(saved));
    window.dispatchEvent(new CustomEvent("leaderboardUpdated", { detail: saved }));
    return saved;
  };

  const clearLeaderboardEntries = () => {
    writeLeaderboardEntries([]);
    window.dispatchEvent(new Event("leaderboardUpdated"));
  };
  const PROGRESS_STORAGE_KEY = "arPlanetaryProgress.v1";
  const MISSION_BONUS_POINTS = 50;
  const MISSION_CONTROL_TABS = [
    { id: "lesson", labelKey: "tabLesson" },
    { id: "overview", labelKey: "tabOverview" },
    { id: "project", labelKey: "tabProject" },
    { id: "missions", labelKey: "tabMissions" },
    { id: "badges", labelKey: "tabBadges" },
    { id: "compare", labelKey: "tabCompare" },
    { id: "simulator", labelKey: "tabSimulator" },
    { id: "learn", labelKey: "tabLearn" }
  ];
  const GUIDED_MISSIONS = [
    {
      id: "solar-scout",
      titleKey: "missionSolarTitle",
      textKey: "missionSolarText",
      steps: [
        { id: "earth", textKey: "missionStepEarth", check: (p) => hasDiscovered(p, "solar", "Earth") },
        { id: "mars", textKey: "missionStepMars", check: (p) => hasDiscovered(p, "solar", "Mars") },
        { id: "solarQuiz", textKey: "missionStepSolarQuiz", check: (p) => includesValue(p.quizSystems, "solar") }
      ]
    },
    {
      id: "tau-researcher",
      titleKey: "missionTauTitle",
      textKey: "missionTauText",
      steps: [
        { id: "tauE", textKey: "missionStepTauE", check: (p) => hasDiscovered(p, "tauCeti", "Tau Ceti e") },
        { id: "hailMary", textKey: "missionStepHailMary", check: (p) => hasDiscovered(p, "tauCeti", "Hail Mary") },
        { id: "tauQuiz", textKey: "missionStepTauQuiz", check: (p) => includesValue(p.quizSystems, "tauCeti") }
      ]
    },
    {
      id: "classroom-champion",
      titleKey: "missionClassTitle",
      textKey: "missionClassText",
      steps: [
        { id: "perfect", textKey: "missionStepPerfect", check: (p) => p.perfectQuizzes > 0 },
        { id: "save", textKey: "missionStepSave", check: (p) => p.savedScores > 0 },
        { id: "discoverEight", textKey: "missionStepDiscoverEight", check: (p) => p.discovered.length >= 8 }
      ]
    }
  ];
  const BADGE_DEFS = [
    {
      id: "planet-explorer",
      code: "5+",
      titleKey: "badgePlanetExplorer",
      descKey: "badgePlanetExplorerDesc",
      check: (p) => p.discovered.length >= 5
    },
    {
      id: "solar-expert",
      code: "SOL",
      titleKey: "badgeSolarExpert",
      descKey: "badgeSolarExpertDesc",
      check: (p) => includesValue(p.quizSystems, "solar")
    },
    {
      id: "tau-researcher",
      code: "TAU",
      titleKey: "badgeTauResearcher",
      descKey: "badgeTauResearcherDesc",
      check: (p) => includesValue(p.quizSystems, "tauCeti")
    },
    {
      id: "perfect-mission",
      code: "100",
      titleKey: "badgePerfectMission",
      descKey: "badgePerfectMissionDesc",
      check: (p) => p.perfectQuizzes > 0
    },
    {
      id: "fast-thinker",
      code: "SPD",
      titleKey: "badgeFastThinker",
      descKey: "badgeFastThinkerDesc",
      check: (p) => p.fastAnswers > 0
    },
    {
      id: "mission-commander",
      code: "CMD",
      titleKey: "badgeMissionCommander",
      descKey: "badgeMissionCommanderDesc",
      check: (p) => p.completedMissions.length > 0
    }
  ];
  const SPACE_MISSION_SIMS = [
    {
      id: "artemis-ii",
      titleKey: "simArtemisTitle",
      bodyKey: "simArtemisBody",
      vehicleKey: "simArtemisVehicle",
      statusKey: "simArtemisStatus",
      route: "lunar",
      sourceKey: "sourceArtemis",
      sourceUrl: "https://www.nasa.gov/mission/artemis-ii"
    },
    {
      id: "imap",
      titleKey: "simImapTitle",
      bodyKey: "simImapBody",
      vehicleKey: "simImapVehicle",
      statusKey: "simImapStatus",
      route: "heliosphere",
      sourceKey: "sourceImap",
      sourceUrl: "https://science.nasa.gov/blogs/imap/2026/02/02/nasas-imap-begins-primary-science-mission/"
    },
    {
      id: "spherex-punch",
      titleKey: "simSpherexTitle",
      bodyKey: "simSpherexBody",
      vehicleKey: "simSpherexVehicle",
      statusKey: "simSpherexStatus",
      route: "earthOrbit",
      sourceKey: "sourceSpherex",
      sourceUrl: "https://www.jpl.nasa.gov/news/nasa-launches-missions-to-study-sun-universes-beginning/"
    },
    {
      id: "blue-ghost",
      titleKey: "simBlueGhostTitle",
      bodyKey: "simBlueGhostBody",
      vehicleKey: "simBlueGhostVehicle",
      statusKey: "simBlueGhostStatus",
      route: "lander",
      sourceKey: "sourceBlueGhost",
      sourceUrl: "https://www.nasa.gov/image-article/blue-ghost-lands-on-moon/"
    }
  ];
  const LEARNING_SOURCES = SPACE_MISSION_SIMS.map((mission) => ({
    key: mission.sourceKey,
    url: mission.sourceUrl
  }));
  let missionControlUi = null;
  let missionControlActiveTab = "lesson";
  let missionCompareSelection = { first: "solar:Earth", second: "solar:Mars" };
  let activeSimulationId = "artemis-ii";
  let missionSimulator = null;
  const MODEL_LOAD_STAGGER_MS = IS_LOW_POWER ? 650 : 180;
  const modelLoadQueue = [];
  let modelLoadActive = false;

  const runNextModelLoad = () => {
    if (modelLoadActive || modelLoadQueue.length === 0) {
      return;
    }

    modelLoadActive = true;
    const task = modelLoadQueue.shift();
    const finish = () => {
      modelLoadActive = false;
      window.setTimeout(runNextModelLoad, MODEL_LOAD_STAGGER_MS);
    };

    window.setTimeout(() => {
      try {
        task(finish);
      } catch (err) {
        console.warn("Model load task failed:", err);
        finish();
      }
    }, MODEL_LOAD_STAGGER_MS);
  };

  const enqueueModelLoad = (task, priority) => {
    if (priority) {
      modelLoadQueue.unshift(task);
    } else {
      modelLoadQueue.push(task);
    }
    runNextModelLoad();
  };

  const randomBetween = (min, max) => min + Math.random() * (max - min);

  const getTranslatedBodyName = (name) => {
    const translations = BODY_TRANSLATIONS[currentLanguage] || {};
    return (translations[name] && translations[name].name) || name || "";
  };

  const getTranslatedBodyData = (data) => {
    if (!data) return {};
    const translations = BODY_TRANSLATIONS[currentLanguage] || {};
    const translated = translations[data.name];
    return translated ? Object.assign({}, data, translated) : data;
  };

  const getSystemDisplayName = (systemKey) => (
    systemKey === "tauCeti" ? t("tauCetiLabel") : t("solarLabel")
  );

  const formatLeaderboardDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(currentLanguage === "ar" ? "ar-SA-u-ca-gregory" : "en-US", {
      month: "short",
      day: "numeric"
    }).format(date);
  };

  function includesValue(list, value) {
    return Array.isArray(list) && list.includes(value);
  }

  function addUnique(list, value) {
    if (!value || list.includes(value)) return;
    list.push(value);
  }

  function getDiscoveryId(systemKey, bodyName) {
    return `${systemKey}:${bodyName}`;
  }

  function hasDiscovered(progress, systemKey, bodyName) {
    return includesValue(progress.discovered, getDiscoveryId(systemKey, bodyName));
  }

  function createDefaultProgress() {
    return {
      discovered: [],
      quizBodies: [],
      quizSystems: [],
      completedMissions: [],
      badges: [],
      quizzesCompleted: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      perfectQuizzes: 0,
      fastAnswers: 0,
      savedScores: 0,
      bestStreak: 0,
      missionBonusPoints: 0
    };
  }

  function normalizeProgress(value) {
    const base = createDefaultProgress();
    if (!value || typeof value !== "object") {
      return base;
    }

    for (const key of ["discovered", "quizBodies", "quizSystems", "completedMissions", "badges"]) {
      base[key] = Array.isArray(value[key]) ? value[key].map(String) : [];
    }
    for (const key of [
      "quizzesCompleted",
      "correctAnswers",
      "totalQuestions",
      "perfectQuizzes",
      "fastAnswers",
      "savedScores",
      "bestStreak",
      "missionBonusPoints"
    ]) {
      const number = Number(value[key]);
      base[key] = Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
    }
    return applyBadgeUnlocks(base);
  }

  function readProgress() {
    const storage = getStorage();
    if (!storage) {
      return normalizeProgress(window.__missionProgressMemory);
    }

    try {
      return normalizeProgress(JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY) || "{}"));
    } catch (err) {
      return createDefaultProgress();
    }
  }

  function writeProgress(progress) {
    const normalized = normalizeProgress(progress);
    window.__missionProgressMemory = normalized;
    const storage = getStorage();
    if (storage) {
      try {
        storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(normalized));
      } catch (err) {
        // Storage can be blocked in a few browser modes; session memory remains.
      }
    }
    window.dispatchEvent(new CustomEvent("progressUpdated", { detail: normalized }));
    return normalized;
  }

  function updateProgress(mutator) {
    const progress = readProgress();
    mutator(progress);
    return writeProgress(progress);
  }

  function applyBadgeUnlocks(progress) {
    for (const badge of BADGE_DEFS) {
      if (badge.check(progress)) {
        addUnique(progress.badges, badge.id);
      }
    }
    return progress;
  }

  function recordStudyDiscovery(systemKey, bodyName) {
    if (!bodyName) return readProgress();
    return updateProgress((progress) => {
      addUnique(progress.discovered, getDiscoveryId(systemKey, bodyName));
    });
  }

  function recordQuizCompletion(result) {
    return updateProgress((progress) => {
      const quizId = getDiscoveryId(result.systemKey, result.bodyName || "");
      progress.quizzesCompleted += 1;
      progress.correctAnswers += result.correct || 0;
      progress.totalQuestions += result.total || 0;
      progress.fastAnswers += result.fastAnswers || 0;
      progress.bestStreak = Math.max(progress.bestStreak, result.bestStreak || 0);
      if (result.correct === result.total && result.total > 0) {
        progress.perfectQuizzes += 1;
      }
      addUnique(progress.quizBodies, quizId);
      addUnique(progress.quizSystems, result.systemKey);
    });
  }

  function recordScoreSaved() {
    return updateProgress((progress) => {
      progress.savedScores += 1;
    });
  }

  function claimGuidedMission(missionId) {
    return updateProgress((progress) => {
      if (!includesValue(progress.completedMissions, missionId)) {
        progress.completedMissions.push(missionId);
        progress.missionBonusPoints += MISSION_BONUS_POINTS;
      }
    });
  }

  function getMissionCompletion(mission, progress) {
    const steps = mission.steps.map((step) => ({
      id: step.id,
      textKey: step.textKey,
      done: Boolean(step.check(progress))
    }));
    return {
      steps,
      complete: steps.every((step) => step.done),
      claimed: includesValue(progress.completedMissions, mission.id)
    };
  }

  function getBodyCatalog() {
    const catalog = [];
    for (const [systemKey, system] of Object.entries(SYSTEMS)) {
      const addBody = (data, kind) => {
        if (!data || !data.name) return;
        catalog.push({
          id: getDiscoveryId(systemKey, data.name),
          systemKey,
          kind,
          data
        });
      };
      if (system.star && system.star.info) addBody(system.star.info, "star");
      for (const planet of system.planets || []) addBody(planet, "planet");
      for (const ship of system.ships || []) addBody(ship.info || ship, "ship");
    }
    return catalog;
  }

  function getBodyById(id) {
    return getBodyCatalog().find((body) => body.id === id) || getBodyCatalog()[0];
  }

  function getProgressStats(progress) {
    const totalBodies = getBodyCatalog().length;
    const accuracy = progress.totalQuestions
      ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
      : 0;
    return {
      discovered: `${Math.min(progress.discovered.length, totalBodies)}/${totalBodies}`,
      quizzes: String(progress.quizzesCompleted),
      accuracy: `${accuracy}%`,
      badges: `${progress.badges.length}/${BADGE_DEFS.length}`,
      missions: `${progress.completedMissions.length}/${GUIDED_MISSIONS.length}`,
      saved: String(progress.savedScores)
    };
  }


  AFRAME.registerComponent("persistent-marker", {
    init: function () {
      const T = AFRAME.THREE;
      this.everDetected = false;
      this.lastMatrix = new T.Matrix4();

      this.copyPose = () => {
        const obj = this.el.object3D;
        if (obj.matrixAutoUpdate) {
          obj.updateMatrix();
        }
        this.lastMatrix.copy(obj.matrix);
      };

      this.restorePose = () => {
        if (!this.everDetected) return;
        const obj = this.el.object3D;
        obj.matrix.copy(this.lastMatrix);
        obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);
        obj.visible = true;
        obj.updateMatrixWorld(true);
      };

      this.onMarkerFound = () => {
        this.everDetected = true;
        this.copyPose();
      };
      this.onMarkerLost = () => this.restorePose();

      this.el.addEventListener("markerFound", this.onMarkerFound);
      this.el.addEventListener("markerLost", this.onMarkerLost);
    },

    tick: function () {
      const obj = this.el.object3D;
      if (!this.everDetected) {
        return;
      }
      if (obj.visible) {
        this.copyPose();
      } else {
        this.restorePose();
      }
    },

    remove: function () {
      this.el.removeEventListener("markerFound", this.onMarkerFound);
      this.el.removeEventListener("markerLost", this.onMarkerLost);
    }
  });


  AFRAME.registerComponent("solar-system-scene", {
    schema: {
      // Pick which planetary system this marker shows. Defined in SYSTEMS above.
      system: { type: "string", default: "solar" }
    },
    init: function () {
      this.three = AFRAME.THREE;
      this.systemDef = SYSTEMS[this.data.system] || SYSTEMS.solar;
      this.planets = [];
      this.pickTargets = [];
      this.disposables = [];
      this.currentDistanceScale = 1;
      this.userZoom = 1;
      this.tmpCamPos = new this.three.Vector3();
      this.tmpRootPos = new this.three.Vector3();

      // Each system gets its own compact scale so the outermost planet fits above the marker.
      this.root = new this.three.Group();
      this.root.position.y = this.systemDef.sceneYOffset;
      this.root.scale.setScalar(this.systemDef.sceneScale);
      this.applyDefaultRootOrientation();
      this.el.object3D.add(this.root);

      // Runtime state for the kid-facing controls. These are mutated by the
      // control-panel buttons in setupControlPanel().
      this.paused = false;
      this.speedMultiplier = PREFERS_REDUCED_MOTION ? 0.4 : 1.0;
      this.showOrbits = true;
      this.showLabels = true;
      this.trueScale = false;
      this.reducedMotion = PREFERS_REDUCED_MOTION;
      this.tmpObject = new this.three.Object3D();

      this.createLights();
      this.createSun();
      this.createOrbitingPlanets();
      this.createAsteroidBelt();
      this.createShips();
      this.createStarField();
      this.createComets();
      this.bindMarkerEvents();
      this.setupInfoPanel();
      this.setupControlPanel();
      this.setupPlanetPicking();
    },

    getDisplayData: function (data) {
      if (!data) {
        return {};
      }
      const translations = BODY_TRANSLATIONS[currentLanguage] || {};
      const translated = translations[data.name];
      return translated ? Object.assign({}, data, translated) : data;
    },

    getDisplayName: function (data) {
      return this.getDisplayData(data).name || "";
    },

    getStatRows: function (data) {
      return [
        [t("diameter"), data.diameter],
        [t("distance"), data.distance],
        [t("yearLength"), data.yearLength],
        [t("dayLength"), data.dayLength],
        [t("moons"), typeof data.moons === "number" ? String(data.moons) : data.moons]
      ];
    },

    applyDefaultRootOrientation: function () {
      if (!this.root) {
        return;
      }
      this.root.rotation.set(0, 0, 0);
      if (IS_SMALL_SCREEN) {
        this.root.rotation.x = this.three.MathUtils.degToRad(MOBILE_FLAT_ROOT_TILT_DEG);
      }
    },

    refreshLanguage: function () {
      this.refreshPlanetLabels();

      if (this.controlPanel) {
        const active = !this.controlPanel.classList.contains("is-hidden");
        this.controlPanel.remove();
        this.controlPanel = null;
        this.setupControlPanel();
        this.setControlPanelActive(active);
        this.setPausedState(this.paused);
      }

      if (this.infoPanel && this.infoPanel.classList.contains("is-visible") && this.currentInfoState) {
        this.showPlanetInfo(this.currentInfoState);
      } else {
        this.setSpeechButtonSpeaking(false);
        if (this.infoQuizButton) this.infoQuizButton.textContent = t("quiz");
        if (this.infoCloseActionButton) this.infoCloseActionButton.textContent = t("close");
      }

      if (this.hud && !this.hud.classList.contains(HUD_HIDDEN_CLASS)) {
        this.hud.textContent = t("hudDefault");
      }
    },

    createLights: function () {
      const star = this.systemDef.star;
      const ambient = new this.three.AmbientLight(star.ambientColor, 0.9);
      const sunLight = new this.three.PointLight(star.pointColor, star.pointIntensity, star.pointDistance);

      sunLight.position.set(0, 0.18, 0);
      this.root.add(ambient, sunLight);
    },

    createSun: function () {
      // The central star gets a swirling procedural surface, an emissive
      // material, and an outer corona shell so it reads as a bright body in AR.
      const star = this.systemDef.star;
      const geometry = this.track(new this.three.SphereGeometry(star.radius, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const sunTexture = this.createPlanetTexture(star.texture);
      const material = this.track(new this.three.MeshStandardMaterial({
        map: sunTexture,
        emissive: star.emissive,
        emissiveMap: sunTexture,
        emissiveIntensity: 1.4,
        roughness: 0.45
      }));

      this.sun = new this.three.Group();
      this.sunSurface = new this.three.Mesh(geometry, material);
      this.sun.add(this.sunSurface);
      this.sunState = { mesh: this.sun, renderMesh: this.sunSurface, data: star.info, kind: "star", pickTarget: null };
      this.sun.userData.planetState = this.sunState;
      this.sunSurface.userData.planetState = this.sunState;

      const coronaGeometry = this.track(new this.three.SphereGeometry(star.radius * 1.35, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const coronaMaterial = this.track(new this.three.MeshBasicMaterial({
        color: star.coronaColor,
        transparent: true,
        opacity: star.coronaOpacity,
        blending: this.three.AdditiveBlending,
        depthWrite: false,
        side: this.three.BackSide
      }));
      this.sunCorona = new this.three.Mesh(coronaGeometry, coronaMaterial);
      this.sun.add(this.sunCorona);

      const sunPickRadius = Math.max(star.radius * SUN_PICK_TARGET_SCALE, PLANET_PICK_TARGET_MIN_SIZE);
      const sunPickGeometry = this.track(new this.three.SphereGeometry(sunPickRadius, PLANET_PICK_TARGET_SEGMENTS, PLANET_PICK_TARGET_SEGMENTS));
      const sunPickMaterial = this.track(new this.three.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      this.sunPickTarget = new this.three.Mesh(sunPickGeometry, sunPickMaterial);
      this.sunPickTarget.name = `${this.systemDef.star.info.name} pick target`;
      this.sunPickTarget.userData.planetState = this.sunState;
      this.sunState.pickTarget = this.sunPickTarget;
      this.sun.add(this.sunPickTarget);

      this.sunHaloLayers = this.createSunHalo(star);
      this.root.add(this.sun);
      this.tryLoadStarModel(star);
    },

    // Builds a cached radial-gradient halo texture once per scene. The gradient
    // is white-hot at the center fading to transparent at the edge, so when
    // sampled by an additive sprite it reads as glowing light rather than a
    // flat disk. Reused across all halo layers (the layers tint via material
    // color and scale via sprite scale).
    getSunHaloTexture: function () {
      if (this.sunHaloTexture) {
        return this.sunHaloTexture;
      }
      const T = this.three;
      const size = SUN_HALO_TEXTURE_SIZE;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0.00, "rgba(255,255,255,1.0)");
      grad.addColorStop(0.18, "rgba(255,255,255,0.85)");
      grad.addColorStop(0.40, "rgba(255,255,255,0.45)");
      grad.addColorStop(0.70, "rgba(255,255,255,0.12)");
      grad.addColorStop(1.00, "rgba(255,255,255,0.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const texture = this.track(new T.CanvasTexture(canvas));
      if (T.SRGBColorSpace) {
        texture.colorSpace = T.SRGBColorSpace;
      } else if ("sRGBEncoding" in T) {
        texture.encoding = T.sRGBEncoding;
      }
      this.sunHaloTexture = texture;
      return texture;
    },

    // Stacks several camera-facing additive sprites on the sun group to fake
    // a bloom + outer-corona without a post-processing pass. AR.js drives the
    // renderer itself, so a post-FX EffectComposer isn't trivial to wire in;
    // additive sprites give us 80% of the look at 0% of the integration risk.
    createSunHalo: function (star) {
      const T = this.three;
      const texture = this.getSunHaloTexture();
      const layers = [];
      for (const layer of SUN_HALO_LAYERS) {
        const material = this.track(new T.SpriteMaterial({
          map: texture,
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          blending: T.AdditiveBlending,
          depthTest: false,
          depthWrite: false
        }));
        const sprite = new T.Sprite(material);
        const baseScale = star.radius * 2 * layer.scale;
        sprite.scale.set(baseScale, baseScale, 1);
        sprite.renderOrder = -1; // draw behind the sun surface
        this.sun.add(sprite);
        layers.push({
          sprite,
          baseScale,
          rotateSpeed: layer.rotateSpeed,
          pulsePhase: Math.random() * TWO_PI
        });
      }
      return layers;
    },

    tryLoadStarModel: function (star) {
      if (!star.modelUrl) {
        return;
      }

      const T = this.three;
      const LoaderCtor = T.GLTFLoader || (typeof THREE !== "undefined" && THREE.GLTFLoader);
      if (!LoaderCtor) {
        console.warn("GLTFLoader unavailable; using procedural star for", star.info && star.info.name);
        return;
      }

      const loader = new LoaderCtor();
      loader.load(
        star.modelUrl,
        (gltf) => {
          const model = gltf && (gltf.scene || (gltf.scenes && gltf.scenes[0]));
          if (!model || !this.sun) {
            return;
          }

          if (typeof star.modelScale === "number") {
            model.scale.setScalar(star.modelScale);
          }
          if (Array.isArray(star.modelRotation)) {
            model.rotation.set(
              star.modelRotation[0] || 0,
              star.modelRotation[1] || 0,
              star.modelRotation[2] || 0
            );
          }

          model.traverse((child) => {
            if (!child || !child.isMesh) {
              return;
            }
            child.userData.planetState = this.sunState;
            child.frustumCulled = false;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            for (const mat of materials) {
              if (!mat) continue;
              if (mat.emissive) {
                mat.emissive.set(star.emissive);
                mat.emissiveIntensity = Math.max(mat.emissiveIntensity || 0, 1.2);
              }
              if (mat.transparent) {
                mat.depthWrite = false;
              }
            }
          });

          if (this.sunSurface) {
            this.sunSurface.visible = false;
          }
          this.loadedStarModel = model;
          this.sun.add(model);

          if (gltf.animations && gltf.animations.length && T.AnimationMixer) {
            this.sunModelMixer = new T.AnimationMixer(model);
            for (const clip of gltf.animations) {
              this.sunModelMixer.clipAction(clip).play();
            }
          }
        },
        undefined,
        (err) => {
          console.warn(`Failed to load star model from ${star.modelUrl}:`, err);
        }
      );
    },

    createOrbitingPlanets: function () {
      this.orbitRings = [];
      for (const planetData of this.systemDef.planets) {
        const orbit = this.createOrbitRing(planetData.radius);
        const orbitGroup = new this.three.Group();

        // tiltAnchor sits on the orbit and carries the axial tilt; the planet
        // mesh inside spins on its own Y axis without affecting the tilt.
        const tiltAnchor = new this.three.Group();
        tiltAnchor.position.x = planetData.radius;
        tiltAnchor.rotation.z = planetData.axialTilt || 0;
        orbitGroup.add(tiltAnchor);

        const planet = this.createPlanet(planetData);
        tiltAnchor.add(planet);
        this.root.add(orbit, orbitGroup);
        this.orbitRings.push(orbit);

        const label = this.createPlanetLabel(planetData);
        // Label lives on the tilt anchor so it doesn't tilt or spin with the
        // planet's surface (sprites face the camera regardless).
        tiltAnchor.add(label);

        const planetState = {
          mesh: planet,
          renderMesh: planet.userData.surfaceMesh || null,
          orbitGroup,
          tiltAnchor,
          orbit,
          label,
          pickTarget: null,
          data: planetData,
          kind: "planet",
          speed: planetData.speed,
          spinSpeed: planetData.spinSpeed || SOLAR_SPIN_SPEED,
          angleOffset: randomBetween(0, TWO_PI),
          moonPivot: null,
          ringMesh: null,
          loadedModel: null,
          modelMixer: null
        };

        orbitGroup.rotation.y = planetState.angleOffset;
        planet.userData.planetState = planetState;
        if (planetState.renderMesh) {
          planetState.renderMesh.userData.planetState = planetState;
        }
        label.userData.planetState = planetState;

        const pickTarget = this.createPlanetPickTarget(planetData);
        pickTarget.userData.planetState = planetState;
        // Pick target lives on tilt anchor so its position matches the planet
        // but is not affected by the planet's spin.
        tiltAnchor.add(pickTarget);
        planetState.pickTarget = pickTarget;
        this.pickTargets.push(pickTarget);

        if (planetData.ring) {
          planetState.ringMesh = this.createSaturnRing();
          tiltAnchor.add(planetState.ringMesh);
        }

        if (planetData.moon) {
          planetState.moonPivot = this.createMoon(tiltAnchor);
        }

        this.planets.push(planetState);
        this.requestPlanetModel(planetState, false);
      }
    },

    createPlanetLabel: function (planetData) {
      // A canvas-based sprite renders the planet name in a small floating box
      // above each planet; sprites always face the camera, so the label stays
      // legible as the planet swings around its orbit.
      const displayName = this.getDisplayName(planetData);
      const canvas = document.createElement("canvas");
      canvas.width = LABEL_CANVAS_WIDTH;
      canvas.height = LABEL_CANVAS_HEIGHT;

      const ctx = canvas.getContext("2d");
      const inset = LABEL_BORDER_WIDTH;
      const w = canvas.width - inset * 2;
      const h = canvas.height - inset * 2;
      const r = LABEL_RADIUS;

      ctx.beginPath();
      ctx.moveTo(inset + r, inset);
      ctx.lineTo(inset + w - r, inset);
      ctx.quadraticCurveTo(inset + w, inset, inset + w, inset + r);
      ctx.lineTo(inset + w, inset + h - r);
      ctx.quadraticCurveTo(inset + w, inset + h, inset + w - r, inset + h);
      ctx.lineTo(inset + r, inset + h);
      ctx.quadraticCurveTo(inset, inset + h, inset, inset + h - r);
      ctx.lineTo(inset, inset + r);
      ctx.quadraticCurveTo(inset, inset, inset + r, inset);
      ctx.closePath();

      ctx.fillStyle = LABEL_BG_COLOR;
      ctx.fill();
      ctx.lineWidth = LABEL_BORDER_WIDTH;
      ctx.strokeStyle = LABEL_BORDER_COLOR;
      ctx.stroke();

      ctx.fillStyle = LABEL_TEXT_COLOR;
      ctx.font = LABEL_FONT;
      ctx.direction = currentLanguage === "ar" ? "rtl" : "ltr";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayName, canvas.width / 2, canvas.height / 2 + 1);

      const texture = this.track(new this.three.CanvasTexture(canvas));
      if (this.three.SRGBColorSpace) {
        texture.colorSpace = this.three.SRGBColorSpace;
      } else {
        texture.encoding = this.three.sRGBEncoding;
      }
      texture.needsUpdate = true;

      const material = this.track(new this.three.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }));
      const sprite = new this.three.Sprite(material);

      sprite.scale.set(LABEL_SPRITE_SCALE_X, LABEL_SPRITE_SCALE_Y, 1);
      sprite.position.y = (planetData.modelFitRadius || planetData.size) + LABEL_HEIGHT_PADDING;
      sprite.renderOrder = 10;

      return sprite;
    },

    refreshPlanetLabels: function () {
      for (const planet of this.planets) {
        if (!planet.label || !planet.tiltAnchor) continue;
        planet.tiltAnchor.remove(planet.label);
        planet.label = this.createPlanetLabel(planet.data);
        planet.label.visible = this.showLabels;
        planet.label.userData.planetState = planet;
        planet.tiltAnchor.add(planet.label);
      }
    },

    createOrbitRing: function (radius) {
      // Thin torus rings show each orbital path without needing extra textures.
      const geometry = this.track(new this.three.TorusGeometry(radius, 0.002, 8, DISK_SEGMENTS));
      const material = this.track(new this.three.MeshBasicMaterial({
        color: SOLAR_ORBIT_COLOR,
        transparent: true,
        opacity: SOLAR_ORBIT_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));
      const orbit = new this.three.Mesh(geometry, material);

      orbit.rotation.x = this.three.MathUtils.degToRad(SOLAR_ORBIT_TILT_X);
      return orbit;
    },

    createPlanet: function (planetData) {
      const group = new this.three.Group();
      const geometry = this.track(new this.three.SphereGeometry(planetData.size, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const texture = planetData.texture
        ? this.createPlanetTexture(planetData.texture)
        : null;
      const material = this.track(new this.three.MeshStandardMaterial({
        map: texture,
        color: texture ? "#ffffff" : planetData.color,
        roughness: 0.7,
        metalness: 0.04
      }));

      const surface = new this.three.Mesh(geometry, material);
      group.add(surface);
      group.userData.surfaceMesh = surface;

      // Cloud layer (Earth only) — a slightly larger sphere with a procedural
      // cloud texture, rotating at a different rate than the surface so weather
      // visibly drifts past continents.
      const clouds = this.createCloudLayer(planetData);
      if (clouds) {
        clouds.renderOrder = 1;
        group.add(clouds);
        group.userData.cloudMesh = clouds;
      }

      // A Fresnel rim shell — visually identical to NASA's "atmospheric scatter"
      // style on Eyes on the Solar System. We do this in addition to the GLB
      // model (when present) because the rim is read from the visible
      // silhouette, which is the same regardless of which body fills the
      // interior.
      const atmosphere = this.createPlanetAtmosphere(planetData);
      if (atmosphere) {
        atmosphere.renderOrder = 2;
        group.add(atmosphere);
        group.userData.atmosphereMesh = atmosphere;
      }
      return group;
    },

    createCloudLayer: function (planetData) {
      if (planetData.name !== "Earth") return null;
      const T = this.three;
      const baseRadius = Math.max(planetData.size, planetData.modelFitRadius || 0);
      const radius = baseRadius * 1.04;
      const geometry = this.track(new T.SphereGeometry(radius, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const material = this.track(new T.MeshStandardMaterial({
        map: this.createCloudTexture(),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        roughness: 1.0,
        metalness: 0.0
      }));
      return new T.Mesh(geometry, material);
    },

    createCloudTexture: function () {
      // Soft white blobs over transparent — wraps around the sphere as
      // scattered cloud cover. Cheap to generate and looks right at AR
      // viewing scales.
      const T = this.three;
      const w = IS_LOW_POWER ? 384 : 512;
      const h = w / 2;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      const count = IS_LOW_POWER ? 140 : 220;
      for (let i = 0; i < count; i += 1) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = randomBetween(10, 36);
        const alpha = randomBetween(0.20, 0.85);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TWO_PI);
        ctx.fill();
      }
      const texture = this.track(new T.CanvasTexture(canvas));
      if (T.SRGBColorSpace) {
        texture.colorSpace = T.SRGBColorSpace;
      } else if ("sRGBEncoding" in T) {
        texture.encoding = T.sRGBEncoding;
      }
      return texture;
    },

    createPlanetAtmosphere: function (planetData) {
      const tint = ATMOSPHERE_COLORS[planetData.name];
      if (!tint) return null;
      const T = this.three;
      // Saturn's GLB has wider rings so modelFitRadius is larger than `size`;
      // we need to clear the GLB's silhouette so the rim sits outside the
      // visible body. Same reasoning for any planet whose model defines an
      // explicit fit radius.
      const baseRadius = Math.max(planetData.size, planetData.modelFitRadius || 0);
      const radius = baseRadius * (1 + ATMOSPHERE_SCALE_BOOST);
      const geometry = this.track(new T.SphereGeometry(radius, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const material = this.track(new T.ShaderMaterial({
        uniforms: {
          uColor: { value: new T.Color(tint) },
          uPower: { value: ATMOSPHERE_POWER },
          uIntensity: { value: ATMOSPHERE_INTENSITY }
        },
        vertexShader: ATMOSPHERE_VERTEX_SHADER,
        fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
        transparent: true,
        blending: T.AdditiveBlending,
        depthWrite: false,
        side: T.BackSide
      }));
      const mesh = new T.Mesh(geometry, material);
      // BackSide + transparent draws cleanly after the opaque planet surface.
      // RenderOrder bumps it past the planet's own mesh in case of ties.
      mesh.renderOrder = 1;
      return mesh;
    },

    requestPlanetModel: function (planetState, priority) {
      const planetData = planetState && planetState.data;
      if (!planetData || !planetData.modelUrl || planetState.loadedModel || planetState.modelLoading) {
        return;
      }
      if (this.shouldSkipPlanetModel(planetData, priority)) {
        planetState.modelSkipped = true;
        return;
      }

      planetState.modelSkipped = false;
      planetState.modelLoading = true;
      enqueueModelLoad((finish) => {
        this.tryLoadPlanetModel(planetState, planetData, () => {
          planetState.modelLoading = false;
          finish();
        });
      }, priority);
    },

    shouldSkipPlanetModel: function (planetData, priority) {
      if (!planetData.modelUrl) {
        return true;
      }
      if (IS_LOW_POWER && (planetData.modelCost === "heavy" || planetData.modelCost === "ultra")) {
        return true;
      }
      if (!priority && (planetData.modelCost === "heavy" || planetData.modelCost === "ultra")) {
        return true;
      }
      return false;
    },

    tryLoadPlanetModel: function (planetState, planetData, done) {
      const T = this.three;
      const LoaderCtor = T.GLTFLoader || (typeof THREE !== "undefined" && THREE.GLTFLoader);
      const finish = typeof done === "function" ? done : () => {};
      if (!LoaderCtor) {
        console.warn("GLTFLoader unavailable; using procedural planet for", planetData.name);
        finish();
        return;
      }

      const loader = new LoaderCtor();
      this.loadGltfModel(
        loader,
        planetData.modelUrl,
        planetData,
        (gltf) => {
          const model = gltf && (gltf.scene || (gltf.scenes && gltf.scenes[0]));
          if (!model || !planetState.mesh) {
            finish();
            return;
          }

          this.fitModelToRadius(model, planetData.modelFitRadius || planetData.size);
          if (Array.isArray(planetData.modelRotation)) {
            model.rotation.set(
              planetData.modelRotation[0] || 0,
              planetData.modelRotation[1] || 0,
              planetData.modelRotation[2] || 0
            );
          }

          model.traverse((child) => {
            if (!child || !child.isMesh) return;
            child.userData.planetState = planetState;
            child.frustumCulled = false;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            for (const mat of materials) {
              if (!mat) continue;
              if (mat.map && this.three.SRGBColorSpace) {
                mat.map.colorSpace = this.three.SRGBColorSpace;
              } else if (mat.map) {
                mat.map.encoding = this.three.sRGBEncoding;
              }
              mat.needsUpdate = true;
            }
          });

          if (planetState.renderMesh) {
            planetState.renderMesh.visible = false;
          }
          if (planetState.ringMesh && planetData.modelIncludesRing) {
            planetState.ringMesh.visible = false;
          }

          planetState.loadedModel = model;
          planetState.mesh.add(model);

          if (planetData.playModelAnimations && gltf.animations && gltf.animations.length && T.AnimationMixer) {
            planetState.modelMixer = new T.AnimationMixer(model);
            for (const clip of gltf.animations) {
              planetState.modelMixer.clipAction(clip).play();
            }
          }
          finish();
        },
        (err) => {
          console.warn(`Failed to load ${planetData.name} model from ${planetData.modelUrl}:`, err);
          finish();
        }
      );
    },

    loadGltfModel: function (loader, url, options, onLoad, onError) {
      if (!options || !options.patchSpecGloss) {
        loader.load(url, onLoad, undefined, onError);
        return;
      }

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} while loading ${url}`);
          }
          return response.arrayBuffer();
        })
        .then((buffer) => this.patchSpecGlossGlb(buffer))
        .then((buffer) => {
          loader.parse(buffer, this.getModelBasePath(url), onLoad, onError);
        })
        .catch(onError);
    },

    getModelBasePath: function (url) {
      const absolute = new URL(url, window.location.href);
      absolute.pathname = absolute.pathname.slice(0, absolute.pathname.lastIndexOf("/") + 1);
      absolute.search = "";
      absolute.hash = "";
      return absolute.href;
    },

    patchSpecGlossGlb: function (buffer) {
      const GLB_MAGIC = 0x46546c67;
      const JSON_CHUNK = 0x4e4f534a;
      const SPEC_GLOSS_EXTENSION = "KHR_materials_pbrSpecularGlossiness";
      const view = new DataView(buffer);

      if (view.byteLength < 20 || view.getUint32(0, true) !== GLB_MAGIC || view.getUint32(4, true) !== 2) {
        return buffer;
      }

      const jsonLength = view.getUint32(12, true);
      const jsonType = view.getUint32(16, true);
      if (jsonType !== JSON_CHUNK) {
        return buffer;
      }

      const jsonStart = 20;
      const jsonEnd = jsonStart + jsonLength;
      const decoder = new TextDecoder();
      const jsonText = decoder
        .decode(new Uint8Array(buffer, jsonStart, jsonLength))
        .replace(/\u0000+$/g, "")
        .trim();
      const gltf = JSON.parse(jsonText);
      let changed = false;

      for (const material of gltf.materials || []) {
        const specGloss = material.extensions && material.extensions[SPEC_GLOSS_EXTENSION];
        if (!specGloss) continue;

        const pbr = material.pbrMetallicRoughness || {};
        if (specGloss.diffuseFactor && !pbr.baseColorFactor) {
          pbr.baseColorFactor = specGloss.diffuseFactor;
        }
        if (specGloss.diffuseTexture && !pbr.baseColorTexture) {
          pbr.baseColorTexture = specGloss.diffuseTexture;
        }
        if (typeof pbr.metallicFactor !== "number") {
          pbr.metallicFactor = 0;
        }
        if (typeof pbr.roughnessFactor !== "number") {
          const gloss = typeof specGloss.glossinessFactor === "number" ? specGloss.glossinessFactor : 0.5;
          pbr.roughnessFactor = Math.max(0, Math.min(1, 1 - gloss));
        }

        material.pbrMetallicRoughness = pbr;
        delete material.extensions[SPEC_GLOSS_EXTENSION];
        if (Object.keys(material.extensions).length === 0) {
          delete material.extensions;
        }
        changed = true;
      }

      if (!changed) {
        return buffer;
      }

      const removeExtension = (list) => {
        if (!Array.isArray(list)) return list;
        const next = list.filter((name) => name !== SPEC_GLOSS_EXTENSION);
        return next.length ? next : undefined;
      };
      gltf.extensionsRequired = removeExtension(gltf.extensionsRequired);
      gltf.extensionsUsed = removeExtension(gltf.extensionsUsed);
      if (!gltf.extensionsRequired) delete gltf.extensionsRequired;
      if (!gltf.extensionsUsed) delete gltf.extensionsUsed;

      const encoder = new TextEncoder();
      const jsonBytes = encoder.encode(JSON.stringify(gltf));
      const paddedJsonLength = Math.ceil(jsonBytes.length / 4) * 4;
      const rest = new Uint8Array(buffer, jsonEnd);
      const totalLength = 12 + 8 + paddedJsonLength + rest.byteLength;
      const patched = new ArrayBuffer(totalLength);
      const patchedView = new DataView(patched);
      const patchedBytes = new Uint8Array(patched);

      patchedView.setUint32(0, GLB_MAGIC, true);
      patchedView.setUint32(4, 2, true);
      patchedView.setUint32(8, totalLength, true);
      patchedView.setUint32(12, paddedJsonLength, true);
      patchedView.setUint32(16, JSON_CHUNK, true);
      patchedBytes.set(jsonBytes, 20);
      for (let i = 20 + jsonBytes.length; i < 20 + paddedJsonLength; i += 1) {
        patchedBytes[i] = 0x20;
      }
      patchedBytes.set(rest, 20 + paddedJsonLength);

      return patched;
    },

    fitModelToRadius: function (model, targetRadius) {
      const T = this.three;
      const box = new T.Box3().setFromObject(model);
      const size = new T.Vector3();
      const center = new T.Vector3();
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0 && isFinite(maxDim)) {
        model.scale.multiplyScalar((targetRadius * 2) / maxDim);
      }

      new T.Box3().setFromObject(model).getCenter(center);
      model.position.sub(center);
    },

    createPlanetPickTarget: function (planetData) {
      const radius = Math.max(planetData.size * PLANET_PICK_TARGET_SCALE, PLANET_PICK_TARGET_MIN_SIZE);
      const geometry = this.track(new this.three.SphereGeometry(radius, PLANET_PICK_TARGET_SEGMENTS, PLANET_PICK_TARGET_SEGMENTS));
      const material = this.track(new this.three.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      const target = new this.three.Mesh(geometry, material);

      target.name = `${planetData.name} pick target`;
      return target;
    },

    createMoon: function (parent) {
      // A tiny Moon orbiting Earth helps the scale model feel immediately
      // recognizable. The MeshStandardMaterial reacts to the Sun's PointLight,
      // so the Moon naturally shows phases as it orbits.
      const moonPivot = new this.three.Group();
      const moonGeometry = this.track(new this.three.SphereGeometry(SOLAR_MOON_SIZE, 16, 16));
      const moonMaterial = this.track(new this.three.MeshStandardMaterial({
        map: this.createPlanetTexture("moon"),
        color: "#ffffff",
        roughness: 0.95
      }));
      const moon = new this.three.Mesh(moonGeometry, moonMaterial);

      moon.position.x = SOLAR_MOON_RADIUS;
      moonPivot.add(moon);
      parent.add(moonPivot);

      return moonPivot;
    },

    createPlanetTexture: function (kind) {
      // Procedural canvas textures keep the project file:// friendly (no CORS
      // issues, no extra HTTP requests) while still giving each planet a
      // distinctive appearance for kids.
      const width = PROCEDURAL_TEXTURE_WIDTH;
      const height = PROCEDURAL_TEXTURE_HEIGHT;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const drawNoise = (alphaMin, alphaMax, count, hue) => {
        for (let i = 0; i < count; i += 1) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const r = randomBetween(0.5, 2.4);
          const a = randomBetween(alphaMin, alphaMax);
          ctx.fillStyle = `hsla(${hue}, 30%, 60%, ${a})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, TWO_PI);
          ctx.fill();
        }
      };

      const horizontalBands = (stops) => {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        for (const [stop, color] of stops) grad.addColorStop(stop, color);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      };

      const wavyBands = (baseColor, bandColors, bandCount) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < bandCount; i += 1) {
          const y = (i / bandCount) * height;
          const bandHeight = height / bandCount;
          ctx.fillStyle = bandColors[i % bandColors.length];
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x <= width; x += 8) {
            const wob = Math.sin((x / width) * Math.PI * 6 + i) * 4;
            ctx.lineTo(x, y + wob);
          }
          ctx.lineTo(width, y + bandHeight);
          for (let x = width; x >= 0; x -= 8) {
            const wob = Math.sin((x / width) * Math.PI * 6 + i + 1) * 4;
            ctx.lineTo(x, y + bandHeight + wob);
          }
          ctx.closePath();
          ctx.fill();
        }
      };

      switch (kind) {
        case "sun": {
          const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, height);
          grad.addColorStop(0, "#fff7c8");
          grad.addColorStop(0.4, "#ffd24a");
          grad.addColorStop(1, "#ff7a18");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          for (let i = 0; i < 240; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = randomBetween(2, 14);
            ctx.fillStyle = `rgba(255, ${180 + Math.random() * 60 | 0}, 60, ${0.15 + Math.random() * 0.35})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
          }
          // Sunspot specks.
          for (let i = 0; i < 14; i += 1) {
            ctx.fillStyle = "rgba(120, 40, 0, 0.55)";
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(2, 5), 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "mercury": {
          horizontalBands([[0, "#8a7e74"], [0.5, "#b8aaa0"], [1, "#7a6e64"]]);
          // Crater dots — the most recognizable Mercury feature.
          for (let i = 0; i < 320; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = randomBetween(1.5, 6);
            ctx.fillStyle = `rgba(60, 50, 45, ${randomBetween(0.25, 0.6)})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
            ctx.fillStyle = `rgba(220, 210, 200, ${randomBetween(0.15, 0.3)})`;
            ctx.beginPath();
            ctx.arc(x - r * 0.4, y - r * 0.4, r * 0.4, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "venus": {
          horizontalBands([[0, "#d8a866"], [0.5, "#f5c97e"], [1, "#caa05a"]]);
          wavyBands("rgba(0,0,0,0)",
            ["rgba(255, 220, 160, 0.18)", "rgba(180, 130, 70, 0.22)"], 14);
          break;
        }
        case "earth": {
          // Ocean base.
          horizontalBands([[0, "#1f4ea0"], [0.5, "#2c6dd2"], [1, "#1a3f80"]]);
          // Continent blobs.
          ctx.fillStyle = "#3b8a3b";
          for (let i = 0; i < 14; i += 1) {
            const cx = Math.random() * width;
            const cy = randomBetween(height * 0.15, height * 0.85);
            ctx.beginPath();
            const points = 9;
            for (let j = 0; j <= points; j += 1) {
              const a = (j / points) * TWO_PI;
              const r = randomBetween(8, 38);
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r * 0.6;
              if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          }
          // Polar ice.
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fillRect(0, 0, width, 12);
          ctx.fillRect(0, height - 12, width, 12);
          // Cloud wisps.
          for (let i = 0; i < 60; i += 1) {
            ctx.fillStyle = `rgba(255,255,255,${randomBetween(0.18, 0.55)})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, randomBetween(8, 30), randomBetween(2, 6), Math.random() * Math.PI, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "mars": {
          horizontalBands([[0, "#a83a1f"], [0.5, "#d35a36"], [1, "#7a2710"]]);
          for (let i = 0; i < 220; i += 1) {
            ctx.fillStyle = `rgba(${80 + Math.random() * 70 | 0}, ${30 + Math.random() * 30 | 0}, 20, ${randomBetween(0.2, 0.45)})`;
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(2, 7), 0, TWO_PI);
            ctx.fill();
          }
          // Polar caps.
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillRect(0, 0, width, 8);
          ctx.fillRect(0, height - 8, width, 8);
          break;
        }
        case "jupiter": {
          wavyBands("#d6a368",
            ["#f0d4a4", "#a87338", "#e6bd86", "#7a4a1a", "#d4a36a"], 16);
          // Great Red Spot.
          ctx.fillStyle = "#a8351e";
          ctx.beginPath();
          ctx.ellipse(width * 0.65, height * 0.62, 26, 14, 0.1, 0, TWO_PI);
          ctx.fill();
          ctx.fillStyle = "rgba(255, 200, 160, 0.4)";
          ctx.beginPath();
          ctx.ellipse(width * 0.65, height * 0.62, 22, 11, 0.1, 0, TWO_PI);
          ctx.fill();
          break;
        }
        case "saturn": {
          wavyBands("#dfc187",
            ["#f3e0ad", "#c69e58", "#e6cc91", "#a8843e"], 12);
          break;
        }
        case "uranus": {
          horizontalBands([[0, "#a8e1f0"], [0.5, "#7dd3fc"], [1, "#9ad6ea"]]);
          wavyBands("rgba(0,0,0,0)",
            ["rgba(180, 230, 250, 0.25)", "rgba(120, 180, 210, 0.18)"], 6);
          break;
        }
        case "neptune": {
          horizontalBands([[0, "#3a5fcf"], [0.5, "#4169e1"], [1, "#284aa3"]]);
          wavyBands("rgba(0,0,0,0)",
            ["rgba(180, 210, 255, 0.18)", "rgba(60, 100, 200, 0.22)"], 8);
          // Dark spot like Neptune's storms.
          ctx.fillStyle = "rgba(20, 30, 80, 0.7)";
          ctx.beginPath();
          ctx.ellipse(width * 0.32, height * 0.45, 18, 9, 0, 0, TWO_PI);
          ctx.fill();
          break;
        }
        case "moon": {
          horizontalBands([[0, "#c8c2b3"], [0.5, "#d9d7ce"], [1, "#aaa498"]]);
          for (let i = 0; i < 200; i += 1) {
            ctx.fillStyle = `rgba(70, 65, 60, ${randomBetween(0.25, 0.55)})`;
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(1.2, 4), 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiStar": {
          // Tau Ceti is G8V — a touch cooler and more amber than the Sun.
          const grad = ctx.createRadialGradient(width / 2, height / 2, 18, width / 2, height / 2, height);
          grad.addColorStop(0, "#fff0b8");
          grad.addColorStop(0.4, "#ffba50");
          grad.addColorStop(1, "#e0631a");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          for (let i = 0; i < 220; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = randomBetween(2, 13);
            ctx.fillStyle = `rgba(255, ${160 + Math.random() * 60 | 0}, 50, ${0.15 + Math.random() * 0.32})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
          }
          for (let i = 0; i < 12; i += 1) {
            ctx.fillStyle = "rgba(110, 30, 0, 0.55)";
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(2, 5), 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiG": {
          // Innermost: scorched, lava-streaked super-Earth.
          horizontalBands([[0, "#7a3520"], [0.5, "#c97a4f"], [1, "#5e2613"]]);
          for (let i = 0; i < 280; i += 1) {
            ctx.fillStyle = `rgba(${180 + Math.random() * 60 | 0}, ${60 + Math.random() * 40 | 0}, 20, ${randomBetween(0.2, 0.5)})`;
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(1.5, 5), 0, TWO_PI);
            ctx.fill();
          }
          // A few bright lava cracks.
          for (let i = 0; i < 24; i += 1) {
            ctx.strokeStyle = `rgba(255, 180, 60, ${randomBetween(0.4, 0.8)})`;
            ctx.lineWidth = randomBetween(1, 2.5);
            ctx.beginPath();
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + randomBetween(-30, 30), sy + randomBetween(-12, 12));
            ctx.stroke();
          }
          break;
        }
        case "tauCetiH": {
          // Warm super-Earth with rocky cratering.
          horizontalBands([[0, "#8a3d28"], [0.5, "#b86045"], [1, "#6e2c1e"]]);
          for (let i = 0; i < 260; i += 1) {
            const r = randomBetween(1.5, 5.5);
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillStyle = `rgba(50, 22, 14, ${randomBetween(0.25, 0.55)})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
            ctx.fillStyle = `rgba(220, 170, 140, ${randomBetween(0.15, 0.3)})`;
            ctx.beginPath();
            ctx.arc(x - r * 0.4, y - r * 0.4, r * 0.4, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiE": {
          // Inner-habitable-zone super-Earth — possible oceans + landmasses.
          horizontalBands([[0, "#264e84"], [0.5, "#5e8fbf"], [1, "#1f3f6a"]]);
          ctx.fillStyle = "#5b8a4a";
          for (let i = 0; i < 12; i += 1) {
            const cx = Math.random() * width;
            const cy = randomBetween(height * 0.2, height * 0.8);
            ctx.beginPath();
            const points = 9;
            for (let j = 0; j <= points; j += 1) {
              const a = (j / points) * TWO_PI;
              const r = randomBetween(10, 36);
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r * 0.55;
              if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          }
          // Sparse polar ice (warm planet, only thin caps).
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fillRect(0, 0, width, 6);
          ctx.fillRect(0, height - 6, width, 6);
          // Cloud wisps.
          for (let i = 0; i < 50; i += 1) {
            ctx.fillStyle = `rgba(255,255,255,${randomBetween(0.18, 0.45)})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, randomBetween(8, 26), randomBetween(2, 5), Math.random() * Math.PI, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiF": {
          // Outer-habitable-zone super-Earth — colder, slate-blue with thicker ice.
          horizontalBands([[0, "#3e5878"], [0.5, "#7896b8"], [1, "#2a3e5a"]]);
          // Thicker polar caps.
          ctx.fillStyle = "rgba(232, 240, 255, 0.92)";
          ctx.fillRect(0, 0, width, 18);
          ctx.fillRect(0, height - 18, width, 18);
          // Faint frozen continents.
          ctx.fillStyle = "rgba(180, 195, 215, 0.55)";
          for (let i = 0; i < 10; i += 1) {
            const cx = Math.random() * width;
            const cy = randomBetween(height * 0.25, height * 0.75);
            ctx.beginPath();
            const points = 8;
            for (let j = 0; j <= points; j += 1) {
              const a = (j / points) * TWO_PI;
              const r = randomBetween(8, 28);
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r * 0.6;
              if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          }
          // High thin clouds.
          for (let i = 0; i < 40; i += 1) {
            ctx.fillStyle = `rgba(220, 235, 255, ${randomBetween(0.14, 0.34)})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, randomBetween(10, 28), randomBetween(2, 5), Math.random() * Math.PI, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        default:
          ctx.fillStyle = "#888";
          ctx.fillRect(0, 0, width, height);
      }

      // Soft brightness noise on every body so it never reads as a flat color.
      drawNoise(0.04, 0.1, 60, 30);

      const texture = this.track(new this.three.CanvasTexture(canvas));
      if (this.three.SRGBColorSpace) {
        texture.colorSpace = this.three.SRGBColorSpace;
      } else {
        texture.encoding = this.three.sRGBEncoding;
      }
      texture.needsUpdate = true;
      return texture;
    },

    createAsteroidBelt: function () {
      // A ring of small instanced rocks. In the Solar System this is the
      // main belt between Mars and Jupiter; in Tau Ceti this becomes the
      // dusty debris disk that lies just outside the outermost planet.
      const belt = this.systemDef.asteroidBelt;
      const geometry = this.track(new this.three.SphereGeometry(1, 6, 6));
      const material = this.track(new this.three.MeshStandardMaterial({
        color: belt.color,
        roughness: 0.95,
        metalness: 0.02
      }));
      const mesh = new this.three.InstancedMesh(geometry, material, ASTEROID_COUNT);
      mesh.instanceMatrix.setUsage(this.three.DynamicDrawUsage);

      this.asteroids = [];
      for (let i = 0; i < ASTEROID_COUNT; i += 1) {
        this.asteroids.push({
          angle: randomBetween(0, TWO_PI),
          radius: randomBetween(belt.innerRadius, belt.outerRadius),
          height: randomBetween(-belt.heightVariance, belt.heightVariance),
          size: randomBetween(belt.minSize, belt.maxSize),
          speed: randomBetween(belt.minSpeed, belt.maxSpeed)
        });
      }
      this.asteroidMesh = mesh;
      this.root.add(mesh);
    },

    createShips: function () {
      // Story-driven extras: in Tau Ceti, Project Hail Mary parks the Hail
      // Mary and the Blip-A near Tau Ceti e. Solar has no ships, so this
      // method short-circuits.
      this.ships = [];
      const shipDefs = this.systemDef.ships;
      if (!shipDefs || shipDefs.length === 0) {
        return;
      }
      const T = this.three;
      for (const shipDef of shipDefs) {
        const mesh = this.createShipMesh(shipDef);
        if (!mesh) {
          continue;
        }
        mesh.position.fromArray(shipDef.position);

        // Invisible pick sphere covers the whole ship so taps register easily.
        const pickRadius = Math.max(shipDef.pickRadius || 0.06, PLANET_PICK_TARGET_MIN_SIZE);
        const pickGeo = this.track(new T.SphereGeometry(pickRadius, PLANET_PICK_TARGET_SEGMENTS, PLANET_PICK_TARGET_SEGMENTS));
        const pickMat = this.track(new T.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false
        }));
        const pickTarget = new T.Mesh(pickGeo, pickMat);
        pickTarget.position.fromArray(shipDef.position);
        pickTarget.name = `${shipDef.name} pick target`;

        const shipState = {
          mesh,
          pickTarget,
          data: shipDef.info,
          def: shipDef,
          kind: "ship",
          centrifuge: mesh.userData.centrifuge || null,
          loadedModel: null,
          modelLoading: false
        };
        mesh.userData.planetState = shipState;
        pickTarget.userData.planetState = shipState;

        this.ships.push(shipState);
        this.root.add(mesh, pickTarget);

        // If a GLB URL is configured, try to load it. On success, the loaded
        // model takes over and the procedural mesh is hidden. On failure, the
        // procedural mesh stays visible (graceful fallback for offline / CORS).
        this.requestShipModel(shipState, false);
      }
    },

    createShipMesh: function (shipDef) {
      if (shipDef.kind === "hailMary") {
        return this.createHailMaryMesh();
      }
      if (shipDef.kind === "blipA") {
        return this.createBlipAMesh();
      }
      return null;
    },

    requestShipModel: function (shipState, priority) {
      const shipDef = shipState && shipState.def;
      if (!shipDef || !shipDef.modelUrl || shipState.loadedModel || shipState.modelLoading) {
        return;
      }
      if (this.shouldSkipShipModel(shipDef, priority)) {
        shipState.modelSkipped = true;
        return;
      }

      shipState.modelSkipped = false;
      shipState.modelLoading = true;
      enqueueModelLoad((finish) => {
        this.tryLoadShipModel(shipState, shipDef, () => {
          shipState.modelLoading = false;
          finish();
        });
      }, priority);
    },

    shouldSkipShipModel: function (shipDef, priority) {
      if (!shipDef.modelUrl) {
        return true;
      }
      if (IS_LOW_POWER && shipDef.modelCost === "heavy") {
        return true;
      }
      if (!priority && shipDef.modelCost === "heavy" && !this.el.object3D.visible) {
        return true;
      }
      return false;
    },

    requestDeferredShipModels: function () {
      if (!this.ships) {
        return;
      }
      for (const ship of this.ships) {
        this.requestShipModel(ship, false);
      }
    },

    tryLoadShipModel: function (shipState, shipDef, done) {
      const T = this.three;
      const LoaderCtor = T.GLTFLoader || (typeof THREE !== "undefined" && THREE.GLTFLoader);
      const finish = typeof done === "function" ? done : () => {};
      if (!LoaderCtor) {
        // Bundled three.js doesn't expose GLTFLoader — keep the procedural mesh.
        console.warn("GLTFLoader unavailable; using procedural ship for", shipDef.name);
        finish();
        return;
      }

      const loader = new LoaderCtor();
      loader.load(
        shipDef.modelUrl,
        (gltf) => {
          const model = gltf && (gltf.scene || (gltf.scenes && gltf.scenes[0]));
          if (!model) {
            finish();
            return;
          }
          model.position.fromArray(shipDef.position);
          if (typeof shipDef.modelScale === "number") {
            model.scale.setScalar(shipDef.modelScale);
          }
          if (Array.isArray(shipDef.modelRotation)) {
            model.rotation.set(
              shipDef.modelRotation[0] || 0,
              shipDef.modelRotation[1] || 0,
              shipDef.modelRotation[2] || 0
            );
          }
          // Replace the procedural mesh with the loaded model. Pick target stays
          // unchanged so taps still register.
          shipState.mesh.visible = false;
          shipState.loadedModel = model;
          shipState.centrifuge = null; // GLB owns its own animation, if any
          model.userData.planetState = shipState;
          this.root.add(model);
          finish();
        },
        undefined,
        (err) => {
          console.warn(`Failed to load ${shipDef.name} model from ${shipDef.modelUrl}:`, err);
          // Procedural mesh remains visible — no further action needed.
          finish();
        }
      );
    },

    createHailMaryMesh: function () {
      const T = this.three;
      const ship = new T.Group();

      const hullMat = this.track(new T.MeshStandardMaterial({
        color: "#e1ddcf", roughness: 0.55, metalness: 0.35
      }));
      const detailMat = this.track(new T.MeshStandardMaterial({
        color: "#a4a098", roughness: 0.6, metalness: 0.55
      }));
      const engineMat = this.track(new T.MeshStandardMaterial({
        color: "#5a5862", roughness: 0.4, metalness: 0.85
      }));
      const radiatorMat = this.track(new T.MeshStandardMaterial({
        color: "#1f2230", roughness: 0.85, metalness: 0.1,
        emissive: "#5a1a08", emissiveIntensity: 0.4,
        side: T.DoubleSide
      }));
      const windowMat = this.track(new T.MeshBasicMaterial({
        color: "#fff0b0", transparent: true, opacity: 0.85,
        blending: T.AdditiveBlending, depthWrite: false
      }));
      const glowMat = this.track(new T.MeshBasicMaterial({
        color: "#ffb24d", transparent: true, opacity: 0.5,
        blending: T.AdditiveBlending, depthWrite: false
      }));

      // Spine — main structural cylinder along the ship's +Z forward axis.
      const spineLen = 0.08;
      const spine = new T.Mesh(
        this.track(new T.CylinderGeometry(0.004, 0.004, spineLen, 14, 1)),
        hullMat
      );
      spine.rotation.x = Math.PI / 2;
      ship.add(spine);

      // Front cupola (control deck).
      const cupola = new T.Mesh(
        this.track(new T.SphereGeometry(0.0085, 14, 12)),
        hullMat
      );
      cupola.position.z = spineLen / 2;
      ship.add(cupola);
      const cupolaWindow = new T.Mesh(
        this.track(new T.SphereGeometry(0.0055, 12, 10)),
        windowMat
      );
      cupolaWindow.position.z = spineLen / 2 + 0.003;
      cupolaWindow.scale.set(0.95, 0.55, 0.45);
      ship.add(cupolaWindow);

      // Centrifuge — three-arm crew section that slowly rotates around the spine.
      const centrifuge = new T.Group();
      centrifuge.position.z = -0.005;

      const hub = new T.Mesh(
        this.track(new T.CylinderGeometry(0.0075, 0.0075, 0.014, 14, 1)),
        detailMat
      );
      hub.rotation.x = Math.PI / 2;
      centrifuge.add(hub);

      const armRadius = 0.024;
      for (let i = 0; i < 3; i += 1) {
        const armGroup = new T.Group();
        armGroup.rotation.z = (i / 3) * TWO_PI;

        const strut = new T.Mesh(
          this.track(new T.CylinderGeometry(0.0016, 0.0016, armRadius, 8, 1)),
          detailMat
        );
        strut.rotation.z = -Math.PI / 2;
        strut.position.x = armRadius / 2;
        armGroup.add(strut);

        const capsuleGeo = T.CapsuleGeometry
          ? this.track(new T.CapsuleGeometry(0.0058, 0.018, 6, 12))
          : this.track(new T.CylinderGeometry(0.0058, 0.0058, 0.0296, 14, 1));
        const capsule = new T.Mesh(capsuleGeo, hullMat);
        capsule.rotation.x = Math.PI / 2;
        capsule.position.x = armRadius + 0.005;
        armGroup.add(capsule);

        // Capsule window strip on the "outer" face of the capsule.
        const windowStrip = new T.Mesh(
          this.track(new T.PlaneGeometry(0.014, 0.0014)),
          windowMat
        );
        windowStrip.position.set(armRadius + 0.005, 0.006, 0);
        windowStrip.rotation.x = -Math.PI / 2;
        armGroup.add(windowStrip);

        centrifuge.add(armGroup);
      }
      ship.add(centrifuge);

      // Radiator vanes — two big flat fins running along the ship body.
      const radiatorGeo = this.track(new T.PlaneGeometry(0.045, 0.022));
      for (const side of [-1, 1]) {
        const radiator = new T.Mesh(radiatorGeo, radiatorMat);
        radiator.rotation.x = Math.PI / 2;
        radiator.position.set(side * 0.018, 0, -spineLen / 2 + 0.025);
        ship.add(radiator);
      }

      // Engine bell + nozzles at the rear (-Z).
      const bell = new T.Mesh(
        this.track(new T.CylinderGeometry(0.013, 0.016, 0.014, 16, 1)),
        engineMat
      );
      bell.position.z = -spineLen / 2 - 0.007;
      bell.rotation.x = Math.PI / 2;
      ship.add(bell);

      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * TWO_PI + Math.PI / 4;
        const nozzle = new T.Mesh(
          this.track(new T.CylinderGeometry(0.0035, 0.0055, 0.01, 10, 1)),
          engineMat
        );
        nozzle.position.set(Math.cos(angle) * 0.008, Math.sin(angle) * 0.008, -spineLen / 2 - 0.018);
        nozzle.rotation.x = Math.PI / 2;
        ship.add(nozzle);
      }

      const driveGlow = new T.Mesh(
        this.track(new T.SphereGeometry(0.014, 14, 12)),
        glowMat
      );
      driveGlow.position.z = -spineLen / 2 - 0.024;
      driveGlow.scale.set(1, 1, 1.7);
      ship.add(driveGlow);

      ship.userData.centrifuge = centrifuge;
      return ship;
    },

    createBlipAMesh: function () {
      const T = this.three;
      const ship = new T.Group();

      // Xenonite reads as warm, semi-translucent amber in the book. We fake
      // that with a slightly metallic standard material plus a faint emissive.
      const xenoniteMat = this.track(new T.MeshStandardMaterial({
        color: "#f0e0b0", roughness: 0.35, metalness: 0.3,
        emissive: "#3a2814", emissiveIntensity: 0.18
      }));
      const ridgeMat = this.track(new T.MeshStandardMaterial({
        color: "#c8a868", roughness: 0.55, metalness: 0.45
      }));
      const portMat = this.track(new T.MeshStandardMaterial({
        color: "#7a5a30", roughness: 0.7, metalness: 0.5
      }));

      // Main hull — flat oblate spheroid (the canonical Eridian "coffee bean").
      const hull = new T.Mesh(
        this.track(new T.SphereGeometry(0.045, 28, 20)),
        xenoniteMat
      );
      hull.scale.set(1.0, 0.32, 0.95);
      ship.add(hull);

      // Equatorial seam ridge — Eridian hulls are described as segmented.
      const seam = new T.Mesh(
        this.track(new T.TorusGeometry(0.0445, 0.0028, 8, 40)),
        ridgeMat
      );
      seam.rotation.x = Math.PI / 2;
      ship.add(seam);

      // A second, smaller belt ridge above the seam to add detail.
      const beltUpper = new T.Mesh(
        this.track(new T.TorusGeometry(0.04, 0.0014, 6, 36)),
        ridgeMat
      );
      beltUpper.rotation.x = Math.PI / 2;
      beltUpper.position.y = 0.005;
      ship.add(beltUpper);

      // Pole bumps at top and bottom — engine ports / sensor cluster.
      for (const side of [-1, 1]) {
        const polarBump = new T.Mesh(
          this.track(new T.SphereGeometry(0.012, 16, 12)),
          ridgeMat
        );
        polarBump.position.y = side * 0.013;
        polarBump.scale.set(1, 0.55, 1);
        ship.add(polarBump);

        const polarPort = new T.Mesh(
          this.track(new T.CylinderGeometry(0.005, 0.0065, 0.004, 14, 1)),
          portMat
        );
        polarPort.position.y = side * 0.0165;
        ship.add(polarPort);
      }

      // Rim ports — four equally-spaced docking / drive ports around the rim.
      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * TWO_PI;
        const port = new T.Mesh(
          this.track(new T.CylinderGeometry(0.005, 0.0065, 0.005, 12, 1)),
          portMat
        );
        port.position.set(Math.cos(angle) * 0.045, 0, Math.sin(angle) * 0.045);
        port.rotation.z = Math.PI / 2;
        port.lookAt(0, 0, 0);
        ship.add(port);
      }

      return ship;
    },

    createSaturnRing: function () {
      // Procedural banded ring: ShaderMaterial computes a radial banding
      // pattern + soft inner/outer fades from the mesh's object-space
      // position. This adds visible structure without an extra texture file,
      // and stacks cleanly on top of Saturn's GLB ring for a richer look.
      const T = this.three;
      const geometry = this.track(new T.RingGeometry(
        SOLAR_SATURN_RING_INNER,
        SOLAR_SATURN_RING_OUTER,
        DISK_SEGMENTS,
        2
      ));
      const material = this.track(new T.ShaderMaterial({
        uniforms: {
          uInner: { value: SOLAR_SATURN_RING_INNER },
          uOuter: { value: SOLAR_SATURN_RING_OUTER },
          uFrequency: { value: SATURN_RING_BAND_FREQUENCY },
          uOpacity: { value: SATURN_RING_GLOW_OPACITY },
          uColorA: { value: new T.Color("#f3d590") },
          uColorB: { value: new T.Color("#fff1c4") }
        },
        vertexShader: RING_VERTEX_SHADER,
        fragmentShader: RING_FRAGMENT_SHADER,
        side: T.DoubleSide,
        transparent: true,
        blending: T.AdditiveBlending,
        depthWrite: false
      }));
      const ring = new T.Mesh(geometry, material);

      ring.rotation.x = T.MathUtils.degToRad(SOLAR_SATURN_RING_TILT_X);
      ring.rotation.z = T.MathUtils.degToRad(SOLAR_SATURN_RING_TILT_Z);

      return ring;
    },

    createStarField: function () {
      // Background points with per-vertex twinkle. The phase attribute keeps
      // each star desynced so the field shimmers as a whole rather than
      // pulsing in unison. uPixelRatio scales gl_PointSize so the look stays
      // consistent on high-DPI displays.
      const T = this.three;
      const positions = [];
      const phases = [];
      const sizes = [];

      for (let i = 0; i < SOLAR_STAR_COUNT; i += 1) {
        const angle = randomBetween(0, TWO_PI);
        const height = randomBetween(SOLAR_STAR_MIN_HEIGHT, SOLAR_STAR_MAX_HEIGHT);
        const radius = randomBetween(SOLAR_STAR_RADIUS * SOLAR_STAR_MIN_RADIUS_SCALE, SOLAR_STAR_RADIUS);

        positions.push(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );
        phases.push(Math.random());
        // Slight log-normal-ish distribution: most stars small, a few bright.
        const s = 0.4 + Math.pow(Math.random(), 2.2) * 1.6;
        sizes.push(s);
      }

      const geometry = this.track(new T.BufferGeometry());
      geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("aPhase", new T.Float32BufferAttribute(phases, 1));
      geometry.setAttribute("aSize", new T.Float32BufferAttribute(sizes, 1));

      this.starUniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uBaseSize: { value: STAR_BASE_SIZE }
      };
      const material = this.track(new T.ShaderMaterial({
        uniforms: this.starUniforms,
        vertexShader: STAR_VERTEX_SHADER,
        fragmentShader: STAR_FRAGMENT_SHADER,
        transparent: true,
        blending: T.AdditiveBlending,
        depthWrite: false
      }));

      this.stars = new T.Points(geometry, material);
      this.root.add(this.stars);
    },

    // Comet/shooting-star pool. We precompute a small parabolic arc in object
    // space, then re-orient and re-position the whole line on each spawn. The
    // vertex shader is the workhorse: every vertex carries a "T" parameter
    // (0..1 along the arc) and a uHead uniform sweeps from 0 → 1 over the
    // comet's lifetime; only a short window of vertices behind uHead is
    // visible, which reads as a moving streak.
    createComets: function () {
      const T = this.three;
      this.comets = [];
      const haloTexture = this.getSunHaloTexture();
      const now = (typeof performance !== "undefined" ? performance.now() : Date.now());

      for (let i = 0; i < COMET_POOL_SIZE; i += 1) {
        const segments = COMET_TRAIL_SEGMENTS;
        // Static placeholder positions; rebuilt per spawn via setArcPositions.
        const positions = new Float32Array(segments * 3);
        const ts = new Float32Array(segments);
        for (let j = 0; j < segments; j += 1) {
          ts[j] = j / (segments - 1);
        }
        const geometry = this.track(new T.BufferGeometry());
        geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("aT", new T.Float32BufferAttribute(ts, 1));

        const uniforms = {
          uHead: { value: 0 },
          uTailLength: { value: 0.45 },
          uColor: { value: new T.Color(COMET_TAIL_COLOR) }
        };
        const lineMaterial = this.track(new T.ShaderMaterial({
          uniforms,
          vertexShader: COMET_VERTEX_SHADER,
          fragmentShader: COMET_FRAGMENT_SHADER,
          transparent: true,
          blending: T.AdditiveBlending,
          depthWrite: false,
          depthTest: true
        }));
        const line = new T.Line(geometry, lineMaterial);
        line.frustumCulled = false;
        line.visible = false;
        line.renderOrder = 2;

        const headMaterial = this.track(new T.SpriteMaterial({
          map: haloTexture,
          color: COMET_HEAD_COLOR,
          transparent: true,
          blending: T.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          opacity: 1
        }));
        const head = new T.Sprite(headMaterial);
        head.scale.set(COMET_HEAD_SIZE, COMET_HEAD_SIZE, 1);
        head.visible = false;
        head.renderOrder = 3;
        this.root.add(line);
        this.root.add(head);

        this.comets.push({
          line,
          head,
          geometry,
          positions,
          uniforms,
          active: false,
          tStart: 0,
          duration: 0,
          // Stagger the first spawns so the pool doesn't all fire at once.
          nextSpawnAt: now + 1200 + i * 2200 + Math.random() * 1500
        });
      }
    },

    spawnComet: function (comet, now) {
      // Random 3D parabolic arc on a tangent plane. Pick a start angle around
      // the marker, then sweep through an arc of angularLength. The arc curves
      // upward in the middle so the comet looks like it's gliding past the
      // viewer rather than orbiting flat.
      const baseAngle = Math.random() * TWO_PI;
      const angularLength = randomBetween(COMET_ARC_MIN, COMET_ARC_MAX) * (Math.random() < 0.5 ? -1 : 1);
      const radius = randomBetween(COMET_RADIUS_MIN, COMET_RADIUS_MAX);
      const startHeight = randomBetween(COMET_HEIGHT_MIN, COMET_HEIGHT_MAX);
      const endHeight = randomBetween(COMET_HEIGHT_MIN, COMET_HEIGHT_MAX);
      const peakOffset = randomBetween(0.06, 0.18);
      const segments = COMET_TRAIL_SEGMENTS;
      const positions = comet.positions;

      for (let j = 0; j < segments; j += 1) {
        const t = j / (segments - 1);
        const angle = baseAngle + angularLength * t;
        // Parabolic arc: height climbs then falls back, biased by start/end.
        const heightLerp = startHeight + (endHeight - startHeight) * t;
        const arcLift = Math.sin(t * Math.PI) * peakOffset;
        positions[j * 3 + 0] = Math.cos(angle) * radius;
        positions[j * 3 + 1] = heightLerp + arcLift;
        positions[j * 3 + 2] = Math.sin(angle) * radius;
      }
      comet.geometry.attributes.position.needsUpdate = true;
      comet.geometry.computeBoundingSphere();

      comet.tailLength = 0.30 + Math.random() * 0.25;
      comet.uniforms.uTailLength.value = comet.tailLength;
      comet.uniforms.uHead.value = 0;

      // Tint the tail toward warm yellow occasionally so not every comet
      // looks identical.
      const warm = Math.random() < 0.35;
      comet.uniforms.uColor.value.set(warm ? "#ffd28a" : COMET_TAIL_COLOR);
      comet.head.material.color.set(warm ? "#fff1c2" : COMET_HEAD_COLOR);

      comet.duration = randomBetween(COMET_DURATION_MIN_MS, COMET_DURATION_MAX_MS);
      comet.tStart = now;
      comet.active = true;
      comet.line.visible = true;
      comet.head.visible = true;
    },

    updateComets: function (now) {
      if (!this.comets) return;
      for (const comet of this.comets) {
        if (!comet.active) {
          if (now >= comet.nextSpawnAt) {
            this.spawnComet(comet, now);
          }
          continue;
        }

        const progress = (now - comet.tStart) / comet.duration;
        if (progress >= 1) {
          comet.active = false;
          comet.line.visible = false;
          comet.head.visible = false;
          comet.nextSpawnAt = now + randomBetween(COMET_SPAWN_MIN_MS, COMET_SPAWN_MAX_MS);
          continue;
        }

        // uHead lives on a [0, 1 + tailLength] sweep so the tail finishes
        // streaming off the end before we deactivate.
        const sweep = 1 + comet.tailLength;
        comet.uniforms.uHead.value = progress * sweep;

        // Place the head sprite at the actual head position along the arc.
        // We sample by linear interpolation between the two surrounding
        // vertices — close enough for a 14-segment streak.
        const segments = COMET_TRAIL_SEGMENTS;
        const headT = Math.min(progress * sweep, 1);
        const fIndex = headT * (segments - 1);
        const i0 = Math.floor(fIndex);
        const i1 = Math.min(i0 + 1, segments - 1);
        const f = fIndex - i0;
        const p = comet.positions;
        comet.head.position.set(
          p[i0 * 3 + 0] * (1 - f) + p[i1 * 3 + 0] * f,
          p[i0 * 3 + 1] * (1 - f) + p[i1 * 3 + 1] * f,
          p[i0 * 3 + 2] * (1 - f) + p[i1 * 3 + 2] * f
        );

        // Head fades in fast and out slowly so the streak reads as the lead.
        const headAlpha = progress < 0.1
          ? progress / 0.1
          : Math.max(0, 1 - (progress - 0.1) / 0.9);
        comet.head.material.opacity = headAlpha;
      }
    },

    bindMarkerEvents: function () {
      this.hud = document.getElementById(HUD_ID);
      this.marker = this.el.closest("a-marker");
      this.hudTimer = null;

      if (!this.marker) {
        return;
      }

      this.onMarkerFound = () => {
        // Two scenes can share a marker (the system-switcher hides one). Only
        // the visible one should drive the HUD so the inactive scene doesn't
        // overwrite the active scene's status text.
        if (!this.el.object3D.visible) return;
        this.markerEverFound = true;
        this.setHud(t(this.systemDef.foundTextKey) || this.systemDef.foundText, true);
      };
      this.onMarkerLost = () => {
        if (!this.el.object3D.visible) return;
        // Once the marker has been detected at least once we keep the system
        // on screen (head-locked at its last marker pose), so the lost text
        // would lie to the user. Show a friendlier hint instead.
        if (this.markerEverFound) {
          this.setHud(t("markerLostPersistent"), true);
        } else {
          this.setHud(t("hudLost") || HUD_LOST_TEXT, false);
        }
      };

      this.marker.addEventListener("markerFound", this.onMarkerFound);
      this.marker.addEventListener("markerLost", this.onMarkerLost);
    },

    setHud: function (message, autoHide) {
      if (!this.hud) {
        return;
      }

      window.clearTimeout(this.hudTimer);
      this.hud.textContent = message || t("hudDefault") || HUD_DEFAULT_TEXT;
      this.hud.classList.remove(HUD_HIDDEN_CLASS);

      if (autoHide) {
        this.hudTimer = window.setTimeout(() => {
          this.hud.classList.add(HUD_HIDDEN_CLASS);
        }, HUD_HIDE_DELAY_MS);
      }
    },

    setupInfoPanel: function () {
      const panel = document.createElement("div");
      panel.className = "planet-info";

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "planet-info-close";
      closeButton.setAttribute("aria-label", t("closeInfo"));
      closeButton.textContent = "×";

      const name = document.createElement("h3");
      name.className = "planet-info-name";

      const figure = document.createElement("figure");
      figure.className = "planet-info-figure";

      const figureCanvas = document.createElement("canvas");
      figureCanvas.className = "planet-info-figure-canvas";
      figureCanvas.width = 220;
      figureCanvas.height = 150;

      const figureCaption = document.createElement("figcaption");
      figureCaption.className = "planet-info-figure-caption";

      figure.appendChild(figureCanvas);
      figure.appendChild(figureCaption);

      const stats = document.createElement("dl");
      stats.className = "planet-info-stats";

      const text = document.createElement("p");
      text.className = "planet-info-text";

      const actions = document.createElement("div");
      actions.className = "planet-info-actions";

      const speakButton = document.createElement("button");
      speakButton.type = "button";
      speakButton.className = "planet-action-button planet-speak-button";
      speakButton.textContent = SUPPORTS_SPEECH ? t("speak") : t("noVoice");
      speakButton.disabled = !SUPPORTS_SPEECH;
      speakButton.setAttribute("aria-label", t("speakAria"));

      const quizButton = document.createElement("button");
      quizButton.type = "button";
      quizButton.className = "planet-action-button planet-quiz-button";
      quizButton.textContent = t("quiz");

      const closeActionButton = document.createElement("button");
      closeActionButton.type = "button";
      closeActionButton.className = "planet-action-button planet-close-button";
      closeActionButton.textContent = t("close");

      actions.appendChild(speakButton);
      actions.appendChild(quizButton);
      actions.appendChild(closeActionButton);

      const quiz = document.createElement("div");
      quiz.className = "planet-quiz";
      quiz.hidden = true;

      panel.appendChild(closeButton);
      panel.appendChild(name);
      panel.appendChild(stats);
      panel.appendChild(text);
      panel.appendChild(actions);
      panel.appendChild(quiz);
      document.body.appendChild(panel);

      this.infoPanel = panel;
      this.infoName = name;
      this.infoFigure = figure;
      this.infoFigureCanvas = figureCanvas;
      this.infoFigureCaption = figureCaption;
      this.infoStats = stats;
      this.infoText = text;
      this.infoActions = actions;
      this.infoSpeakButton = speakButton;
      this.infoQuizButton = quizButton;
      this.infoCloseActionButton = closeActionButton;
      this.infoQuiz = quiz;

      this.onInfoClose = () => this.hidePlanetInfo();
      closeButton.addEventListener("click", this.onInfoClose);
      closeActionButton.addEventListener("click", this.onInfoClose);
      speakButton.addEventListener("click", () => this.toggleSpeech());
      quizButton.addEventListener("click", () => this.showQuiz());
    },

    setupControlPanel: function () {
      // Right-side control rail with pause, speed slider, and toggles for
      // orbits / labels / true-scale / reduced-motion. Designed for kid-sized
      // tap targets (44px+).
      const panel = document.createElement("div");
      panel.className = "control-panel";
      panel.setAttribute("role", "group");
      panel.setAttribute("aria-label", t("controlsAria"));

      const makeRow = (labelText) => {
        const row = document.createElement("div");
        row.className = "control-row";
        if (labelText) {
          const label = document.createElement("span");
          label.className = "control-label";
          label.textContent = labelText;
          row.appendChild(label);
        }
        return row;
      };

      const makeButton = (text, label, onClick) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "control-button";
        btn.textContent = text;
        btn.setAttribute("aria-label", label);
        btn.addEventListener("click", onClick);
        return btn;
      };

      const makeToggle = (text, ariaLabel, initial, onChange) => {
        const btn = makeButton(text, ariaLabel, () => {
          const next = !btn.classList.contains("is-on");
          btn.classList.toggle("is-on", next);
          btn.setAttribute("aria-pressed", String(next));
          onChange(next);
        });
        btn.classList.add("control-toggle");
        if (initial) {
          btn.classList.add("is-on");
          btn.setAttribute("aria-pressed", "true");
        } else {
          btn.setAttribute("aria-pressed", "false");
        }
        return btn;
      };

      const makeViewSlider = (axis, label, min, max, ariaLabel) => {
        const row = makeRow(label);
        row.classList.add("control-view-row");

        const slider = document.createElement("input");
        slider.type = "range";
        slider.className = "control-slider control-view-slider";
        slider.min = String(min);
        slider.max = String(max);
        slider.step = String(VIEW_ROTATION_STEP);
        slider.value = this.formatRotationSliderValue(this.getRootRotation(axis));
        slider.setAttribute("aria-label", ariaLabel);

        const value = document.createElement("span");
        value.className = "control-value control-view-value";
        value.textContent = this.formatRotationLabel(this.getRootRotation(axis));

        slider.addEventListener("input", () => {
          this.setRootRotation(axis, parseFloat(slider.value));
        });

        row.appendChild(slider);
        row.appendChild(value);
        this.viewSliders[axis] = slider;
        this.viewValues[axis] = value;
        return row;
      };

      // Pause / play.
      const pauseRow = makeRow();
      pauseRow.classList.add("control-single-button-row");
      const pauseBtn = makeButton(this.paused ? t("playButton") : t("pauseButton"), t("pauseAria"), () => {
        this.setPausedState(!this.paused);
      });
      pauseRow.appendChild(pauseBtn);
      panel.appendChild(pauseRow);

      // Speed slider.
      const speedRow = makeRow(t("speedLabel"));
      const speedSlider = document.createElement("input");
      speedSlider.type = "range";
      speedSlider.className = "control-slider";
      speedSlider.min = "0.1";
      speedSlider.max = "10";
      speedSlider.step = "0.1";
      speedSlider.value = String(this.speedMultiplier);
      speedSlider.setAttribute("aria-label", t("speedAria"));
      const speedValue = document.createElement("span");
      speedValue.className = "control-value";
      speedValue.textContent = `${this.speedMultiplier.toFixed(1)}×`;
      speedSlider.addEventListener("input", () => {
        const v = parseFloat(speedSlider.value);
        this.speedMultiplier = v;
        speedValue.textContent = `${v.toFixed(1)}×`;
      });
      speedRow.appendChild(speedSlider);
      speedRow.appendChild(speedValue);
      panel.appendChild(speedRow);

      // Precision view controls: rotate the whole 3D system to inspect it
      // from above, below, and the sides on desktop or phone.
      this.viewSliders = {};
      this.viewValues = {};
      const positionGroup = document.createElement("div");
      positionGroup.className = "view-controls";
      const positionTitle = document.createElement("div");
      positionTitle.className = "control-section-title";
      positionTitle.textContent = t("viewTitle");
      positionGroup.appendChild(positionTitle);
      positionGroup.appendChild(makeViewSlider("x", t("tiltLabel"), -VIEW_TILT_LIMIT, VIEW_TILT_LIMIT, t("tiltAria")));
      positionGroup.appendChild(makeViewSlider("y", t("turnLabel"), -VIEW_ROTATION_LIMIT, VIEW_ROTATION_LIMIT, t("turnAria")));
      positionGroup.appendChild(makeViewSlider("z", t("rollLabel"), -VIEW_ROTATION_LIMIT, VIEW_ROTATION_LIMIT, t("rollAria")));
      const centerRow = makeRow();
      centerRow.classList.add("control-view-reset-row");
      centerRow.appendChild(makeButton(t("resetView"), t("resetViewAria"), () => this.resetUserTransform()));
      positionGroup.appendChild(centerRow);
      panel.appendChild(positionGroup);

      // Toggles.
      const togglesRow = makeRow();
      togglesRow.classList.add("control-row-toggles");
      togglesRow.appendChild(makeToggle(t("orbits"), t("orbitsAria"), this.showOrbits, (on) => this.setOrbitsVisible(on)));
      togglesRow.appendChild(makeToggle(t("names"), t("namesAria"), this.showLabels, (on) => this.setLabelsVisible(on)));
      togglesRow.appendChild(makeToggle(t("trueSize"), t("trueSizeAria"), this.trueScale, (on) => this.setTrueScale(on)));
      togglesRow.appendChild(makeToggle(t("calm"), t("calmAria"), this.reducedMotion, (on) => this.setReducedMotion(on)));
      panel.appendChild(togglesRow);

      document.body.appendChild(panel);
      this.controlPanel = panel;
      this.pauseButton = pauseBtn;
      this.speedSlider = speedSlider;
      this.speedValue = speedValue;
      this.setControlPanelActive(this.el.object3D.visible);
      this.syncViewControls();
    },

    setPausedState: function (paused) {
      this.paused = !!paused;
      if (this.pauseButton) {
        this.pauseButton.textContent = this.paused ? t("playButton") : t("pauseButton");
        this.pauseButton.classList.toggle("is-on", this.paused);
      }
    },

    pauseForInfo: function () {
      if (!this.infoPanel || !this.infoPanel.classList.contains("is-visible")) {
        this.infoResumePausedState = this.paused;
      }
      this.setPausedState(true);
    },

    setControlPanelActive: function (active) {
      if (this.controlPanel) {
        this.controlPanel.classList.toggle("is-hidden", !active);
      }
      if (active) {
        this.requestDeferredShipModels();
      }
    },

    formatRotationSliderValue: function (value) {
      return String(Math.round(value || 0));
    },

    formatRotationLabel: function (value) {
      return `${Math.round(value || 0)}°`;
    },

    getRootRotation: function (axis) {
      return this.three.MathUtils.radToDeg(this.root.rotation[axis] || 0);
    },

    setRootRotation: function (axis, value) {
      const limit = axis === "x" ? VIEW_TILT_LIMIT : VIEW_ROTATION_LIMIT;
      const next = this.three.MathUtils.clamp(value || 0, -limit, limit);
      this.root.rotation[axis] = this.three.MathUtils.degToRad(next);
      this.syncViewControls();
    },

    syncViewControls: function () {
      if (!this.viewSliders || !this.viewValues) {
        return;
      }
      for (const axis of ["x", "y", "z"]) {
        const degrees = this.getRootRotation(axis);
        if (this.viewSliders[axis]) {
          this.viewSliders[axis].value = this.formatRotationSliderValue(degrees);
        }
        if (this.viewValues[axis]) {
          this.viewValues[axis].textContent = this.formatRotationLabel(degrees);
        }
      }
    },

    setOrbitsVisible: function (visible) {
      this.showOrbits = visible;
      if (this.orbitRings) {
        for (const orbit of this.orbitRings) orbit.visible = visible;
      }
    },

    setLabelsVisible: function (visible) {
      this.showLabels = visible;
      for (const planet of this.planets) {
        if (planet.label) planet.label.visible = visible;
      }
    },

    setTrueScale: function (enabled) {
      // True-scale mode: sizes become proportional to real diameters using
      // Earth's current visual radius as the unit. The Sun is compressed (a
      // log factor) so it doesn't eclipse the entire orbit view.
      this.trueScale = enabled;
      const earthBase = TRUE_SCALE_EARTH_BASE;
      for (const planet of this.planets) {
        if (enabled) {
          const targetSize = earthBase * planet.data.realSize;
          const scale = targetSize / planet.data.size;
          planet.mesh.scale.setScalar(scale);
        } else {
          planet.mesh.scale.setScalar(1);
        }
      }
      if (this.sun) {
        this.sun.scale.setScalar(enabled ? this.systemDef.star.trueScaleFactor : 1);
      }
      if (this.selectedInfoState) {
        const object = this.getSelectedVisualObject(this.selectedInfoState);
        if (object) {
          this.selectedInfoObject = object;
          this.selectedInfoBaseScale = object.scale.clone();
        }
      }
      this.setHud(
        enabled
          ? t("trueSizeOn")
          : t("trueSizeOff"),
        true
      );
    },

    setReducedMotion: function (enabled) {
      this.reducedMotion = enabled;
      if (enabled) {
        this.speedMultiplier = Math.min(this.speedMultiplier, 0.5);
        if (this.speedSlider) this.speedSlider.value = String(this.speedMultiplier);
        if (this.speedValue) this.speedValue.textContent = `${this.speedMultiplier.toFixed(1)}×`;
      }
    },

    setupPlanetPicking: function () {
      this.raycaster = new this.three.Raycaster();
      this.pointer = new this.three.Vector2();
      this.pointerStart = { x: 0, y: 0, time: 0 };
      // Multi-touch state for pinch zoom. activePointers is a Map of
      // pointerId → {x,y}. tapEligible tracks whether the current single
      // pointer is still a candidate for a planet tap (cancelled if a second
      // finger lands or the pointer travels too far).
      this.activePointers = new Map();
      this.pinchActive = false;
      this.pinchInitialDist = 0;
      this.pinchInitialZoom = 1;
      this.tapEligible = false;
      // Pan state: when active, root.position tracks finger movement so the
      // system can be picked up and moved freely in 3D (XY on screen → world
      // motion on the plane perpendicular to the camera at the grab point,
      // which gives natural up/down/left/right with one finger).
      this.panActive = false;
      this._panRootStartWorld = new this.three.Vector3();
      this._panGrabStartWorld = new this.three.Vector3();
      this._panPlane = new this.three.Plane();
      this._panTmpDir = new this.three.Vector3();
      this._panTmpGrab = new this.three.Vector3();
      this._panTmpNew = new this.three.Vector3();
      this.PAN_THRESHOLD_PX = 12;

      const scene = this.el.sceneEl;
      const attach = () => {
        const canvas = scene && scene.canvas;
        if (!canvas) {
          return;
        }
        this.pickCanvas = canvas;
        canvas.style.touchAction = "none";

        const isVisible = () => this.el.object3D.visible;
        const consume = (event) => {
          if (event && event.cancelable) {
            event.preventDefault();
          }
        };

        const handleDown = (id, x, y) => {
          this.activePointers.set(id, { x, y });

          if (this.activePointers.size === 1) {
            this.pointerStart.x = x;
            this.pointerStart.y = y;
            this.pointerStart.time = performance.now();
            this.tapEligible = true;
            this.panActive = false;
          } else if (this.activePointers.size === 2) {
            // Second finger landed → switch into pinch mode and discard the
            // pending tap so a one-finger lift doesn't trigger picking. Also
            // re-anchor pan to the centroid so two-finger drag pans smoothly
            // alongside the pinch scale.
            this.tapEligible = false;
            const pts = Array.from(this.activePointers.values());
            this.pinchInitialDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
            this.pinchInitialZoom = this.userZoom;
            this.pinchActive = true;
            const cx = (pts[0].x + pts[1].x) / 2;
            const cy = (pts[0].y + pts[1].y) / 2;
            this.beginPan(cx, cy);
          }
        };

        const handleMove = (id, x, y) => {
          if (!this.activePointers.has(id)) return;
          this.activePointers.set(id, { x, y });

          if (this.pinchActive && this.activePointers.size >= 2) {
            const pts = Array.from(this.activePointers.values());
            const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            const ratio = dist / this.pinchInitialDist;
            this.userZoom = this.three.MathUtils.clamp(
              this.pinchInitialZoom * ratio,
              USER_ZOOM_MIN,
              USER_ZOOM_MAX
            );
            const cx = (pts[0].x + pts[1].x) / 2;
            const cy = (pts[0].y + pts[1].y) / 2;
            this.updatePan(cx, cy);
          } else if (this.activePointers.size === 1) {
            const pt = this.activePointers.get(id);
            if (!pt) return;
            const dx = pt.x - this.pointerStart.x;
            const dy = pt.y - this.pointerStart.y;
            // Promote the gesture to a pan only after passing the tap
            // threshold, so a held-still tap keeps picking planets.
            if (!this.panActive && Math.hypot(dx, dy) > this.PAN_THRESHOLD_PX) {
              this.tapEligible = false;
              this.beginPan(this.pointerStart.x, this.pointerStart.y);
            }
            if (this.panActive) {
              this.updatePan(pt.x, pt.y);
            }
          }
        };

        const handleUp = (id, x, y) => {
          const point = this.activePointers.get(id) || { x, y };
          this.activePointers.delete(id);

          if (this.pinchActive && this.activePointers.size < 2) {
            this.pinchActive = false;
            // 2 → 1 finger transition: re-anchor the pan to the remaining
            // finger's current position so the system doesn't jump.
            if (this.activePointers.size === 1) {
              const remaining = Array.from(this.activePointers.values())[0];
              this.pointerStart.x = remaining.x;
              this.pointerStart.y = remaining.y;
              this.pointerStart.time = performance.now();
              this.tapEligible = false;
              this.beginPan(remaining.x, remaining.y);
            }
          }

          if (
            isVisible() &&
            this.tapEligible &&
            this.activePointers.size === 0
          ) {
            const dx = point.x - this.pointerStart.x;
            const dy = point.y - this.pointerStart.y;
            const elapsed = performance.now() - this.pointerStart.time;
            if (elapsed <= 600 && Math.hypot(dx, dy) <= this.PAN_THRESHOLD_PX) {
              this.tryPickPlanet(point.x, point.y);
            }
          }

          if (this.activePointers.size === 0) {
            this.tapEligible = false;
            this.panActive = false;
          }
        };

        const handleCancel = (id) => {
          this.activePointers.delete(id);
          this.pinchActive = false;
          this.tapEligible = false;
          if (this.activePointers.size === 0) this.panActive = false;
        };

        const onDown = (event) => {
          if (!isVisible()) return;
          consume(event);
          if (canvas.setPointerCapture) {
            try {
              canvas.setPointerCapture(event.pointerId);
            } catch (err) {
              // Some browsers throw if capture races with a cancelled touch.
            }
          }
          handleDown(event.pointerId, event.clientX, event.clientY);
        };

        const onMove = (event) => {
          if (!this.activePointers.has(event.pointerId)) return;
          consume(event);
          handleMove(event.pointerId, event.clientX, event.clientY);
        };

        const onUp = (event) => {
          if (!this.activePointers.has(event.pointerId)) return;
          consume(event);
          handleUp(event.pointerId, event.clientX, event.clientY);
          if (canvas.releasePointerCapture) {
            try {
              canvas.releasePointerCapture(event.pointerId);
            } catch (err) {
              // Pointer capture may already be gone after a browser gesture cancel.
            }
          }
        };

        const onCancel = (event) => {
          handleCancel(event.pointerId);
        };

        const onTouchStart = (event) => {
          if (!isVisible()) return;
          consume(event);
          for (const touch of Array.from(event.changedTouches || [])) {
            handleDown(touch.identifier, touch.clientX, touch.clientY);
          }
        };

        const onTouchMove = (event) => {
          consume(event);
          for (const touch of Array.from(event.changedTouches || [])) {
            handleMove(touch.identifier, touch.clientX, touch.clientY);
          }
        };

        const onTouchEnd = (event) => {
          consume(event);
          for (const touch of Array.from(event.changedTouches || [])) {
            handleUp(touch.identifier, touch.clientX, touch.clientY);
          }
        };

        const onTouchCancel = (event) => {
          consume(event);
          for (const touch of Array.from(event.changedTouches || [])) {
            handleCancel(touch.identifier);
          }
        };

        const onGesture = (event) => {
          if (!isVisible()) return;
          consume(event);
        };

        const onWheel = (event) => {
          if (!isVisible()) return;
          consume(event);
          const factor = event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
          this.userZoom = this.three.MathUtils.clamp(
            this.userZoom * factor,
            USER_ZOOM_MIN,
            USER_ZOOM_MAX
          );
        };

        this.onPointerDown = onDown;
        this.onPointerMove = onMove;
        this.onPointerUp = onUp;
        this.onPointerCancel = onCancel;
        this.onWheel = onWheel;
        this.onTouchStart = onTouchStart;
        this.onTouchMove = onTouchMove;
        this.onTouchEnd = onTouchEnd;
        this.onTouchCancel = onTouchCancel;
        this.onGesture = onGesture;
        if (window.PointerEvent) {
          canvas.addEventListener("pointerdown", onDown, { passive: false });
          canvas.addEventListener("pointermove", onMove, { passive: false });
          canvas.addEventListener("pointerup", onUp, { passive: false });
          canvas.addEventListener("pointercancel", onCancel, { passive: false });
        } else {
          canvas.addEventListener("touchstart", onTouchStart, { passive: false });
          canvas.addEventListener("touchmove", onTouchMove, { passive: false });
          canvas.addEventListener("touchend", onTouchEnd, { passive: false });
          canvas.addEventListener("touchcancel", onTouchCancel, { passive: false });
        }
        canvas.addEventListener("gesturestart", onGesture, { passive: false });
        canvas.addEventListener("gesturechange", onGesture, { passive: false });
        canvas.addEventListener("gestureend", onGesture, { passive: false });
        canvas.addEventListener("wheel", onWheel, { passive: false });
      };

      if (scene && scene.hasLoaded) {
        attach();
      } else if (scene) {
        scene.addEventListener("loaded", attach, { once: true });
      }
    },

    resetUserZoom: function () {
      this.userZoom = 1;
    },

    resetUserTransform: function () {
      this.userZoom = 1;
      this.root.position.set(0, this.systemDef.sceneYOffset, 0);
      this.applyDefaultRootOrientation();
      this.panActive = false;
      this.syncViewControls();
    },

    beginPan: function (clientX, clientY) {
      const camera = this.el.sceneEl && this.el.sceneEl.camera;
      if (!camera || !this.pickCanvas) {
        this.panActive = false;
        return;
      }
      const rect = this.pickCanvas.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, camera);

      this.root.getWorldPosition(this._panRootStartWorld);
      camera.getWorldDirection(this._panTmpDir);
      // Plane through the system's current world position, perpendicular to
      // the camera. Translation in screen XY maps onto this plane, which
      // gives natural up/down/left/right drag in world space.
      this._panPlane.setFromNormalAndCoplanarPoint(this._panTmpDir, this._panRootStartWorld);

      const hit = this.raycaster.ray.intersectPlane(this._panPlane, this._panGrabStartWorld);
      this.panActive = !!hit;
    },

    updatePan: function (clientX, clientY) {
      if (!this.panActive) return;
      const camera = this.el.sceneEl && this.el.sceneEl.camera;
      if (!camera || !this.pickCanvas) return;

      const rect = this.pickCanvas.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, camera);

      const hit = this.raycaster.ray.intersectPlane(this._panPlane, this._panTmpGrab);
      if (!hit) return;

      // newRootWorld = startRootWorld + (currentGrab − startGrab)
      this._panTmpNew
        .copy(this._panRootStartWorld)
        .add(this._panTmpGrab)
        .sub(this._panGrabStartWorld);

      // Convert world → root.parent local so the system stays attached to
      // the marker (any marker pose change is applied on top of our offset).
      if (this.root.parent) {
        this.root.parent.worldToLocal(this._panTmpNew);
      }
      this.root.position.copy(this._panTmpNew);
    },

    getEventPoint: function (event) {
      if (typeof event.clientX === "number") {
        return { x: event.clientX, y: event.clientY };
      }
      const touch = event.changedTouches && event.changedTouches[0];
      if (touch) {
        return { x: touch.clientX, y: touch.clientY };
      }
      return null;
    },

    tryPickPlanet: function (clientX, clientY) {
      const canvas = this.pickCanvas;
      const camera = this.el.sceneEl && this.el.sceneEl.camera;
      if (!canvas || !camera) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (this.el.sceneEl && this.el.sceneEl.object3D) {
        this.el.sceneEl.object3D.updateMatrixWorld(true);
      }
      this.raycaster.setFromCamera(this.pointer, camera);
      const meshes = [];

      if (this.sunPickTarget) {
        meshes.push(this.sunPickTarget);
      }
      if (this.sun) {
        meshes.push(this.sun);
      }
      for (const planet of this.planets) {
        if (planet.pickTarget) {
          meshes.push(planet.pickTarget);
        }
        meshes.push(planet.mesh);
        if (planet.label) {
          meshes.push(planet.label);
        }
      }
      if (this.ships) {
        for (const ship of this.ships) {
          if (ship.pickTarget) {
            meshes.push(ship.pickTarget);
          }
          meshes.push(ship.loadedModel || ship.mesh);
        }
      }

      // Prefer planet / ship hits over the sun: the sun's pick sphere can
      // overlap inner-planet pick spheres, and the closest hit by distance
      // would otherwise resolve to the star even when the ray passes through
      // a planet too.
      const hits = this.raycaster.intersectObjects(meshes, true);
      let chosen = null;
      for (const hit of hits) {
        const state = this.getPickStateFromObject(hit.object);
        if (!state) continue;
        if (state.kind !== "star") {
          chosen = state;
          break;
        }
        if (!chosen) chosen = state;
      }

      if (!chosen) {
        chosen = this.findNearestScreenPick(clientX, clientY, camera, rect);
      }

      if (chosen) {
        this.showPlanetInfo(chosen);
      }
    },

    getPickStateFromObject: function (object) {
      let current = object;
      while (current) {
        if (current.userData && current.userData.planetState) {
          return current.userData.planetState;
        }
        current = current.parent;
      }
      return null;
    },

    findNearestScreenPick: function (clientX, clientY, camera, rect) {
      const T = this.three;
      const world = new T.Vector3();
      const ndc = new T.Vector3();
      const candidates = [];

      if (this.sunState) {
        candidates.push(this.sunState);
      }
      for (const planet of this.planets) {
        candidates.push(planet);
      }
      if (this.ships) {
        for (const ship of this.ships) candidates.push(ship);
      }

      let bestBody = null;
      let bestStar = null;
      for (const state of candidates) {
        const object = state.pickTarget || state.loadedModel || state.mesh;
        if (!object || !state.data) continue;

        object.getWorldPosition(world);
        ndc.copy(world).project(camera);
        if (ndc.z < -1 || ndc.z > 1) continue;

        const x = rect.left + (ndc.x + 1) * 0.5 * rect.width;
        const y = rect.top + (1 - ndc.y) * 0.5 * rect.height;
        const dist = Math.hypot(clientX - x, clientY - y);
        const radius = this.getScreenPickRadius(state);
        if (dist > radius) continue;

        const score = dist / radius;
        const bucket = state.kind === "star" ? bestStar : bestBody;
        if (!bucket || score < bucket.score) {
          const result = { state, score };
          if (state.kind === "star") {
            bestStar = result;
          } else {
            bestBody = result;
          }
        }
      }

      return (bestBody && bestBody.state) || (bestStar && bestStar.state);
    },

    getScreenPickRadius: function (state) {
      if (state.kind === "ship") {
        return SCREEN_PICK_SHIP_RADIUS;
      }
      if (state.kind === "star") {
        return SCREEN_PICK_STAR_RADIUS;
      }
      return SCREEN_PICK_PLANET_RADIUS;
    },

    showPlanetInfo: function (planetState) {
      if (!this.infoPanel) {
        return;
      }
      const data = this.getDisplayData(planetState.data);
      this.pauseForInfo();
      this.stopSpeech();
      this.currentInfoState = planetState;
      this.currentInfoData = data;
      recordStudyDiscovery(this.data.system, planetState.data && planetState.data.name);
      this.activateSelectedInfoObject(planetState);
      if (planetState.kind === "planet") {
        this.requestPlanetModel(planetState, true);
      } else if (planetState.kind === "ship") {
        this.requestShipModel(planetState, true);
      }
      this.infoName.textContent = data.name;
      this.infoText.textContent = data.info || "";
      if (this.infoQuiz) {
        this.infoQuiz.hidden = true;
        while (this.infoQuiz.firstChild) this.infoQuiz.removeChild(this.infoQuiz.firstChild);
      }
      this.clearQuizAdvanceTimer();
      this.quizState = null;
      if (this.infoQuizButton) {
        this.infoQuizButton.textContent = t("quiz");
      }

      // Rebuild the definition list each time so the rows reflect the body
      // currently being shown (Sun has no year, planets do, etc.).
      while (this.infoStats.firstChild) this.infoStats.removeChild(this.infoStats.firstChild);
      const rows = this.getStatRows(data);
      for (const [label, value] of rows) {
        if (value === undefined || value === null || value === "") continue;
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = value;
        this.infoStats.appendChild(dt);
        this.infoStats.appendChild(dd);
      }
      this.infoPanel.classList.add("is-visible");
    },

    positionInfoFigure: function () {
      if (!this.infoPanel || !this.infoFigure || !this.infoPanel.classList.contains("is-visible")) {
        return;
      }

      const panelRect = this.infoPanel.getBoundingClientRect();
      const figureRect = this.infoFigure.getBoundingClientRect();
      const gap = 10;
      const bottomPadding = 10;
      const targetTop = panelRect.bottom + gap;
      const maxTop = window.innerHeight - figureRect.height - bottomPadding;
      const top = Math.max(gap, Math.min(targetTop, maxTop));

      this.infoFigure.style.left = `${panelRect.left + panelRect.width / 2}px`;
      this.infoFigure.style.top = `${top}px`;
    },

    getSelectedVisualObject: function (state) {
      if (!state) {
        return null;
      }
      if (state.kind === "ship") {
        return state.loadedModel || state.mesh;
      }
      if (state.kind === "star") {
        return this.sun;
      }
      return state.mesh;
    },

    activateSelectedInfoObject: function (state) {
      this.clearSelectedInfoObject();
      const object = this.getSelectedVisualObject(state);
      if (!object) {
        return;
      }
      this.selectedInfoState = state;
      this.selectedInfoObject = object;
      this.selectedInfoBaseScale = object.scale.clone();
    },

    clearSelectedInfoObject: function () {
      if (this.selectedInfoObject && this.selectedInfoBaseScale) {
        this.selectedInfoObject.scale.copy(this.selectedInfoBaseScale);
      }
      this.selectedInfoState = null;
      this.selectedInfoObject = null;
      this.selectedInfoBaseScale = null;
    },

    animateSelectedInfoObject: function (time, rawDt) {
      const state = this.selectedInfoState;
      const object = this.selectedInfoObject;
      if (!state || !object || !this.selectedInfoBaseScale) {
        return;
      }

      if (state.kind === "planet") {
        object.rotation.y += rawDt * (state.spinSpeed || SOLAR_SPIN_SPEED) * 2.2;
      } else if (state.kind === "ship") {
        object.rotation.y += rawDt * 0.0011;
      }

      if (state.kind !== "star") {
        const beat = 1 + Math.sin(time * 0.008) * 0.12;
        object.scale.copy(this.selectedInfoBaseScale).multiplyScalar(beat);
      }
    },

    drawInfoFigure: function (planetState) {
      const canvas = this.infoFigureCanvas;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      const data = this.getDisplayData(planetState.data || {});
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 8, w * 0.5, h * 0.5, w * 0.65);
      bg.addColorStop(0, "rgba(55, 72, 115, 0.42)");
      bg.addColorStop(1, "rgba(255, 255, 255, 0.03)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (planetState.kind === "ship") {
        this.drawShipInfoFigure(ctx, w, h, data, planetState.data && planetState.data.name);
      } else {
        this.drawPlanetInfoFigure(ctx, w, h, planetState);
      }

      if (this.infoFigureCaption) {
        this.infoFigureCaption.textContent = data.name || "";
      }
    },

    clearInfoFigure: function () {
      if (!this.infoFigureCanvas) {
        return;
      }
      const ctx = this.infoFigureCanvas.getContext("2d");
      ctx.clearRect(0, 0, this.infoFigureCanvas.width, this.infoFigureCanvas.height);
      if (this.infoFigureCaption) {
        this.infoFigureCaption.textContent = "";
      }
    },

    drawPlanetInfoFigure: function (ctx, w, h, planetState) {
      const data = planetState.data || {};
      const cx = w / 2;
      const cy = h * 0.48;
      const radius = planetState.kind === "star" ? 48 : 42;
      const texture = this.getInfoFigureTexture(planetState);

      if (data.ring) {
        ctx.save();
        ctx.translate(cx, cy + 4);
        ctx.rotate(-0.18);
        ctx.strokeStyle = "rgba(242, 219, 157, 0.72)";
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.65, radius * 0.42, 0, 0, TWO_PI);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.42, radius * 0.32, 0, 0, TWO_PI);
        ctx.stroke();
        ctx.restore();
      }

      if (planetState.kind === "star") {
        const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.55);
        glow.addColorStop(0, "rgba(255, 245, 186, 0.9)");
        glow.addColorStop(0.45, "rgba(255, 145, 45, 0.35)");
        glow.addColorStop(1, "rgba(255, 145, 45, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.55, 0, TWO_PI);
        ctx.fill();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TWO_PI);
      ctx.clip();
      if (texture) {
        ctx.drawImage(texture, cx - radius, cy - radius, radius * 2, radius * 2);
      } else {
        ctx.fillStyle = data.color || "#9eb7ff";
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      }
      const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      shade.addColorStop(0, "rgba(255, 255, 255, 0.26)");
      shade.addColorStop(0.48, "rgba(255, 255, 255, 0)");
      shade.addColorStop(1, "rgba(0, 0, 0, 0.5)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.restore();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TWO_PI);
      ctx.stroke();
    },

    getInfoFigureTexture: function (planetState) {
      const mesh = planetState.renderMesh || planetState.mesh;
      const material = mesh && mesh.material;
      const texture = material && !Array.isArray(material) && material.map;
      return texture && texture.image ? texture.image : null;
    },

    drawShipInfoFigure: function (ctx, w, h, data, sourceName) {
      const cx = w / 2;
      const cy = h * 0.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sourceName === "Blip-A" ? -0.12 : -0.28);

      if (sourceName === "Blip-A") {
        ctx.fillStyle = "rgba(240, 224, 176, 0.95)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 54, 21, 0, 0, TWO_PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "rgba(122, 90, 48, 0.65)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 48, 15, 0, 0, TWO_PI);
        ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(225, 221, 207, 0.95)";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-48, 0);
        ctx.lineTo(48, 0);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 240, 176, 0.9)";
        ctx.beginPath();
        ctx.arc(53, 0, 10, 0, TWO_PI);
        ctx.fill();
        ctx.strokeStyle = "rgba(31, 34, 48, 0.9)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-8, -26);
        ctx.lineTo(24, -10);
        ctx.moveTo(-8, 26);
        ctx.lineTo(24, 10);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 178, 77, 0.7)";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-58, 0);
        ctx.lineTo(-75, 0);
        ctx.stroke();
      }
      ctx.restore();
    },

    hidePlanetInfo: function () {
      if (!this.infoPanel) {
        return;
      }
      this.infoPanel.classList.remove("is-visible");
      if (this.infoFigure) {
        this.infoFigure.classList.remove("is-visible");
      }
      this.clearSelectedInfoObject();
      this.currentInfoData = null;
      this.currentInfoState = null;
      this.clearInfoFigure();
      this.stopSpeech();
      if (this.infoQuiz) {
        this.infoQuiz.hidden = true;
        while (this.infoQuiz.firstChild) this.infoQuiz.removeChild(this.infoQuiz.firstChild);
      }
      this.clearQuizAdvanceTimer();
      this.quizState = null;
      if (this.infoQuizButton) {
        this.infoQuizButton.textContent = t("quiz");
      }
      if (typeof this.infoResumePausedState === "boolean") {
        this.setPausedState(this.infoResumePausedState);
        this.infoResumePausedState = null;
      }
    },

    toggleSpeech: function () {
      if (!SUPPORTS_SPEECH || !this.currentInfoData) {
        return;
      }
      if (this.currentUtterance) {
        this.stopSpeech();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(this.createSpeechText(this.currentInfoData));
      utterance.lang = currentLanguage === "ar" ? "ar-SA" : "en-US";
      utterance.rate = 0.94;
      utterance.pitch = 1;
      utterance.onend = () => {
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
          this.setSpeechButtonSpeaking(false);
        }
      };
      utterance.onerror = utterance.onend;

      this.currentUtterance = utterance;
      this.setSpeechButtonSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },

    createSpeechText: function (data) {
      const parts = [`${data.name}.`];
      if (data.info) {
        parts.push(data.info);
      }
      const rows = this.getStatRows(data);
      for (const [label, value] of rows) {
        if (value === undefined || value === null || value === "" || value === "—") continue;
        parts.push(`${label}: ${value}.`);
      }
      return parts.join(" ");
    },

    stopSpeech: function () {
      if (SUPPORTS_SPEECH) {
        window.speechSynthesis.cancel();
      }
      this.currentUtterance = null;
      this.setSpeechButtonSpeaking(false);
    },

    setSpeechButtonSpeaking: function (speaking) {
      if (!this.infoSpeakButton || !SUPPORTS_SPEECH) {
        return;
      }
      this.infoSpeakButton.textContent = speaking ? t("stop") : t("speak");
      this.infoSpeakButton.classList.toggle("is-speaking", speaking);
      this.infoSpeakButton.setAttribute("aria-label", speaking ? t("stopAria") : t("speakAria"));
    },

    showQuiz: function () {
      if (!this.currentInfoData || !this.infoQuiz) {
        return;
      }
      this.clearQuizAdvanceTimer();
      const questions = this.createQuizQuestions(this.currentInfoData);
      const startedAt = performance.now();
      this.quizState = {
        questions,
        index: 0,
        score: 0,
        answered: false,
        startedAt,
        questionStartedAt: startedAt,
        currentStreak: 0,
        bestStreak: 0,
        perfectBonusApplied: false,
        savedEntryId: null,
        scoring: {
          correctPoints: 0,
          fastBonus: 0,
          streakBonus: 0,
          perfectBonus: 0,
          total: 0
        }
      };
      this.infoQuiz.hidden = false;
      if (this.infoQuizButton) {
        this.infoQuizButton.textContent = t("restartQuiz");
      }
      this.renderQuizStep();
    },

    createQuizQuestions: function (data) {
      const specs = [
        { key: "diameter", question: t("quizDiameter") },
        { key: "distance", question: t("quizDistance") },
        { key: "yearLength", question: t("quizYearLength") },
        { key: "dayLength", question: t("quizDayLength") },
        { key: "moons", question: t("quizMoons") },
        { key: "name", question: t("quizName") }
      ];
      const questions = [];

      for (const spec of specs) {
        if (questions.length >= 3) break;
        const correct = this.formatQuizValue(data[spec.key]);
        if (!this.isQuizValue(correct)) continue;
        const choices = this.createQuizChoices(spec.key, correct, data);
        if (choices.length < 3) continue;
        questions.push({
          question: spec.question,
          correct,
          choices
        });
      }

      return questions;
    },

    createQuizChoices: function (key, correct, data) {
      const choices = [correct];
      const addChoice = (value) => {
        const text = this.formatQuizValue(value);
        if (!this.isQuizValue(text) || choices.includes(text)) return;
        choices.push(text);
      };

      const pool = this.getQuizPool();
      for (const item of pool) {
        if (choices.length >= 3) break;
        if (item === data) continue;
        addChoice(this.getDisplayData(item)[key]);
      }

      const fallbackSet = currentLanguage === "ar" ? QUIZ_FALLBACKS_AR : QUIZ_FALLBACKS;
      const fallbacks = fallbackSet[key] || QUIZ_FALLBACKS[key] || [];
      for (const value of fallbacks) {
        if (choices.length >= 3) break;
        addChoice(value);
      }

      return this.shuffleQuizChoices(choices).map((choice) => ({
        text: choice,
        correct: choice === correct
      }));
    },

    getQuizPool: function () {
      const pool = [];
      if (this.systemDef.star && this.systemDef.star.info) {
        pool.push(this.systemDef.star.info);
      }
      for (const planet of this.systemDef.planets || []) {
        pool.push(planet);
      }
      for (const ship of this.systemDef.ships || []) {
        if (ship.info) pool.push(ship.info);
      }
      return pool;
    },

    formatQuizValue: function (value) {
      if (typeof value === "number") {
        return String(value);
      }
      return value === undefined || value === null ? "" : String(value);
    },

    isQuizValue: function (value) {
      const text = this.formatQuizValue(value).trim();
      return text !== "" && text !== "—" && text !== "-";
    },

    shuffleQuizChoices: function (choices) {
      const shuffled = choices.slice();
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      return shuffled;
    },

    renderQuizStep: function () {
      if (!this.infoQuiz || !this.quizState) {
        return;
      }
      this.clearQuizAdvanceTimer();
      while (this.infoQuiz.firstChild) this.infoQuiz.removeChild(this.infoQuiz.firstChild);

      if (this.quizState.questions.length === 0) {
        const empty = document.createElement("p");
        empty.className = "planet-quiz-result";
        empty.textContent = t("quizEmpty");
        this.infoQuiz.appendChild(empty);
        return;
      }

      if (this.quizState.index >= this.quizState.questions.length) {
        this.renderQuizResult();
        return;
      }

      const progress = document.createElement("p");
      progress.className = "planet-quiz-progress";
      progress.textContent = t("quizProgress", this.quizState.index + 1, this.quizState.questions.length);
      this.infoQuiz.appendChild(progress);

      this.infoQuiz.appendChild(this.createQuizRow(
        this.quizState.questions[this.quizState.index],
        this.quizState.index
      ));
    },

    updateQuizScoreTotal: function () {
      if (!this.quizState || !this.quizState.scoring) {
        return 0;
      }
      const scoring = this.quizState.scoring;
      scoring.total = scoring.correctPoints + scoring.fastBonus + scoring.streakBonus + scoring.perfectBonus;
      return scoring.total;
    },

    applyQuizAnswerScoring: function (isCorrect) {
      if (!this.quizState || !this.quizState.scoring) {
        return;
      }

      if (!isCorrect) {
        this.quizState.currentStreak = 0;
        this.updateQuizScoreTotal();
        return;
      }

      const answeredAt = performance.now();
      const elapsed = answeredAt - (this.quizState.questionStartedAt || answeredAt);
      this.quizState.score += 1;
      this.quizState.scoring.correctPoints += SCORE_CORRECT_POINTS;

      if (elapsed <= SCORE_FAST_THRESHOLD_MS) {
        this.quizState.scoring.fastBonus += SCORE_FAST_BONUS_POINTS;
      }

      this.quizState.currentStreak += 1;
      this.quizState.bestStreak = Math.max(this.quizState.bestStreak, this.quizState.currentStreak);
      if (this.quizState.currentStreak % SCORE_STREAK_LENGTH === 0) {
        this.quizState.scoring.streakBonus += SCORE_STREAK_BONUS_POINTS;
      }

      this.updateQuizScoreTotal();
    },

    applyPerfectQuizBonus: function () {
      if (!this.quizState || !this.quizState.scoring || this.quizState.perfectBonusApplied) {
        return;
      }
      const totalQuestions = this.quizState.questions.length;
      if (totalQuestions > 0 && this.quizState.score === totalQuestions) {
        this.quizState.scoring.perfectBonus += SCORE_PERFECT_BONUS_POINTS;
      }
      this.quizState.perfectBonusApplied = true;
      this.updateQuizScoreTotal();
    },

    renderQuizResult: function () {
      this.applyPerfectQuizBonus();
      const totalScore = this.updateQuizScoreTotal();
      if (!this.quizState.progressRecorded) {
        recordQuizCompletion({
          systemKey: this.data.system,
          bodyName: this.currentInfoState && this.currentInfoState.data && this.currentInfoState.data.name,
          correct: this.quizState.score,
          total: this.quizState.questions.length,
          fastAnswers: Math.round(this.quizState.scoring.fastBonus / SCORE_FAST_BONUS_POINTS),
          bestStreak: this.quizState.bestStreak || 0,
          score: totalScore
        });
        this.quizState.progressRecorded = true;
      }
      const result = document.createElement("div");
      result.className = "planet-quiz-result";

      const title = document.createElement("p");
      title.className = "planet-quiz-result-score";
      title.textContent = t("quizScoreHud", totalScore);

      const text = document.createElement("p");
      text.textContent = `${this.quizState.score} / ${this.quizState.questions.length} · ${
        this.quizState.score === this.quizState.questions.length
        ? t("quizPerfect")
        : t("quizRetry")
      }`;

      result.appendChild(title);
      result.appendChild(text);
      result.appendChild(this.createQuizScoreBreakdown());
      result.appendChild(this.createQuizSaveSection());
      this.infoQuiz.appendChild(result);
    },

    createQuizScoreBreakdown: function () {
      const scoring = this.quizState.scoring;
      const rows = [
        [t("scoreCorrect"), scoring.correctPoints],
        [t("scoreFastBonus"), scoring.fastBonus],
        [t("scoreStreakBonus"), scoring.streakBonus],
        [t("scorePerfectBonus"), scoring.perfectBonus],
        [t("scoreTotal"), scoring.total]
      ];
      const list = document.createElement("dl");
      list.className = "planet-quiz-score-lines";
      for (const [label, points] of rows) {
        const row = document.createElement("div");
        row.className = "planet-quiz-score-row";
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = t("pointsUnit", points);
        row.appendChild(dt);
        row.appendChild(dd);
        list.appendChild(row);
      }
      return list;
    },

    createQuizSaveSection: function () {
      const section = document.createElement("div");
      section.className = "planet-quiz-save";

      const title = document.createElement("p");
      title.className = "planet-quiz-save-title";
      title.textContent = t("saveScoreTitle");
      section.appendChild(title);

      if (this.quizState.savedEntryId) {
        const saved = document.createElement("p");
        saved.className = "planet-quiz-save-status";
        saved.textContent = t("scoreSaved");
        section.appendChild(saved);
        return section;
      }

      const form = document.createElement("form");
      form.className = "planet-quiz-save-form";

      const label = document.createElement("label");
      label.className = "planet-quiz-save-label";
      label.textContent = t("playerNameLabel");

      const input = document.createElement("input");
      input.className = "planet-quiz-save-input";
      input.type = "text";
      input.maxLength = PLAYER_NAME_MAX_LENGTH;
      input.placeholder = t("playerNamePlaceholder");
      input.autocomplete = "name";

      const button = document.createElement("button");
      button.className = "planet-quiz-save-button";
      button.type = "submit";
      button.textContent = t("saveScore");

      const status = document.createElement("p");
      status.className = "planet-quiz-save-status";

      form.appendChild(label);
      form.appendChild(input);
      form.appendChild(button);
      form.appendChild(status);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const playerName = sanitizePlayerName(input.value);
        if (!playerName) {
          input.classList.add("is-invalid");
          status.textContent = t("playerNameRequired");
          input.focus();
          return;
        }
        const entry = this.saveQuizScore(playerName);
        if (!entry) {
          return;
        }
        this.quizState.savedEntryId = entry.id;
        this.renderQuizStep();
      });
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        status.textContent = "";
      });

      section.appendChild(form);
      return section;
    },

    saveQuizScore: function (playerName) {
      if (!this.quizState || !this.currentInfoState) {
        return null;
      }

      const totalQuestions = this.quizState.questions.length;
      const correct = this.quizState.score;
      const totalScore = this.updateQuizScoreTotal();
      const entry = saveLeaderboardEntry({
        playerName,
        score: totalScore,
        correct,
        total: totalQuestions,
        accuracy: totalQuestions ? (correct / totalQuestions) * 100 : 0,
        systemKey: this.data.system,
        bodyName: this.currentInfoState.data && this.currentInfoState.data.name
      });

      if (entry) {
        recordScoreSaved();
        this.setHud(t("scoreSaved"), true);
      }
      return entry;
    },

    createQuizRow: function (question, index) {
      const row = document.createElement("div");
      row.className = "planet-quiz-row";

      const prompt = document.createElement("p");
      prompt.className = "planet-quiz-question";
      prompt.textContent = `${index + 1}. ${question.question}`;
      row.appendChild(prompt);

      const choices = document.createElement("div");
      choices.className = "planet-quiz-choices";

      for (const choice of question.choices) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "planet-quiz-choice";
        button.textContent = choice.text;
        button.addEventListener("click", () => {
          if (row.classList.contains("is-answered")) return;
          row.classList.add("is-answered");
          this.quizState.answered = true;
          this.applyQuizAnswerScoring(choice.correct);
          const buttons = Array.from(choices.querySelectorAll("button"));
          for (const btn of buttons) {
            const isCorrect = btn.textContent === question.correct;
            btn.disabled = true;
            btn.classList.toggle("is-correct", isCorrect);
          }
          if (!choice.correct) {
            button.classList.add("is-wrong");
          }
          const activeQuiz = this.quizState;
          this.quizAdvanceTimer = window.setTimeout(() => {
            if (this.quizState !== activeQuiz) return;
            this.quizState.index += 1;
            this.quizState.answered = false;
            this.quizState.questionStartedAt = performance.now();
            this.renderQuizStep();
          }, 1100);
        });
        choices.appendChild(button);
      }

      row.appendChild(choices);
      return row;
    },

    clearQuizAdvanceTimer: function () {
      if (this.quizAdvanceTimer) {
        window.clearTimeout(this.quizAdvanceTimer);
        this.quizAdvanceTimer = null;
      }
    },

    updateDistanceScale: function () {
      const camera = this.el.sceneEl && this.el.sceneEl.camera;
      if (!camera) {
        return;
      }

      camera.getWorldPosition(this.tmpCamPos);
      this.root.getWorldPosition(this.tmpRootPos);
      const distance = this.tmpCamPos.distanceTo(this.tmpRootPos);
      if (!distance || !isFinite(distance)) {
        return;
      }

      // Scale grows linearly with camera distance so the system stays large
      // and readable when you back away, and shrinks when you move in close.
      const factor = this.three.MathUtils.clamp(
        distance / DISTANCE_REFERENCE,
        DISTANCE_SCALE_MIN,
        DISTANCE_SCALE_MAX
      );
      this.currentDistanceScale += (factor - this.currentDistanceScale) * DISTANCE_SCALE_LERP;
      this.root.scale.setScalar(this.systemDef.sceneScale * this.currentDistanceScale * this.userZoom);
    },

    tick: function (time, delta) {
      if (!this.el.object3D.visible) {
        return;
      }

      const rawDt = delta || DEFAULT_DELTA_MS;
      const infoOpen = this.infoPanel && this.infoPanel.classList.contains("is-visible");
      const speed = (this.paused || infoOpen) ? 0 : this.speedMultiplier;
      const dt = rawDt * speed;

      // Sun pulse uses real time so it never freezes (the "pulse" is just a
      // gentle ambient effect, not part of the orbital simulation). Reduced
      // motion mutes it; true-scale mode bumps the base size up so the pulse
      // multiplies on top of the larger scale.
      const selectedStarOpen = infoOpen && this.currentInfoState === this.sunState;
      const pulseAmt = this.reducedMotion ? SOLAR_SUN_PULSE_AMOUNT * 0.25 : SOLAR_SUN_PULSE_AMOUNT;
      const pulse = 1 + Math.sin(time * SOLAR_SUN_PULSE_SPEED) * pulseAmt;
      const sunBase = this.trueScale ? this.systemDef.star.trueScaleFactor : 1;
      this.sun.scale.setScalar(sunBase * ((infoOpen && !selectedStarOpen) ? 1 : pulse));
      this.sun.rotation.y += (selectedStarOpen ? rawDt : dt) * SOLAR_SPIN_SPEED;
      if (this.sunModelMixer) {
        this.sunModelMixer.update((infoOpen && !selectedStarOpen ? 0 : rawDt) / 1000);
      }

      // Sun halo: each layer rotates its billboard and breathes on its own
      // phase so the corona never reads as static. Pulse runs on real time so
      // the star feels alive even when the orbit sim is paused.
      if (this.sunHaloLayers) {
        for (const layer of this.sunHaloLayers) {
          layer.sprite.material.rotation += rawDt * layer.rotateSpeed;
          const wobble = 1 + Math.sin(time * 0.0011 + layer.pulsePhase) * 0.04;
          layer.sprite.scale.setScalar(layer.baseScale * wobble);
        }
      }

      if (this.starUniforms) {
        // Twinkle drives off real time so it never freezes — independent of
        // pause/info-open state.
        this.starUniforms.uTime.value = time;
      }

      if (!infoOpen) {
        this.stars.rotation.y += rawDt * SOLAR_STAR_ROTATION_SPEED;
      }

      this.updateComets(time);

      for (const planet of this.planets) {
        planet.orbitGroup.rotation.y += dt * planet.speed;
        planet.mesh.rotation.y += dt * planet.spinSpeed;
        if (planet.modelMixer) {
          planet.modelMixer.update((!infoOpen || this.currentInfoState === planet ? rawDt : 0) / 1000);
        }

        // Earth's cloud layer rides on top of the planet's spin and adds a
        // small extra drift so weather visibly moves past continents.
        const cloudMesh = planet.mesh.userData && planet.mesh.userData.cloudMesh;
        if (cloudMesh) {
          cloudMesh.rotation.y += dt * 0.0011;
        }

        if (planet.moonPivot) {
          planet.moonPivot.rotation.y += dt * SOLAR_MOON_SPEED;
        }
      }

      if (this.ships) {
        // Centrifuge spin makes Hail Mary's crew section read as alive even
        // while the ship itself stays put.
        for (const ship of this.ships) {
          if (ship.centrifuge) {
            ship.centrifuge.rotation.z += dt * 0.0009;
          }
        }
      }

      if (infoOpen) {
        this.animateSelectedInfoObject(time, rawDt);
      }

      this.updateAsteroids(dt);
      this.updateDistanceScale();
    },

    updateAsteroids: function (dt) {
      if (!this.asteroidMesh || !this.asteroids) {
        return;
      }
      const obj = this.tmpObject;
      for (let i = 0; i < this.asteroids.length; i += 1) {
        const a = this.asteroids[i];
        a.angle += dt * a.speed;
        obj.position.set(
          Math.cos(a.angle) * a.radius,
          a.height,
          Math.sin(a.angle) * a.radius
        );
        obj.scale.setScalar(a.size);
        obj.rotation.set(a.angle, a.angle * 0.6, 0);
        obj.updateMatrix();
        this.asteroidMesh.setMatrixAt(i, obj.matrix);
      }
      this.asteroidMesh.instanceMatrix.needsUpdate = true;
    },

    track: function (resource) {
      this.disposables.push(resource);
      return resource;
    },

    remove: function () {
      window.clearTimeout(this.hudTimer);
      this.clearQuizAdvanceTimer();
      this.stopSpeech();

      if (this.marker) {
        this.marker.removeEventListener("markerFound", this.onMarkerFound);
        this.marker.removeEventListener("markerLost", this.onMarkerLost);
      }

      if (this.pickCanvas) {
        if (this.onPointerDown) {
          this.pickCanvas.removeEventListener("pointerdown", this.onPointerDown);
        }
        if (this.onPointerMove) {
          this.pickCanvas.removeEventListener("pointermove", this.onPointerMove);
        }
        if (this.onPointerUp) {
          this.pickCanvas.removeEventListener("pointerup", this.onPointerUp);
        }
        if (this.onPointerCancel) {
          this.pickCanvas.removeEventListener("pointercancel", this.onPointerCancel);
        }
        if (this.onTouchStart) {
          this.pickCanvas.removeEventListener("touchstart", this.onTouchStart);
        }
        if (this.onTouchMove) {
          this.pickCanvas.removeEventListener("touchmove", this.onTouchMove);
        }
        if (this.onTouchEnd) {
          this.pickCanvas.removeEventListener("touchend", this.onTouchEnd);
        }
        if (this.onTouchCancel) {
          this.pickCanvas.removeEventListener("touchcancel", this.onTouchCancel);
        }
        if (this.onGesture) {
          this.pickCanvas.removeEventListener("gesturestart", this.onGesture);
          this.pickCanvas.removeEventListener("gesturechange", this.onGesture);
          this.pickCanvas.removeEventListener("gestureend", this.onGesture);
        }
        if (this.onWheel) {
          this.pickCanvas.removeEventListener("wheel", this.onWheel);
        }
      }

      if (this.infoPanel) {
        this.infoPanel.remove();
      }
      if (this.controlPanel) {
        this.controlPanel.remove();
      }
      if (this.infoFigure) {
        this.infoFigure.remove();
      }
      if (this.onInfoFigureResize) {
        window.removeEventListener("resize", this.onInfoFigureResize);
      }

      if (this.loadedStarModel) {
        this.loadedStarModel.traverse((child) => {
          if (child.geometry && typeof child.geometry.dispose === "function") {
            child.geometry.dispose();
          }
          const mat = child.material;
          if (!mat) return;
          if (Array.isArray(mat)) {
            for (const m of mat) m.dispose && m.dispose();
          } else if (typeof mat.dispose === "function") {
            mat.dispose();
          }
        });
      }

      for (const planet of this.planets) {
        if (!planet.loadedModel) continue;
        planet.loadedModel.traverse((child) => {
          if (child.geometry && typeof child.geometry.dispose === "function") {
            child.geometry.dispose();
          }
          const mat = child.material;
          if (!mat) return;
          if (Array.isArray(mat)) {
            for (const m of mat) m.dispose && m.dispose();
          } else if (typeof mat.dispose === "function") {
            mat.dispose();
          }
        });
      }

      // GLB-loaded ship models aren't tracked in this.disposables, so walk
      // their scene graphs and dispose geometries / materials manually.
      if (this.ships) {
        for (const ship of this.ships) {
          if (!ship.loadedModel) continue;
          ship.loadedModel.traverse((child) => {
            if (child.geometry && typeof child.geometry.dispose === "function") {
              child.geometry.dispose();
            }
            const mat = child.material;
            if (!mat) return;
            if (Array.isArray(mat)) {
              for (const m of mat) m.dispose && m.dispose();
            } else if (typeof mat.dispose === "function") {
              mat.dispose();
            }
          });
        }
      }

      this.el.object3D.remove(this.root);

      for (const resource of this.disposables) {
        if (resource && typeof resource.dispose === "function") {
          resource.dispose();
        }
      }
    }
  });

  // System switcher: a single Hiro marker hosts both scenes; the button
  // toggles which one is visible. Each scene already guards its picker, marker
  // events, and zoom on `this.el.object3D.visible`, so flipping that flag is
  // enough to swap systems without re-initialising any THREE resources.
  const setupSystemSwitcher = () => {
    const button = document.getElementById("systemSwitchButton");
    const solarScene = document.getElementById("solarScene");
    const tauCetiScene = document.getElementById("tauCetiScene");
    const aScene = document.querySelector("a-scene");
    if (!button || !solarScene || !tauCetiScene || !aScene) return;

    const SYSTEMS_ORDER = [
      { el: solarScene, key: "solar", labelKey: "solarLabel", switchToKey: "tauCetiLabel" },
      { el: tauCetiScene, key: "tauCeti", labelKey: "tauCetiLabel", switchToKey: "solarLabel" }
    ];
    let activeIndex = 0;

    const renderButton = () => {
      const next = SYSTEMS_ORDER[(activeIndex + 1) % SYSTEMS_ORDER.length];
      button.innerHTML = `<span class="system-switch-icon" aria-hidden="true">⇄</span> ${t(next.labelKey)}`;
      button.setAttribute("aria-label", t("systemSwitchAria"));
    };

    const apply = () => {
      SYSTEMS_ORDER.forEach((s, i) => {
        const comp = s.el.components && s.el.components["solar-system-scene"];
        if (comp && typeof comp.hidePlanetInfo === "function") {
          comp.hidePlanetInfo();
        }
        s.el.object3D.visible = (i === activeIndex);
        if (comp && typeof comp.setControlPanelActive === "function") {
          comp.setControlPanelActive(i === activeIndex);
        }
        // Reset zoom/pan on the scene becoming active so the user always
        // starts a system from a centered, default-zoom view.
        if (i === activeIndex && comp && typeof comp.resetUserTransform === "function") {
          comp.resetUserTransform();
        }
      });
      renderButton();
    };

    button.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % SYSTEMS_ORDER.length;
      apply();
    });
    window.addEventListener("languageChanged", renderButton);

    if (aScene.hasLoaded) {
      apply();
    } else {
      aScene.addEventListener("loaded", apply, { once: true });
    }
  };

  // Marker persistence: AR.js sets `marker.object3D.visible = false` whenever
  // detection drops. The persistent-marker component restores the last tracked
  // pose so the system stays usable after the printed marker leaves the camera.
  const setupMarkerPersistence = () => {
    const marker = document.getElementById("hiroMarker");
    if (!marker) return;
    if (!marker.hasAttribute("persistent-marker")) {
      marker.setAttribute("persistent-marker", "");
    }
  };

  const createLeaderboardStat = (label, value) => {
    const item = document.createElement("div");
    item.className = "leaderboard-stat";

    const number = document.createElement("strong");
    number.textContent = value;

    const text = document.createElement("span");
    text.textContent = label;

    item.appendChild(number);
    item.appendChild(text);
    return item;
  };

  const renderLeaderboardStats = (entries) => {
    if (!leaderboardUi) return;
    while (leaderboardUi.stats.firstChild) leaderboardUi.stats.removeChild(leaderboardUi.stats.firstChild);

    const bestScore = entries.length ? Math.max(...entries.map((entry) => entry.score)) : 0;
    const totalCorrect = entries.reduce((sum, entry) => sum + entry.correct, 0);
    const totalQuestions = entries.reduce((sum, entry) => sum + entry.total, 0);
    const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    leaderboardUi.stats.appendChild(createLeaderboardStat(t("leaderboardBest"), t("pointsUnit", bestScore)));
    leaderboardUi.stats.appendChild(createLeaderboardStat(t("leaderboardQuizzes"), String(entries.length)));
    leaderboardUi.stats.appendChild(createLeaderboardStat(t("leaderboardCorrect"), `${totalCorrect}/${totalQuestions || 0}`));
    leaderboardUi.stats.appendChild(createLeaderboardStat(t("leaderboardAverage"), `${accuracy}%`));
  };

  const renderLeaderboardRows = (entries) => {
    if (!leaderboardUi) return;
    while (leaderboardUi.rows.firstChild) leaderboardUi.rows.removeChild(leaderboardUi.rows.firstChild);

    if (!entries.length) {
      leaderboardUi.empty.hidden = false;
      leaderboardUi.tableWrap.hidden = true;
      return;
    }

    leaderboardUi.empty.hidden = true;
    leaderboardUi.tableWrap.hidden = false;

    entries.forEach((entry, index) => {
      const row = document.createElement("tr");
      const cells = [
        `#${index + 1}`,
        entry.playerName,
        t("pointsUnit", entry.score),
        getTranslatedBodyName(entry.bodyName),
        getSystemDisplayName(entry.systemKey),
        `${entry.accuracy}%`,
        formatLeaderboardDate(entry.savedAt)
      ];
      for (const cellText of cells) {
        const cell = document.createElement("td");
        cell.textContent = cellText;
        row.appendChild(cell);
      }
      leaderboardUi.rows.appendChild(row);
    });
  };

  const escapeCsvCell = (value) => {
    const text = String(value === undefined || value === null ? "" : value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const exportLeaderboardCsv = () => {
    const entries = readLeaderboardEntries();
    if (!entries.length) return;

    const headers = [
      t("leaderboardRank"),
      t("leaderboardPlayer"),
      t("leaderboardScore"),
      t("leaderboardBody"),
      t("leaderboardSystem"),
      t("leaderboardAccuracy"),
      t("leaderboardDate")
    ];
    const rows = entries.map((entry, index) => [
      index + 1,
      entry.playerName,
      entry.score,
      getTranslatedBodyName(entry.bodyName),
      getSystemDisplayName(entry.systemKey),
      `${entry.accuracy}%`,
      formatLeaderboardDate(entry.savedAt)
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mission-leaderboard.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const renderLeaderboardDashboard = () => {
    if (!leaderboardUi) return;
    const entries = readLeaderboardEntries();
    leaderboardUi.title.textContent = t("leaderboardTitle");
    leaderboardUi.closeButton.setAttribute("aria-label", t("leaderboardCloseAria"));
    leaderboardUi.clearButton.textContent = t("leaderboardClear");
    leaderboardUi.clearButton.setAttribute("aria-label", t("leaderboardClearAria"));
    leaderboardUi.clearButton.disabled = entries.length === 0;
    leaderboardUi.exportButton.textContent = t("exportCsv");
    leaderboardUi.exportButton.setAttribute("aria-label", t("exportCsvAria"));
    leaderboardUi.exportButton.disabled = entries.length === 0;
    leaderboardUi.empty.textContent = t("leaderboardEmpty");

    const headers = [
      t("leaderboardRank"),
      t("leaderboardPlayer"),
      t("leaderboardScore"),
      t("leaderboardBody"),
      t("leaderboardSystem"),
      t("leaderboardAccuracy"),
      t("leaderboardDate")
    ];
    leaderboardUi.headers.forEach((header, index) => {
      header.textContent = headers[index] || "";
    });

    renderLeaderboardStats(entries);
    renderLeaderboardRows(entries);
  };

  const applyLeaderboardButtonLanguage = () => {
    const button = document.getElementById("leaderboardButton");
    if (!button) return;
    const text = button.querySelector(".leaderboard-button-text");
    if (text) text.textContent = t("leaderboard");
    button.setAttribute("aria-label", t("leaderboardAria"));
  };

  const setupLeaderboardDashboard = () => {
    const button = document.getElementById("leaderboardButton");
    if (!button) return;

    const overlay = document.createElement("div");
    overlay.className = "leaderboard-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "leaderboardTitle");

    const card = document.createElement("section");
    card.className = "leaderboard-card";

    const header = document.createElement("div");
    header.className = "leaderboard-header";

    const title = document.createElement("h2");
    title.id = "leaderboardTitle";
    title.className = "leaderboard-title";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "leaderboard-close";
    closeButton.textContent = "×";

    header.appendChild(title);
    header.appendChild(closeButton);

    const stats = document.createElement("div");
    stats.className = "leaderboard-stats";

    const empty = document.createElement("p");
    empty.className = "leaderboard-empty";

    const tableWrap = document.createElement("div");
    tableWrap.className = "leaderboard-table-wrap";

    const table = document.createElement("table");
    table.className = "leaderboard-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const headers = Array.from({ length: 7 }, () => {
      const th = document.createElement("th");
      headRow.appendChild(th);
      return th;
    });
    thead.appendChild(headRow);

    const rows = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(rows);
    tableWrap.appendChild(table);

    const footer = document.createElement("div");
    footer.className = "leaderboard-footer";

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.className = "leaderboard-export";
    footer.appendChild(exportButton);

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "leaderboard-clear";
    footer.appendChild(clearButton);

    card.appendChild(header);
    card.appendChild(stats);
    card.appendChild(empty);
    card.appendChild(tableWrap);
    card.appendChild(footer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    leaderboardUi = {
      button,
      overlay,
      title,
      closeButton,
      stats,
      empty,
      tableWrap,
      table,
      rows,
      headers,
      exportButton,
      clearButton
    };

    const open = () => {
      renderLeaderboardDashboard();
      overlay.hidden = false;
      button.setAttribute("aria-expanded", "true");
      closeButton.focus();
    };
    const close = () => {
      overlay.hidden = true;
      button.setAttribute("aria-expanded", "false");
      button.focus();
    };

    button.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    clearButton.addEventListener("click", () => {
      if (window.confirm(t("leaderboardClearConfirm"))) {
        clearLeaderboardEntries();
      }
    });
    exportButton.addEventListener("click", exportLeaderboardCsv);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) {
        close();
      }
    });
    window.addEventListener("leaderboardUpdated", () => {
      if (!overlay.hidden) {
        renderLeaderboardDashboard();
      }
    });
    window.addEventListener("languageChanged", () => {
      applyLeaderboardButtonLanguage();
      renderLeaderboardDashboard();
    });

    applyLeaderboardButtonLanguage();
    renderLeaderboardDashboard();
  };

  const clearElement = (element) => {
    while (element && element.firstChild) element.removeChild(element.firstChild);
  };

  const createMissionControlStat = (label, value) => {
    const item = document.createElement("div");
    item.className = "mission-stat";
    const number = document.createElement("strong");
    number.textContent = value;
    const text = document.createElement("span");
    text.textContent = label;
    item.appendChild(number);
    item.appendChild(text);
    return item;
  };

  const applyMissionControlButtonLanguage = () => {
    const button = document.getElementById("missionControlButton");
    if (!button) return;
    const text = button.querySelector(".mission-control-button-text");
    if (text) text.textContent = t("missionControl");
    button.setAttribute("aria-label", t("missionControlAria"));
  };

  const applyLessonButtonLanguage = () => {
    const button = document.getElementById("lessonButton");
    if (!button) return;
    const text = button.querySelector(".lesson-button-text");
    if (text) text.textContent = t("lessonButton");
    button.setAttribute("aria-label", t("lessonButtonAria"));
  };

  const switchMissionControlTab = (tabId) => {
    missionControlActiveTab = tabId;
    renderMissionControlDashboard();
  };

  const createLessonStep = (config) => {
    const card = document.createElement("article");
    card.className = "lesson-step-card";
    card.classList.toggle("is-done", config.done);
    card.classList.toggle("is-next", config.next);

    const status = document.createElement("span");
    status.className = "lesson-step-status";
    status.textContent = config.done ? t("lessonStatusDone") : (config.next ? t("lessonStatusNext") : t("lessonStatusReady"));

    const title = document.createElement("h3");
    title.textContent = t(config.titleKey);
    const text = document.createElement("p");
    text.textContent = t(config.textKey);

    const action = document.createElement("button");
    action.type = "button";
    action.className = "lesson-step-action";
    action.textContent = t(config.actionKey);
    action.addEventListener("click", config.onAction);

    card.appendChild(status);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(action);
    return card;
  };

  const renderGuidedJourney = (content, progress) => {
    const stats = getProgressStats(progress);
    const discoveredCount = progress.discovered.length;
    const hasQuiz = progress.quizzesCompleted > 0;
    const hasMission = progress.completedMissions.length > 0;
    const hasSavedScore = readLeaderboardEntries().length > 0;
    const completed = [discoveredCount > 0, hasQuiz || hasMission, discoveredCount >= 2, hasSavedScore || progress.badges.length > 0]
      .filter(Boolean).length;
    const percent = Math.round((completed / 4) * 100);
    const firstOpenStep = completed;

    const hero = document.createElement("section");
    hero.className = "lesson-hero";
    const copy = document.createElement("div");
    const eyebrow = document.createElement("span");
    eyebrow.className = "lesson-eyebrow";
    eyebrow.textContent = t("tabLesson");
    const title = document.createElement("h3");
    title.textContent = t("lessonTitle");
    const subtitle = document.createElement("p");
    subtitle.textContent = t("lessonSubtitle");
    copy.appendChild(eyebrow);
    copy.appendChild(title);
    copy.appendChild(subtitle);

    const meter = document.createElement("div");
    meter.className = "lesson-meter";
    const meterLabel = document.createElement("span");
    meterLabel.textContent = t("lessonProgressLabel");
    const meterValue = document.createElement("strong");
    meterValue.textContent = `${percent}%`;
    const meterTrack = document.createElement("div");
    meterTrack.className = "lesson-meter-track";
    const meterFill = document.createElement("span");
    meterFill.style.width = `${percent}%`;
    meterTrack.appendChild(meterFill);
    meter.appendChild(meterLabel);
    meter.appendChild(meterValue);
    meter.appendChild(meterTrack);

    hero.appendChild(copy);
    hero.appendChild(meter);
    content.appendChild(hero);

    const statsGrid = document.createElement("div");
    statsGrid.className = "mission-stat-grid lesson-stat-grid";
    statsGrid.appendChild(createMissionControlStat(t("progressDiscovered"), stats.discovered));
    statsGrid.appendChild(createMissionControlStat(t("progressQuizzes"), stats.quizzes));
    statsGrid.appendChild(createMissionControlStat(t("progressAccuracy"), stats.accuracy));
    statsGrid.appendChild(createMissionControlStat(t("progressSaved"), stats.saved));
    content.appendChild(statsGrid);

    const steps = document.createElement("div");
    steps.className = "lesson-step-grid";
    const configs = [
      {
        titleKey: "lessonStepExploreTitle",
        textKey: "lessonStepExploreText",
        actionKey: "lessonActionExplore",
        done: discoveredCount > 0,
        onAction: () => {
          if (missionControlUi) {
            missionControlUi.overlay.hidden = true;
            missionControlUi.button.setAttribute("aria-expanded", "false");
            missionControlUi.button.focus();
          }
        }
      },
      {
        titleKey: "lessonStepMissionTitle",
        textKey: "lessonStepMissionText",
        actionKey: "lessonActionMissions",
        done: hasMission || hasQuiz,
        onAction: () => switchMissionControlTab("missions")
      },
      {
        titleKey: "lessonStepCompareTitle",
        textKey: "lessonStepCompareText",
        actionKey: "lessonActionCompare",
        done: discoveredCount >= 2,
        onAction: () => switchMissionControlTab("compare")
      },
      {
        titleKey: "lessonStepSimTitle",
        textKey: "lessonStepSimText",
        actionKey: "lessonActionSim",
        done: hasSavedScore || progress.badges.length > 0,
        onAction: () => switchMissionControlTab("simulator")
      }
    ];
    configs.forEach((config, index) => {
      config.next = index === firstOpenStep;
      steps.appendChild(createLessonStep(config));
    });
    content.appendChild(steps);

    const sourcesButton = document.createElement("button");
    sourcesButton.type = "button";
    sourcesButton.className = "lesson-secondary-action";
    sourcesButton.textContent = t("lessonActionLearn");
    sourcesButton.addEventListener("click", () => switchMissionControlTab("learn"));
    content.appendChild(sourcesButton);
  };

  const createMissionCard = (mission, progress) => {
    const status = getMissionCompletion(mission, progress);
    const card = document.createElement("article");
    card.className = "mission-card";
    card.classList.toggle("is-complete", status.complete);

    const header = document.createElement("div");
    header.className = "mission-card-header";
    const title = document.createElement("h3");
    title.textContent = t(mission.titleKey);
    const pill = document.createElement("span");
    pill.className = "mission-bonus-pill";
    pill.textContent = status.claimed ? t("missionClaimed") : t("missionBonus", MISSION_BONUS_POINTS);
    header.appendChild(title);
    header.appendChild(pill);

    const text = document.createElement("p");
    text.textContent = t(mission.textKey);

    const steps = document.createElement("ul");
    steps.className = "mission-steps";
    for (const step of status.steps) {
      const item = document.createElement("li");
      item.className = step.done ? "is-done" : "";
      const mark = document.createElement("span");
      mark.textContent = step.done ? "✓" : "–";
      const label = document.createElement("span");
      label.textContent = t(step.textKey);
      item.appendChild(mark);
      item.appendChild(label);
      steps.appendChild(item);
    }

    const claim = document.createElement("button");
    claim.type = "button";
    claim.className = "mission-claim-button";
    claim.textContent = status.claimed ? t("missionClaimed") : t("missionClaim");
    claim.disabled = !status.complete || status.claimed;
    claim.addEventListener("click", () => {
      claimGuidedMission(mission.id);
      renderMissionControlDashboard();
    });

    card.appendChild(header);
    card.appendChild(text);
    card.appendChild(steps);
    card.appendChild(claim);
    return card;
  };

  const renderMissionOverview = (content, progress) => {
    const stats = getProgressStats(progress);
    const grid = document.createElement("div");
    grid.className = "mission-stat-grid";
    grid.appendChild(createMissionControlStat(t("progressDiscovered"), stats.discovered));
    grid.appendChild(createMissionControlStat(t("progressQuizzes"), stats.quizzes));
    grid.appendChild(createMissionControlStat(t("progressAccuracy"), stats.accuracy));
    grid.appendChild(createMissionControlStat(t("progressBadges"), stats.badges));
    grid.appendChild(createMissionControlStat(t("progressMissions"), stats.missions));
    grid.appendChild(createMissionControlStat(t("progressSaved"), stats.saved));
    content.appendChild(grid);

    const missions = document.createElement("div");
    missions.className = "mission-card-grid";
    for (const mission of GUIDED_MISSIONS) {
      missions.appendChild(createMissionCard(mission, progress));
    }
    content.appendChild(missions);
  };

  const renderMissionList = (content, progress) => {
    const missions = document.createElement("div");
    missions.className = "mission-card-grid";
    for (const mission of GUIDED_MISSIONS) {
      missions.appendChild(createMissionCard(mission, progress));
    }
    content.appendChild(missions);
  };

  const renderBadges = (content, progress) => {
    if (!progress.badges.length) {
      const empty = document.createElement("p");
      empty.className = "mission-empty";
      empty.textContent = t("noBadgesYet");
      content.appendChild(empty);
    }

    const grid = document.createElement("div");
    grid.className = "badge-grid";
    for (const badge of BADGE_DEFS) {
      const unlocked = includesValue(progress.badges, badge.id);
      const card = document.createElement("article");
      card.className = "badge-card";
      card.classList.toggle("is-locked", !unlocked);
      const code = document.createElement("strong");
      code.textContent = badge.code;
      const title = document.createElement("h3");
      title.textContent = t(badge.titleKey);
      const desc = document.createElement("p");
      desc.textContent = t(badge.descKey);
      card.appendChild(code);
      card.appendChild(title);
      card.appendChild(desc);
      grid.appendChild(card);
    }
    content.appendChild(grid);
  };

  const createCompareSelect = (labelText, value, onChange) => {
    const wrap = document.createElement("label");
    wrap.className = "compare-select-wrap";
    const label = document.createElement("span");
    label.textContent = labelText;
    const select = document.createElement("select");
    select.value = value;
    for (const body of getBodyCatalog()) {
      const option = document.createElement("option");
      option.value = body.id;
      option.textContent = `${getTranslatedBodyName(body.data.name)} · ${getSystemDisplayName(body.systemKey)}`;
      select.appendChild(option);
    }
    select.addEventListener("change", () => onChange(select.value));
    wrap.appendChild(label);
    wrap.appendChild(select);
    return wrap;
  };

  const renderComparison = (content) => {
    const catalog = getBodyCatalog();
    if (!getBodyById(missionCompareSelection.first)) {
      missionCompareSelection.first = catalog[0] && catalog[0].id;
    }
    if (!getBodyById(missionCompareSelection.second)) {
      missionCompareSelection.second = catalog[1] && catalog[1].id;
    }

    const selectors = document.createElement("div");
    selectors.className = "compare-selects";
    selectors.appendChild(createCompareSelect(t("compareFirst"), missionCompareSelection.first, (value) => {
      missionCompareSelection.first = value;
      renderMissionControlDashboard();
    }));
    selectors.appendChild(createCompareSelect(t("compareSecond"), missionCompareSelection.second, (value) => {
      missionCompareSelection.second = value;
      renderMissionControlDashboard();
    }));
    content.appendChild(selectors);

    const first = getBodyById(missionCompareSelection.first);
    const second = getBodyById(missionCompareSelection.second);
    if (!first || !second) return;

    const a = getTranslatedBodyData(first.data);
    const b = getTranslatedBodyData(second.data);
    const rows = [
      [t("compareSystem"), getSystemDisplayName(first.systemKey), getSystemDisplayName(second.systemKey)],
      [t("diameter"), a.diameter, b.diameter],
      [t("distance"), a.distance, b.distance],
      [t("yearLength"), a.yearLength, b.yearLength],
      [t("dayLength"), a.dayLength, b.dayLength],
      [t("moons"), typeof a.moons === "number" ? String(a.moons) : a.moons, typeof b.moons === "number" ? String(b.moons) : b.moons]
    ];

    const table = document.createElement("table");
    table.className = "compare-table";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const label of [t("compareMetric"), getTranslatedBodyName(first.data.name), getTranslatedBodyName(second.data.name)]) {
      const th = document.createElement("th");
      th.textContent = label;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const rowData of rows) {
      const row = document.createElement("tr");
      for (const cellData of rowData) {
        const cell = document.createElement("td");
        cell.textContent = cellData === undefined || cellData === null || cellData === "" ? "—" : cellData;
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    content.appendChild(table);
  };

  const renderSimulator = (content) => {
    const wrap = document.createElement("div");
    wrap.className = "simulator-layout";
    const side = document.createElement("div");
    side.className = "simulator-side";

    for (const mission of SPACE_MISSION_SIMS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "simulator-mission-button";
      button.classList.toggle("is-active", mission.id === activeSimulationId);
      button.textContent = t(mission.titleKey);
      button.addEventListener("click", () => {
        activeSimulationId = mission.id;
        renderMissionControlDashboard();
      });
      side.appendChild(button);
    }

    const stage = document.createElement("div");
    stage.className = "simulator-stage";
    const canvas = document.createElement("canvas");
    canvas.className = "mission-sim-canvas";
    canvas.width = 960;
    canvas.height = 540;
    stage.appendChild(canvas);

    const mission = SPACE_MISSION_SIMS.find((item) => item.id === activeSimulationId) || SPACE_MISSION_SIMS[0];
    const details = document.createElement("dl");
    details.className = "simulator-details";
    const detailRows = [
      [t("simulatorMission"), t(mission.titleKey)],
      [t("simulatorVehicle"), t(mission.vehicleKey)],
      [t("simulatorStatus"), t(mission.statusKey)]
    ];
    for (const [label, value] of detailRows) {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      details.appendChild(dt);
      details.appendChild(dd);
    }
    const text = document.createElement("p");
    text.className = "simulator-summary";
    text.textContent = t(mission.bodyKey);
    stage.appendChild(details);
    stage.appendChild(text);

    wrap.appendChild(side);
    wrap.appendChild(stage);
    content.appendChild(wrap);
    startMissionSimulation(canvas, mission);
  };

  const renderLearning = (content) => {
    const goalsTitle = document.createElement("h3");
    goalsTitle.className = "mission-section-title";
    goalsTitle.textContent = t("learningGoalsTitle");
    content.appendChild(goalsTitle);

    const goals = document.createElement("ul");
    goals.className = "learning-list";
    for (const key of ["learningGoal1", "learningGoal2", "learningGoal3", "learningGoal4"]) {
      const item = document.createElement("li");
      item.textContent = t(key);
      goals.appendChild(item);
    }
    content.appendChild(goals);

    const sourceTitle = document.createElement("h3");
    sourceTitle.className = "mission-section-title";
    sourceTitle.textContent = t("sourceTitle");
    content.appendChild(sourceTitle);

    const sources = document.createElement("div");
    sources.className = "source-list";
    for (const source of LEARNING_SOURCES) {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = t(source.key);
      sources.appendChild(link);
    }
    content.appendChild(sources);
  };

  const renderProjectBrief = (content) => {
    const copy = getProjectBrief();
    const wrap = document.createElement("div");
    wrap.className = "project-brief";

    const hero = document.createElement("section");
    hero.className = "project-brief-hero";
    const title = document.createElement("h3");
    title.textContent = copy.title;
    const subtitle = document.createElement("p");
    subtitle.textContent = copy.subtitle;
    hero.appendChild(title);
    hero.appendChild(subtitle);
    wrap.appendChild(hero);

    const appendTextSection = (sectionTitle, text) => {
      const section = document.createElement("section");
      section.className = "project-brief-section";
      const heading = document.createElement("h3");
      heading.textContent = sectionTitle;
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      section.appendChild(heading);
      section.appendChild(paragraph);
      wrap.appendChild(section);
    };

    const appendListSection = (sectionTitle, items) => {
      const section = document.createElement("section");
      section.className = "project-brief-section";
      const heading = document.createElement("h3");
      heading.textContent = sectionTitle;
      const list = document.createElement("ul");
      list.className = "project-brief-list";
      for (const text of items) {
        const item = document.createElement("li");
        item.textContent = text;
        list.appendChild(item);
      }
      section.appendChild(heading);
      section.appendChild(list);
      wrap.appendChild(section);
    };

    appendTextSection(copy.problemTitle, copy.problem);
    appendListSection(copy.usersTitle, copy.users);
    appendListSection(copy.goalsTitle, copy.goals);
    appendListSection(copy.processTitle, copy.process);
    appendListSection(copy.principlesTitle, copy.principles);

    const storyboard = document.createElement("section");
    storyboard.className = "project-brief-section";
    const storyboardTitle = document.createElement("h3");
    storyboardTitle.textContent = copy.storyboardTitle;
    const storyboardGrid = document.createElement("div");
    storyboardGrid.className = "project-storyboard-grid";
    for (const step of copy.storyboard) {
      const item = document.createElement("article");
      item.className = "project-storyboard-step";
      const stepTitle = document.createElement("strong");
      stepTitle.textContent = step.title;
      const stepText = document.createElement("p");
      stepText.textContent = step.text;
      item.appendChild(stepTitle);
      item.appendChild(stepText);
      storyboardGrid.appendChild(item);
    }
    storyboard.appendChild(storyboardTitle);
    storyboard.appendChild(storyboardGrid);
    wrap.appendChild(storyboard);

    appendListSection(copy.testTitle, copy.test);
    appendListSection(copy.ethicsTitle, copy.ethics);
    content.appendChild(wrap);
  };

  const renderMissionControlDashboard = () => {
    if (!missionControlUi) return;
    const progress = readProgress();
    missionControlUi.title.textContent = t("missionControlTitle");
    missionControlUi.closeButton.setAttribute("aria-label", t("missionCloseAria"));

    for (const tab of missionControlUi.tabs) {
      tab.button.textContent = t(tab.labelKey);
      tab.button.classList.toggle("is-active", tab.id === missionControlActiveTab);
    }

    clearElement(missionControlUi.content);
    stopMissionSimulation();
    if (missionControlActiveTab === "lesson") {
      renderGuidedJourney(missionControlUi.content, progress);
    } else if (missionControlActiveTab === "overview") {
      renderMissionOverview(missionControlUi.content, progress);
    } else if (missionControlActiveTab === "project") {
      renderProjectBrief(missionControlUi.content);
    } else if (missionControlActiveTab === "missions") {
      renderMissionList(missionControlUi.content, progress);
    } else if (missionControlActiveTab === "badges") {
      renderBadges(missionControlUi.content, progress);
    } else if (missionControlActiveTab === "compare") {
      renderComparison(missionControlUi.content);
    } else if (missionControlActiveTab === "simulator") {
      renderSimulator(missionControlUi.content);
    } else {
      renderLearning(missionControlUi.content);
    }
  };

  const setupMissionControlDashboard = () => {
    const button = document.getElementById("missionControlButton");
    const lessonButton = document.getElementById("lessonButton");
    if (!button) return;

    const overlay = document.createElement("div");
    overlay.className = "mission-control-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "missionControlTitle");

    const card = document.createElement("section");
    card.className = "mission-control-card";

    const header = document.createElement("div");
    header.className = "mission-control-header";
    const title = document.createElement("h2");
    title.id = "missionControlTitle";
    title.className = "mission-control-title";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "mission-control-close";
    closeButton.textContent = "×";
    header.appendChild(title);
    header.appendChild(closeButton);

    const tabs = document.createElement("div");
    tabs.className = "mission-tabs";
    const tabRefs = MISSION_CONTROL_TABS.map((tab) => {
      const tabButton = document.createElement("button");
      tabButton.type = "button";
      tabButton.className = "mission-tab-button";
      tabButton.addEventListener("click", () => {
        missionControlActiveTab = tab.id;
        renderMissionControlDashboard();
      });
      tabs.appendChild(tabButton);
      return Object.assign({ button: tabButton }, tab);
    });

    const content = document.createElement("div");
    content.className = "mission-control-content";

    card.appendChild(header);
    card.appendChild(tabs);
    card.appendChild(content);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    missionControlUi = {
      button,
      lessonButton,
      overlay,
      title,
      closeButton,
      tabs: tabRefs,
      content
    };

    const open = (tabId) => {
      if (tabId) {
        missionControlActiveTab = tabId;
      }
      renderMissionControlDashboard();
      overlay.hidden = false;
      button.setAttribute("aria-expanded", "true");
      closeButton.focus();
    };
    const close = () => {
      overlay.hidden = true;
      button.setAttribute("aria-expanded", "false");
      stopMissionSimulation();
      button.focus();
    };

    button.addEventListener("click", () => open());
    if (lessonButton) {
      lessonButton.addEventListener("click", () => open("lesson"));
    }
    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) {
        close();
      }
    });
    window.addEventListener("progressUpdated", () => {
      if (!overlay.hidden) renderMissionControlDashboard();
    });
    window.addEventListener("languageChanged", () => {
      applyMissionControlButtonLanguage();
      applyLessonButtonLanguage();
      if (!overlay.hidden) renderMissionControlDashboard();
    });

    applyMissionControlButtonLanguage();
    applyLessonButtonLanguage();
    renderMissionControlDashboard();
  };

  const setupOnboardingAndLoading = () => {
    const overlay = document.getElementById("onboardingOverlay");
    const closeButton = document.getElementById("onboardingClose");
    const helpButton = document.getElementById("helpButton");
    const loadingScreen = document.getElementById("loadingScreen");
    const scene = document.querySelector("a-scene");
    const storage = getStorage();

    const openOnboarding = () => {
      if (!overlay) return;
      overlay.hidden = false;
      if (closeButton) closeButton.focus();
    };
    const closeOnboarding = () => {
      if (!overlay) return;
      overlay.hidden = true;
      if (storage) {
        try {
          storage.setItem(ONBOARDING_STORAGE_KEY, "1");
        } catch (err) {
          // Storage can be unavailable in private browsing.
        }
      }
    };
    const hideLoading = () => {
      if (!loadingScreen) return;
      loadingScreen.classList.add("is-hidden");
      window.setTimeout(() => {
        loadingScreen.hidden = true;
      }, 260);
    };

    if (closeButton) {
      closeButton.addEventListener("click", closeOnboarding);
    }
    if (helpButton) {
      helpButton.addEventListener("click", openOnboarding);
    }
    if (overlay) {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeOnboarding();
      });
    }

    let seen = false;
    if (storage) {
      try {
        seen = storage.getItem(ONBOARDING_STORAGE_KEY) === "1";
      } catch (err) {
        seen = false;
      }
    }
    if (!seen) {
      window.setTimeout(openOnboarding, 450);
    }

    if (!SUPPORTS_CAMERA) {
      hideLoading();
      const support = document.createElement("div");
      support.className = "support-message";
      support.textContent = t("supportMessage") || SUPPORT_MESSAGE_TEXT;
      document.body.appendChild(support);
    } else if (scene) {
      if (scene.hasLoaded) {
        window.setTimeout(hideLoading, 700);
      } else {
        scene.addEventListener("loaded", () => window.setTimeout(hideLoading, 700), { once: true });
        window.setTimeout(hideLoading, 4200);
      }
    } else {
      window.setTimeout(hideLoading, 1200);
    }
  };

  function stopMissionSimulation() {
    if (missionSimulator && missionSimulator.raf) {
      window.cancelAnimationFrame(missionSimulator.raf);
    }
    missionSimulator = null;
  }

  function startMissionSimulation(canvas, mission) {
    stopMissionSimulation();
    const ctx = canvas.getContext("2d");
    const stars = Array.from({ length: MISSION_SIM_STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      r: 0.35 + Math.random() * 1.2
    }));
    missionSimulator = {
      canvas,
      ctx,
      mission,
      stars,
      startedAt: performance.now(),
      raf: 0
    };

    const tick = (time) => {
      if (!missionSimulator || missionSimulator.canvas !== canvas) return;
      resizeMissionCanvas(canvas);
      drawMissionFrame(ctx, canvas.width, canvas.height, mission, stars, time - missionSimulator.startedAt);
      missionSimulator.raf = window.requestAnimationFrame(tick);
    };
    missionSimulator.raf = window.requestAnimationFrame(tick);
  }

  function resizeMissionCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MISSION_SIM_DEVICE_PIXEL_RATIO);
    const width = Math.max(480, Math.round(rect.width * dpr));
    const height = Math.max(270, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function drawMissionFrame(ctx, w, h, mission, stars, elapsed) {
    drawSpaceBackdrop(ctx, w, h, stars, elapsed);
    if (mission.route === "heliosphere") {
      drawHeliosphereMission(ctx, w, h, elapsed);
    } else if (mission.route === "earthOrbit") {
      drawEarthOrbitMission(ctx, w, h, elapsed);
    } else if (mission.route === "lander") {
      drawLanderMission(ctx, w, h, elapsed);
    } else {
      drawLunarFlybyMission(ctx, w, h, elapsed);
    }
    drawTelemetryOverlay(ctx, w, h, mission, elapsed);
  }

  function drawSpaceBackdrop(ctx, w, h, stars, elapsed) {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#02040d");
    bg.addColorStop(0.48, "#070b19");
    bg.addColorStop(1, "#010207");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (const star of stars) {
      const twinkle = 0.45 + Math.sin(elapsed * 0.0015 + star.z * 10) * 0.28 + star.z * 0.35;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0.12, Math.min(0.95, twinkle))})`;
      ctx.beginPath();
      ctx.arc(star.x * w, star.y * h, star.r, 0, TWO_PI);
      ctx.fill();
    }

    const glow = ctx.createRadialGradient(w * 0.72, h * 0.18, 10, w * 0.72, h * 0.18, w * 0.8);
    glow.addColorStop(0, "rgba(82, 125, 255, 0.12)");
    glow.addColorStop(1, "rgba(82, 125, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  function drawTelemetryOverlay(ctx, w, h, mission, elapsed) {
    const pad = Math.max(14, w * 0.018);
    const panelW = Math.min(w * 0.48, 390);
    const panelH = Math.max(58, h * 0.12);
    const phase = (elapsed % 15000) / 15000;
    ctx.save();
    ctx.fillStyle = "rgba(4, 8, 18, 0.62)";
    ctx.strokeStyle = "rgba(154, 199, 255, 0.22)";
    ctx.lineWidth = 1;
    roundRect(ctx, pad, pad, panelW, panelH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `${Math.max(13, w * 0.018)}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillText(t(mission.titleKey), pad + 14, pad + 25);

    ctx.fillStyle = "rgba(185, 214, 255, 0.72)";
    ctx.font = `${Math.max(10, w * 0.013)}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillText(t(mission.statusKey), pad + 14, pad + 46);

    const barX = pad + 14;
    const barY = pad + panelH - 14;
    const barW = panelW - 28;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    roundRect(ctx, barX, barY, barW, 4, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(105, 190, 255, 0.82)";
    roundRect(ctx, barX, barY, barW * phase, 4, 4);
    ctx.fill();
    ctx.restore();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawPlanetOrb(ctx, x, y, radius, colors, highlightAngle) {
    const glow = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 2.35);
    glow.addColorStop(0, colors.glow || "rgba(95, 155, 255, 0.42)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.35, 0, TWO_PI);
    ctx.fill();

    const surface = ctx.createRadialGradient(
      x - Math.cos(highlightAngle) * radius * 0.35,
      y - Math.sin(highlightAngle) * radius * 0.35,
      radius * 0.08,
      x,
      y,
      radius
    );
    for (const stop of colors.stops) {
      surface.addColorStop(stop[0], stop[1]);
    }
    ctx.fillStyle = surface;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TWO_PI);
    ctx.fill();

    const shade = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    shade.addColorStop(0, "rgba(255,255,255,0.20)");
    shade.addColorStop(0.48, "rgba(255,255,255,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TWO_PI);
    ctx.fill();
  }

  function drawEarthSurfaceDetails(ctx, x, y, radius, elapsed) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.99, 0, TWO_PI);
    ctx.clip();
    const drift = Math.sin(elapsed * 0.00012) * radius * 0.18;
    ctx.fillStyle = "rgba(57, 126, 70, 0.68)";
    const land = [
      [-0.42, -0.12, 0.22, 0.10, -0.3],
      [-0.1, 0.28, 0.28, 0.12, 0.2],
      [0.32, -0.2, 0.24, 0.11, 0.35],
      [0.18, 0.1, 0.18, 0.08, -0.45]
    ];
    for (const [lx, ly, rx, ry, rot] of land) {
      ctx.save();
      ctx.translate(x + lx * radius + drift, y + ly * radius);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * radius, ry * radius, 0, 0, TWO_PI);
      ctx.fill();
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.36)";
    ctx.lineWidth = Math.max(1.2, radius * 0.035);
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.ellipse(x + drift * 0.5, y + i * radius * 0.22, radius * 0.82, radius * 0.12, -0.18, 0, TWO_PI);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMoonCraters(ctx, x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.98, 0, TWO_PI);
    ctx.clip();
    const craters = [
      [-0.35, -0.2, 0.13],
      [0.22, -0.28, 0.09],
      [0.36, 0.12, 0.12],
      [-0.12, 0.26, 0.08],
      [-0.02, -0.02, 0.16]
    ];
    for (const [cx, cy, cr] of craters) {
      const gx = x + cx * radius;
      const gy = y + cy * radius;
      ctx.strokeStyle = "rgba(60, 62, 62, 0.34)";
      ctx.lineWidth = Math.max(1, radius * 0.035);
      ctx.beginPath();
      ctx.arc(gx, gy, cr * radius, 0, TWO_PI);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.arc(gx - cr * radius * 0.25, gy - cr * radius * 0.25, cr * radius * 0.45, 0, TWO_PI);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTrajectory(ctx, points, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, ctx.canvas.width * 0.003);
    ctx.setLineDash([14, 12]);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  function pointOnQuadratic(a, b, c, tValue) {
    const u = 1 - tValue;
    return [
      u * u * a[0] + 2 * u * tValue * b[0] + tValue * tValue * c[0],
      u * u * a[1] + 2 * u * tValue * b[1] + tValue * tValue * c[1]
    ];
  }

  function drawSpacecraft(ctx, x, y, scale, angle, plume) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    if (plume) {
      const flame = ctx.createLinearGradient(-60, 0, -120, 0);
      flame.addColorStop(0, "rgba(255, 244, 171, 0.95)");
      flame.addColorStop(0.45, "rgba(255, 116, 35, 0.66)");
      flame.addColorStop(1, "rgba(255, 116, 35, 0)");
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(-52, -12);
      ctx.lineTo(-125, 0);
      ctx.lineTo(-52, 12);
      ctx.closePath();
      ctx.fill();
    }

    const hull = ctx.createLinearGradient(-40, -18, 42, 20);
    hull.addColorStop(0, "#f4f7ff");
    hull.addColorStop(0.46, "#aeb8c9");
    hull.addColorStop(1, "#ffffff");
    ctx.fillStyle = hull;
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(46, 0);
    ctx.lineTo(12, -18);
    ctx.lineTo(-40, -12);
    ctx.lineTo(-48, 0);
    ctx.lineTo(-40, 12);
    ctx.lineTo(12, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(35, 56, 91, 0.9)";
    ctx.beginPath();
    ctx.arc(13, 0, 7, 0, TWO_PI);
    ctx.fill();
    ctx.strokeStyle = "rgba(80, 130, 255, 0.7)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-18, -18);
    ctx.lineTo(-42, -46);
    ctx.moveTo(-18, 18);
    ctx.lineTo(-42, 46);
    ctx.stroke();
    ctx.restore();
  }

  function drawLunarFlybyMission(ctx, w, h, elapsed) {
    const earth = [w * 0.22, h * 0.64, Math.min(w, h) * 0.16];
    const moon = [w * 0.78, h * 0.36, Math.min(w, h) * 0.07];
    drawPlanetOrb(ctx, earth[0], earth[1], earth[2], {
      glow: "rgba(75, 145, 255, 0.45)",
      stops: [[0, "#e8f4ff"], [0.28, "#2d86d8"], [0.55, "#174389"], [1, "#06132e"]]
    }, 0.8);
    drawEarthSurfaceDetails(ctx, earth[0], earth[1], earth[2], elapsed);
    drawPlanetOrb(ctx, moon[0], moon[1], moon[2], {
      glow: "rgba(230, 232, 220, 0.22)",
      stops: [[0, "#f2f0dc"], [0.45, "#aaa99e"], [1, "#474948"]]
    }, 0.6);
    drawMoonCraters(ctx, moon[0], moon[1], moon[2]);

    const start = [earth[0] + earth[2] * 0.45, earth[1] - earth[2] * 0.5];
    const control = [w * 0.53, h * 0.06];
    const end = [moon[0] - moon[2] * 0.95, moon[1] + moon[2] * 0.35];
    const points = [];
    for (let i = 0; i <= 80; i += 1) {
      points.push(pointOnQuadratic(start, control, end, i / 80));
    }
    drawTrajectory(ctx, points, "rgba(117, 188, 255, 0.62)");

    const tValue = (elapsed % 15000) / 15000;
    const point = pointOnQuadratic(start, control, end, tValue);
    const next = pointOnQuadratic(start, control, end, Math.min(1, tValue + 0.012));
    drawSpacecraft(ctx, point[0], point[1], Math.min(w, h) / 640, Math.atan2(next[1] - point[1], next[0] - point[0]), tValue < 0.22);
  }

  function drawHeliosphereMission(ctx, w, h, elapsed) {
    const sun = [w * 0.18, h * 0.5, Math.min(w, h) * 0.13];
    drawPlanetOrb(ctx, sun[0], sun[1], sun[2], {
      glow: "rgba(255, 161, 64, 0.5)",
      stops: [[0, "#fff6a8"], [0.35, "#ff9d39"], [0.72, "#d64c20"], [1, "#4b1309"]]
    }, 0.35);
    ctx.save();
    ctx.strokeStyle = "rgba(255, 190, 94, 0.18)";
    ctx.lineWidth = Math.max(2, w * 0.002);
    for (let i = 1; i <= 5; i += 1) {
      ctx.beginPath();
      ctx.arc(sun[0], sun[1], sun[2] * (1.6 + i * 0.72), 0, TWO_PI);
      ctx.stroke();
    }
    ctx.restore();

    const earth = [w * 0.66, h * 0.52, Math.min(w, h) * 0.055];
    drawPlanetOrb(ctx, earth[0], earth[1], earth[2], {
      glow: "rgba(75,145,255,0.32)",
      stops: [[0, "#dff8ff"], [0.45, "#2d86d8"], [1, "#07172e"]]
    }, 0.8);
    drawEarthSurfaceDetails(ctx, earth[0], earth[1], earth[2], elapsed);
    const l1 = [w * 0.56, h * 0.48];
    drawTrajectory(ctx, [[earth[0], earth[1]], [l1[0], l1[1]], [w * 0.46, h * 0.43]], "rgba(105, 255, 205, 0.55)");
    const spin = elapsed * 0.0013;
    const x = l1[0] + Math.cos(spin) * w * 0.035;
    const y = l1[1] + Math.sin(spin) * h * 0.05;
    drawSpacecraft(ctx, x, y, Math.min(w, h) / 720, spin + 0.8, false);
  }

  function drawEarthOrbitMission(ctx, w, h, elapsed) {
    const earth = [w * 0.5, h * 0.55, Math.min(w, h) * 0.18];
    drawPlanetOrb(ctx, earth[0], earth[1], earth[2], {
      glow: "rgba(75, 145, 255, 0.48)",
      stops: [[0, "#e9fbff"], [0.32, "#2d86d8"], [0.64, "#163d7d"], [1, "#051026"]]
    }, 0.7);
    drawEarthSurfaceDetails(ctx, earth[0], earth[1], earth[2], elapsed);
    ctx.save();
    ctx.strokeStyle = "rgba(148, 205, 255, 0.46)";
    ctx.lineWidth = Math.max(2, w * 0.002);
    ctx.beginPath();
    ctx.ellipse(earth[0], earth[1], earth[2] * 1.72, earth[2] * 0.56, -0.2, 0, TWO_PI);
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < 5; i += 1) {
      const phase = elapsed * 0.00075 + i * TWO_PI / 5;
      const x = earth[0] + Math.cos(phase) * earth[2] * 1.72;
      const y = earth[1] + Math.sin(phase) * earth[2] * 0.56;
      drawSpacecraft(ctx, x, y, Math.min(w, h) / 940, phase + Math.PI / 2, i === 0);
    }
  }

  function drawLanderMission(ctx, w, h, elapsed) {
    const moon = [w * 0.54, h * 0.72, Math.min(w, h) * 0.34];
    drawPlanetOrb(ctx, moon[0], moon[1], moon[2], {
      glow: "rgba(230, 232, 220, 0.2)",
      stops: [[0, "#f1eedb"], [0.35, "#b9b7aa"], [0.7, "#6f716c"], [1, "#272827"]]
    }, 0.55);
    drawMoonCraters(ctx, moon[0], moon[1], moon[2]);

    const cycle = (elapsed % 12000) / 12000;
    const descent = Math.min(1, cycle * 1.2);
    const x = w * 0.42 + Math.sin(cycle * Math.PI) * w * 0.08;
    const y = h * 0.18 + descent * h * 0.48;
    drawTrajectory(ctx, [[w * 0.22, h * 0.14], [w * 0.38, h * 0.24], [x, y]], "rgba(255, 220, 120, 0.55)");
    drawSpacecraft(ctx, x, y, Math.min(w, h) / 720, Math.PI / 2, descent > 0.55);
  }

  const setText = (selector, key) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = t(key);
  };

  const setHtml = (selector, key) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = t(key);
  };

  const applyStaticLanguage = () => {
    const isArabic = currentLanguage === "ar";
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.title = t("pageTitle");

    setText(".loading-text", "loadingText");
    setText(".loading-hint", "loadingHint");
    setText("#onboardingTitle", "onboardingTitle");
    setText(".onboarding-intro", "onboardingIntro");
    setHtml(".onboarding-steps li:nth-child(1)", "onboardingStep1");
    setHtml(".onboarding-steps li:nth-child(2)", "onboardingStep2");
    setHtml(".onboarding-steps li:nth-child(3)", "onboardingStep3");
    setText(".onboarding-marker-tag", "onboardingMarkerTag");
    setText(".onboarding-marker-name", "onboardingMarkerName");
    setText(".onboarding-marker-download", "onboardingMarkerDownload");
    setText(".onboarding-tip", "onboardingTip");
    setText("#onboardingClose", "onboardingClose");

    const hud = document.getElementById(HUD_ID);
    if (hud && !hud.classList.contains(HUD_HIDDEN_CLASS)) {
      hud.textContent = t("hudDefault");
    }

    const helpButton = document.getElementById("helpButton");
    if (helpButton) helpButton.setAttribute("aria-label", t("helpAria"));

    const languageButton = document.getElementById("languageSwitchButton");
    if (languageButton) {
      languageButton.textContent = t("languageButton");
      languageButton.setAttribute("aria-label", t("languageAria"));
    }

    const systemButton = document.getElementById("systemSwitchButton");
    if (systemButton) systemButton.setAttribute("aria-label", t("systemSwitchAria"));

    applyLeaderboardButtonLanguage();
    applyMissionControlButtonLanguage();
    applyLessonButtonLanguage();
    if (leaderboardUi) {
      renderLeaderboardDashboard();
    }
    if (missionControlUi && !missionControlUi.overlay.hidden) {
      renderMissionControlDashboard();
    }
  };

  const setupLanguageSwitcher = () => {
    const button = document.getElementById("languageSwitchButton");
    applyStaticLanguage();
    if (!button) return;

    button.addEventListener("click", () => {
      currentLanguage = currentLanguage === "ar" ? "en" : "ar";
      applyStaticLanguage();
      for (const el of document.querySelectorAll("[solar-system-scene]")) {
        const comp = el.components && el.components["solar-system-scene"];
        if (comp && typeof comp.refreshLanguage === "function") {
          comp.refreshLanguage();
        }
      }
      window.dispatchEvent(new Event("languageChanged"));
    });
  };

  const setupServiceWorker = () => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
    }, { once: true });
  };

  const ready = () => {
    setupLeaderboardDashboard();
    setupMissionControlDashboard();
    setupLanguageSwitcher();
    setupOnboardingAndLoading();
    setupSystemSwitcher();
    setupMarkerPersistence();
    setupServiceWorker();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
}());
