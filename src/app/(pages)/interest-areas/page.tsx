/* eslint-disable */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AreasListBox from "./components/AreasListBox";
import axios from "axios";

const LS_MYAREA = "neston_my_area_v1";
const LS_INTEREST = "neston_interest_district_v1";
const NEXT_ROUTE = "/";
const MAX_SELECT = 5;

type ApiListResp = {
  status: number;
  success: boolean;
  message: string;
  data: string[];
};
type MyArea = {
  city: string;
  district: string;
  borough?: string | null;
} | null;
type Picked = { city: string; district: string; borough?: string | null };

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

const api = axios.create({ withCredentials: true, validateStatus: () => true });
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

export default function InterestAreasListPage() {
  const router = useRouter();

  const [myArea, setMyArea] = useState<MyArea>(null);

  const [cities, setCities] = useState<string[]>([]);
  const [districtsRaw, setDistrictsRaw] = useState<string[]>([]);
  const [boroughsRaw, setBoroughsRaw] = useState<string[]>([]);

  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [borough, setBorough] = useState<string>("");

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBoroughs, setLoadingBoroughs] = useState(false);

  const [selected, setSelected] = useState<Picked[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_MYAREA);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object" && obj.city && obj.district) {
          setMyArea({
            city: String(obj.city),
            district: String(obj.district),
            borough: obj.borough ?? null,
          });
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCities(true);
        const resp = await getJSON<ApiListResp>("/api/user/locations/cities/");
        const list = Array.isArray(resp?.data) ? resp.data : [];

        const defaultCity =
          (myArea && list.includes(myArea.city) && myArea.city) ||
          list[0] ||
          "";
        setCities(list);
        setCity((prev) => prev || defaultCity);
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
    if (!city) {
      setDistrictsRaw([]);
      setDistrict("");
      setBoroughsRaw([]);
      setBorough("");
      return;
    }
    (async () => {
      try {
        setLoadingDistricts(true);
        setDistrict("");
        setBorough("");
        setBoroughsRaw([]);

        const q = encodeURIComponent(city);
        const resp = await getJSON<ApiListResp>(
          `/api/user/locations/districts/?city=${q}`
        );
        let list = Array.isArray(resp?.data) ? resp.data : [];

        if (myArea && myArea.city === city && !myArea.borough) {
          list = list.filter((d) => d !== myArea.district);
        }

        setDistrictsRaw(list);
        if (list.length > 0) setDistrict(list[0]);
      } catch (e) {
        console.error(e);
        setDistrictsRaw([]);
      } finally {
        setLoadingDistricts(false);
      }
    })();
  }, [city, myArea]);

  useEffect(() => {
    if (!city || !district) {
      setBoroughsRaw([]);
      setBorough("");
      return;
    }
    (async () => {
      try {
        setLoadingBoroughs(true);
        setBorough("");

        const qc = encodeURIComponent(city);
        const qd = encodeURIComponent(district);
        const resp = await getJSON<ApiListResp>(
          `/api/user/locations/boroughs/?city=${qc}&district=${qd}`
        );
        let list = Array.isArray(resp?.data) ? resp.data : [];

        if (
          myArea &&
          myArea.city === city &&
          myArea.district === district &&
          myArea.borough
        ) {
          list = list.filter((b) => b !== myArea.borough);
        }

        setBoroughsRaw(list);
        if (list.length > 0) setBorough(list[0]);
      } catch (e) {
        console.error(e);
        setBoroughsRaw([]);
      } finally {
        setLoadingBoroughs(false);
      }
    })();
  }, [city, district, myArea]);

  const districts = districtsRaw;
  const boroughs = boroughsRaw;

  const makeKey = (c: string, d: string, b?: string | null) =>
    `${c}||${d}||${b || ""}`;
  const selectedKeySet = useMemo(
    () => new Set(selected.map((s) => makeKey(s.city, s.district, s.borough))),
    [selected]
  );

  const isSelectedDistrict = (c: string, d: string) =>
    [...selectedKeySet].some((k) => k.startsWith(`${c}||${d}||`)) &&
    !boroughs.length;

  const isSelectedBorough = (c: string, d: string, b: string) =>
    selectedKeySet.has(makeKey(c, d, b));

  const selectedCountByCity = useMemo(() => {
    const m = new Map<string, number>();
    selected.forEach((s) => m.set(s.city, (m.get(s.city) || 0) + 1));
    return m;
  }, [selected]);

  const toggleDistrict = (c: string, d: string) => {
    if (boroughs.length > 0 && district === d) return;

    const key = makeKey(c, d, null);
    const exists = selectedKeySet.has(key);
    if (exists) {
      setSelected((prev) =>
        prev.filter((x) => makeKey(x.city, x.district, x.borough) !== key)
      );
      return;
    }
    if (selected.length >= MAX_SELECT) return;
    setSelected((prev) => [...prev, { city: c, district: d, borough: null }]);
  };

  const toggleBorough = (c: string, d: string, b: string) => {
    const key = makeKey(c, d, b);
    const exists = selectedKeySet.has(key);
    if (exists) {
      setSelected((prev) =>
        prev.filter((x) => makeKey(x.city, x.district, x.borough) !== key)
      );
      return;
    }
    if (selected.length >= MAX_SELECT) return;
    setSelected((prev) => [...prev, { city: c, district: d, borough: b }]);
  };

  const handleNext = () => {
    if (!success) {
      if (selected.length === 0) return;

      const payload = {
        list: selected,

        districts: selected.map((s) => (s.borough ? s.borough : s.district)),
        ts: Date.now(),
      };
      try {
        localStorage.setItem(LS_INTEREST, JSON.stringify(payload));
      } catch {}
      setSuccess(true);
    } else {
      router.replace(NEXT_ROUTE);
    }
  };

  /** 완료 화면 */
  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#DBFFEA] flex justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col p-5">
          <div className="text-2xl font-semibold text-mainBrown pb-10">
            NestOn
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              관심 지역 추가가 완료되었습니다.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-900">
              추후 ‘나의 지역 &gt; 지역 추가하기’에서 지역 변경이 가능합니다.
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

        <h1 className="mt-10 text-xl font-bold text-gray-900 text-center">
          추가로 관심 있는 지역을 선택해 주세요
        </h1>
        <p className="text-xs text-gray-700 text-center pt-2">
          부모님댁, 직장 등 자주 가는 곳도 함께 추가해 보세요
          <br />
          (최대 {MAX_SELECT}개까지 선택 가능)
        </p>

        {/* 리스트 박스 */}
        <AreasListBox
          cities={cities}
          districts={districts}
          boroughs={boroughs}
          city={city}
          setCity={(c) => {
            setCity(c);
          }}
          district={district}
          setDistrict={(d) => {
            setDistrict(d);
          }}
          borough={borough}
          setBorough={setBorough}
          loading={{
            cities: loadingCities,
            districts: loadingDistricts,
            boroughs: loadingBoroughs,
          }}
          selected={selected}
          isSelectedDistrict={isSelectedDistrict}
          isSelectedBorough={isSelectedBorough}
          toggleDistrict={() => toggleDistrict(city, district)}
          toggleBorough={(b) => toggleBorough(city, district, b)}
          selectedCountByCity={selectedCountByCity}
          canAddMore={selected.length < MAX_SELECT}
        />

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className="mt-50 mb-10 w-full rounded-xl bg-white py-3 text-base font-semibold text-gray-800 shadow active:translate-y-[1px] disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
