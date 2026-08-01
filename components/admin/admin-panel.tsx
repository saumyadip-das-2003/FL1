"use client";

import {
  ArrowDown,
  ArrowUp,
  Download,
  GripVertical,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  Wrench,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminEmailStorageKey, adminTokenStorageKey } from "@/lib/admin-auth";
import {
  adminStorageKey,
  createSeedAdminContent,
  type AdminContent,
  type AdminMedia,
  type AdminNews,
  type AdminPerson,
  type AdminProject,
  type AdminService
} from "@/lib/admin-demo-data";
import { projectTaxonomy, type ProjectSection } from "@/lib/data";
import { youtubeEmbedUrl } from "@/lib/youtube";

type Tab = "general" | "home" | "projects" | "services" | "news" | "people" | "about" | "contact" | "settings";
type CollectionKey = "projects" | "services" | "news" | "people";
type EditableItem = AdminProject | AdminService | AdminNews | AdminPerson;

const sidebarItems: { id: Tab; label: string; icon: typeof Settings }[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: LayoutDashboard },
  { id: "services", label: "Services", icon: Wrench },
  { id: "news", label: "News", icon: Newspaper },
  { id: "people", label: "People", icon: Users },
  { id: "about", label: "About", icon: ImageIcon },
  { id: "contact", label: "Contact", icon: Menu },
  { id: "settings", label: "Settings", icon: Settings }
];

const projectSections = Object.keys(projectTaxonomy) as ProjectSection[];
const serviceCategories = ["Architecture Design", "3D Modeling", "Rendering", "Interior", "Exterior", "Animation"];
const peopleRoles = ["Founding Partner", "Design Director", "Project Architect", "Interior Lead", "Landscape Architect", "Visualization Artist", "Technical Architect"];
const newsCategories = ["Studio", "Projects", "Awards", "Research", "Press"];

const emptyItem: Record<CollectionKey, EditableItem> = {
  projects: {
    id: "",
    title: "New Project",
    location: "Dhaka, Bangladesh",
    year: "2026",
    section: "Architecture",
    subsection: "Culture",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80",
    media: [],
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
    bio: "Short biography goes here.",
    studio: "Modern Age Studio",
    office: "Dhaka",
    profile: "Employee profile details go here."
  }
};

