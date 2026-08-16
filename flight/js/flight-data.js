// Career Flight - Stage Data
const STAGES = [
    {
        id: 1, years: '2015~2018', title: 'DATA PLATFORM ERA',
        subtitle: 'Samsung VD - TV Platform Engineer',
        bgColors: ['#0a0a2e', '#1a1a4e'], // deep navy
        enemyTypes: ['scout', 'zigzag'],
        bossName: 'SERVER OVERLORD',
        bossColor: '#5a8a5a',
        achievements: [
            'KPI Server: Spark-based big data pipeline for all TV KPIs',
            'GDPR: Privacy compliance pipeline deployed globally',
            'EPG App: TV Electronic Program Guide innovation',
            'SmartView SDK: TV-Mobile convergence (precursor to SmartThings)',
        ],
        waves: 8,
        difficulty: 1.0
    },
    {
        id: 2, years: '2019', title: 'C-LAB INNOVATION',
        subtitle: 'Samsung C-Lab - Healthcare Startup',
        bgColors: ['#0a1a2e', '#1a3a5e'],
        enemyTypes: ['scout', 'zigzag', 'diver'],
        bossName: 'CES STAGE GUARDIAN',
        bossColor: '#4fc3f7',
        achievements: [
            'Hearing Aid App: Replacing $6000 devices with smartphones',
            'Clinical Trial: Samsung Hospital patient verification',
            'CES 2020: World showcase exhibition',
            'Tech Transfer: Deployed to Mobile Division (MX)',
        ],
        waves: 9,
        difficulty: 1.2
    },
    {
        id: 3, years: '2020', title: 'AD-TECH & ML',
        subtitle: 'Samsung Ads - ML Engineer',
        bgColors: ['#1a0a2e', '#3a1a5e'],
        enemyTypes: ['scout', 'zigzag', 'turret'],
        bossName: 'AD NETWORK AI',
        bossColor: '#e91e63',
        achievements: [
            'ACR Pipeline: ML-powered content recognition targeting',
            'Lincoln Campaign: Cross-device ad matching success',
            'AI Competition: GIST 2nd Prize (Power Prediction DL)',
            'HAICon 2020: Security Threat Detection (GRU Ensemble)',
        ],
        waves: 10,
        difficulty: 1.4
    },
    {
        id: 4, years: '2021', title: 'MLOPS FACTORY',
        subtitle: 'Samsung Ads - MLOps Architect',
        bgColors: ['#1a1a1a', '#2a2a3a'],
        enemyTypes: ['zigzag', 'diver', 'turret'],
        bossName: 'FACTORY MAINFRAME',
        bossColor: '#ff9800',
        achievements: [
            'AI Framework: Model deployment 3 months → 1 week',
            'Demographics Model: 1M daily inferences in production',
            'Databricks Award: Data Team Transformation',
            'AutoML Pipeline: Automated model training & A/B testing',
        ],
        waves: 11,
        difficulty: 1.6
    },
    {
        id: 5, years: '2022', title: 'INCREMENTAL AI',
        subtitle: 'Samsung Ads - Senior ML Engineer',
        bgColors: ['#0a0a1a', '#1a1040'],
        enemyTypes: ['diver', 'turret', 'scout'],
        bossName: 'DEEP LEARNING CORE',
        bossColor: '#7c4dff',
        achievements: [
            'Incremental Learning: Continuous model adaptation system',
            'Feature Store: Real-time feature serving infrastructure',
            'Model Monitoring: Drift detection & auto-retraining',
            'Cost Optimization: 40% reduction in cloud compute',
        ],
        waves: 12,
        difficulty: 1.8
    },
    {
        id: 6, years: '2023~2024', title: 'SNU RESEARCH',
        subtitle: 'Seoul National University - M.S.',
        bgColors: ['#0a1a0a', '#1a3a2a'],
        enemyTypes: ['turret', 'diver', 'zigzag'],
        bossName: 'THESIS EXAMINER',
        bossColor: '#f0d000',
        achievements: [
            'IEEE Paper: Zero-shot Video QA with VLM (149 citations, SOTA)',
            'REFINED App: AI fitness coaching startup (Grand Prize!)',
            'Government Grant: 50M KRW for startup',
            'SNU Startup Award: Best Startup Competition',
        ],
        waves: 13,
        difficulty: 2.0
    },
    {
        id: 7, years: '2025', title: 'AI FUTURE',
        subtitle: 'Toss Bank - AI/ML Engineer',
        bgColors: ['#0a0020', '#200040'],
        enemyTypes: ['diver', 'turret', 'zigzag', 'scout'],
        bossName: 'AI OVERLORD',
        bossColor: '#00e5ff',
        achievements: [
            'Recommendation System: Personalized financial product matching',
            'OCEAN Reranking: Personality-based personalization algorithm',
            'VLM Applications: Multimodal AI deployment at scale',
            'AI Agent: Autonomous intelligent systems',
        ],
        waves: 15,
        difficulty: 2.4
    }
];

const CAREER_INFO = {
    name: 'Kim Wonkyun',
    nameKr: '김원균',
    title: 'Senior Data Scientist / AI Engineer',
    email: 'wonkyunkim.sj@gmail.com',
    linkedin: 'https://www.linkedin.com/in/wonkyun-kim-50084b152/',
    profile: '10+ years at Samsung Electronics. Two startup ventures as CEO. IEEE Access paper (149 citations, SOTA). Expert in Recommendation Systems, Ad-tech AI, MLOps, and Multimodal LLMs.'
};
