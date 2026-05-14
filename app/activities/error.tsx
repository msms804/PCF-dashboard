"use client";

import { useEffect } from "react";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <p className="text-gray-500 text-sm">데이터를 불러오는 중 오류가 발생했습니다.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
