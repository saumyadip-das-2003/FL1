"use client";

import { Download, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  adminStorageKey,
  createSeedAdminContent,
  type AdminContent,
  type AdminNews,
  type AdminPerson,
  type AdminProject,
  type AdminService
} from "@/lib/admin-demo-data";

type Tab = "settings" | "projects" | "services" | "news" | "people";
type CollectionKey = Exclude<Tab, "settings">;
type EditableItem = AdminProject | AdminService | AdminNews | AdminPerson;

const tabs: { id: Tab; label: string }[] = [
  { id: "settings", label: "Site Settings" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "news", label: "News" },
  { id: "people", label: "People" }
];

const fieldMap: Record<CollectionKey, { key: string; label: string; textarea?: boolean }[]> = {
  projects: [
    { key: "title", label: "Project title" },
    { key: "location", label: "Location" },
    { key: "year", label: "Year" },
    { key: "section", label: "Section" },
    { key: "subsection", label: "Subsection" },
    { key: "image", label: "Cover image URL" },
    { key: "gallery", label: "Gallery image URLs, one per line", textarea: true },
    { key: "video", label: "YouTube video URL" },
    { key: "description", label: "Description", textarea: true }
  ],
  services: [
    { key: "title", label: "Service title" },
    { key: "image", label: "Image URL" },
    { key: "description", label: "Description", textarea: true },
    { key: "tags", label: "Tags, comma separated" }
  ],
  news: [
    { key: "title", label: "News title" },
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "image", label: "Cover image URL" },
    { key: "gallery", label: "Gallery image URLs, one per line", textarea: true },
    { key: "description", label: "Full article", textarea: true }
  ],
  people: [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "image", label: "Photo URL" },
    { key: "bio", label: "Bio", textarea: true }
  ]
};

const emptyItem: Record<CollectionKey, EditableItem> = {
  projects: {
    id: "",
    title: "New Project",
    location: "Dhaka, Bangladesh",
    year: "2026",
    section: "Architecture",
    subsection: "Culture",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80",
    gallery: "",
    video: "https://youtu.be/OP_fVIUTr9Y",
    description: "Project description goes here."
  },
  services: {
    id: "",
    title: "New Service",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    description: "Service description goes here.",
    tags: "Planning, Design"
  },
  news: {
    id: "",
    title: "New News Item",
    date: "July 2026",
    category: "Studio",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    gallery: "",
    description: "Full news story goes here."
  },
  people: {
    id: "",
    name: "New Team Member",
    role: "Architect",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    bio: "Short biography goes here."
  }
};

