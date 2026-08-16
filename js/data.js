const CAREER_DATA = {
    info: {
        name: "Kim Wonkyun",
        nameKr: "김원균",
        title: "Senior Data Scientist",
        email: "wonkyunkim.sj@gmail.com",
        phone: "+82-10-2231-9021",
        linkedin: "https://www.linkedin.com/in/wonkyun-kim-50084b152/",
        profile: "삼성전자에서 10년 이상 정형 데이터 기반 ML 모델 개발 및 프로덕션 적용 경력을 보유한 Senior Data Scientist. 두 차례 창업을 대표로 이끌며 다양한 팀을 리딩. IEEE Access 논문 게재(149회 인용, SOTA 달성), 추천시스템 Ranking 모델 연구로 OCEAN4Rec 논문 게재(arXiv). 고객 세분화 모델로 일일 100만 건 추론 처리, AI Framework 구축으로 모델 상품화 기간을 3개월→1주일 미만으로 단축. LLM·AI Agent 기반 제품 개발 및 운영 경험도 보유.",
        education: [
            { school: "서울대학교", major: "지능정보융합학부 석사", year: "2023~2025", detail: "Multimodal LLM 연구 | 랩내 창업 (REFINED)" },
            { school: "아주대학교", major: "미디어학부 학사", year: "2008~2014", detail: "" }
        ],
        papers: [
            { title: "An Image Grid Can Be Worth a Video: Zero-Shot Video QA Using a VLM", venue: "IEEE Access, 2024", url: "https://arxiv.org/abs/2403.18406", citations: 149, achievement: "SOTA" },
            { title: "OCEAN Profile 기반 Personalized Reranking Algorithm", venue: "arXiv, 2025", url: "https://arxiv.org/abs/2605.27429", citations: null, achievement: null }
        ],
        skills: {
            "ML/DL": "PyTorch, TensorFlow, Multimodal LLM (VLM), Recommendation Systems, Incremental Learning, AutoML",
            "Data": "Apache Spark, AWS EMR, Feature Engineering, TFRecord, ETL Pipeline, A/B Testing",
            "MLOps": "AWS (EMR, SageMaker, Lambda), MLOps Framework, DevOps (CI/CD), Model Monitoring, Databricks",
            "AI/Agent": "LLM, RAG, AI Agent, VLM, Prompt Engineering",
            "Domain": "추천 시스템, 광고 타겟팅 (CTR/CVR), 고객 세분화, 예측 모델링, 최적화, Cross-device Matching"
        },
        awards: [
            { title: "Grand Prize (대상) - Lab-Based Startup Demoday", org: "과학기술정보통신부·교육부·서울대 산학협력단", date: "2024.12", detail: "REFINED 운동 코칭 앱 — AI 기반 실시간 자세 분석 및 개인화 코칭" },
            { title: "최우수상 (2nd) - 2020 AI 경진대회", org: "GIST", date: "2020.12", detail: "전력 사용량 예측 Deep Learning 모델" },
            { title: "장려상 - HAICon 2020 보안위협 탐지 AI", org: "한국정보보호학회", date: "2020.10", detail: "GRU 기반 Ensemble 모델" },
            { title: "Data Team Transformation Award", org: "Databricks", date: "", detail: "광고 타겟팅 최적화 및 데이터 파이프라인 자동화" },
            { title: "SW Excellent Programmer · Best Reviewer", org: "Samsung Electronics", date: "", detail: "" },
            { title: "CES 2020 전시", org: "Samsung C-Lab", date: "2020.01", detail: "보청기 어플리케이션" },
            { title: "서울대학교 창업 대회 최우수상", org: "서울대학교", date: "2024", detail: "REFINED 앱 (정부지원사업 5,000만원 수여)" }
        ]
    },
    zones: [
        {
            id: 1,
            years: "2014~2017",
            theme: "grassland",
            title: "Software Engineer",
            subtitle: "Samsung VD - Smart TV & Mobile App",
            description: "Samsung Frame TV, Eden Mobile, One App 등 개발.\nSpark 기반 KPI 서버, GDPR 대응.\nSmartView SDK/DIAL Service 상품화.",
            bgColor1: "#87CEEB",
            bgColor2: "#4a8c2a",
            groundColor: "#5a3a1a",
            achievements: [
                { text: "Samsung Frame TV 앱, Samsung Eden Mobile, Samsung One App 개발 (Android, Node.js, C++, Tizen, RESTful API)", type: "block", score: 200 },
                { text: "KPI 데이터 수집 서버: Spark 기반 대용량 데이터 수집·처리 서버 개발 및 안정적 운영", type: "block", score: 200 },
                { text: "GDPR 대응: EU 규정에 맞는 개인정보 처리·삭제 파이프라인 개발 및 상품화", type: "coin", score: 150 },
                { text: "SmartView SDK / DIAL Service: TV-모바일 연동 SDK, YouTube/Netflix 캐스팅 서비스 개발 및 상품화", type: "block", score: 200 },
                { text: "즉시 시상 2회 + 사업부 주관 대회 2회 수상 (SW Excellent Programmer)", type: "trophy", score: 500 }
            ],
            boss: null,
            enemy: "bug",
            npcDialog: "서비스 개발부터 빅데이터 인프라까지,\n삼성 Smart TV의 기반을 만든 시기야.\nSpark, GDPR, SDK... 모든 것의 시작!"
        },
        {
            id: 2,
            years: "2017~2018",
            theme: "lab",
            title: "Big Data & Ad Platform",
            subtitle: "Samsung VD - Data Scientist",
            description: "Smart TV 광고 플랫폼 초기 빅데이터 모델 개발.\nACR Feature Engineering으로 비용·성능 20%+ 효율화.\nCross-device 광고 모델 → Lincoln 브랜드 캠페인 적용.",
            bgColor1: "#1a1a3a",
            bgColor2: "#2a2a5a",
            groundColor: "#3a3a5a",
            achievements: [
                { text: "Smart TV 광고 플랫폼 초기 빅데이터 모델: 가구 단위 Demographic 모델, Spark/Python 활용 빅데이터 수집·분석·ML 모델 개발", type: "block", score: 250 },
                { text: "ACR Feature Engineering: TV의 ACR(Automatic Content Recognition) 데이터 분석 → 사용자 시청 패턴 피처 설계, 비용 및 성능 20% 이상 효율화!", type: "block", score: 300 },
                { text: "크로스디바이스 광고 모델: User Behavior 데이터로 TV-모바일 간 사용자 매칭 및 타겟팅 모델 개발 → Lincoln 브랜드 캠페인 적용!", type: "trophy", score: 400 }
            ],
            boss: null,
            enemy: "glitch",
            npcDialog: "데이터 엔지니어에서 데이터 사이언티스트로.\nACR 데이터와 ML을 결합해\n광고 타겟팅의 첫 걸음을 뗀 시기야."
        },
        {
            id: 3,
            years: "2018~2019",
            theme: "city",
            title: "C-Lab Innovation",
            subtitle: "Samsung C-Lab - Creative Team Lead",
            description: "600만원짜리 보청기를 대체하는\n스마트폰 보청 앱 프로젝트를 리딩!\n삼성서울병원 임상시험 성공\n→ CES 2019 출품 → 무선사업부 기술 이관.",
            bgColor1: "#2a1a3a",
            bgColor2: "#4a2a5a",
            groundColor: "#2a2a3a",
            achievements: [
                { text: "스마트폰 기반 보청기 앱 개발 프로젝트 리딩: 600만원 보청기를 AI 기술로 대체! 신호처리 및 AI 적용으로 시중 보청기 성능 상회", type: "block", score: 350 },
                { text: "삼성서울병원 임상시험: 실제 난청 환자 대상 임상시험 진행 → 의학적 효과 검증 완료", type: "block", score: 300 },
                { text: "CES 2019 출품! 세계 최대 IT 전시회에서 혁신 기술로 주목", type: "trophy", score: 500 },
                { text: "삼성전자 무선사업부(MX) 기술 이관 완료 → 실제 제품화 단계 진입!", type: "trophy", score: 500 }
            ],
            boss: { name: "CES STAGE", type: "showcase" },
            enemy: "spam",
            npcDialog: "보청기 하나에 600만원이라니...\n기술로 누구나 들을 수 있는 세상을 만들자!\nCES까지 가서 증명했어."
        },
        {
            id: 4,
            years: "2019~2021",
            theme: "factory",
            title: "Ad Targeting Model",
            subtitle: "Samsung Ads - Data Scientist",
            description: "Demographic 스코어링 모델 개발.\nNielsen 패널 Ground Truth 활용\n→ 일일 100만 건 추론, 전체 광고의 25%\nLookAlike 모델 50%+ 성능 향상.",
            bgColor1: "#1a1a2a",
            bgColor2: "#3a2a1a",
            groundColor: "#4a4a4a",
            achievements: [
                { text: "Demographic 스코어링 모델: Nielsen 패널 Ground Truth로 TV 사용자 연령·성별·가구 유형 예측 → 일일 100만 건 추론, 전체 광고 25% 활용 (월 3,000만건+)", type: "trophy", score: 500 },
                { text: "LookAlike 모델링: 고가치 사용자 세그먼트 식별, 유사 잠재고객 최적 타겟팅 → 기존 대비 성능 50% 이상 향상! 캠페인 ROI 개선", type: "block", score: 350 },
                { text: "데모그래픽 타겟팅 A/B 테스트 & 실험 설계: 모델 적용 여부 A/B 테스트 → CTR +12%, CVR +10% 달성!", type: "trophy", score: 500 },
                { text: "3rd Party 확장: Vizio TV 대상 데모그래픽 모델 개발·배포 → 삼성 생태계 외부로 광고 비즈니스 확장", type: "block", score: 300 },
                { text: "GIST AI 경진대회 최우수상(2nd): 전력 사용량 예측 Deep Learning 모델 (2020.12)", type: "trophy", score: 400 },
                { text: "HAICon 2020 보안위협 탐지 AI 장려상: GRU 기반 Ensemble 모델 (한국정보보호학회)", type: "coin", score: 300 }
            ],
            boss: { name: "LEGACY SYSTEM", type: "robot" },
            enemy: "bug",
            npcDialog: "일일 100만 건 추론, CTR +12%...\n숫자로 증명하는 게 광고 ML의 세계야.\n모델이 곧 매출인 시대를 열었지."
        },
        {
            id: 5,
            years: "2021~2023",
            theme: "space",
            title: "AI Platform & MLOps",
            subtitle: "Samsung Ads - Senior Data Scientist",
            description: "AI Framework 구축 → 상품화 3개월→1주일!\n인력 10명→2명. Incremental Learning.\nMLOps 파이프라인 (Airflow·MLflow·SageMaker).\nDatabricks Data Team Transformation Award!",
            bgColor1: "#000020",
            bgColor2: "#000040",
            groundColor: "#1a1a3a",
            achievements: [
                { text: "AI Framework 설계·개발: 광고 AI 모델의 학습·평가·서빙 자동화 통합 프레임워크 → 상품화 기간 3개월 → 1주일 미만! 인력 10명→2명!", type: "trophy", score: 600 },
                { text: "MLOps 파이프라인 구축 (Airflow·MLflow·AWS SageMaker): 실험 트래킹~모니터링까지 전체 모델 라이프사이클 관리 플랫폼", type: "block", score: 350 },
                { text: "Incremental Learning 도입: 사용자 피드백 실시간 반영 → 재학습 없이 지속 성능 개선, 기존 대비 평균 10%+ 향상", type: "block", score: 350 },
                { text: "Auto Hyperparameter Tuning: Bayesian Optimization 기반 자동 최적화 → LookAlike 모델 성능 12% 향상!", type: "coin", score: 250 },
                { text: "Imbalanced Data 처리: 극심한 클래스 불균형(1:1000+) 모델 아키텍처 설계 → Precision 기존 대비 1,000% 향상!", type: "trophy", score: 500 },
                { text: "MLOps 통합 플랫폼: 미국/한국 연구소 AI 모델을 단일 프레임워크로 통합, CI/CD, 모니터링, TFRecord 학습 속도 최적화", type: "block", score: 300 },
                { text: "Databricks Data Team Transformation Award 수상! 광고 타겟팅 최적화 및 데이터 파이프라인 자동화 공로", type: "trophy", score: 400 }
            ],
            boss: { name: "LEGACY INFRA", type: "robot" },
            enemy: "asteroid",
            npcDialog: "3개월이 1주일이 되는 마법.\n10명이 2명으로 줄어드는 자동화.\nMLOps의 힘을 보여준 시기야."
        },
        {
            id: 6,
            years: "2023~2024",
            theme: "university",
            title: "SNU & Research",
            subtitle: "Seoul National University - M.S. (Intelligence & Information Convergence)",
            description: "서울대학교에서 Multimodal LLM을 연구.\nIEEE Access 논문 → 149회 인용, SOTA 달성!\n창업 대표로 REFINED 앱 런칭,\n대상 수상 + 정부지원 5,000만원.",
            bgColor1: "#1a3a5a",
            bgColor2: "#2a4a6a",
            groundColor: "#3a3a2a",
            achievements: [
                { text: "서울대학교 지능정보융합학과 석사 입학 및 졸업! 연구와 창업을 동시에 수행", type: "block", score: 300 },
                { text: "IEEE Access 논문 게재: 'An Image Grid Can Be Worth a Video: Zero-Shot Video QA Using a VLM'", type: "trophy", score: 600, url: "https://arxiv.org/abs/2403.18406" },
                { text: "149회 인용 & SOTA 달성!! 해당 분야 최고 성능을 기록한 연구 성과", type: "trophy", score: 700 },
                { text: "REFINED 운동 코칭 앱 창업: AI 기반 실시간 자세 분석 및 개인화 코칭 서비스 → 대표로 팀 리딩", type: "block", score: 350, url: "https://apps.apple.com/kr/app/%EB%A6%AC%ED%8C%8C%EC%9D%B8%EB%93%9C-%EC%9A%B4%EB%8F%99%EB%A3%A8%ED%8B%B4-%EC%9A%B4%EB%8F%99%EC%9D%BC%EC%A7%80-%ED%97%AC%EC%8A%A4-%EC%9A%B4%EB%8F%99%EC%96%B4%ED%94%8C-%EC%9B%A8%EC%9D%B4%ED%8A%B8%ED%8A%B8%EB%A0%88/id6751578826" },
                { text: "Lab-Based Startup Demoday 대상(Grand Prize)! 과기부·교육부·서울대 산학협력단 주관 (2024.12)", type: "trophy", score: 600 },
                { text: "정부지원사업 5,000만원 수여! 과학기술정보통신부·교육부 지원", type: "block", score: 400 },
                { text: "서울대학교 창업 대회 최우수상 수상 → 창업 역량 + 리더십 검증", type: "trophy", score: 500 }
            ],
            boss: { name: "THESIS", type: "professor" },
            enemy: "deadline",
            npcDialog: "연구자로서, 창업 대표로서, 리더로서.\n한 해에 세 가지 역할을 동시에 해냈어.\nIEEE Access 게재 + 149회 인용 + 대상까지...\n가장 치열했던 시간이야."
        },
        {
            id: 7,
            years: "2025~현재",
            theme: "future",
            title: "Smart TV 추천 & VLM",
            subtitle: "Samsung VD - Senior Data Scientist",
            description: "전세계 1억대+ Samsung TV 추천 시스템 최적화.\nMamba4Rec A/B테스트, Personality Reranking.\nVLM 기반 메타데이터 자동화, Video-to-Commerce.\nAI Agent로 EMR 장애 자동 진단까지.",
            bgColor1: "#0a1a3a",
            bgColor2: "#0a3a5a",
            groundColor: "#1a2a3a",
            achievements: [
                { text: "SmartTV 추천 최적화: User Taste Test 기능 설계·구현 → 신규 사용자 콜드스타트 문제 완벽 해결! 실시간 초기 추천 생성", type: "block", score: 300 },
                { text: "OTT My Channel: Samsung TV OTT 서비스에서 사용자별 맞춤형 VOD를 EPG 가이드 채널 형태로 추천 → Coverage 100% 달성!", type: "block", score: 350 },
                { text: "추천 알고리즘 A/B 테스트: Mamba4Rec 등 최신 알고리즘을 프로덕션에서 테스트 → 데이터 기반 최적 알고리즘 선정", type: "coin", score: 250 },
                { text: "OCEAN(Big Five) Personality 기반 Reranking: 성격 프로필 활용 재순위화 알고리즘 설계·구현 → 논문 게재!", type: "trophy", score: 500, url: "https://arxiv.org/abs/2605.27429" },
                { text: "VLM 비디오 메타데이터 자동화: Vision-Language Model로 프레임별 시각 설명 생성 → 전체 영상 메타데이터 자동 태깅 파이프라인", type: "block", score: 300 },
                { text: "자동 하이라이트 숏폼 생성: 시청 패턴 + 선호도 분석 → 영상 내 최적 구간 추천 알고리즘 → 숏폼 자동 생성 엔진 상용화!", type: "block", score: 350 },
                { text: "Video-to-Commerce: 영상 내 제품 자동 식별·라벨링 + 실시간 문맥 기반 상품 추천 → 시청 중 자연스러운 쇼핑 경험!", type: "trophy", score: 500 },
                { text: "EMR Batch AI Agent: AWS EMR 오류 시 코드/로그/Cloud 상태 종합 분석 → 자동 진단 + 재실행까지 수행하는 AI Agent 구현!", type: "block", score: 300 }
            ],
            boss: { name: "THE FUTURE", type: "ai" },
            enemy: "glitch",
            npcDialog: "VLM, AI Agent, 추천 시스템...\n기술의 최전선에서 미래를 만들고 있어.\nTV가 사용자를 이해하는 시대,\n그 시작을 내가 만들고 있는 거야."
        }
    ]
};
