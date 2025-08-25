/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MyAreaListBox from "./components/myAreaListBox";
import axios from "axios";

const LS_MYAREA = "neston_my_area_v1";
const LS_INTEREST = "neston_interest_district_v1";
const NEXT_ROUTE = "/interest-areas";

const ALLOWED_CITY = "서울특별시";

function readAccessToken(): string | null {
  try {
    const direct = localStorage.getItem("access_token");
    if (direct) return direct;
    const alt = localStorage.getItem("neston_auth_v1");
    if (alt) {
      const obj = JSON.parse(alt);
      return obj?.access_token || obj?.access || null;
    }
  } catch {}
  return null;
}

const api = axios.create({
  withCredentials: true,
  validateStatus: () => true,
});
api.defaults.headers.common["Accept"] = "application/json";
api.defaults.headers.common["Content-Type"] = "application/json";
function applyAuthHeader() {
  const t = readAccessToken();
  if (t) api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  else delete api.defaults.headers.common["Authorization"];
}
async function getJSON<T>(url: string): Promise<T> {
  applyAuthHeader();
  const res = await api.get<T>(url);
  if (res.status >= 200 && res.status < 300) return res.data as T;
  const anyData: any = res.data || {};
  throw new Error(
    anyData?.message || anyData?.detail || `GET 실패: ${res.status}`
  );
}

type ApiListResp = {
  status: number;
  success: boolean;
  message: string;
  data: string[];
};

export default function MyAreaPage() {
  const router = useRouter();

  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [boroughs, setBoroughs] = useState<string[]>([]);

  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [borough, setBorough] = useState<string>("");

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBoroughs] = useState(false);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const hasMy = !!localStorage.getItem(LS_MYAREA);
      const hasInterest = !!localStorage.getItem(LS_INTEREST);
      if (hasMy && hasInterest) router.replace(NEXT_ROUTE);
    } catch {}
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCities(true);
        const resp = await getJSON<ApiListResp>("/api/user/locations/cities/");
        const list = Array.isArray(resp?.data) ? resp.data : [];

        const seoul =
          list.find((c) => c === ALLOWED_CITY) ??
          list.find((c) => /서울/.test(String(c)));
        const reordered = seoul
          ? [seoul, ...list.filter((c) => c !== seoul)]
          : list;
        setCities(reordered);

        setCity(seoul || "");
      } catch (e) {
        console.error(e);
        setCities([]);
        setCity("");
      } finally {
        setLoadingCities(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!city || city !== ALLOWED_CITY) {
      setDistricts([]);
      setDistrict("");
      setBoroughs([]);
      setBorough("");
      return;
    }
    (async () => {
      try {
        setLoadingDistricts(true);
        setDistrict("");
        setBorough("");
        setBoroughs([]);

        const q = encodeURIComponent(ALLOWED_CITY);
        const resp = await getJSON<ApiListResp>(
          `/api/user/locations/districts/?city=${q}`
        );
        const list = Array.isArray(resp?.data) ? resp.data : [];
        setDistricts(list);
        if (list.length > 0) setDistrict(list[0]);
      } catch (e) {
        console.error(e);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    })();
  }, [city]);

  useEffect(() => {
    if (city !== ALLOWED_CITY) {
      setBoroughs([]);
      setBorough("");
    }
  }, [city, district]);

  const guardedSetCity = (next: string) => {
    if (next !== ALLOWED_CITY) {
      return;
    }
    setCity(next);
  };
  const guardedSetDistrict = (next: string) => {
    if (city !== ALLOWED_CITY) return;
    setDistrict(next);
  };
  const guardedSetBorough = (next: string) => {
    if (city !== ALLOWED_CITY) return;
    setBorough(next);
  };

  const canProceed = city === ALLOWED_CITY && !!district;

  const handleNext = () => {
    if (!canProceed) return;

    if (!success) {
      const payload = {
        city: ALLOWED_CITY,
        district,
        borough: null,
        ts: Date.now(),
      };
      try {
        localStorage.setItem(LS_MYAREA, JSON.stringify(payload));
      } catch {}
      setSuccess(true);
    } else {
      router.replace(NEXT_ROUTE);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#DBFFEA] flex justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col p-5">
          <img src="/svg/NestOn.svg" alt="NestOn" className="w-[25%] pt-10" />
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              내 지역 추가가 완료되었습니다.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-900">
              추후 ‘나의 지역’에서 지역 변경이 가능합니다.
            </p>
          </div>
          <button
            onClick={handleNext}
            className="mt-auto mb-10 w-full rounded-xl bg-white py-3 text-base font-semibold text-gray-800 shadow active:translate-y-[1px]"
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#DBFFEA] flex justify-center px-4 py-8">
      <div className="w-full max-w-sm p-5">
        {/* 상단 */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-mainBrown pb-10">
            NestOn
          </div>
        </div>

        <h1 className="mt-2 text-2xl font-bold text-gray-900 text-center">
          내 지역을 선택해 주세요
        </h1>

        {/* 서울만 선택 가능 */}
        <p className="mt-2 text-xs text-center">
          시/도를 고르면 해당 시/군/구가 표시됩니다.
          <br />
          현재는 <b>서울특별시</b>만 선택할 수 있어요.{" "}
          <span className="inline-block mt-1 rounded bg-white/70 px-2 py-1">
            타 지역은 <b>확장 예정</b>입니다.
          </span>
        </p>

        {/* 리스트 박스 */}
        <MyAreaListBox
          cities={cities}
          districts={districts}
          boroughs={boroughs}
          city={city}
          setCity={guardedSetCity}
          district={district}
          setDistrict={guardedSetDistrict}
          borough={borough}
          setBorough={guardedSetBorough}
          loading={{
            cities: loadingCities,
            districts: loadingDistricts,
            boroughs: false,
          }}
        />

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="mt-[50px] mb-10 w-full rounded-xl bg-white py-3 text-base font-semibold text-gray-800 shadow active:translate-y-[1px] disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
