"use client";

import PageLayout from "@/app/components/PageLayout";
import { data as users } from "@/app/lib/data";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ISSUE_SCRAPS } from "@/app/lib/issueScraps";
import { PROVINCES, PROVINCE_ORDER } from "@/app/lib/regions";

// 단일 선택(내 거주 지역)용
import MyAreaListBox from "../interest-myarea/components/myAreaListBox";
// 복수 선택(관심 지역)용
import AreasListBox from "../interest-areas/components/AreasListBox";

type Picked = { province: string; district: string } | null;
type PickedMulti = { province: string; district: string };

const MAX_SELECT = 5;

export default function MyArea() {
  const user = users.find((u) => u.id === 1);

  // 내 거주 지역
  const [myplace, setMyplace] = useState("서대문구");

  // 관심 지역
  const [interestAreas, setInterestAreas] = useState<string[]>([
    "마포구",
    "은평구",
    "종로구",
  ]);

  // 패널 토글
  const [open, setOpen] = useState(false);
  const [openInterest, setOpenInterest] = useState(false);

  // 이슈 스크랩 펼침
  const [showAllScraps, setShowAllScraps] = useState(false);
  const visibleScraps = showAllScraps ? ISSUE_SCRAPS : ISSUE_SCRAPS.slice(0, 3);

  // ---------- 내 거주 지역 변경 모달(단일) ----------
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [province, setProvince] = useState<string>("서울");
  const [picked, setPicked] = useState<Picked>(null);
  const districts = PROVINCES[province] ?? [];
  const isSelected = (prov: string, d: string) =>
    picked?.province === prov && picked?.district === d;
  const toggleDistrict = (prov: string, d: string) => {
    if (isSelected(prov, d)) setPicked(null);
    else setPicked({ province: prov, district: d });
  };
  const confirmPick = () => {
    if (picked?.district) {
      setMyplace(picked.district);
      setPickerOpen(false);
    }
  };

  // ---------- 관심 지역 추가/변경 모달(복수) ----------
  const [isAreasPickerOpen, setAreasPickerOpen] = useState(false);
  const [province2, setProvince2] = useState<string>("서울");
  const [selectedMulti, setSelectedMulti] = useState<PickedMulti[]>(
    interestAreas.map((d) => ({ province: "서울", district: d })) // 초기값(데모: 모두 서울 소속 가정)
  );
  const districts2 = PROVINCES[province2] ?? [];

  const selectedCountByProvince = useMemo(() => {
    const m = new Map<string, number>();
    selectedMulti.forEach((s) =>
      m.set(s.province, (m.get(s.province) || 0) + 1)
    );
    return m;
  }, [selectedMulti]);

  const isSelectedMulti = (prov: string, d: string) =>
    selectedMulti.some((s) => s.province === prov && s.district === d);

  const toggleDistrictMulti = (prov: string, d: string) => {
    const exists = isSelectedMulti(prov, d);
    if (exists) {
      setSelectedMulti((prev) =>
        prev.filter((s) => !(s.province === prov && s.district === d))
      );
      return;
    }
    if (selectedMulti.length >= MAX_SELECT) return;
    setSelectedMulti((prev) => [...prev, { province: prov, district: d }]);
  };

  const saveInterestAreas = () => {
    setInterestAreas(selectedMulti.map((s) => s.district));
    setAreasPickerOpen(false);
  };

  return (
    <PageLayout pageTitle="나의 지역">
      <div className="w-full min-h-screen mb-20">
        {/* 상단 인사 */}
        <div className="flex flex-row gap-4 justify-start items-end mx-6 mt-8 mb-10">
          <p className="text-3xl font-bold">{user?.name ?? "이름 없음"}</p>
          <p className="text-2xl">님의 지역이에요</p>
        </div>

        {/* 상세 리스트 */}
        <div className="flex flex-col items-start gap-5">
          {/* 나의 거주 지역 (토글) */}
          <button
            aria-expanded={open}
            aria-controls="my-area-panel"
            onClick={() => setOpen((v) => !v)}
            className={`relative ml-6 pl-7 text-xl ${
              open ? "font-bold" : "font-normal"
            }`}
          >
            <span className="before:content-[''] before:absolute before:left-0 before:top-1 before:w-2 before:h-6 before:bg-black" />
            나의 거주 지역
          </button>

          {/* 나의 거주 지역 패널 */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="my-area-panel"
                key="my-area-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden w-full"
              >
                <div className="mt-2 mb-6 ml-6 mr-6 rounded-md p-4">
                  {/* 현재 거주 지역 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-black underline underline-offset-4">
                        나의 현재 거주 지역
                      </p>
                      <button
                        onClick={() => {
                          setPickerOpen(true);
                          setProvince("서울");
                          setPicked(null);
                        }}
                        className="text-xs text-gray-400"
                      >
                        변경하기
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-black">{myplace}</p>
                  </div>

                  {/* 이슈 스크랩 */}
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-black underline underline-offset-4">
                        이슈 스크랩
                      </p>
                      <button
                        onClick={() => setShowAllScraps((v) => !v)}
                        className="text-xs text-gray-400"
                      >
                        {showAllScraps ? "닫기" : "더보기"}
                      </button>
                    </div>

                    <ul className="mt-4 space-y-3">
                      {visibleScraps.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white shadow-sm px-3 py-3"
                        >
                          <div className="flex-1 pr-3">
                            <p className="text-base font-semibold truncate">
                              {item.title}
                            </p>
                            <p className="mt-3 text-xs text-gray-500">
                              {item.meta}
                            </p>
                          </div>
                          <div className="relative">
                            <img
                              src={item.thumb}
                              alt=""
                              className="h-15 w-15 rounded-md object-cover border border-neutral-200"
                            />
                            <button
                              aria-label={
                                item.starred ? "스크랩 해제" : "스크랩"
                              }
                              className="absolute top-0 right-1 text-[#C5F6D9] text-lg"
                              title={item.starred ? "스크랩 해제" : "스크랩"}
                            >
                              {item.starred ? "★" : "☆"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 나의 관심 지역(타지역) (토글) */}
          <button
            aria-expanded={openInterest}
            aria-controls="interest-area-panel"
            onClick={() => setOpenInterest((v) => !v)}
            className={`relative ml-6 pl-7 text-xl ${
              openInterest ? "font-bold" : "font-normal"
            }`}
          >
            <span className="before:content-[''] before:absolute before:left-0 before:top-1 before:w-2 before:h-6 before:bg-black" />
            나의 관심 지역(타지역)
          </button>

          {/* 관심 지역(타지역) 패널 */}
          <AnimatePresence initial={false}>
            {openInterest && (
              <motion.div
                id="interest-area-panel"
                key="interest-area-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden w-full"
              >
                <div className="mt-2 mb-6 ml-6 mr-6 rounded-md p-4">
                  <p className="text-sm text-black underline underline-offset-4 pb-5">
                    내가 등록한 관심 지역
                  </p>

                  <ul className="space-y-2">
                    {interestAreas.map((area) => (
                      <li
                        key={area}
                        className="flex items-center justify-between px-1 py-2"
                      >
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 text-right">
                    <button
                      className="text-xs text-gray-500 underline underline-offset-2"
                      onClick={() => {
                        // 모달 초기화
                        setAreasPickerOpen(true);
                        setProvince2("서울");
                        setSelectedMulti(
                          interestAreas.map((d) => ({
                            province: "서울",
                            district: d,
                          }))
                        );
                      }}
                    >
                      관심 지역 추가/변경하기
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 내 지역 변경 (단일) */}
      <AnimatePresence>
        {isPickerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setPickerOpen(false)}
            />
            <motion.div
              className="relative z-10 w-[92vw] max-w-[420px] rounded-xl bg-white shadow-xl p-4"
              initial={{ scale: 0.98, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-modal="true"
              aria-label="내 지역 변경"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">내 지역 변경</h3>
                <button
                  className="text-sm text-gray-500"
                  onClick={() => setPickerOpen(false)}
                >
                  닫기
                </button>
              </div>

              <MyAreaListBox
                province={province}
                setProvince={setProvince}
                picked={picked}
                isSelected={isSelected}
                toggleDistrict={toggleDistrict}
                districts={districts}
                PROVINCE_ORDER={Array.from(PROVINCE_ORDER)}
              />

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  className="px-3 py-2 text-sm text-gray-600"
                  onClick={() => setPickerOpen(false)}
                >
                  취소
                </button>
                <button
                  className="px-3 py-2 text-sm font-semibold rounded-md bg-black text-white disabled:opacity-40"
                  disabled={!picked}
                  onClick={confirmPick}
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 관심 지역 추가/변경 (복수) */}
      <AnimatePresence>
        {isAreasPickerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setAreasPickerOpen(false)}
            />
            <motion.div
              className="relative z-10 w-[92vw] max-w-[420px] rounded-xl bg-white shadow-xl p-4"
              initial={{ scale: 0.98, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-modal="true"
              aria-label="관심 지역 추가/변경"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">관심 지역 추가/변경</h3>
                <button
                  className="text-sm text-gray-500"
                  onClick={() => setAreasPickerOpen(false)}
                >
                  닫기
                </button>
              </div>

              <AreasListBox
                province={province2}
                setProvince={setProvince2}
                PROVINCE_ORDER={Array.from(PROVINCE_ORDER)}
                districts={districts2}
                isSelected={isSelectedMulti}
                toggleDistrict={toggleDistrictMulti}
                selectedCountByProvince={selectedCountByProvince}
              />

              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="text-xs text-gray-500">
                  선택: {selectedMulti.length} / {MAX_SELECT}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 text-sm text-gray-600"
                    onClick={() => setAreasPickerOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    className="px-3 py-2 text-sm font-semibold rounded-md bg-black text-white disabled:opacity-40"
                    disabled={selectedMulti.length === 0}
                    onClick={saveInterestAreas}
                  >
                    저장
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
