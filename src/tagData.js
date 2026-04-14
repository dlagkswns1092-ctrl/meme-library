export const FIXED_MEME_TAGS = ["이미지", "gif", "10대", "20대", "30대"];

export function sanitizeKoreanTagInput(value) {
    return value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, "").replace(/\s+/g, " ");
}