function makeId(value: string) {
  return `${value || "item"}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminPanel() {
  const [content, setContent] = useState<AdminContent>(() => createSeedAdminContent());
  const [tab, setTab] = useState<Tab>("settings");
  const [selectedId, setSelectedId] = useState<string>("");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(adminStorageKey);
    if (saved) {
      setContent(JSON.parse(saved) as AdminContent);
    }
  }, []);

  const selectedItem = useMemo(() => {
    if (tab === "settings") {
      return null;
    }

    return content[tab].find((item) => item.id === selectedId) ?? content[tab][0] ?? null;
  }, [content, selectedId, tab]);

  useEffect(() => {
    if (tab !== "settings" && !selectedId && content[tab][0]) {
      setSelectedId(content[tab][0].id);
    }
  }, [content, selectedId, tab]);

  function saveContent(next = content) {
    window.localStorage.setItem(adminStorageKey, JSON.stringify(next));
    setSavedAt(new Date().toLocaleTimeString());
  }

  function updateSettings(key: keyof AdminContent["settings"], value: string) {
    setContent((current) => ({
      ...current,
      settings: { ...current.settings, [key]: value }
    }));
  }

  function updateItem(key: CollectionKey, id: string, field: string, value: string) {
    setContent((current) => ({
      ...current,
      [key]: current[key].map((item) => (item.id === id ? { ...item, [field]: value } : item))
    }));
  }

  function addItem(key: CollectionKey) {
    const base = emptyItem[key];
    const id = makeId("title" in base ? base.title : "item");
    const nextItem = { ...base, id } as EditableItem;
    setContent((current) => ({ ...current, [key]: [nextItem, ...current[key]] as never }));
    setSelectedId(id);
  }

  function deleteItem(key: CollectionKey, id: string) {
    setContent((current) => ({ ...current, [key]: current[key].filter((item) => item.id !== id) as never }));
    setSelectedId("");
  }

  function resetDemo() {
    const seed = createSeedAdminContent();
    setContent(seed);
    saveContent(seed);
    setSelectedId("");
  }

  return (
    <main className="bg-paper px-5 pb-20 pt-28 transition-colors dark:bg-charcoal md:px-8 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-8 dark:border-white/10 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Demo Admin Panel</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">Manage Modern Age Studio</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              This demo stores changes in this browser. Later this same UI can save to Firebase, Sanity, or another CMS.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => saveContent()} className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-xs uppercase tracking-[0.18em] text-paper dark:bg-paper dark:text-ink">
              <Save size={15} /> Save Demo
            </button>
            <button onClick={resetDemo} className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-xs uppercase tracking-[0.18em] dark:border-white/15">
              <RotateCcw size={15} /> Reset
            </button>
            <a
              href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(content, null, 2))}`}
              download="modern-age-admin-content.json"
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-xs uppercase tracking-[0.18em] dark:border-white/15"
            >
              <Download size={15} /> Export
            </a>
          </div>
        </div>

        {savedAt && <p className="mt-4 text-sm text-muted">Last saved locally at {savedAt}</p>}

        <div className="mt-8 flex gap-3 overflow-x-auto border-b border-black/10 pb-3 dark:border-white/10">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setSelectedId("");
              }}
              className={`whitespace-nowrap px-4 py-2 text-sm uppercase tracking-[0.16em] transition ${
                tab === item.id ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "border border-black/10 text-muted dark:border-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "settings" ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {(Object.keys(content.settings) as (keyof AdminContent["settings"])[]).map((key) => (
              <label key={key} className="grid gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                {key.replace(/([A-Z])/g, " $1")}
                <input
                  value={content.settings[key]}
                  onChange={(event) => updateSettings(key, event.target.value)}
                  className="h-12 border border-black/15 bg-white px-4 text-base normal-case tracking-normal text-ink outline-none dark:border-white/15 dark:bg-[#4a4a4a] dark:text-paper"
                />
              </label>
            ))}
          </section>
        ) : (
          <section className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
            <aside>
              <button
                onClick={() => addItem(tab)}
                className="mb-4 inline-flex w-full items-center justify-center gap-2 bg-ink px-5 py-3 text-xs uppercase tracking-[0.18em] text-paper dark:bg-paper dark:text-ink"
              >
                <Plus size={15} /> Add {tab}
              </button>
              <div className="grid max-h-[620px] gap-2 overflow-y-auto">
                {content[tab].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`border px-4 py-3 text-left transition ${
                      selectedItem?.id === item.id
                        ? "border-ink bg-white dark:border-paper dark:bg-[#4a4a4a]"
                        : "border-black/10 text-muted dark:border-white/10"
                    }`}
                  >
                    <p className="font-medium text-ink dark:text-paper">
                      {"title" in item ? item.title : item.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{item.id}</p>
                  </button>
                ))}
              </div>
            </aside>

            {selectedItem && (
              <div className="border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a] md:p-7">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="font-serif text-3xl">Edit item</h2>
                  <button
                    onClick={() => deleteItem(tab, selectedItem.id)}
                    className="inline-flex items-center gap-2 border border-black/15 px-4 py-2 text-xs uppercase tracking-[0.16em] dark:border-white/15"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                <div className="grid gap-5">
                  {fieldMap[tab].map((field) => (
                    <label key={field.key} className="grid gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                      {field.label}
                      {field.textarea ? (
                        <textarea
                          value={String(selectedItem[field.key as keyof typeof selectedItem] ?? "")}
                          onChange={(event) => updateItem(tab, selectedItem.id, field.key, event.target.value)}
                          className="min-h-32 border border-black/15 bg-paper p-4 text-base normal-case tracking-normal text-ink outline-none dark:border-white/15 dark:bg-charcoal dark:text-paper"
                        />
                      ) : (
                        <input
                          value={String(selectedItem[field.key as keyof typeof selectedItem] ?? "")}
                          onChange={(event) => updateItem(tab, selectedItem.id, field.key, event.target.value)}
                          className="h-12 border border-black/15 bg-paper px-4 text-base normal-case tracking-normal text-ink outline-none dark:border-white/15 dark:bg-charcoal dark:text-paper"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <div className="mt-10 border-t border-black/10 pt-6 text-sm text-muted dark:border-white/10">
          <Link href="/" className="underline">
            Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
