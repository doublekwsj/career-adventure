const CAREER_DATA = {
    info: {
        name: "Kim Wonkyun",
        nameKr: "김원균",
        title: "Senior Data Scientist",
        email: "wonkyunkim.sj@gmail.com",
        phone: "+82-10-2231-9021",
        linkedin: "https://www.linkedin.com/in/wonkyun-kim-50084b152/",
        profile: "삼성전자 10년+ 경력의 Senior Data Scientist. 두 차례 창업을 대표로 이끌며 다양한 팀을 리딩. IEEE Access 논문 게재(149회 인용, SOTA 달성). 추천 시스템, 광고 타겟팅 AI, MLOps 프레임워크 등 대규모 프로덕션 ML 시스템의 설계·상품화·A/B 테스트·성과 측정까지 ML lifecycle 전반을 주도. 고객 세분화 모델로 일일 100만 건 추론 처리, AI Framework 구축으로 모델 상품화 기간을 3개월에서 1주일 미만으로 단축.",
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
            years: "2015~2018",
            theme: "grassland",
            title: "Data Platform Era",
            subtitle: "Samsung VD - TV Platform Engineer",
            description: "Smart TV의 핵심 데이터 인프라를 구축하고\nTV 생태계를 확장하는 다양한 서비스를 개발.\nSpark 기반 대용량 처리부터 GDPR 대응까지.",
            bgColor1: "#87CEEB",
            bgColor2: "#4a8c2a",
            groundColor: "#5a3a1a",
            achievements: [
                { text: "KPI 데이터 수집 서버: Spark 기반 대용량 데이터 수집·처리 서버 개발. VD사업부 전체 TV KPI 데이터 파이프라인 관리", type: "block", score: 200 },
                { text: "GDPR 대응: EU GDPR 규정에 맞는 개인정보 처리·삭제 파이프라인 개발 및 상품화 완료", type: "block", score: 200 },
                { text: "EPG 어플리케이션: TV 전자 프로그램 가이드 앱 개발 및 상품화 → TV 시청 경험 혁신", type: "coin", score: 150 },
                { text: "SmartView SDK: TV-모바일 연동 SDK 개발 → VD사업부 Convergence 기능 강화 (Smartthings 전신)", type: "coin", score: 150 },
                { text: "DIAL Service: YouTube/Netflix 캐스팅 서비스 개발 및 유지보수 → 주요 OTT 앱 사용성 강화", type: "block", score: 200 },
                { text: "Serverless 품질 데이터 수집 서버: AWS Lambda 기반 비용 최적화된 서버 개발 및 안정적 운영", type: "coin", score: 150 },
                { text: "즉시 시상 2회 + 사업부 주관 대회 2회 수상! (SW Excellent Programmer 포함)", type: "trophy", score: 500 }
            ],
            boss: null,
            enemy: "bug",
            npcDialog: "이 시절은 TV 데이터 세상의 기반을 다진 시기야.\nSpark로 빅데이터를 처리하고, GDPR까지...\n모든 것의 시작이었지!"
        },
        {
            id: 2,
            years: "2019",
            theme: "lab",
            title: "C-Lab Innovation",
            subtitle: "Samsung C-Lab - Healthcare Startup",
            description: "600만원짜리 보청기를 대체하는 혁신적인\n스마트폰 보청 앱을 개발.\n삼성서울병원 임상시험 → CES 2020 전시\n→ 무선사업부 기술 이관 완료!",
            bgColor1: "#1a1a3a",
            bgColor2: "#2a2a5a",
            groundColor: "#3a3a5a",
            achievements: [
                { text: "600만원 보청기를 대체하는 스마트폰 기반 보청 어플리케이션 개발! 누구나 접근 가능한 청각 보조 기술 실현", type: "block", score: 300 },
                { text: "삼성서울병원 협력: 실제 난청 환자 대상 임상시험 진행 → 의학적 효과 검증 완료", type: "block", score: 250 },
                { text: "CES 2020 전시! 세계 최대 IT 전시회에서 혁신 기술로 주목받음", type: "trophy", score: 500 },
                { text: "삼성전자 무선사업부(MX) 기술 이관 완료 → 실제 제품화 단계 진입!", type: "trophy", score: 500 }
            ],
            boss: { name: "CES STAGE", type: "showcase" },
            enemy: "glitch",
            npcDialog: "보청기 하나에 600만원이라니...\n기술로 누구나 들을 수 있는 세상을 만들자!\nCES까지 가서 증명했어."
        },
        {
            id: 3,
            years: "2020",
            theme: "city",
            title: "Ad-Tech & ML",
            subtitle: "Samsung Ads - ML Engineer",
            description: "ACR(Automatic Content Recognition) 데이터와\nML을 결합한 광고 타겟팅 기술 개발.\nLincoln 브랜드 캠페인 성공 운영.\n외부 AI 대회 수상까지!",
            bgColor1: "#2a1a3a",
            bgColor2: "#4a2a5a",
            groundColor: "#2a2a3a",
            achievements: [
                { text: "ACR Feature Engineering: TV의 자동 콘텐츠 인식 데이터를 분석 → 사용자 시청 패턴 피처 설계, 자동화 파이프라인으로 비용·성능 20%+ 효율화!", type: "block", score: 250 },
                { text: "크로스디바이스 광고 모델: User Behavior 데이터로 TV-모바일 간 사용자 매칭 기술 개발 → Cross-device Targeting 실현", type: "block", score: 250 },
                { text: "Lincoln 브랜드 캠페인: 크로스디바이스 광고 타겟팅 모델을 Lincoln 자동차 캠페인에 적용 → 성공적 운영!", type: "trophy", score: 400 },
                { text: "Context-aware Demographic 모델: 미국 시간대(daypart)와 시청 컨텍스트 활용 → 데모그래픽 추론 성능 10% Lift 달성", type: "block", score: 250 },
                { text: "AI 경진대회 최우수상 (GIST 2020): 전력 사용량 예측 Deep Learning 모델 개발 및 비즈니스 모델 평가", type: "trophy", score: 400 },
                { text: "HAICon 보안위협 탐지 AI 장려상 (한국정보보호학회): GRU 기반 Ensemble 모델 — overfitting trade-off 활용", type: "coin", score: 300 }
            ],
            boss: null,
            enemy: "spam",
            npcDialog: "광고 타겟팅의 핵심은 '적시에 적소에'.\nACR 데이터로 TV가 뭘 보여주는지 알고,\n그걸 ML로 맞춤 광고에 연결하는 거지."
        },
        {
            id: 4,
            years: "2021",
            theme: "factory",
            title: "AI Framework & MLOps",
            subtitle: "Samsung Ads - AI Platform Lead",
            description: "ML 모델 상품화를 혁신적으로 자동화.\n3개월 → 1주일, 10명 → 2명.\n일일 100만 건 추론 시스템 구축.\n미국/한국 통합 MLOps 플랫폼 완성.",
            bgColor1: "#1a1a2a",
            bgColor2: "#3a2a1a",
            groundColor: "#4a4a4a",
            achievements: [
                { text: "AI Framework 설계·개발: 광고 AI 모델의 학습·평가·서빙 자동화 통합 프레임워크 → 상품화 3개월 → 1주일 미만!!", type: "trophy", score: 600 },
                { text: "인력 효율화: 동일 업무에 10명 → 2명으로 최적화 (80% 절감) → 나머지 인력은 신규 프로젝트에 투입", type: "block", score: 300 },
                { text: "Demographics 추론 모델: TV 시청 행동 데이터 기반 연령/성별 추론 → 일일 100만 건 처리, 전체 광고 25% 활용 (월 3,000만건+)", type: "block", score: 350 },
                { text: "Auto Hyperparameter Tuning: Bayesian Optimization 기반 자동 최적화 → LookAlike 모델 성능 12% 향상!", type: "coin", score: 250 },
                { text: "Imbalanced Data 처리: 극심한 클래스 불균형(1:1000+) 처리 모델 아키텍처 설계 → Precision 1,000% 향상!!", type: "trophy", score: 500 },
                { text: "LookAlike Audience Targeting: 시드 유저와 유사 잠재 고객 식별 모델 → 기존 대비 50%+ 성능 향상, Brand/Game 캠페인 적용", type: "block", score: 300 },
                { text: "MLOps 통합 플랫폼: 미국/한국 연구소 AI 모델을 단일 프레임워크로 통합. CI/CD, 모니터링, 자동 배포. TFRecord 도입 학습 속도 최적화", type: "block", score: 300 },
                { text: "3rd Party 확장: Vizio TV 대상 데모그래픽 모델 개발·배포 → 삼성 생태계 외부로 광고 비즈니스 확장!", type: "coin", score: 250 },
                { text: "Brand/Game 광고 캠페인: LookAlike 모델을 활용한 직접 캠페인 운영 → 비즈니스 임팩트 검증 완료", type: "coin", score: 200 }
            ],
            boss: { name: "LEGACY SYSTEM", type: "robot" },
            enemy: "bug",
            npcDialog: "기존 시스템의 한계를 부수고\n완전히 새로운 자동화 프레임워크를 만들었어.\n3개월이 1주일이 되는 마법...\n이건 진짜 전쟁이었어."
        },
        {
            id: 5,
            years: "2022",
            theme: "space",
            title: "Real-time AI Evolution",
            subtitle: "Samsung Ads - AI Research",
            description: "실시간 학습하는 AI.\n재학습 없이 지속 개선되는 모델.\nA/B 테스트로 효과를 정량 검증.\nDatabricks 활용 파이프라인 혁신.",
            bgColor1: "#000020",
            bgColor2: "#000040",
            groundColor: "#1a1a3a",
            achievements: [
                { text: "Incremental Learning 파이프라인 설계: 사용자 피드백 데이터를 실시간 반영 → 재학습 없이 지속적 성능 개선! 평균 10%+ 향상", type: "block", score: 350 },
                { text: "TVPlus 광고 Scoring Model: 사용자 행동 데이터 + 콘텐츠 특성 결합 피처 엔지니어링 → CTR 예측 성능 개선", type: "block", score: 300 },
                { text: "데모그래픽 타겟팅 A/B 테스트: 광고 캠페인에서 모델 적용 여부 A/B 테스트 설계·운영 → ROI 기반 의사결정에 기여", type: "coin", score: 250 },
                { text: "Databricks 활용 광고 타겟팅 최적화: 데이터 파이프라인 자동화 → Data Team Transformation Award 수상!", type: "trophy", score: 400 },
                { text: "기존 대비 평균 10% 이상 성능 향상 달성! Feedback loop 기반 자가 진화 AI 모델 완성", type: "trophy", score: 400 }
            ],
            boss: null,
            enemy: "asteroid",
            npcDialog: "데이터는 흐르고, 모델은 스스로 진화한다.\nIncremental Learning으로\nAI의 미래를 본 시기였어."
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
            years: "2025",
            theme: "future",
            title: "AI & Recommendation",
            subtitle: "Samsung SmartTV - Staff Engineer / Data Scientist",
            description: "최첨단 VLM, AI Agent, 추천 시스템으로\nSmartTV 경험을 혁신하는 현재.\nMamba4Rec A/B 테스트,\nVideo-to-Commerce 상용화까지.",
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
