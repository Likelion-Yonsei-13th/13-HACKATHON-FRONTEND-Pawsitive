// src/app/tipoff/[category]/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Draft = {
  title: string;
  content: string;
  tags: string[];
  imagePreview?: string | null;
  videoName?: string | null;
};

const ICONS = {
  image: "/svg/imgicon.svg", // 예: public/svg/image.svg
  video: "/svg/camicon.svg", // 예: public/svg/video.svg
  format: "/svg/texticon.svg", // 굵게/텍스트 서식 아이콘 파일명
  emoji: "/svg/emoticon.svg", // 이모지 아이콘 파일명
  pin: "/svg/locaicon.svg", // 위치(핀) 아이콘 파일명
} as const;

/** 공통 아이콘 버튼 (접근성 포함) */
function IconButton({
  src,
  title,
  onClick,
}: {
  src: string;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-lg p-1.5 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
    >
      {/* 외부 SVG는 색상을 바꾸려면 파일 자체가 단색/컬러 준비돼 있어야 함 */}
      <img src={src} alt="" aria-hidden className="h-5 w-5" />
      <span className="sr-only">{title}</span>
    </button>
  );
}

export default function TipoffWritePage() {
  const router = useRouter();
  const { category } = useParams<{ category: string }>();
  const cat = decodeURIComponent(category);

  // 카테고리별 로컬 초안 저장 키
  const DRAFT_KEY = useMemo(() => `tipoff:draft:${cat}`, [cat]);

  // 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const imgInputRef = useRef<HTMLInputElement>(null);
  const vidInputRef = useRef<HTMLInputElement>(null);

  // 최초 진입 시 초안 불러오기
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d: Draft = JSON.parse(raw);
      setTitle(d.title ?? "");
      setContent(d.content ?? "");
      setTags(d.tags ?? []);
      setImagePreview(d.imagePreview ?? null);
      setVideoName(d.videoName ?? null);
    } catch {}
  }, [DRAFT_KEY]);

  // 임시등록(초안 저장)
  const saveDraft = () => {
    const d: Draft = { title, content, tags, imagePreview, videoName };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    setToast("임시등록 완료! 이 기기에서 계속 이어서 작성할 수 있어요.");
    setTimeout(() => setToast(null), 1600);
  };

  // 등록(데모) → 해당 카테고리 리스트로 이동
  const canSubmit = title.trim().length > 0 && content.trim().length > 0;
  const submitPost = () => {
    if (!canSubmit) return;
    localStorage.removeItem(DRAFT_KEY);
    setToast("등록되었습니다. 검토 후 게시됩니다.");
    setTimeout(() => {
      setToast(null);
      router.push(`/reports/${encodeURIComponent(cat)}`);
    }, 700);
  };

  // 태그 입력: 쉼표 또는 Enter로 추가(최대 10개)
  const onTagKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const el = e.currentTarget;
    if ((e.key === "Enter" || e.key === ",") && el.value.trim()) {
      e.preventDefault();
      if (tags.length >= 10) return;
      const next = el.value.trim().replace(/^#/, "");
      if (!tags.includes(next)) setTags((t) => [...t, next]);
      el.value = "";
    }
  };
  const removeTag = (x: string) => setTags((t) => t.filter((v) => v !== x));

  // 파일 선택
  const onPickImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  };
  const onPickVideo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVideoName(f.name);
  };

  return (
    <section className="px-4 py-6">
      {/* 상단 액션 줄: 닫기 / 임시등록 / 등록 */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => router.back()}
          className="rounded-lg p-2 hover:bg-neutral-100"
        >
          ✕
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-sm bg-[#C5F6D9] px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-emerald-300"
          >
            임시등록
          </button>
          <button
            type="button"
            onClick={submitPost}
            disabled={!canSubmit}
            className="rounded-sm bg-[#C5F6D9] px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-emerald-300"
          >
            등록
          </button>
        </div>
      </div>

      {/* 제목 */}
      <label className="block">
        <span className="mb-1 block text-sm text-neutral-700">제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-[15px] outline-none focus:border-neutral-400"
        />
      </label>

      {/* ── 도구바 (이모지 → public/svg 아이콘으로 변경) ───────────────────── */}
      <div className="mt-3 flex items-center gap-3 border-b pb-2 text-[18px] text-neutral-700">
        <IconButton
          src={ICONS.image}
          title="이미지 첨부"
          onClick={() => imgInputRef.current?.click()}
        />
        <IconButton
          src={ICONS.video}
          title="동영상 첨부"
          onClick={() => vidInputRef.current?.click()}
        />
        <IconButton
          src={ICONS.format}
          title="텍스트 서식"
          onClick={() =>
            setContent((c) => (c ? c + "\n**굵게** " : "**굵게** "))
          }
        />
        <IconButton
          src={ICONS.emoji}
          title="이모지"
          onClick={() => setContent((c) => (c ? c + " 🙂" : "🙂"))}
        />
        <IconButton
          src={ICONS.pin}
          title="위치"
          onClick={() =>
            setContent((c) => (c ? c + "\n📍 내 위치" : "📍 내 위치"))
          }
        />

        {/* 숨겨진 파일 input */}
        <input
          ref={imgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickImage}
        />
        <input
          ref={vidInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={onPickVideo}
        />
      </div>

      {/* 이미지/영상 미리보기 */}
      {imagePreview && (
        <div className="mt-3 overflow-hidden rounded-xl border">
          <img
            src={imagePreview}
            alt="선택한 이미지"
            className="w-full object-cover"
          />
        </div>
      )}
      {videoName && (
        <div className="mt-2 text-xs text-neutral-600">
          영상 파일: {videoName}
        </div>
      )}

      {/* 본문 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
        rows={10}
        className="mt-3 w-full resize-y rounded-xl border border-neutral-300 bg-white p-3 text-[15px] leading-6 outline-none focus:border-neutral-400"
      />

      {/* 태그 영역 */}
      <div className="rounded-xl border bg-white">
        <div className="flex flex-wrap gap-2 px-3 py-2 mt-3">
          {tags.map((t) => (
            <span
              key={t}
              className="group inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs"
            >
              #{t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="rounded p-0.5 text-neutral-500 hover:bg-neutral-200"
                aria-label={`${t} 태그 제거`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center">
          <input
            onKeyDown={onTagKeyDown}
            placeholder="# 태그입력(, 또는 Enter로 구분, 최대 10개)"
            className="-mt-6 w-full px-3 py-3 text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>
    </section>
  );
}