function makeId(value: string) {
  return `${value || "item"}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function normalizeContent(content: AdminContent): AdminContent {
  const seed = createSeedAdminContent();
  return {
    ...seed,
    ...content,
    settings: {
      ...seed.settings,
      ...content.settings
    },
    projects: content.projects ?? seed.projects,
    services: content.services ?? seed.services,
    news: content.news ?? seed.news,
    people: (content.people?.length ? content.people : seed.people).map((person, index) => ({
      ...seed.people[index % seed.people.length],
      ...person
    }))
  };
}

function itemTitle(item: EditableItem) {
  return "title" in item ? item.title : item.name;
}

function itemImage(item: EditableItem) {
  return "image" in item ? item.image : "";
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid content-start gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-300">
      {label}
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/10 dark:bg-[#4a4a4a] dark:text-paper"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-28 rounded-md border border-black/10 bg-white p-3 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/10 dark:bg-[#4a4a4a] dark:text-paper"
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/10 dark:bg-[#4a4a4a] dark:text-paper"
    />
  );
}

function MediaPreview({ type = "image", source, title }: { type?: "image" | "video"; source: string; title: string }) {
  if (!source) {
    return <div className="flex h-32 w-32 items-center justify-center rounded-md bg-neutral-100 text-xs text-muted dark:bg-neutral-700">No media</div>;
  }

  if (type === "video") {
    return (
      <iframe
        src={youtubeEmbedUrl(source, false)}
        title={title}
        className="h-32 w-48 rounded-md bg-black"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <span className="flex h-32 w-32 items-center justify-center rounded-md bg-neutral-100 p-2 dark:bg-neutral-700">
      <img src={source} alt={title} className="max-h-full max-w-full object-contain" />
    </span>
  );
}

export function AdminPanel() {
  const router = useRouter();
  const [content, setContent] = useState<AdminContent>(() => createSeedAdminContent());
  const [tab, setTab] = useState<Tab>("general");
  const [selectedId, setSelectedId] = useState<string>("");
  const [savedAt, setSavedAt] = useState("");
  const [status, setStatus] = useState("Checking admin session...");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customSubsection, setCustomSubsection] = useState("");
  const [draggedItemId, setDraggedItemId] = useState("");
  const [draggedMediaId, setDraggedMediaId] = useState("");
  const [collectionQuery, setCollectionQuery] = useState("");
  const [featuredQuery, setFeaturedQuery] = useState<Record<string, string>>({});
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  useEffect(() => {
    const storedToken = window.localStorage.getItem(adminTokenStorageKey);
    const firebaseEnabled = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

    if (!storedToken && firebaseEnabled) {
      router.replace("/admin/login");
      return;
    }

    setToken(storedToken ?? "");
    setAdminEmail(window.localStorage.getItem(adminEmailStorageKey) ?? "");

    const saved = window.localStorage.getItem(adminStorageKey);
    if (saved) {
      setContent(normalizeContent(JSON.parse(saved) as AdminContent));
    }

    async function loadRemoteContent() {
      try {
        const response = await fetch("/api/admin/content", {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : undefined
        });

        if (!response.ok) {
          throw new Error("Remote content is not available yet.");
        }

        const payload = (await response.json()) as { content: AdminContent };
        const normalized = normalizeContent(payload.content);
        setContent(normalized);
        window.localStorage.setItem(adminStorageKey, JSON.stringify(normalized));
        setStatus("Connected to Sanity content.");
      } catch {
        setStatus("Using local demo content until Sanity/Firebase keys are available.");
      }
    }

    loadRemoteContent();
  }, [router]);

  const selectedItem = useMemo(() => {
    if (!isCollectionTab(tab)) {
      return null;
    }

    return content[tab].find((item) => item.id === selectedId) ?? content[tab][0] ?? null;
  }, [content, selectedId, tab]);

  useEffect(() => {
    if (isCollectionTab(tab) && !selectedId && content[tab][0]) {
      setSelectedId(content[tab][0].id);
    }
  }, [content, selectedId, tab]);

  useEffect(() => {
    setCollectionQuery("");
  }, [tab]);

  useEffect(() => {
    function handleSaveShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveContent();
      }
    }

    window.addEventListener("keydown", handleSaveShortcut);
    return () => window.removeEventListener("keydown", handleSaveShortcut);
  });

  function isCollectionTab(value: Tab): value is CollectionKey {
    return ["projects", "services", "news", "people"].includes(value);
  }

  async function saveContent(next = content) {
    setBusy(true);
    window.localStorage.setItem(adminStorageKey, JSON.stringify(next));

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(next)
      });

      if (!response.ok) {
        throw new Error("Remote save failed.");
      }

      const result = (await response.json()) as { mode?: string };
      setStatus(result.mode === "sanity" ? "Saved to Sanity." : "Saved locally. Add Sanity keys for production storage.");
    } catch {
      setStatus("Saved locally only. Check Firebase/Sanity environment keys.");
    } finally {
      setSavedAt(new Date().toLocaleTimeString());
      setBusy(false);
    }
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

  async function uploadImageFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      const payload = (await response.json()) as { url: string };
      setStatus("Image uploaded to Sanity.");
      return payload.url;
    } catch {
      setStatus("Image kept locally for demo. Add Sanity keys for production upload.");
      return null;
    }
  }

  async function uploadToSettings(key: keyof AdminContent["settings"], file?: File) {
    if (!file) {
      return;
    }

    const localPreview = await readFileAsDataUrl(file);
    updateSettings(key, localPreview);
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      updateSettings(key, uploadedUrl);
    }
  }

  async function uploadToItem(key: CollectionKey, id: string, field: string, file?: File) {
    if (!file) {
      return;
    }

    const localPreview = await readFileAsDataUrl(file);
    updateItem(key, id, field, localPreview);
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      updateItem(key, id, field, uploadedUrl);
    }
  }

  async function uploadProjectMedia(projectId: string, mediaId: string, file?: File) {
    if (!file) {
      return;
    }

    const localPreview = await readFileAsDataUrl(file);
    updateProjectMedia(projectId, mediaId, "source", localPreview);
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      updateProjectMedia(projectId, mediaId, "source", uploadedUrl);
    }
  }

  async function uploadNewsGalleryImage(newsId: string, file?: File) {
    if (!file) {
      return;
    }

    const localPreview = await readFileAsDataUrl(file);
    appendNewsGalleryImage(newsId, localPreview);
    const uploadedUrl = await uploadImageFile(file);

    if (uploadedUrl) {
      setContent((current) => ({
        ...current,
        news: current.news.map((item) => {
          if (item.id !== newsId) {
            return item;
          }

          const gallery = item.gallery
            .split(/\n+/)
            .map((entry) => (entry === localPreview ? uploadedUrl : entry))
            .join("\n");

          return { ...item, gallery };
        })
      }));
    }
  }

  function appendNewsGalleryImage(newsId: string, imageUrl: string) {
    setContent((current) => ({
      ...current,
      news: current.news.map((item) =>
        item.id === newsId
          ? {
              ...item,
              gallery: [item.gallery.trim(), imageUrl].filter(Boolean).join("\n")
            }
          : item
      )
    }));
  }

  function updateProjectMedia(projectId: string, mediaId: string, field: keyof AdminMedia, value: string) {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              media: project.media.map((media) => (media.id === mediaId ? { ...media, [field]: value } : media))
            }
          : project
      )
    }));
  }

  function addProjectMedia(projectId: string, type: AdminMedia["type"]) {
    insertProjectMedia(projectId, type);
  }

  function insertProjectMedia(projectId: string, type: AdminMedia["type"], index?: number) {
    const media: AdminMedia = {
      id: makeId(`${type}-media`),
      type,
      source:
        type === "image"
          ? "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80"
          : "https://youtu.be/OP_fVIUTr9Y",
      caption: type === "image" ? "Image caption goes here." : "Video caption goes here."
    };

    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const nextMedia = [...project.media];
        nextMedia.splice(index ?? nextMedia.length, 0, media);

        return { ...project, media: nextMedia };
      })
    }));
  }

  function deleteProjectMedia(projectId: string, mediaId: string) {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId ? { ...project, media: project.media.filter((media) => media.id !== mediaId) } : project
      )
    }));
  }

  function moveProjectMedia(projectId: string, mediaId: string, direction: -1 | 1) {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return { ...project, media: moveById(project.media, mediaId, direction) };
      })
    }));
  }

  function reorderProjectMedia(projectId: string, fromId: string, toId: string) {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return { ...project, media: moveToId(project.media, fromId, toId) };
      })
    }));
  }

  function moveById<T extends { id: string }>(items: T[], id: string, direction: -1 | 1) {
    const index = items.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) {
      return items;
    }

    const copy = [...items];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    return copy;
  }

  function moveToId<T extends { id: string }>(items: T[], fromId: string, toId: string) {
    if (!fromId || fromId === toId) {
      return items;
    }

    const from = items.findIndex((item) => item.id === fromId);
    const to = items.findIndex((item) => item.id === toId);
    if (from < 0 || to < 0) {
      return items;
    }

    const copy = [...items];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  }

  function moveItem(key: CollectionKey, id: string, direction: -1 | 1) {
    setContent((current) => ({
      ...current,
      [key]: moveById(current[key] as EditableItem[], id, direction) as never
    }));
  }

  function reorderItem(key: CollectionKey, fromId: string, toId: string) {
    setContent((current) => ({
      ...current,
      [key]: moveToId(current[key] as EditableItem[], fromId, toId) as never
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

  function logout() {
    window.localStorage.removeItem(adminTokenStorageKey);
    window.localStorage.removeItem(adminEmailStorageKey);
    router.push("/admin/login");
  }

  async function changeAdminPassword() {
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";

    if (!firebaseApiKey || !token || !adminEmail) {
      setPasswordStatus("Firebase login is not active in this session.");
      return;
    }

    if (!currentPassword) {
      setPasswordStatus("Current password is required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("Passwords do not match.");
      return;
    }

    setBusy(true);
    setPasswordStatus("Updating password...");

    try {
      const signInResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: currentPassword,
          returnSecureToken: true
        })
      });
      const signInPayload = (await signInResponse.json()) as { idToken?: string; error?: { message?: string } };

      if (!signInResponse.ok || !signInPayload.idToken) {
        throw new Error("Current password is incorrect.");
      }

      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: signInPayload.idToken,
          password: newPassword,
          returnSecureToken: true
        })
      });
      const payload = (await response.json()) as { idToken?: string; error?: { message?: string } };

      if (!response.ok || !payload.idToken) {
        throw new Error(payload.error?.message ?? "Password update failed.");
      }

      window.localStorage.setItem(adminTokenStorageKey, payload.idToken);
      setToken(payload.idToken);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus("Password updated successfully.");
    } catch (error) {
      setPasswordStatus(error instanceof Error ? error.message : "Password update failed.");
    } finally {
      setBusy(false);
    }
  }

  function getFeaturedIds(key: "featuredProjectIds" | "featuredServiceIds" | "featuredNewsIds") {
    return content.settings[key]
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  function updateFeaturedIds(key: "featuredProjectIds" | "featuredServiceIds" | "featuredNewsIds", ids: string[]) {
    updateSettings(key, ids.join(", "));
  }

  function toggleFeaturedId(key: "featuredProjectIds" | "featuredServiceIds" | "featuredNewsIds", id: string) {
    const current = getFeaturedIds(key);
    updateFeaturedIds(key, current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function renderFeaturedSelector(
    label: string,
    key: "featuredProjectIds" | "featuredServiceIds" | "featuredNewsIds",
    items: { id: string; title: string; meta?: string }[]
  ) {
    const selectedIds = getFeaturedIds(key);
    const query = featuredQuery[key] ?? "";
    const visibleItems = items.filter((item) =>
      [item.title, item.id, item.meta].join(" ").toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
      <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#4a4a4a]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
            <p className="mt-1 text-sm text-muted">Selected: {selectedIds.length}</p>
          </div>
          <button
            type="button"
            onClick={() => updateFeaturedIds(key, [])}
            className="rounded-md border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10"
          >
            Clear
          </button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
          <input
            value={query}
            onChange={(event) => setFeaturedQuery((current) => ({ ...current, [key]: event.target.value }))}
            placeholder={`Search ${label.toLowerCase()}`}
            className="h-11 w-full rounded-md border border-black/10 bg-neutral-50 pl-9 pr-3 text-sm outline-none dark:border-white/10 dark:bg-neutral-700/40"
          />
        </div>
        <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto pr-1">
          {visibleItems.map((item) => {
            const selected = selectedIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleFeaturedId(key, item.id)}
                className={`rounded-md border px-3 py-2 text-left transition ${
                  selected
                    ? "border-ink bg-neutral-100 dark:border-paper dark:bg-neutral-700/50"
                    : "border-black/10 hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-neutral-700/40"
                }`}
              >
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="mt-1 block text-xs text-muted">{item.meta ?? item.id}</span>
              </button>
            );
          })}
          {visibleItems.length === 0 && <p className="rounded-md bg-neutral-50 p-4 text-sm text-muted dark:bg-neutral-700/40">No matching items.</p>}
        </div>
      </div>
    );
  }

  function renderDropZone(label: string, onFile: (file?: File) => void, preview?: string) {
    return (
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFile(event.dataTransfer.files?.[0]);
        }}
        className="rounded-lg border border-dashed border-black/20 bg-neutral-50 p-3 dark:border-white/20 dark:bg-neutral-700/40"
      >
        {preview && (
          <div className="mb-3 flex items-center justify-center rounded-md bg-white p-3 dark:bg-[#4a4a4a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={label}
              className="block h-auto w-auto rounded object-contain"
              style={{ maxWidth: "8rem", maxHeight: "8rem" }}
            />
          </div>
        )}
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10 dark:bg-[#4a4a4a]">
          <Upload size={14} /> {label}
          <input type="file" accept="image/*" onChange={(event) => onFile(event.target.files?.[0])} className="hidden" />
        </label>
      </div>
    );
  }

  function renderMediaInsert(projectId: string, index: number) {
    return (
      <div className="group relative flex items-center justify-center py-1">
        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
        <div className="absolute flex scale-95 gap-2 opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => insertProjectMedia(projectId, "image", index)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs shadow-sm dark:border-white/10 dark:bg-[#4a4a4a]"
          >
            <Plus size={13} /> Image
          </button>
          <button
            type="button"
            onClick={() => insertProjectMedia(projectId, "video", index)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs shadow-sm dark:border-white/10 dark:bg-[#4a4a4a]"
          >
            <Plus size={13} /> Video
          </button>
        </div>
      </div>
    );
  }

  function renderSettingsFields(keys: (keyof AdminContent["settings"])[]) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {keys.map((key) => (
          <Field key={key} label={key.replace(/([A-Z])/g, " $1")}>
            {["homeTagline", "aboutStudioProfile", "aboutMission", "aboutVision", "founderMessage", "offices", "officeMaps"].includes(key) ? (
              <TextArea value={content.settings[key]} onChange={(event) => updateSettings(key, event.target.value)} />
            ) : (
              <TextInput value={content.settings[key]} onChange={(event) => updateSettings(key, event.target.value)} />
            )}
            {["logoUrl", "founderImage", "aboutHeroImage"].includes(key) && renderDropZone("Upload image", (file) => uploadToSettings(key, file), content.settings[key])}
          </Field>
        ))}
      </div>
    );
  }

  function renderPanel() {
    if (tab === "general") {
      return renderSettingsFields(["companyName", "tagline", "logoUrl", "homeLogoText"]);
    }

    if (tab === "settings") {
      return (
        <div className="grid gap-6">
          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Admin Password</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Change the Firebase admin login password for {adminEmail || "the currently logged-in account"}.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
              <Field label="Current password">
                <TextInput
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Existing password"
                />
              </Field>
              <Field label="New password">
                <TextInput
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </Field>
              <Field label="Confirm password">
                <TextInput
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat password"
                />
              </Field>
              <button
                type="button"
                onClick={changeAdminPassword}
                className="h-11 rounded-md bg-ink px-5 text-xs uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
              >
                Update
              </button>
            </div>
            {passwordStatus && <p className="mt-3 text-sm text-muted">{passwordStatus}</p>}
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Website Maintenance</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use these controls for client handoff, backups, and checking the public website.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/admin/catalogue.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.14em] dark:border-white/10"
              >
                <Download size={15} /> Export Catalogue
              </Link>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.14em] dark:border-white/10"
              >
                View Website
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.14em] dark:border-white/10"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (tab === "home") {
      return (
        <div className="grid gap-6">
          {renderSettingsFields(["homeHeadline", "homeTagline", "homeVideoUrl", "statYears", "statProjects", "statCountries", "whatsapp", "facebook"])}
          <div className="grid gap-5 xl:grid-cols-3">
            {renderFeaturedSelector(
              "Featured Projects",
              "featuredProjectIds",
              content.projects.map((project) => ({
                id: project.id,
                title: project.title,
                meta: `${project.location} / ${project.section}`
              }))
            )}
            {renderFeaturedSelector(
              "Featured Services",
              "featuredServiceIds",
              content.services.map((service) => ({
                id: service.id,
                title: service.title,
                meta: service.tags
              }))
            )}
            {renderFeaturedSelector(
              "Featured News",
              "featuredNewsIds",
              content.news.map((item) => ({
                id: item.id,
                title: item.title,
                meta: `${item.category} / ${item.date}`
              }))
            )}
          </div>
        </div>
      );
    }

    if (tab === "about") {
      return renderSettingsFields(["aboutStudioProfile", "aboutMission", "aboutVision", "aboutHeroImage", "founderMessage"]);
    }

    if (tab === "contact") {
      return (
        <div className="grid gap-6">
          {renderSettingsFields(["email", "phone", "address", "whatsapp", "facebook"])}
          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Offices and Maps</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Add one office per line. Add matching Google Maps embed URLs one per line in the same order.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="Office addresses">
                <TextArea value={content.settings.offices} onChange={(event) => updateSettings("offices", event.target.value)} />
              </Field>
              <Field label="Office map embed URLs">
                <TextArea value={content.settings.officeMaps} onChange={(event) => updateSettings("officeMaps", event.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      );
    }

    return renderCollection(tab);
  }

  function renderCollection(key: CollectionKey) {
    const normalizedQuery = collectionQuery.trim().toLowerCase();
    const visibleItems = content[key].filter((item) =>
      JSON.stringify(item).toLowerCase().includes(normalizedQuery)
    );

    return (
      <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#4a4a4a]">
          <button
            onClick={() => addItem(key)}
            className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-xs uppercase tracking-[0.16em] text-paper dark:bg-paper dark:text-ink"
          >
            <Plus size={15} /> Add {key}
          </button>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
            <input
              value={collectionQuery}
              onChange={(event) => setCollectionQuery(event.target.value)}
              placeholder={`Search ${key}`}
              className="h-11 w-full rounded-md border border-black/10 bg-neutral-50 pl-9 pr-3 text-sm outline-none dark:border-white/10 dark:bg-neutral-700/40"
            />
          </div>
          <div className="grid max-h-[68vh] gap-2 overflow-y-auto pr-1">
            {visibleItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDraggedItemId(item.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  reorderItem(key, draggedItemId, item.id);
                  setDraggedItemId("");
                }}
                className={`grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-md border p-2 transition ${
                  selectedItem?.id === item.id
                    ? "border-ink bg-neutral-50 dark:border-paper dark:bg-neutral-700/40"
                    : "border-black/10 dark:border-white/10"
                }`}
              >
                <button className="cursor-grab text-muted" aria-label="Drag to reorder">
                  <GripVertical size={18} />
                </button>
                <button onClick={() => setSelectedId(item.id)} className="grid grid-cols-[52px_1fr] items-center gap-3 text-left">
                  {itemImage(item) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={itemImage(item)} alt="" className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <span className="h-12 w-12 rounded bg-neutral-200 dark:bg-neutral-700" />
                  )}
                  <span>
                    <span className="line-clamp-1 text-sm font-medium">{itemTitle(item)}</span>
                    <span className="mt-1 block text-xs text-muted">#{index + 1}</span>
                  </span>
                </button>
                <span className="flex flex-col gap-1">
                  <button onClick={() => moveItem(key, item.id, -1)} className="rounded border border-black/10 p-1 dark:border-white/10" aria-label="Move up">
                    <ArrowUp size={13} />
                  </button>
                  <button onClick={() => moveItem(key, item.id, 1)} className="rounded border border-black/10 p-1 dark:border-white/10" aria-label="Move down">
                    <ArrowDown size={13} />
                  </button>
                </span>
              </div>
            ))}
            {visibleItems.length === 0 && <p className="rounded-md bg-neutral-50 p-4 text-sm text-muted dark:bg-neutral-700/40">No {key} found.</p>}
          </div>
        </aside>
        {selectedItem && renderEditor(key, selectedItem)}
      </section>
    );
  }

  function renderEditor(key: CollectionKey, item: EditableItem) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Editing</p>
            <h2 className="mt-1 font-serif text-3xl">{itemTitle(item)}</h2>
          </div>
          <button
            onClick={() => deleteItem(key, item.id)}
            className="inline-flex items-center gap-2 rounded-md border border-red-500/30 px-4 py-2 text-xs uppercase tracking-[0.14em] text-red-600"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>

        {key === "projects" && renderProjectEditor(item as AdminProject)}
        {key === "services" && renderServiceEditor(item as AdminService)}
        {key === "news" && renderNewsEditor(item as AdminNews)}
        {key === "people" && renderPersonEditor(item as AdminPerson)}
      </div>
    );
  }

  function renderProjectEditor(project: AdminProject) {
    const section = project.section as ProjectSection;
    const subsectionOptions = projectTaxonomy[section] ?? [];

    return (
      <div className="grid gap-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Project title">
            <TextInput value={project.title} onChange={(event) => updateItem("projects", project.id, "title", event.target.value)} />
          </Field>
          <Field label="Slug / ID">
            <TextInput value={project.id} onChange={(event) => updateItem("projects", project.id, "id", event.target.value)} />
          </Field>
          <Field label="Location">
            <TextInput value={project.location} onChange={(event) => updateItem("projects", project.id, "location", event.target.value)} />
          </Field>
          <Field label="Year">
            <TextInput value={project.year} onChange={(event) => updateItem("projects", project.id, "year", event.target.value)} />
          </Field>
          <Field label="Section">
            <SelectInput value={project.section} onChange={(event) => updateItem("projects", project.id, "section", event.target.value)}>
              {projectSections.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Subsection">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <SelectInput value={subsectionOptions.includes(project.subsection) ? project.subsection : "custom"} onChange={(event) => updateItem("projects", project.id, "subsection", event.target.value)}>
                {subsectionOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
                <option value="custom">Custom...</option>
              </SelectInput>
              <button
                onClick={() => {
                  if (customSubsection.trim()) {
                    updateItem("projects", project.id, "subsection", customSubsection.trim());
                    setCustomSubsection("");
                  }
                }}
                className="rounded-md border border-black/10 px-3 dark:border-white/10"
                aria-label="Add custom subsection"
              >
                <Plus size={16} />
              </button>
            </div>
            <TextInput placeholder="Custom subsection" value={customSubsection} onChange={(event) => setCustomSubsection(event.target.value)} />
          </Field>
        </div>
        <Field label="Description">
          <TextArea value={project.description} onChange={(event) => updateItem("projects", project.id, "description", event.target.value)} />
        </Field>
        <Field label="Cover image">
          <TextInput value={project.image} onChange={(event) => updateItem("projects", project.id, "image", event.target.value)} />
          {renderDropZone("Upload cover", (file) => uploadToItem("projects", project.id, "image", file), project.image)}
        </Field>
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Ordered media</p>
              <p className="mt-1 text-sm text-muted">Drag, use arrows, upload images, or paste YouTube links.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => addProjectMedia(project.id, "image")} className="rounded-md border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10">Add image</button>
              <button onClick={() => addProjectMedia(project.id, "video")} className="rounded-md border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10">Add video</button>
            </div>
          </div>
          <div className="grid gap-4">
            {project.media.map((media, index) => (
              <div key={media.id} className="grid gap-4">
                {renderMediaInsert(project.id, index)}
                <div
                  draggable
                  onDragStart={() => setDraggedMediaId(media.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    reorderProjectMedia(project.id, draggedMediaId, media.id);
                    setDraggedMediaId("");
                  }}
                  className="grid gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10 lg:grid-cols-[180px_1fr]"
                >
                  <div>
                    <MediaPreview type={media.type} source={media.source} title={`${project.title} media ${index + 1}`} />
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <GripVertical className="cursor-grab text-muted" size={17} />
                      <div className="flex gap-1">
                        <button onClick={() => moveProjectMedia(project.id, media.id, -1)} className="rounded border border-black/10 p-2 dark:border-white/10" aria-label="Move media up"><ArrowUp size={13} /></button>
                        <button onClick={() => moveProjectMedia(project.id, media.id, 1)} className="rounded border border-black/10 p-2 dark:border-white/10" aria-label="Move media down"><ArrowDown size={13} /></button>
                        <button onClick={() => deleteProjectMedia(project.id, media.id)} className="rounded border border-red-500/30 p-2 text-red-600" aria-label="Remove media"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Field label={`Media ${index + 1} type`}>
                      <SelectInput value={media.type} onChange={(event) => updateProjectMedia(project.id, media.id, "type", event.target.value as AdminMedia["type"])}>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </SelectInput>
                    </Field>
                    <Field label={media.type === "image" ? "Image URL / Upload" : "YouTube link"}>
                      <TextInput value={media.source} onChange={(event) => updateProjectMedia(project.id, media.id, "source", event.target.value)} />
                      {media.type === "image" && renderDropZone("Upload image", (file) => uploadProjectMedia(project.id, media.id, file), media.source)}
                    </Field>
                    <Field label="Caption">
                      <TextArea value={media.caption} onChange={(event) => updateProjectMedia(project.id, media.id, "caption", event.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
            {renderMediaInsert(project.id, project.media.length)}
          </div>
        </div>
      </div>
    );
  }

  function renderServiceEditor(service: AdminService) {
    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Service title"><TextInput value={service.title} onChange={(event) => updateItem("services", service.id, "title", event.target.value)} /></Field>
          <Field label="Category / tags">
            <SelectInput value={serviceCategories.includes(service.tags.split(",")[0]?.trim()) ? service.tags.split(",")[0]?.trim() : "custom"} onChange={(event) => updateItem("services", service.id, "tags", event.target.value)}>
              {serviceCategories.map((item) => <option key={item}>{item}</option>)}
              <option value="custom">Custom...</option>
            </SelectInput>
            <TextInput value={service.tags} onChange={(event) => updateItem("services", service.id, "tags", event.target.value)} />
          </Field>
        </div>
        <Field label="Description"><TextArea value={service.description} onChange={(event) => updateItem("services", service.id, "description", event.target.value)} /></Field>
        <Field label="Image">
          <TextInput value={service.image} onChange={(event) => updateItem("services", service.id, "image", event.target.value)} />
          {renderDropZone("Upload service image", (file) => uploadToItem("services", service.id, "image", file), service.image)}
        </Field>
      </div>
    );
  }

  function renderNewsEditor(item: AdminNews) {
    const galleryImages = item.gallery
      .split(/\n+/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="News title"><TextInput value={item.title} onChange={(event) => updateItem("news", item.id, "title", event.target.value)} /></Field>
          <Field label="Category">
            <SelectInput value={newsCategories.includes(item.category) ? item.category : "custom"} onChange={(event) => updateItem("news", item.id, "category", event.target.value)}>
              {newsCategories.map((category) => <option key={category}>{category}</option>)}
              <option value="custom">Custom...</option>
            </SelectInput>
            <TextInput value={item.category} onChange={(event) => updateItem("news", item.id, "category", event.target.value)} />
          </Field>
          <Field label="Date"><TextInput value={item.date} onChange={(event) => updateItem("news", item.id, "date", event.target.value)} /></Field>
          <Field label="Slug / ID"><TextInput value={item.id} onChange={(event) => updateItem("news", item.id, "id", event.target.value)} /></Field>
        </div>
        <Field label="Cover image">
          <TextInput value={item.image} onChange={(event) => updateItem("news", item.id, "image", event.target.value)} />
          {renderDropZone("Upload cover", (file) => uploadToItem("news", item.id, "image", file), item.image)}
        </Field>
        <Field label="Gallery image URLs, one per line">
          <TextArea value={item.gallery} onChange={(event) => updateItem("news", item.id, "gallery", event.target.value)} />
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              uploadNewsGalleryImage(item.id, event.dataTransfer.files?.[0]);
            }}
            className="rounded-lg border border-dashed border-black/20 bg-neutral-50 p-3 dark:border-white/20 dark:bg-neutral-700/40"
          >
            <div className="flex flex-wrap gap-2">
              {galleryImages.map((image, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <span key={`${image}-${index}`} className="flex h-24 w-24 items-center justify-center rounded bg-white p-1 dark:bg-[#4a4a4a]">
                  <img src={image} alt={`${item.title} gallery ${index + 1}`} className="max-h-full max-w-full object-contain" />
                </span>
              ))}
              {galleryImages.length === 0 && (
                <div className="col-span-full rounded bg-white p-4 text-center text-xs text-muted dark:bg-[#4a4a4a]">
                  Drop gallery images here or use upload.
                </div>
              )}
            </div>
            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10 dark:bg-[#4a4a4a]">
              <Upload size={14} /> Upload gallery image
              <input type="file" accept="image/*" onChange={(event) => uploadNewsGalleryImage(item.id, event.target.files?.[0])} className="hidden" />
            </label>
          </div>
        </Field>
        <Field label="Full article"><TextArea value={item.description} onChange={(event) => updateItem("news", item.id, "description", event.target.value)} /></Field>
      </div>
    );
  }

  function renderPersonEditor(person: AdminPerson) {
    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name"><TextInput value={person.name} onChange={(event) => updateItem("people", person.id, "name", event.target.value)} /></Field>
          <Field label="Role / subsection">
            <SelectInput value={peopleRoles.includes(person.role) ? person.role : "custom"} onChange={(event) => updateItem("people", person.id, "role", event.target.value)}>
              {peopleRoles.map((role) => <option key={role}>{role}</option>)}
              <option value="custom">Custom...</option>
            </SelectInput>
            <TextInput value={person.role} onChange={(event) => updateItem("people", person.id, "role", event.target.value)} />
          </Field>
        </div>
        <Field label="Bio"><TextArea value={person.bio} onChange={(event) => updateItem("people", person.id, "bio", event.target.value)} /></Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Studio">
            <TextInput value={person.studio} onChange={(event) => updateItem("people", person.id, "studio", event.target.value)} />
          </Field>
          <Field label="Office">
            <TextInput value={person.office} onChange={(event) => updateItem("people", person.id, "office", event.target.value)} />
          </Field>
        </div>
        <Field label="Profile details">
          <TextArea value={person.profile} onChange={(event) => updateItem("people", person.id, "profile", event.target.value)} />
        </Field>
        <Field label="Photo">
          <TextInput value={person.image} onChange={(event) => updateItem("people", person.id, "image", event.target.value)} />
          {renderDropZone("Upload photo", (file) => uploadToItem("people", person.id, "image", file), person.image)}
        </Field>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-ink transition-colors dark:bg-[#3a3a3a] dark:text-paper">
      {busy && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/55 backdrop-blur-sm dark:bg-black/35">
          <div className="flex flex-col items-center gap-5 rounded-xl border border-black/10 bg-white/75 px-10 py-8 text-center shadow-soft dark:border-white/10 dark:bg-[#4a4a4a]/80">
            {content.settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.settings.logoUrl}
                alt=""
                className="h-16 w-16 animate-pulse object-contain opacity-80"
              />
            ) : (
              <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full border border-black/15 font-serif text-xl dark:border-white/15">
                {content.settings.companyName
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>
            )}
            <div>
              <p className="font-serif text-2xl">{content.settings.companyName}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">Saving changes</p>
            </div>
          </div>
        </div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 border-r border-black/10 bg-white transition-transform dark:border-white/10 dark:bg-[#4a4a4a] lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-black/10 px-5 dark:border-white/10">
          <div>
            <p className="font-serif text-2xl">Admin</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Modern Age Studio</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close admin menu">
            <X size={20} />
          </button>
        </div>
        <nav className="grid gap-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setSelectedId("");
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm transition ${
                  tab === item.id ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-muted hover:bg-neutral-100 hover:text-ink dark:hover:bg-neutral-700/50 dark:hover:text-paper"
                }`}
              >
                <Icon size={17} /> {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-4 border-b border-black/10 bg-white px-5 dark:border-white/10 dark:bg-[#4a4a4a]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-md border border-black/10 p-2 dark:border-white/10 lg:hidden" aria-label="Open admin menu">
              <Menu size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Admin Panel</p>
              <h1 className="font-serif text-2xl capitalize">{tab}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button onClick={() => saveContent()} disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-xs uppercase tracking-[0.14em] text-paper disabled:opacity-60 dark:bg-paper dark:text-ink">
              <Save size={15} /> {busy ? "Saving" : "Save"}
            </button>
            <Link
              href="/admin/catalogue.pdf"
              target="_blank"
              title="Download a complete PDF company catalogue."
              className="hidden items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10 md:inline-flex"
            >
              <Download size={15} /> Export Catalogue
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </header>

        <section className="p-5 md:p-8">
          <div className="mb-5 rounded-lg border border-black/10 bg-white p-4 text-sm text-muted dark:border-white/10 dark:bg-[#4a4a4a]">
            {status}
            {savedAt ? ` Last saved at ${savedAt}.` : ""}
            <Link href="/" className="ml-3 underline">View site</Link>
          </div>
          {renderPanel()}
        </section>
      </div>
    </main>
  );
}
