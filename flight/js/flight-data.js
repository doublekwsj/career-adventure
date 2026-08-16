// Career Flight - Stage Data
const STAGES = [
    {
        id: 1, years: '2014~2017', title: 'SOFTWARE ENGINEER',
        subtitle: 'Samsung VD',
        role: 'Smart TV & Mobile App',
        description: 'Samsung Frame TV, Eden Mobile, One App 개발\nSpark 기반 KPI 서버, GDPR 대응\nSmartView SDK / DIAL Service 상품화',
        bgColors: ['#0a0a2e', '#1a1a4e'],
        enemyTypes: ['scout', 'zigzag'],
        bossName: 'SERVER OVERLORD',
        bossColor: '#5a8a5a',
        achievements: [
            'KPI 데이터 수집 서버: Spark 기반 대용량 처리 (VD사업부 전체 TV KPI)',
            'GDPR 대응: EU 개인정보 처리·삭제 파이프라인 → 글로벌 상품화',
            'EPG App: 전자 프로그램 가이드 앱 개발 → TV 시청 경험 혁신',
            'SmartView SDK: TV-모바일 연동 (SmartThings 전신)',
            'Serverless 품질 데이터 수집: AWS Lambda 기반 비용 최적화',
            'SW Excellent Programmer 수상 + 즉시시상 2회',
        ],
        waves: 8,
        difficulty: 1.0
    },
    {
        id: 2, years: '2017~2018', title: 'BIG DATA & AD PLATFORM',
        subtitle: 'Samsung VD',
        role: 'Data Scientist',
        description: 'Smart TV 광고 플랫폼 초기 빅데이터 모델\nACR Feature Engineering → 비용·성능 20%+ 효율화\nCross-device 광고 모델 → Lincoln 캠페인 적용',
        bgColors: ['#0a1a2e', '#1a3a5e'],
        enemyTypes: ['scout', 'zigzag', 'diver'],
        bossName: 'CES STAGE GUARDIAN',
        bossColor: '#4fc3f7',
        achievements: [
            'Smart TV 광고 플랫폼 초기 빅데이터 모델 개발 (Spark, Python)',
            'ACR Feature Engineering: 비용 및 성능 20% 이상 효율화',
            'Cross-device 광고 모델: TV-모바일 매칭 → Lincoln 캠페인',
        ],
        waves: 9,
        difficulty: 1.2
    },
    {
        id: 3, years: '2018~2019', title: 'C-LAB INNOVATION',
        subtitle: 'Samsung C-Lab',
        role: 'Creative Team Lead',
        description: '600만원 보청기를 대체하는 스마트폰 보청 앱 리딩\n삼성서울병원 임상시험 성공\n→ CES 2019 출품 → 무선사업부 기술 이관!',
        bgColors: ['#1a0a2e', '#3a1a5e'],
        enemyTypes: ['scout', 'zigzag', 'turret'],
        bossName: 'AD NETWORK AI',
        bossColor: '#e91e63',
        achievements: [
            '스마트폰 보청기 앱 프로젝트 리딩 (600만원 대체)',
            '삼성서울병원 임상시험 성공',
            'CES 2019 출품! 세계 최대 IT 전시회',
            '무선사업부(MX) 기술 이관 완료 → 제품화',
        ],
        waves: 10,
        difficulty: 1.4
    },
    {
        id: 4, years: '2019~2021', title: 'AD TARGETING MODEL',
        subtitle: 'Samsung Ads',
        role: 'Data Scientist',
        description: 'Demographic 스코어링 모델 → 일일 100만건 추론\nLookAlike 모델 50%+ 성능 향상\nA/B테스트: CTR +12%, CVR +10%\nGIST AI대회 최우수상, HAICon 장려상',
        bgColors: ['#1a1a1a', '#2a2a3a'],
        enemyTypes: ['zigzag', 'diver', 'turret'],
        bossName: 'FACTORY MAINFRAME',
        bossColor: '#ff9800',
        achievements: [
            'Demographic 스코어링: 일일 100만건, 전체 광고 25% 활용',
            'LookAlike 모델: 기존 대비 50%+ 성능 향상!',
            'A/B테스트: CTR +12%, CVR +10% 달성',
            '3rd Party 확장: Vizio TV 데모그래픽 배포',
            'GIST AI대회 최우수상 (2020.12)',
            'HAICon 2020 보안위협 탐지 장려상',
        ],
        waves: 11,
        difficulty: 1.6
    },
    {
        id: 5, years: '2021~2023', title: 'AI PLATFORM & MLOPS',
        subtitle: 'Samsung Ads',
        role: 'Senior Data Scientist',
        description: 'AI Framework → 상품화 3개월→1주일, 인력 10명→2명!\nMLOps (Airflow·MLflow·SageMaker)\nIncremental Learning + Auto Tuning\nDatabricks Award 수상!',
        bgColors: ['#0a0a1a', '#1a1040'],
        enemyTypes: ['diver', 'turret', 'scout'],
        bossName: 'DEEP LEARNING CORE',
        bossColor: '#7c4dff',
        achievements: [
            'AI Framework: 상품화 3개월→1주일! 인력 10명→2명!',
            'MLOps 파이프라인: Airflow·MLflow·SageMaker',
            'Incremental Learning: 재학습 없이 10%+ 성능 향상',
            'Auto Hyperparameter Tuning: LookAlike 12% 향상',
            'Imbalanced Data 처리: Precision 1,000% 향상!',
            'Databricks Data Team Transformation Award!',
        ],
        waves: 12,
        difficulty: 1.8
    },
    {
        id: 6, years: '2023~2024', title: 'SNU RESEARCH',
        subtitle: 'Seoul National University',
        role: 'M.S. (지능정보융합학부)',
        description: 'Multimodal LLM(VLM) 연구\nIEEE Access 논문 (149회 인용, SOTA)\nREFINED 창업 → 대상 수상!',
        bgColors: ['#0a1a0a', '#1a3a2a'],
        enemyTypes: ['turret', 'diver', 'zigzag'],
        bossName: 'THESIS EXAMINER',
        bossColor: '#f0d000',
        achievements: [
            'IEEE Access 논문: Zero-shot Video QA (149 citations, SOTA!)',
            'REFINED 창업: AI 운동 코칭 앱 (과기부·교육부 대상!)',
            '정부지원사업 5,000만원 수여',
            '서울대 창업대회 최우수상',
        ],
        waves: 13,
        difficulty: 2.0
    },
    {
        id: 7, years: '2025~현재', title: 'SMART TV 추천 & VLM',
        subtitle: 'Samsung VD',
        role: 'Senior Data Scientist',
        description: '전세계 1억대+ Samsung TV 추천 시스템 최적화\nMamba4Rec A/B테스트, OCEAN Reranking\nVLM 메타데이터 자동화, Video-to-Commerce\nAI Agent로 EMR 장애 자동 진단',
        bgColors: ['#0a0020', '#200040'],
        enemyTypes: ['diver', 'turret', 'zigzag', 'scout'],
        bossName: 'AI OVERLORD',
        bossColor: '#00e5ff',
        achievements: [
            'ML 기반 추천 최적화: 전세계 1억대+ Samsung TV OTT 추천',
            'Mamba4Rec A/B테스트: 최신 추천 알고리즘 프로덕션 검증',
            'OCEAN Personality Reranking: Big Five 성격 기반 재순위화 (논문 게재)',
            'VLM 비디오 메타데이터 자동화: Vision-Language Model 활용',
            'Video-to-Commerce: 영상 내 상품 인식→실시간 쇼핑 추천',
            'EMR Batch AI Agent: LLM+RAG 기반 장애 자동 진단·재실행',
        ],
        waves: 15,
        difficulty: 2.4
    }
];

const CAREER_INFO = {
    name: 'Kim Wonkyun',
    nameKr: '김원균',
    title: 'Senior Data Scientist @ Samsung Electronics',
    email: 'wonkyunkim.sj@gmail.com',
    linkedin: 'https://www.linkedin.com/in/wonkyun-kim-50084b152/',
    profile: 'Samsung Electronics 10년+ 경력. 두 차례 창업 (대표). IEEE Access 논문 (149회 인용, SOTA). 추천시스템, 광고 AI, MLOps, VLM, AI Agent 전문.'
};
