"use client";
import PolicyModal from "@/app/(pages)/consent/components/PolicyModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PolicyId = "terms" | "privacy" | "location" | "community";

const AUTH_KEY = "neston_auth_v1";
const CONSENT_KEY = "neston_consent_v1";

export default function ConsentPage() {
  const router = useRouter();

  const [requiredAgree, setRequiredAgree] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [communityAgree, setCommunityAgree] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState<PolicyId | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(AUTH_KEY)) {
        router.replace("/");
        return;
      }
      if (localStorage.getItem(CONSENT_KEY)) {
        router.replace("/join");
      }
    } catch {}
  }, [router]);

  const all = requiredAgree && termsAgree && privacyAgree && communityAgree;

  const toggleAll = () => {
    const next = !all;
    setRequiredAgree(next);
    setTermsAgree(next);
    setPrivacyAgree(next);
    setCommunityAgree(next);
  };

  // ✅ API 호출 없이 로컬 저장 → /join 이동
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!all) return;
    try {
      localStorage.setItem(
        "neston_consent_v1",
        JSON.stringify({
          required: requiredAgree,
          terms: termsAgree,
          privacy: privacyAgree,
          community: communityAgree,
          ts: Date.now(),
        })
      );
    } catch {}
    router.replace("/join");
  };

  const checkButton = `shrink-0 aspect-square
    mt-1 h-5 w-5 rounded-full
    border border-black bg-white
    appearance-none
    transition-all duration-150
    checked:bg-[radial-gradient(circle_at_50%_50%,_#5E9665_0_52%,_transparent_53%)]
    checked:shadow-[0_0_4px_1px_rgba(84,167,129,0.35)]
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300`;

  return (
    <div>
      <div className="w-screen min-h-screen pt-20 pb-20 px-13 flex items-start justify-center bg-[linear-gradient(180deg,_#fff_0%,_#DBFFEA_100%)]">
        <div className="w-full max-w-md">
          <h1 className="mb-7 text-2xl font-semibold  text-center leading-snug">
            아래 약관에 동의하시면
            <br />
            NestOn을 시작합니다
          </h1>

          <form
            onSubmit={onSubmit}
            className="rounded-[15px] bg-white border-1 shadow-xl p-5 space-y-4"
          >
            {/* 전체 동의 */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={all}
                onChange={toggleAll}
                className={checkButton}
                aria-label="아래의 내용에 모두 동의합니다"
              />
              <span className="font-semibold ml-1">
                아래의 내용에 모두 동의합니다.
              </span>
            </label>

            <hr className="my-5" />

            {/* 이용약관 (필수) */}
            <label className="flex flex-row items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgree}
                onChange={(e) => setTermsAgree(e.target.checked)}
                className={checkButton}
                aria-label="이용약관 동의 (필수)"
              />
              <span className="flex flex-col">
                <span className="font-medium">이용약관 동의 (필수)</span>
                <span
                  className="mt-2 font-medium text-[12px] underline text-gray-500 cursor-pointer"
                  onClick={() => {
                    setModalId("terms");
                    setModalOpen(true);
                  }}
                >
                  자세히 보기
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  서비스 이용에 관한 기본 규정에 동의합니다. 미동의 시 이용이
                  제한될 수 있습니다.
                </p>
              </span>
            </label>

            {/* 위치기반 (필수) */}
            <label className="flex flex-row items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={requiredAgree}
                onChange={(e) => setRequiredAgree(e.target.checked)}
                className={checkButton}
                aria-label="위치 기반 서비스 약관 (필수)"
              />
              <span className="flex flex-col">
                <span className="font-medium">
                  위치기반 서비스 약관 동의 (필수)
                </span>
                <span
                  className="mt-2 font-medium text-[12px] underline text-gray-500 cursor-pointer"
                  onClick={() => {
                    setModalId("location");
                    setModalOpen(true);
                  }}
                >
                  자세히 보기
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  내 위치 정보를 활용하여 실시간 거주 환경 장소 정보를
                  최적화하여 제공합니다. 미동의 시 이용이 제한될 수 있습니다.
                </p>
              </span>
            </label>

            {/* 개인정보 (필수) */}
            <label className="flex flex-row items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAgree}
                onChange={(e) => setPrivacyAgree(e.target.checked)}
                className={checkButton}
                aria-label="개인정보 처리방침 동의 (필수)"
              />
              <span className="flex flex-col">
                <span className="font-medium">
                  개인정보 처리방침 동의 (필수)
                </span>
                <span
                  className="mt-2 font-medium text-[12px] underline text-gray-500 cursor-pointer"
                  onClick={() => {
                    setModalId("privacy");
                    setModalOpen(true);
                  }}
                >
                  자세히 보기
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  서비스 제공을 위해 필요한 최소한의 개인정보를 수집·이용합니다.
                </p>
              </span>
            </label>

            {/* 커뮤니티 정책 (필수) → 추후 가입 바디에서 marketing_push_agreed로 매핑 */}
            <label className="flex flex-row items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={communityAgree}
                onChange={(e) => setCommunityAgree(e.target.checked)}
                className={checkButton}
                aria-label="커뮤니티 운영 및 게시물 관리 정책 동의 (필수)"
              />
              <span className="flex flex-col">
                <span className="font-medium">
                  커뮤니티 운영 및 게시물 관리 정책 동의 (필수)
                </span>
                <span
                  className="mt-2 font-medium text-[12px] underline text-gray-500 cursor-pointer"
                  onClick={() => {
                    setModalId("community");
                    setModalOpen(true);
                  }}
                >
                  자세히 보기
                </span>
                <p className="mt-1 text-sm text-gray-500">
                  허위 또는 부적절한 콘텐츠는 삭제될 수 있으며, 미동의 시 이용이
                  제한될 수 있습니다.
                </p>
              </span>
            </label>

            <div className="flex justify-center items-center mt-4">
              <button
                type="submit"
                disabled={!all}
                className={`mt-2 px-20 py-3 rounded-[10px] shadow-md transition ${
                  all
                    ? "bg-mainMint text-black"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                확인
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-gray-500">
              필수 항목 동의 시 서비스 이용이 가능합니다.
            </p>
          </form>
        </div>
      </div>

      <PolicyModal
        open={modalOpen}
        policyId={modalId}
        onClose={() => {
          setModalOpen(false);
          setModalId(null);
        }}
      />
    </div>
  );
}
