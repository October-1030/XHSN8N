"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "厨房用品",
  "衣物",
  "工具",
  "文件",
  "电子产品",
  "药品",
  "食品",
  "清洁用品",
  "其他",
];

const LOCATIONS = [
  "客厅",
  "卧室",
  "厨房",
  "卫生间",
  "阳台",
  "书房",
  "储物间",
  "车库",
  "其他",
];

export default function AddItem() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "其他",
    location: "",
    detail_location: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      alert("请填写物品名称和存放位置");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      alert(data.error || "保存失败");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-900 text-lg"
          >
            ← 返回
          </button>
          <h1 className="text-xl font-bold text-gray-900">添加物品</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              物品名称 *
            </label>
            <input
              type="text"
              placeholder="例如：剪刀、充电器、护照..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              物品分类
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    form.category === cat
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              存放位置 *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setForm({ ...form, location: loc })}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    form.location === loc
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="或者输入自定义位置..."
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细位置
            </label>
            <input
              type="text"
              placeholder="例如：第二层抽屉、左边柜子里面..."
              value={form.detail_location}
              onChange={(e) =>
                setForm({ ...form, detail_location: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              备注
            </label>
            <textarea
              placeholder="其他补充信息..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存物品"}
          </button>
        </form>
      </main>
    </div>
  );
}
