"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  detail_location: string;
  note: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES: Record<string, string> = {
  厨房用品: "🍳",
  衣物: "👕",
  工具: "🔧",
  文件: "📄",
  电子产品: "📱",
  药品: "💊",
  食品: "🍎",
  清洁用品: "🧹",
  其他: "📦",
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async (q?: string) => {
    setLoading(true);
    const url = q ? `/api/items?q=${encodeURIComponent(q)}` : "/api/items";
    const res = await fetch(url);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems(search);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除「${name}」吗？`)) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    fetchItems(search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">FindMyStuff</h1>
          <p className="text-sm text-gray-500 mt-1">家庭物品收纳管理</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="搜索物品名称、位置..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            搜索
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 mb-2">
              {search ? "没有找到相关物品" : "还没有记录任何物品"}
            </p>
            <p className="text-gray-400 text-sm">
              点击下方按钮开始添加物品
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {CATEGORIES[item.category] || "📦"}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {item.location}
                        {item.detail_location && ` · ${item.detail_location}`}
                      </p>
                      {item.note && (
                        <p className="text-sm text-gray-400 mt-1">
                          {item.note}
                        </p>
                      )}
                      <p className="text-xs text-gray-300 mt-2">
                        {item.category} · {item.updated_at}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/add"
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-600 transition-colors"
        >
          +
        </Link>
      </main>
    </div>
  );
}
