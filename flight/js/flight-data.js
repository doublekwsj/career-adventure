// Career Flight - Stage Data
const STAGES = [
    {
        id: 1, years: '2015~2018', title: 'DATA PLATFORM ERA',
        subtitle: 'Samsung Electronics VD Division',
        role: 'TV Platform Engineer',
        description: 'Smart TV 핵심 데이터 인프라 구축\nSpark 빅데이터 처리 + GDPR 대응\n→ VD사업부 전체 TV KPI 파이프라인 관리',
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
        id: 2, years: '2019', title: 'C-LAB INNOVATION',
        subtitle: 'Samsung C-Lab Inside',
        role: 'Healthcare Startup Lead',
        description: '600만원짜리 보청기를 대체하는\n스마트폰 보청 앱 개발 → CES 2020 전시\n→ 삼성 무선사업부(MX) 기술 이관 완료!',
        bgColors: ['#0a1a2e', '#1a3a5e'],
        enemyTypes: ['scout', 'zigzag', 'diver'],
        bossName: 'CES STAGE GUARDIAN',
        bossColor: '#4fc3f7',
        achievements: [
            '보청 앱 개발: 600만원 보청기를 스마트폰으로 대체!',
            '삼성서울병원 임상시험: 실제 난청환자 대상 효과 검증',
            'CES 2020 전시: 세계 최대 IT전시회에서 혁신기술 소개',
            '무선사업부(MX) 기술이관: 실제 제품화 단계 진입',
        ],
        waves: 9,
        difficulty: 1.2
    },
    {
        id: 3, years: '2020', title: 'AD-TECH & ML',
        subtitle: 'Samsung Ads',
        role: 'ML Engineer',
        description: 'ACR 데이터 + ML 결합 광고 타겟팅 개발\nCross-device 매칭 기술 상품화\n외부 AI 대회 수상 2건!',
        bgColors: ['#1a0a2e', '#3a1a5e'],
        enemyTypes: ['scout', 'zigzag', 'turret'],
        bossName: 'AD NETWORK AI',
        bossColor: '#e91e63',
        achievements: [
            'ACR 파이프라인: ML 기반 콘텐츠 인식 광고 타겟팅',
            'Lincoln 캠페인: Cross-device 광고 매칭 성공 운영',
            'GIST AI대회 최우수상: 전력예측 Deep Learning 모델',
            'HAICon 2020 장려상: GRU 기반 보안위협 탐지',
        ],
        waves: 10,
        difficulty: 1.4
    },
    {
        id: 4, years: '2021', title: 'MLOPS FACTORY',
        subtitle: 'Samsung Ads',
        role: 'MLOps Architect',
        description: 'AI Framework 구축으로\n모델 상품화 기간 3개월→1주일로 단축!\n일일 100만건 추론 처리 시스템 운영',
        bgColors: ['#1a1a1a', '#2a2a3a'],
        enemyTypes: ['zigzag', 'diver', 'turret'],
        bossName: 'FACTORY MAINFRAME',
        bossColor: '#ff9800',
        achievements: [
            'AI Framework: 모델 상품화 3개월 → 1주일 미만으로 단축!',
            'Demographics 모델: 일일 100만건 추론 프로덕션 운영',
            'Databricks Award: Data Team Transformation 수상',
            'AutoML Pipeline: 자동 모델 학습 + A/B 테스트 시스템',
        ],
        waves: 11,
        difficulty: 1.6
    },
    {
        id: 5, years: '2022', title: 'INCREMENTAL AI',
        subtitle: 'Samsung Ads',
        role: 'Senior ML Engineer',
        description: 'Incremental Learning 기반\n지속 학습 시스템 구축\n클라우드 비용 40% 절감 달성',
        bgColors: ['#0a0a1a', '#1a1040'],
        enemyTypes: ['diver', 'turret', 'scout'],
        bossName: 'DEEP LEARNING CORE',
        bossColor: '#7c4dff',
        achievements: [
            'Incremental Learning: 지속적 모델 적응 시스템 구축',
            'Feature Store: 실시간 Feature Serving 인프라',
            'Model Monitoring: Drift 탐지 + 자동 재학습',
            'Cost Optimization: 클라우드 비용 40% 절감!',
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
        id: 7, years: '2025', title: 'AI FUTURE',
        subtitle: 'Toss Bank',
        role: 'AI/ML Engineer',
        description: '금융 AI 추천 시스템 구축\nOCEAN 성격 기반 개인화 알고리즘\nMultimodal AI 대규모 적용',
        bgColors: ['#0a0020', '#200040'],
        enemyTypes: ['diver', 'turret', 'zigzag', 'scout'],
        bossName: 'AI OVERLORD',
        bossColor: '#00e5ff',
        achievements: [
            '추천 시스템: 개인화 금융 상품 매칭 AI',
            'OCEAN Reranking: 성격 기반 개인화 알고리즘 (논문 게재)',
            'VLM 적용: Multimodal AI 대규모 서비스 배포',
            'AI Agent: 자율 지능 시스템 구축',
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
