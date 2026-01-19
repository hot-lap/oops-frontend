// Form
export const TYPES = [
  "약속/일정",
  "선택/결정",
  "말/소통",
  "기대/결과 불일치",
  "직접 입력",
] as const;

export const REASONS = [
  "미루는 습관",
  "감정 기복",
  "체력 부족",
  "과한 기대",
  "판단 착오",
] as const;

export const EMOTIONS = [
  "답답함",
  "속상함",
  "서운함",
  "짜증",
  "불안",
  "후회",
] as const;

export const EMOTION_SCORE_MAP = {
  1: {
    img: "/icons/emotion1.svg",
    title: "괜찮아요",
    subtitle: "잠깐 신경 쓰였지만, 바로 잊고 다른 일에 집중했어요.",
  },
  2: {
    img: "/icons/emotion2.svg",
    title: "신경 쓰여요",
    subtitle: "가끔 생각났지만, 큰 방해 없이 일상생활이 가능했어요.",
  },
  3: {
    img: "/icons/emotion3.svg",
    title: "마음에 걸려요",
    subtitle: "하루 종일은 아니지만, 쉽게 넘기긴 어려웠어요.",
  },
  4: {
    img: "/icons/emotion4.svg",
    title: "마음이 무거워요",
    subtitle: "그 생각에서 벗어나기 힘들고, 기분이 저조했어요.",
  },
  5: {
    img: "/icons/emotion5.svg",
    title: "너무 힘들어요",
    subtitle: "계속 생각나서 다른 일을 아무것도 하지 못했어요.",
  },
} as const;

// 홈화면 랜덤타이틀
// 첫 방문용 고정 타이틀/서브타이틀
export const FIRST_VISIT_TITLE = "오늘의 실패를 적어볼까요?";
export const FIRST_VISIT_SUBTITLE = "마음이 한결 가벼워질 거예요";
// 이후 방문용 랜덤 타이틀/서브타이틀
export const RETURN_VISIT_TITLE = [
  "마음에 걸리는 일이 있었나요?",
  "하루종일 신경 쓰인 순간이 있나요?",
  "오늘 마음에 남은 일이 있나요?",
  "오늘은 어떤 일 때문에 생각이 많아졌나요?",
  "괜히 계속 떠오르는 일이 있나요?",
  "오늘 하루, 계속 맴도는 일이 있나요?",
];
export const RETURN_VISIT_SUBTITLE = "오늘의 실패를 기록해보세요";

// 로딩화면 랜덤 타이틀/서브타이틀
export const LOADING_TITLE = [
  "오늘은 여기까지 정리했어요",
  "이건 기록으로 남겼어요",
  "정리 끝!",
];
export const LOADING_SUBTITLE = [
  "기록한 것만으로도 충분해요",
  "이제 내려놔도 돼요",
  "오늘은 여기까지",
];
