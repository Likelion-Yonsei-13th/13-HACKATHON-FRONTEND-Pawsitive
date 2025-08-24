// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint"; // v7+ 사용 권장

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  // (A) 자동 생성물 무시
  { ignores: ["**/.next/**", "next-env.d.ts"] },

  // (B) Next.js 권장 규칙
  ...compat.config({ extends: ["next/core-web-vitals"] }),

  // (C) TypeScript 규칙 (타입 인지 모드)
  ...tseslint.config(
    tseslint.configs.recommendedTypeChecked,
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          project: ["./tsconfig.eslint.json"],
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
      },
    },
    // (D) 생성 타입(.d.ts)과 .next/types에서만 any 허용
    {
      files: ["**/*.d.ts", "**/.next/types/**/*.ts"],
      rules: { "@typescript-eslint/no-explicit-any": "off" },
    }
  ),
];
