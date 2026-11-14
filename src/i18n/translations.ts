export type Language = 'en' | 'uz' | 'ru' | 'es' | 'fr';

export interface Translations {
  appName: string;
  appSubtitle: string;
  nasaBadge: string;
  regions: {
    global: string;
    amazon: string;
    indonesia: string;
    central_asia: string;
    north_america: string;
    australia: string;
  };
  nav: {
    map: string;
    calendar: string;
    harmonizer: string;
    submission: string;
  };
  kpi: {
    trueFiresTitle: string;
    trueFiresSubtitle: string;
    rawSignificance: string;
    riskTitle: string;
    riskLevel: string;
    riskFRP: string;
    faiTitle: string;
    faiSubtitle: string;
    tripleConfirmed: string;
    riskLevels: {
      low: string;
      moderate: string;
      high: string;
      extreme: string;
    };
  };
  map: {
    title: string;
    renderingCount: string;
    filterLabel: string;
    filterAll: string;
    filterHigh: string;
    legendTriple: string;
    legendActive: string;
    inspectorTitle: string;
    inspectorCoords: string;
    inspectorDate: string;
    inspectorFRP: string;
    inspectorSensors: string;
    inspectorMerged: string;
  };
  calendar: {
    bannerTitle: string;
    peakMonthLabel: string;
    dangerSeasonLabel: string;
    distributionTitle: string;
    distributionHint: string;
    recent7DaysTitle: string;
    dayAnalysis: string;
    trueEventsLabel: string;
    rawDetectionsLabel: string;
    avgFrpLabel: string;
    anomalyAlert: string;
  };
  harmonizer: {
    title: string;
    subtitle: string;
    paramsTitle: string;
    radiusLabel: string;
    radiusDesc: string;
    confLabel: string;
    confDesc: string;
    simulateBtn: string;
    uploadBtn: string;
    statusLabel: string;
    resultsTitle: string;
    colId: string;
    colCoords: string;
    colSensors: string;
    colMerged: string;
    colFrp: string;
    colFai: string;
    emptyText: string;
    viewOnMap: string;
    selectRowHint: string;
    eventDetails: string;
    mergedDetectionsHint: string;
  };
  submission: {
    title: string;
    subtitle: string;
    copyBtn: string;
    copiedBtn: string;
    summaryTitle: string;
    detailsTitle: string;
    aiTitle: string;
    dataTitle: string;
  };
  footer: {
    attribution: string;
    guideLink: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "FIREFUSION",
    appSubtitle: "Harmonizing MODIS & VIIRS into Unified Fire Intelligence",
    nasaBadge: "NASA SPACE APPS 2026",
    regions: {
      global: "Global (All Regions)",
      amazon: "Amazon Basin (Brazil)",
      indonesia: "Indonesia & Malaysia",
      central_asia: "Central Asia & Uzbekistan",
      north_america: "North America (Western US)",
      australia: "Australia"
    },
    nav: {
      map: "Fire Map",
      calendar: "Activity Calendar",
      harmonizer: "CSV Harmonizer",
      submission: "NASA Submission"
    },
    kpi: {
      trueFiresTitle: "HARMONIZED FIRE EVENTS",
      trueFiresSubtitle: "duplicate alarms eliminated",
      rawSignificance: "filtered from raw satellite detections",
      riskTitle: "REGIONAL RISK INDEX",
      riskLevel: "Risk Score",
      riskFRP: "Avg Fire Radiative Power (MW)",
      faiTitle: "FIRE AGREEMENT INDEX (FAI)",
      faiSubtitle: "MODIS (Terra/Aqua) + VIIRS (NOAA)",
      tripleConfirmed: "events verified by all 3 satellites simultaneously",
      riskLevels: {
        low: "LOW RISK",
        moderate: "MODERATE",
        high: "HIGH RISK",
        extreme: "EXTREME ALERT"
      }
    },
    map: {
      title: "Geospatial Multi-Sensor Triangulation",
      renderingCount: "clusters displayed",
      filterLabel: "Filter:",
      filterAll: "All Incidents",
      filterHigh: "High Severity Only",
      legendTriple: "White Border = Triple Confirmed (FAI 100)",
      legendActive: "Orange = Active Fire Cluster",
      inspectorTitle: "Fire Cluster Telemetry",
      inspectorCoords: "Coordinates:",
      inspectorDate: "Acquisition Time:",
      inspectorFRP: "Thermal Energy (FRP):",
      inspectorSensors: "Detecting Sensors:",
      inspectorMerged: "Detections Merged:"
    },
    calendar: {
      bannerTitle: "BURNING ACTIVITY CALENDAR & HISTORICAL SEASONALITY",
      peakMonthLabel: "PEAK BURNING MONTH:",
      dangerSeasonLabel: "CRITICAL DANGER WINDOW:",
      distributionTitle: "ANNUAL BURNING ACTIVITY DISTRIBUTION (12-MONTH BASELINE):",
      distributionHint: "Orange indicates peak burning season",
      recent7DaysTitle: "7-DAY HARMONIZED TELEMETRY MATRIX (NOV 8 – 14, 2026):",
      dayAnalysis: "DAY TELEMETRY DIAGNOSTICS",
      trueEventsLabel: "Harmonized Events:",
      rawDetectionsLabel: "Raw Hotspots:",
      avgFrpLabel: "Avg Radiative Power:",
      anomalyAlert: "Operational Anomaly Alert:"
    },
    harmonizer: {
      title: "LIVE HARMONIZATION ENGINE & CSV TEST BENCH",
      subtitle: "Upload arbitrary NASA FIRMS CSV or synthesize bursts to test deduplication and FAI calculation in real time.",
      paramsTitle: "ALGORITHM CALIBRATION",
      radiusLabel: "Spatial Proximity Threshold:",
      radiusDesc: "Geographic radius bridging 1km MODIS and 375m VIIRS pixels.",
      confLabel: "Confidence Cutoff:",
      confDesc: "Eliminates false glint reflections while preserving active ignitions.",
      simulateBtn: "Simulate Multi-Satellite Fire Burst",
      uploadBtn: "Upload NASA FIRMS CSV File",
      statusLabel: "Engine Status:",
      resultsTitle: "HARMONIZATION LOG",
      colId: "Event ID",
      colCoords: "Lat / Lon",
      colSensors: "Consensus",
      colMerged: "Raw Merged",
      colFrp: "FRP (MW)",
      colFai: "FAI Score",
      emptyText: "No active processing run. Click simulate or upload a CSV.",
      viewOnMap: "View on Map ➔",
      selectRowHint: "(Click a row to inspect)",
      eventDetails: "Event Diagnostics",
      mergedDetectionsHint: "raw detections merged into a single confirmed physical fire event."
    },
    submission: {
      title: "NASA SPACE APPS CHALLENGE 2026 — SUBMISSION BRIEFING",
      subtitle: "Official form fields formatted for direct copy-paste into the project submission page.",
      copyBtn: "Copy",
      copiedBtn: "Copied!",
      summaryTitle: "1. High-Level Project Summary",
      detailsTitle: "2. Detailed Project Description",
      aiTitle: "3. Use of Super Intelligence (SI / AI) Disclosure",
      dataTitle: "4. Space Agency Partner Data & References"
    },
    footer: {
      attribution: "Derived from NASA FIRMS Open Data (MODIS & VIIRS)",
      guideLink: "Judging Criteria & Disclosures"
    }
  },
  uz: {
    appName: "FIREFUSION",
    appSubtitle: "MODIS va VIIRS sun’iy yo‘ldoshlarini yagona tizimga keltirish",
    nasaBadge: "NASA SPACE APPS 2026",
    regions: {
      global: "Butun dunyo (Global)",
      amazon: "Amazon o‘rmonlari (Braziliya)",
      indonesia: "Indoneziya va Malayziya",
      central_asia: "Markaziy Osiyo va O‘zbekiston",
      north_america: "Shimoliy Amerika (AQSH)",
      australia: "Avstraliya"
    },
    nav: {
      map: "Xarita",
      calendar: "Yong‘in Taqvimi",
      harmonizer: "CSV Sinash",
      submission: "NASA Taqdimot"
    },
    kpi: {
      trueFiresTitle: "HAQIQIY YONG‘IN O‘CHOQLARI",
      trueFiresSubtitle: "takroriy signallar tozalandi",
      rawSignificance: "xom sun’iy yo‘ldosh signallaridan filtrlangan",
      riskTitle: "HUDUDIY XAVF DARAJASI",
      riskLevel: "Xavf balli",
      riskFRP: "O‘rtacha olov kuchi (MW)",
      faiTitle: "ISHONCH DARAJASI (FAI)",
      faiSubtitle: "MODIS (Terra/Aqua) + VIIRS (NOAA)",
      tripleConfirmed: "yong‘inni 3 ta mustaqil yo‘ldosh bir vaqtda tasdiqlagan",
      riskLevels: {
        low: "PAST XAVF",
        moderate: "O‘RTACHA",
        high: "YUQORI XAVF",
        extreme: "EKSTREMAL XAVF"
      }
    },
    map: {
      title: "Geofazoviy Yong‘in Klasterlari",
      renderingCount: "ta o‘choq aks ettirilmoqda",
      filterLabel: "Filtr:",
      filterAll: "Barchasi",
      filterHigh: "Faqat kuchli xavflilar",
      legendTriple: "Oq hoshiyali = 3 ta yo‘ldosh tasdiqlagan (FAI 100)",
      legendActive: "Sabzi rang = Faol yong‘in o‘chog‘i",
      inspectorTitle: "Yong‘in Tafsilotlari",
      inspectorCoords: "Koordinata:",
      inspectorDate: "Aniqlangan vaqt:",
      inspectorFRP: "Olov quvvati (FRP):",
      inspectorSensors: "Aniqlagan yo‘ldoshlar:",
      inspectorMerged: "Birlashtirilgan signallar:"
    },
    calendar: {
      bannerTitle: "YONG‘INNING MAVSUMIY TAQVIMI VA TARIXIY HOLATI",
      peakMonthLabel: "ENG XAVFLI OY:",
      dangerSeasonLabel: "YONG‘IN KUCHAYADIGAN DAVR:",
      distributionTitle: "YIL DAVOMIDA YONG‘IN FAOLLIGI TAQSIMOTI (12 OYLIK ME’YOR):",
      distributionHint: "Sabzi rang eng xatarli oylarni bildiradi",
      recent7DaysTitle: "7 KUNLIK AMALIY KO‘RSATKICHLAR (8 – 14 NOYABR, 2026):",
      dayAnalysis: "KUNNING CHUQURLASHTIRILGAN TAHLILI",
      trueEventsLabel: "Haqiqiy o‘choqlar:",
      rawDetectionsLabel: "Xom signallar:",
      avgFrpLabel: "O‘rtacha olov kuchi:",
      anomalyAlert: "Favqulodda anomaliya ogohlantirishi:"
    },
    harmonizer: {
      title: "JONLI HARMONIZATSIYA VA CSV FAYLNI SINASH LABORATORIYASI",
      subtitle: "NASA FIRMS faylini yuklang yoki sun’iy portlashni ishga tushirib, takrorlanishlar qanday tozalanishini jonli ko‘ring.",
      paramsTitle: "ALGORITM SOZLAMALARI",
      radiusLabel: "Fazoviy birlashtirish radiusi:",
      radiusDesc: "MODIS 1km va VIIRS 375m nuqtalarini umumiy o‘choqqa birlashtiradi.",
      confLabel: "Minimal ishonchlilik chegarasi:",
      confDesc: "Quyosh nuri qaytishidan hosil bo‘lgan soxta chaqnashlarni o‘chiradi.",
      simulateBtn: "Sun’iy Yong‘in Portlashini Sinash",
      uploadBtn: "NASA FIRMS CSV Faylini Yuklash",
      statusLabel: "Tizim holati:",
      resultsTitle: "HARMONIZATSIYA NATIJALARI",
      colId: "Hodisa ID",
      colCoords: "Koordinata",
      colSensors: "Konsensus",
      colMerged: "Jamlandi",
      colFrp: "FRP (MW)",
      colFai: "FAI Bali",
      emptyText: "Hozircha test o‘tkazilmadi. Sinash tugmasini bosing yoki CSV yuklang.",
      viewOnMap: "Xaritada ko‘rish ➔",
      selectRowHint: "(Qatorni tanlang)",
      eventDetails: "Hodisa Tafsilotlari",
      mergedDetectionsHint: "ta xom signal birlashtirilib bitta haqiqiy olov o‘chog‘iga keltirildi."
    },
    submission: {
      title: "NASA SPACE APPS 2026 — TOPSHIRISH VA TAQDIMOT MATNLARI",
      subtitle: "Anketani to‘ldirish uchun tayyor rasmiy matnlar. Bitta tugma orqali nusxalanadi.",
      copyBtn: "Nusxalash",
      copiedBtn: "Nusxalandi!",
      summaryTitle: "1. High-Level Project Summary (Loyiha haqida qisqacha)",
      detailsTitle: "2. Detailed Project Description (Batafsil tavsif)",
      aiTitle: "3. Use of Super Intelligence / AI (Sun'iy intellektdan foydalanish)",
      dataTitle: "4. Space Agency Partner Data (NASA Ma'lumotlari)"
    },
    footer: {
      attribution: "NASA FIRMS (MODIS & VIIRS) ochiq ma’lumotlariga asoslangan",
      guideLink: "Hakamlar uchun anketalar va iqtiboslar"
    }
  },
  ru: {
    appName: "FIREFUSION",
    appSubtitle: "Гармонизация данных MODIS и VIIRS в единую систему пожарного мониторинга",
    nasaBadge: "NASA SPACE APPS 2026",
    regions: {
      global: "Весь мир (Глобальный)",
      amazon: "Бассейн Амазонки (Бразилия)",
      indonesia: "Индонезия и Малайзия",
      central_asia: "Центральная Азия и Узбекистан",
      north_america: "Северная Америка (США)",
      australia: "Австралия"
    },
    nav: {
      map: "Карта пожаров",
      calendar: "Календарь активности",
      harmonizer: "Тест CSV",
      submission: "Заявка NASA"
    },
    kpi: {
      trueFiresTitle: "ГАРМОНИЗИРОВАННЫЕ ОЧАГИ",
      trueFiresSubtitle: "дублирующих сигналов удалено",
      rawSignificance: "отфильтровано из сырых спутниковых сигналов",
      riskTitle: "ИНДЕКС ПОЖАРНОГО РИСКА",
      riskLevel: "Уровень риска",
      riskFRP: "Ср. тепловая мощность (МВт)",
      faiTitle: "ИНДЕКС СОГЛАСИЯ СПУТНИКОВ (FAI)",
      faiSubtitle: "MODIS (Terra/Aqua) + VIIRS (NOAA)",
      tripleConfirmed: "очагов подтверждены всеми 3 спутниками одновременно",
      riskLevels: {
        low: "НИЗКИЙ РИСК",
        moderate: "УМЕРЕННЫЙ",
        high: "ВЫСОКИЙ РИСК",
        extreme: "ЭКСТРЕМАЛЬНЫЙ"
      }
    },
    map: {
      title: "Геопространственная триангуляция пожаров",
      renderingCount: "очагов отображается",
      filterLabel: "Фильтр:",
      filterAll: "Все очаги",
      filterHigh: "Только высокой опасности",
      legendTriple: "Белая кайма = Подтверждено 3 спутниками (FAI 100)",
      legendActive: "Оранжевый = Активный очаг горения",
      inspectorTitle: "Телеметрия очага",
      inspectorCoords: "Координаты:",
      inspectorDate: "Время фиксации:",
      inspectorFRP: "Тепловая мощность (FRP):",
      inspectorSensors: "Спутники наблюдения:",
      inspectorMerged: "Объединено точек:"
    },
    calendar: {
      bannerTitle: "КАЛЕНДАРЬ АКТИВНОСТИ И ИСТОРИЧЕСКИЙ СЕЗОННЫЙ ПРОФИЛЬ",
      peakMonthLabel: "ПИКОВЫЙ МЕСЯЦ:",
      dangerSeasonLabel: "ОПАСНЫЙ СЕЗОННЫЙ ПЕРИОД:",
      distributionTitle: "ГОДОВОЕ РАСПРЕДЕЛЕНИЕ АКТИВНОСТИ (12 МЕСЯЦЕВ):",
      distributionHint: "Оранжевый цвет обозначает период пиковой пожароопасности",
      recent7DaysTitle: "7-ДНЕВНАЯ МАТРИЦА АКТИВНОСТИ (8 – 14 НОЯБРЯ 2026):",
      dayAnalysis: "ДИАГНОСТИКА ВЫБРАННОГО ДНЯ",
      trueEventsLabel: "Реальных очагов:",
      rawDetectionsLabel: "Сырых детекций:",
      avgFrpLabel: "Ср. мощность (FRP):",
      anomalyAlert: "Оперативное предупреждение об аномалии:"
    },
    harmonizer: {
      title: "ОНЛАЙН-ГАРМОНИЗАЦИЯ И ЛАБОРАТОРИЯ CSV",
      subtitle: "Загрузите любой CSV файл NASA FIRMS или запустите симуляцию для проверки устранения дублей и расчета FAI.",
      paramsTitle: "КАЛИБРОВКА АЛГОРИТМА",
      radiusLabel: "Порог пространственной близости:",
      radiusDesc: "Объединяет пиксели MODIS 1 км и VIIRS 375 м в общий кластер.",
      confLabel: "Порог достоверности:",
      confDesc: "Отсекает солнечные блики, сохраняя реальные очаги возгорания.",
      simulateBtn: "Симулировать всплеск очагов",
      uploadBtn: "Загрузить CSV-файл NASA FIRMS",
      statusLabel: "Статус модуля:",
      resultsTitle: "РЕЗУЛЬТАТЫ ГАРМОНИЗАЦИИ",
      colId: "ID события",
      colCoords: "Координаты",
      colSensors: "Консенсус",
      colMerged: "Слито точек",
      colFrp: "FRP (МВт)",
      colFai: "Балл FAI",
      emptyText: "Тест не запущен. Нажмите кнопку симуляции или загрузите CSV.",
      viewOnMap: "Показать на карте ➔",
      selectRowHint: "(Выберите строку)",
      eventDetails: "Детали события",
      mergedDetectionsHint: "сырых сигналов объединены в единый физический очаг пожара."
    },
    submission: {
      title: "NASA SPACE APPS 2026 — МАТЕРИАЛЫ ДЛЯ ПОДАЧИ ЗАЯВКИ",
      subtitle: "Официальные поля заявки, готовые для копирования в форму отправки проекта.",
      copyBtn: "Копировать",
      copiedBtn: "Скопировано!",
      summaryTitle: "1. Краткое резюме проекта (High-Level Summary)",
      detailsTitle: "2. Подробное описание проекта (Detailed Description)",
      aiTitle: "3. Раскрытие использования ИИ (AI Disclosure)",
      dataTitle: "4. Данные космических агентств (NASA Data Sources)"
    },
    footer: {
      attribution: "На основе открытых данных NASA FIRMS (MODIS и VIIRS)",
      guideLink: "Критерии судейства и цитирование"
    }
  },
  es: {
    appName: "FIREFUSION",
    appSubtitle: "Armonización de MODIS y VIIRS en Inteligencia Unificada de Incendios",
    nasaBadge: "NASA SPACE APPS 2026",
    regions: {
      global: "Global (Todo el Mundo)",
      amazon: "Cuenca Amazónica (Brasil)",
      indonesia: "Indonesia y Malasia",
      central_asia: "Asia Central y Uzbekistán",
      north_america: "América del Norte (EE.UU.)",
      australia: "Australia"
    },
    nav: {
      map: "Mapa de Fuego",
      calendar: "Calendario",
      harmonizer: "Probar CSV",
      submission: "Envío NASA"
    },
    kpi: {
      trueFiresTitle: "EVENTOS DE FUEGO ARMONIZADOS",
      trueFiresSubtitle: "alarmas duplicadas eliminadas",
      rawSignificance: "filtrado de detecciones satelitales brutas",
      riskTitle: "ÍNDICE DE RIESGO REGIONAL",
      riskLevel: "Puntuación de Riesgo",
      riskFRP: "Poder Radiativo Promedio (MW)",
      faiTitle: "ÍNDICE DE ACUERDO SATELITAL (FAI)",
      faiSubtitle: "MODIS (Terra/Aqua) + VIIRS (NOAA)",
      tripleConfirmed: "eventos verificados por los 3 satélites simultáneamente",
      riskLevels: {
        low: "RIESGO BAJO",
        moderate: "MODERADO",
        high: "RIESGO ALTO",
        extreme: "ALERTA EXTREMA"
      }
    },
    map: {
      title: "Triangulación Geoespacial Multisensor",
      renderingCount: "focos mostrados",
      filterLabel: "Filtrar:",
      filterAll: "Todos los Focos",
      filterHigh: "Solo Alta Severidad",
      legendTriple: "Borde Blanco = Confirmación Triple (FAI 100)",
      legendActive: "Naranja = Foco Activo",
      inspectorTitle: "Telemetría del Foco",
      inspectorCoords: "Coordenadas:",
      inspectorDate: "Fecha y Hora:",
      inspectorFRP: "Energía Térmica (FRP):",
      inspectorSensors: "Satélites:",
      inspectorMerged: "Detecciones Fusionadas:"
    },
    calendar: {
      bannerTitle: "CALENDARIO DE ACTIVIDAD Y PATRÓN HISTÓRICO",
      peakMonthLabel: "MES PICO DE INCENDIOS:",
      dangerSeasonLabel: "VENTANA CRÍTICA DE PELIGRO:",
      distributionTitle: "DISTRIBUCIÓN ANUAL DE ACTIVIDAD (BASE DE 12 MESES):",
      distributionHint: "Naranja indica temporada de máxima quema",
      recent7DaysTitle: "MATRIZ DE 7 DÍAS (8 – 14 NOVIEMBRE 2026):",
      dayAnalysis: "DIAGNÓSTICO DEL DÍA SELECCIONADO",
      trueEventsLabel: "Eventos Reales:",
      rawDetectionsLabel: "Focos Brutos:",
      avgFrpLabel: "Poder Promedio:",
      anomalyAlert: "Alerta de Anomalía Operacional:"
    },
    harmonizer: {
      title: "MOTOR DE ARMONIZACIÓN EN VIVO Y PRUEBA CSV",
      subtitle: "Suba cualquier archivo CSV de NASA FIRMS o simule eventos para comprobar la deduplicación y el cálculo de FAI.",
      paramsTitle: "CALIBRACIÓN DEL ALGORITMO",
      radiusLabel: "Umbral de Proximidad Espacial:",
      radiusDesc: "Radio geográfico que une píxeles de MODIS 1km y VIIRS 375m.",
      confLabel: "Umbral de Confianza:",
      confDesc: "Elimina reflejos solares falsos conservando igniciones reales.",
      simulateBtn: "Simular Ráfaga Multisatelital",
      uploadBtn: "Subir Archivo CSV NASA FIRMS",
      statusLabel: "Estado del Motor:",
      resultsTitle: "REGISTRO DE ARMONIZACIÓN",
      colId: "ID Evento",
      colCoords: "Lat / Lon",
      colSensors: "Consenso",
      colMerged: "Fusionados",
      colFrp: "FRP (MW)",
      colFai: "Puntaje FAI",
      emptyText: "Sin procesamiento activo. Haga clic en simular o suba un CSV.",
      viewOnMap: "Ver en el mapa ➔",
      selectRowHint: "(Haga clic en una fila)",
      eventDetails: "Detalles del evento",
      mergedDetectionsHint: "detecciones sin procesar combinadas en un solo foco de incendio."
    },
    submission: {
      title: "NASA SPACE APPS 2026 — REPORTE DE ENVÍO",
      subtitle: "Campos oficiales listos para copiar y pegar en la plataforma de entrega.",
      copyBtn: "Copiar",
      copiedBtn: "¡Copiado!",
      summaryTitle: "1. Resumen Ejecutivo (High-Level Summary)",
      detailsTitle: "2. Descripción Detallada del Proyecto",
      aiTitle: "3. Divulgación de Uso de IA (AI Disclosure)",
      dataTitle: "4. Datos de Agencias Espaciales (NASA FIRMS)"
    },
    footer: {
      attribution: "Basado en Datos Abiertos de NASA FIRMS (MODIS y VIIRS)",
      guideLink: "Criterios de Evaluación y Créditos"
    }
  },
  fr: {
    appName: "FIREFUSION",
    appSubtitle: "Harmonisation de MODIS et VIIRS en Intelligence Incendie Unifiée",
    nasaBadge: "NASA SPACE APPS 2026",
    regions: {
      global: "Mondial (Toutes Régions)",
      amazon: "Bassin Amazonien (Brésil)",
      indonesia: "Indonésie et Malaisie",
      central_asia: "Asie Centrale et Ouzbékistan",
      north_america: "Amérique du Nord (USA)",
      australia: "Australie"
    },
    nav: {
      map: "Carte Feux",
      calendar: "Calendrier",
      harmonizer: "Tester CSV",
      submission: "Soumission NASA"
    },
    kpi: {
      trueFiresTitle: "ÉVÉNEMENTS D'INCENDIE HARMONISÉS",
      trueFiresSubtitle: "alarmes redondantes éliminées",
      rawSignificance: "filtré des détections brutes des satellites",
      riskTitle: "INDICE DE RISQUE RÉGIONAL",
      riskLevel: "Score de Risque",
      riskFRP: "Puissance Radiative Moyenne (MW)",
      faiTitle: "INDICE D'ACCORD SATELLITAIRE (FAI)",
      faiSubtitle: "MODIS (Terra/Aqua) + VIIRS (NOAA)",
      tripleConfirmed: "événements validés par les 3 satellites en même temps",
      riskLevels: {
        low: "FAIBLE RISQUE",
        moderate: "MODÉRÉ",
        high: "RISQUE ÉLEVÉ",
        extreme: "ALERTE EXTRÊME"
      }
    },
    map: {
      title: "Triangulation Géospatiale Multisensorielle",
      renderingCount: "foyers affichés",
      filterLabel: "Filtrer :",
      filterAll: "Tous les Foyers",
      filterHigh: "Haute Sévérité Uniquement",
      legendTriple: "Bordure Blanche = Triple Accord (FAI 100)",
      legendActive: "Orange = Foyer Actif",
      inspectorTitle: "Télémétrie du Foyer",
      inspectorCoords: "Coordonnées :",
      inspectorDate: "Heure de Détection :",
      inspectorFRP: "Puissance Thermique (FRP) :",
      inspectorSensors: "Satellites :",
      inspectorMerged: "Points Fusionnés :"
    },
    calendar: {
      bannerTitle: "CALENDRIER D'ACTIVITÉ ET PROFIL HISTORIQUE",
      peakMonthLabel: "MOIS PIC DE FEUX :",
      dangerSeasonLabel: "PÉRIODE CRITIQUE DE DANGER :",
      distributionTitle: "DISTRIBUTION ANNUELLE D'ACTIVITÉ (BASE 12 MOIS) :",
      distributionHint: "L'orange indique la période de combustion maximale",
      recent7DaysTitle: "MATRICE DE 7 JOURS (8 – 14 NOVEMBRE 2026) :",
      dayAnalysis: "DIAGNOSTIC DU JOUR SÉLECTIONNÉ",
      trueEventsLabel: "Événements Réels :",
      rawDetectionsLabel: "Détections Brutes :",
      avgFrpLabel: "Puissance Moyenne :",
      anomalyAlert: "Alerte d'Anomalie Opérationnelle :"
    },
    harmonizer: {
      title: "MOTEUR D'HARMONISATION EN DIRECT ET TEST CSV",
      subtitle: "Importez un fichier CSV NASA FIRMS ou simulez un événement pour observer la déduplication et le calcul du FAI.",
      paramsTitle: "CALIBRAGE DE L'ALGORITHME",
      radiusLabel: "Seuil de Proximité Spatiale :",
      radiusDesc: "Rayon géographique reliant les pixels MODIS 1km et VIIRS 375m.",
      confLabel: "Seuil de Confiance :",
      confDesc: "Élimine les faux reflets solaires tout en préservant les feux actifs.",
      simulateBtn: "Simuler une Salve Multisatellite",
      uploadBtn: "Importer un CSV NASA FIRMS",
      statusLabel: "État du Système :",
      resultsTitle: "JOURNAL D'HARMONISATION",
      colId: "ID Événement",
      colCoords: "Lat / Lon",
      colSensors: "Consensus",
      colMerged: "Fusionnés",
      colFrp: "FRP (MW)",
      colFai: "Score FAI",
      emptyText: "Aucun test actif. Cliquez sur simuler ou importez un CSV.",
      viewOnMap: "Voir sur la carte ➔",
      selectRowHint: "(Cliquez sur une ligne)",
      eventDetails: "Détails de l'événement",
      mergedDetectionsHint: "détections brutes fusionnées en un seul foyer d'incendie."
    },
    submission: {
      title: "NASA SPACE APPS 2026 — DOSSIER DE SOUMISSION",
      subtitle: "Champs officiels formatés pour un copier-coller direct dans le formulaire de candidature.",
      copyBtn: "Copier",
      copiedBtn: "Copié !",
      summaryTitle: "1. Résumé Exécutif (High-Level Summary)",
      detailsTitle: "2. Description Détaillée du Projet",
      aiTitle: "3. Divulgation de l'Usage de l'IA (AI Disclosure)",
      dataTitle: "4. Données des Agences Spatiales (NASA FIRMS)"
    },
    footer: {
      attribution: "Basé sur les données ouvertes NASA FIRMS (MODIS et VIIRS)",
      guideLink: "Critères du Jury et Références"
    }
  }
};
