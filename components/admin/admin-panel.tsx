"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  GripVertical,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Plus,
  Save,
  Search,
  Settings,
  Sun,
  Trash2,
  Upload,
  Users,
  Wrench,
  X
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adminEmailStorageKey, adminRefreshTokenStorageKey, adminTokenStorageKey, protectedAdminEmail } from "@/lib/admin-auth";
import {
  adminStorageKey,
  createSeedAdminContent,
  type AdminContent,
  type AdminAboutMessage,
  type AdminMedia,
  type AdminNews,
  type AdminPerson,
  type AdminProject,
  type AdminService,
  type AdminSocialLink,
  type AdminBrandLink,
  type AdminTextItem,
  type AdminLinkItem
} from "@/lib/admin-demo-data";
import { normalizeProjectTaxonomy, serializeProjectTaxonomy, projectTaxonomy, type ProjectSection } from "@/lib/data";
import { normalizeSocialPlatform, socialPlatformGroups } from "@/lib/social-platforms";

type Tab = "general" | "home" | "projects" | "services" | "news" | "people" | "about" | "contact" | "settings";
type CollectionKey = "projects" | "services" | "news" | "people";
type EditableItem = AdminProject | AdminService | AdminNews | AdminPerson;
type AdminUser = {
  uid: string;
  email: string;
  disabled: boolean;
  protected: boolean;
  createdAt?: string;
  lastSignInAt?: string;
};
type DeletePrompt = {
  key: CollectionKey;
  id: string;
  title: string;
} | null;

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
const serviceCategories = [
  "Architecture Design",
  "Drafting",
  "Planning",
  "3D Modeling",
  "Rendering",
  "Visualization",
  "Interior",
  "Exterior",
  "Animation",
  "AutoCAD",
  "Revit",
  "SketchUp",
  "Rhino",
  "Lumion",
  "V-Ray",
  "Enscape",
  "D5 Render"
];
const defaultPeopleRoles = ["Architecture", "Engineer", "Designer", "Technical"];
const defaultNewsCategories = ["Studio", "Projects", "Awards", "Research", "Press"];

const emptyItem: Record<CollectionKey, EditableItem> = {
  projects: {
    id: "",
    title: "New Project",
    location: "Dhaka, Bangladesh",
    year: "2026",
    client: "",
    status: "Concept",
    section: "Architecture",
    subsection: "Culture",
    image: "",
    media: [],
    mapLocation: "Dhaka, Bangladesh",
    description: "Project description goes here."
  },
  services: {
    id: "",
    title: "New Service",
    image: "",
    description: "Service description goes here.",
    tags: "Planning, Design"
  },
  news: {
    id: "",
    title: "New News Item",
    date: "July 2026",
    category: "Studio",
    image: "",
    gallery: "",
    description: "Full news story goes here."
  },
  people: {
    id: "",
    name: "New Team Member",
    category: "Architecture",
    role: "Architect",
    image: "",
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
  const knownPeopleCategories = (content.settings?.peopleRoles || seed.settings.peopleRoles || "")
    .split(",")
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);

  function normalizePerson(person: AdminPerson, index: number): AdminPerson {
    const seedPerson = seed.people[index % seed.people.length];
    const legacyPerson = person as AdminPerson & { category?: string };
    const legacyRoleLooksLikeCategory = knownPeopleCategories.includes((legacyPerson.role || "").trim().toLowerCase());
    const category = legacyPerson.category || (legacyRoleLooksLikeCategory ? legacyPerson.role : seedPerson.category) || defaultPeopleRoles[0];

    return {
      ...seedPerson,
      ...person,
      category,
      role: legacyPerson.category || !legacyRoleLooksLikeCategory ? (person.role || seedPerson.role) : (seedPerson.role || "")
    };
  }

  return {
    ...seed,
    ...content,
    settings: {
      ...seed.settings,
      ...content.settings
    },
    projects: (content.projects ?? seed.projects).map((project, index) => ({
      ...seed.projects[index % seed.projects.length],
      ...project,
      client: project.client ?? "",
      mapLocation: project.mapLocation ?? project.location ?? "",
      media: (project.media ?? []).map((media) => ({
        ...media,
        type: media.type ?? "image",
        source: media.source ?? "",
        caption: media.caption ?? ""
      }))
    })),
    services: content.services ?? seed.services,
    news: content.news ?? seed.news,
    people: (content.people ?? seed.people).map(normalizePerson)
  };
}

async function readAdminApiResponse<T>(response: Response): Promise<T & { error?: string }> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T & { error?: string };
  }

  const text = await response.text();
  return {
    error: text.includes("<!DOCTYPE")
      ? "Admin user API returned an HTML error page. Check Firebase Admin service account environment variables and redeploy."
      : text || "Admin user API returned an unexpected response."
  } as T & { error?: string };
}

function itemTitle(item: EditableItem) {
  return "title" in item ? item.title : item.name;
}

function itemImage(item: EditableItem) {
  return "image" in item ? item.image : "";
}

function itemSearchText(item: EditableItem) {
  if ("title" in item) {
    const base = [item.title, item.description].filter(Boolean);

    if ("location" in item) {
      base.push(item.location, item.year, item.client, item.status, item.section, item.subsection);
    }

    if ("date" in item) {
      base.push(item.date, item.category);
    }

    if ("tags" in item) {
      base.push(item.tags);
    }

    return base.join(" ").toLowerCase();
  }

  return [item.name, item.category, item.role, item.bio, item.studio, item.office, item.profile].join(" ").toLowerCase();
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

function ToggleField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-[#4a4a4a]">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
    </label>
  );
}

function PasswordInput({
  visible,
  onToggle,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <span className="flex h-11 items-center rounded-md border border-black/10 bg-white dark:border-white/10 dark:bg-[#4a4a4a]">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm normal-case tracking-normal text-ink outline-none dark:text-paper"
      />
      <button
        type="button"
        onClick={onToggle}
        className="flex h-full w-11 items-center justify-center text-muted transition hover:text-ink dark:hover:text-paper"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </span>
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

function MediaPreview({ type = "image", source, title, caption }: { type?: AdminMedia["type"]; source: string; title: string; caption?: string }) {
  if (type === "caption") {
    return (
      <span className="flex h-32 w-32 flex-col justify-center rounded-md bg-neutral-100 p-3 text-left dark:bg-neutral-700">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Caption</span>
        <span className="mt-2 line-clamp-2 font-serif text-lg leading-tight text-ink dark:text-paper">{source || "Untitled"}</span>
        <span className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{caption || "No paragraph yet."}</span>
      </span>
    );
  }

  if (!source) {
    return <div className="flex h-32 w-32 items-center justify-center rounded-md bg-neutral-100 text-xs text-muted dark:bg-neutral-700">No media</div>;
  }

  if (type === "video") {
    return (
      <span className="flex h-32 w-32 flex-col items-center justify-center rounded-md bg-black p-3 text-center text-paper">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/60">Video</span>
        <span className="mt-2 line-clamp-3 break-all text-xs leading-5 text-paper/85">{source}</span>
      </span>
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
  const { theme, setTheme } = useTheme();
  const [content, setContentState] = useState<AdminContent>(() => createSeedAdminContent());
  const contentRef = useRef(content);
  const userEditedRef = useRef(false);
  const setContent = useCallback((next: SetStateAction<AdminContent>) => {
    const base = contentRef.current;
    const resolved = typeof next === "function" ? (next as (current: AdminContent) => AdminContent)(base) : next;
    contentRef.current = resolved;
    setContentState(resolved);
    return resolved;
  }, []);
  const updateDraft = useCallback((next: SetStateAction<AdminContent>) => {
    userEditedRef.current = true;
    return setContent(next);
  }, [setContent]);
  const [tab, setTab] = useState<Tab>("general");
  const [selectedId, setSelectedId] = useState<string>("");
  const [savedAt, setSavedAt] = useState("");
  const [status, setStatus] = useState("Checking admin session...");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customSubsection, setCustomSubsection] = useState("");
  const [customPeopleRole, setCustomPeopleRole] = useState("");
  const [customNewsCategory, setCustomNewsCategory] = useState("");
  const [openSubsectionMenuId, setOpenSubsectionMenuId] = useState("");
  const [draggedItemId, setDraggedItemId] = useState("");
  const [draggedMediaId, setDraggedMediaId] = useState("");
  const [collectionQuery, setCollectionQuery] = useState("");
  const [featuredQuery, setFeaturedQuery] = useState<Record<string, string>>({});
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<"current" | "new" | "confirm", boolean>>({
    current: false,
    new: false,
    confirm: false
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [userStatus, setUserStatus] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [userEmailDrafts, setUserEmailDrafts] = useState<Record<string, string>>({});
  const [userPasswordDrafts, setUserPasswordDrafts] = useState<Record<string, string>>({});
  const [visibleUserPasswords, setVisibleUserPasswords] = useState<Record<string, boolean>>({});
  const [socialPlacementStatus, setSocialPlacementStatus] = useState("");
  const [deletePrompt, setDeletePrompt] = useState<DeletePrompt>(null);
  const isProtectedOwnerSession = adminEmail.trim().toLowerCase() === protectedAdminEmail;

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

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
          cache: "no-store",
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : undefined
        });

        if (!response.ok) {
          throw new Error("Remote content is not available yet.");
        }

        const payload = (await response.json()) as { content: AdminContent };
        const normalized = normalizeContent(payload.content);
        if (!userEditedRef.current) {
          setContent(normalized);
          window.localStorage.setItem(adminStorageKey, JSON.stringify(normalized));
          setStatus("Connected to Sanity content.");
        }
      } catch {
        setStatus("Using local demo content until Sanity/Firebase keys are available.");
      } finally {
        setLoadingContent(false);
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
    if (tab === "settings" && token && isProtectedOwnerSession && !usersLoaded) {
      loadAdminUsers();
    }
  }, [tab, token, usersLoaded, isProtectedOwnerSession]);

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

  function toggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed((current) => !current);
      return;
    }

    setSidebarOpen(true);
  }

  async function saveContent(next?: AdminContent) {
    const sourceContent = next ?? contentRef.current;
    if (loadingContent) {
      setStatus("Content is still loading. Please try again in a moment.");
      return;
    }

    const normalizedNext = normalizeContent(sourceContent);
    setBusy(true);
    updateDraft(normalizedNext);
    window.localStorage.setItem(adminStorageKey, JSON.stringify(normalizedNext));

    try {
      const authToken = await getFreshAdminToken();
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(normalizedNext)
      });

      const result = await readAdminApiResponse<{ mode?: string; documents?: number }>(response);
      if (!response.ok) {
        throw new Error(result.error || `Remote save failed with status ${response.status}.`);
      }

      setStatus(
        result.mode === "sanity"
          ? `Saved to Sanity${typeof result.documents === "number" ? ` as ${result.documents} split documents` : ""}.`
          : "Saved locally. Add Sanity keys for production storage."
      );
    } catch (error) {
      setStatus(`Saved locally only. ${error instanceof Error ? error.message : "Check Firebase/Sanity environment keys."}`);
    } finally {
      setSavedAt(new Date().toLocaleTimeString());
      setBusy(false);
    }
  }

  function updateSettings(key: keyof AdminContent["settings"], value: string) {
    updateDraft((current) => ({
      ...current,
      settings: { ...current.settings, [key]: value }
    }));
  }

  function settingEnabled(key: keyof AdminContent["settings"]) {
    return content.settings[key] !== "false";
  }

  function updateSettingEnabled(key: keyof AdminContent["settings"], value: boolean) {
    updateSettings(key, value ? "true" : "false");
  }

  function projectSubsections() {
    return normalizeProjectTaxonomy(content.settings.projectSubsections);
  }

  function saveProjectSubsections(next: Record<ProjectSection, string[]>) {
    updateSettings("projectSubsections", serializeProjectTaxonomy(next));
  }

  function addProjectSubsection(section: ProjectSection, subsection: string, projectId?: string) {
    const value = subsection.trim();
    if (!value) {
      return;
    }

    const current = projectSubsections();
    const next = {
      ...current,
      [section]: Array.from(new Set([...(current[section] ?? []), value]))
    };

    saveProjectSubsections(next);
    if (projectId) {
      updateItem("projects", projectId, "subsection", value);
    }
    setCustomSubsection("");
  }

  function removeProjectSubsection(section: ProjectSection, subsection: string) {
    const current = projectSubsections();
    const next = {
      ...current,
      [section]: (current[section] ?? []).filter((item) => item !== subsection)
    };

    saveProjectSubsections(next);
  }

  function peopleRoles() {
    const roles = content.settings.peopleRoles
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);

    return Array.from(new Set(roles.length ? roles : defaultPeopleRoles));
  }

  function savePeopleRoles(roles: string[]) {
    updateSettings("peopleRoles", Array.from(new Set(roles.map((role) => role.trim()).filter(Boolean))).join(", "));
  }

  function addPeopleRole(personId?: string) {
    const value = customPeopleRole.trim();
    if (!value) {
      return;
    }

    savePeopleRoles([...peopleRoles(), value]);
    if (personId) {
      updateItem("people", personId, "category", value);
    }
    setCustomPeopleRole("");
  }

  function removePeopleRole(role: string) {
    savePeopleRoles(peopleRoles().filter((item) => item !== role));
  }

  function newsCategories() {
    const categories = (content.settings.newsCategories || "")
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean);

    return Array.from(new Set(categories.length ? categories : defaultNewsCategories));
  }

  function saveNewsCategories(categories: string[]) {
    updateSettings("newsCategories", Array.from(new Set(categories.map((category) => category.trim()).filter(Boolean))).join(", "));
  }

  function addNewsCategory(newsId?: string) {
    const value = customNewsCategory.trim();
    if (!value) {
      return;
    }

    saveNewsCategories([...newsCategories(), value]);
    if (newsId) {
      updateItem("news", newsId, "category", value);
    }
    setCustomNewsCategory("");
  }

  function removeNewsCategory(category: string) {
    saveNewsCategories(newsCategories().filter((item) => item !== category));
  }

  function officeEntries() {
    const addresses = content.settings.offices.split(/\n+/);
    const maps = (content.settings.officeMaps ?? "").split(/\n+/);
    const count = Math.max(addresses.length, maps.length, 1);

    return Array.from({ length: count }, (_, index) => ({
      address: addresses[index]?.trim() ?? "",
      map: maps[index]?.trim() ?? ""
    })).filter((entry, index, list) => entry.address || entry.map || list.length === 1 || index < count);
  }

  function saveOfficeEntries(entries: { address: string; map: string }[]) {
    updateSettings("offices", entries.map((entry) => entry.address.trim()).filter(Boolean).join("\n"));
    updateSettings("officeMaps", entries.map((entry) => entry.map.trim()).join("\n"));
  }

  function updateOfficeEntry(index: number, field: "address" | "map", value: string) {
    const entries = officeEntries();
    entries[index] = { ...(entries[index] ?? { address: "", map: "" }), [field]: value };
    saveOfficeEntries(entries);
  }

  function addOfficeEntry() {
    saveOfficeEntries([...officeEntries().filter((entry) => entry.address || entry.map), { address: "", map: "" }]);
  }

  function removeOfficeEntry(index: number) {
    const next = officeEntries().filter((_, itemIndex) => itemIndex !== index);
    saveOfficeEntries(next.length ? next : [{ address: "", map: "" }]);
  }

  function updateItem(key: CollectionKey, id: string, field: string, value: string) {
    updateDraft((current) => ({
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
      updateDraft((current) => ({
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
    updateDraft((current) => ({
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

  function aboutMessages() {
    try {
      const parsed = JSON.parse(content.settings.aboutMessages || "[]") as AdminAboutMessage[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Use the legacy founder fields below.
    }

    return [
      {
        id: "founder-message",
        name: "Founder",
        role: "Founder",
        image: content.settings.founderImage,
        message: content.settings.founderMessage
      }
    ];
  }

  function saveAboutMessages(messages: AdminAboutMessage[]) {
    updateSettings("aboutMessages", JSON.stringify(messages, null, 2));
  }

  function addAboutMessage() {
    saveAboutMessages([
      ...aboutMessages(),
      {
        id: makeId("about-message"),
        name: "New Message",
        role: "Studio Leadership",
        image: "",
        message: "Add this person's message here."
      }
    ]);
  }

  function updateAboutMessage(id: string, field: keyof AdminAboutMessage, value: string) {
    saveAboutMessages(aboutMessages().map((message) => (message.id === id ? { ...message, [field]: value } : message)));
  }

  function deleteAboutMessage(id: string) {
    saveAboutMessages(aboutMessages().filter((message) => message.id !== id));
  }

  async function uploadAboutMessageImage(id: string, file?: File) {
    if (!file) {
      return;
    }

    const localPreview = await readFileAsDataUrl(file);
    updateAboutMessage(id, "image", localPreview);
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      updateAboutMessage(id, "image", uploadedUrl);
    }
  }

  function socialLinks() {
    try {
      const parsed = JSON.parse(content.settings.socialLinks || "[]") as AdminSocialLink[];
      if (Array.isArray(parsed)) {
        return parsed.map((link) => ({ ...link, platform: normalizeSocialPlatform(link.platform) }));
      }
    } catch {
      // Use legacy social fields below.
    }

    return [
      { id: "email", platform: "Professional Email", href: content.settings.email },
      { id: "whatsapp", platform: "WhatsApp Business", href: content.settings.whatsapp },
      { id: "facebook", platform: "Facebook Page", href: content.settings.facebook },
      { id: "instagram", platform: "Instagram", href: content.settings.instagram },
      { id: "linkedin", platform: "LinkedIn", href: content.settings.linkedin }
    ];
  }

  function saveSocialLinks(links: AdminSocialLink[]) {
    updateSettings("socialLinks", JSON.stringify(links, null, 2));
  }

  function addSocialLink(platform = "Instagram") {
    saveSocialLinks([
      ...socialLinks(),
      {
        id: makeId("social-link"),
        platform,
        href: platform === "Professional Email" ? content.settings.email : "https://"
      }
    ]);
  }

  function updateSocialLink(id: string, field: keyof AdminSocialLink, value: string) {
    saveSocialLinks(socialLinks().map((link) => (link.id === id ? { ...link, [field]: value } : link)));
  }

  function deleteSocialLink(id: string) {
    saveSocialLinks(socialLinks().filter((link) => link.id !== id));
  }

  function selectedSocialIds(key: "footerSocialIds" | "quickContactSocialIds" | "serviceSocialPresenceSocialIds") {
    return content.settings[key]
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  function toggleSelectedSocialId(key: "footerSocialIds" | "quickContactSocialIds" | "serviceSocialPresenceSocialIds", id: string) {
    const current = selectedSocialIds(key);
    const adding = !current.includes(id);

    if (key === "quickContactSocialIds" && adding && current.length >= 5) {
      setSocialPlacementStatus("Quick Contacts can show a maximum of 5 links. Remove one before adding another.");
      return;
    }

    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    setSocialPlacementStatus("");
    updateSettings(key, next.join(", "));
  }

  function brandLinks() {
    try {
      const parsed = JSON.parse(content.settings.brandLinks || "[]") as AdminBrandLink[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Ignore malformed brand JSON.
    }

    return [];
  }

  function saveBrandLinks(links: AdminBrandLink[]) {
    updateSettings("brandLinks", JSON.stringify(links, null, 2));
  }

  function addBrandLink() {
    saveBrandLinks([
      ...brandLinks(),
      {
        id: makeId("brand-link"),
        name: "New Brand",
        logo: "",
        href: "https://example.com"
      }
    ]);
  }

  function updateBrandLink(id: string, field: keyof AdminBrandLink, value: string) {
    saveBrandLinks(brandLinks().map((brand) => (brand.id === id ? { ...brand, [field]: value } : brand)));
  }

  function deleteBrandLink(id: string) {
    saveBrandLinks(brandLinks().filter((brand) => brand.id !== id));
  }

  async function uploadBrandLogo(id: string, file?: File) {
    if (!file) {
      return;
    }

    const localPreview = await readFileAsDataUrl(file);
    updateBrandLink(id, "logo", localPreview);
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      updateBrandLink(id, "logo", uploadedUrl);
    }
  }

  function serviceTextItems(key: "serviceWorkflow" | "serviceWhyChoose") {
    try {
      const parsed = JSON.parse(content.settings[key] || "[]") as AdminTextItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveServiceTextItems(key: "serviceWorkflow" | "serviceWhyChoose", items: AdminTextItem[]) {
    updateSettings(key, JSON.stringify(items, null, 2));
  }

  function addServiceTextItem(key: "serviceWorkflow" | "serviceWhyChoose") {
    saveServiceTextItems(key, [
      ...serviceTextItems(key),
      {
        id: makeId(key),
        title: "New item",
        body: "Add description here."
      }
    ]);
  }

  function updateServiceTextItem(key: "serviceWorkflow" | "serviceWhyChoose", id: string, field: keyof AdminTextItem, value: string) {
    saveServiceTextItems(key, serviceTextItems(key).map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function deleteServiceTextItem(key: "serviceWorkflow" | "serviceWhyChoose", id: string) {
    saveServiceTextItems(key, serviceTextItems(key).filter((item) => item.id !== id));
  }

  function serviceLinkItems() {
    try {
      const parsed = JSON.parse(content.settings.serviceFreelanceLinks || "[]") as AdminLinkItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveServiceLinkItems(items: AdminLinkItem[]) {
    updateSettings("serviceFreelanceLinks", JSON.stringify(items, null, 2));
  }

  function addServiceLinkItem() {
    saveServiceLinkItems([...serviceLinkItems(), { id: makeId("platform"), label: "New Platform", href: "https://example.com" }]);
  }

  function updateServiceLinkItem(id: string, field: keyof AdminLinkItem, value: string) {
    saveServiceLinkItems(serviceLinkItems().map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function deleteServiceLinkItem(id: string) {
    saveServiceLinkItems(serviceLinkItems().filter((item) => item.id !== id));
  }

  function updateProjectMedia(projectId: string, mediaId: string, field: keyof AdminMedia, value: string) {
    updateDraft((current) => ({
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
          ? ""
          : type === "video"
            ? ""
            : "",
      caption: ""
    };

    updateDraft((current) => ({
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
    updateDraft((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId ? { ...project, media: project.media.filter((media) => media.id !== mediaId) } : project
      )
    }));
  }

  function moveProjectMedia(projectId: string, mediaId: string, direction: -1 | 1) {
    updateDraft((current) => ({
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
    updateDraft((current) => ({
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
    updateDraft((current) => ({
      ...current,
      [key]: moveById(current[key] as EditableItem[], id, direction) as never
    }));
  }

  function reorderItem(key: CollectionKey, fromId: string, toId: string) {
    updateDraft((current) => ({
      ...current,
      [key]: moveToId(current[key] as EditableItem[], fromId, toId) as never
    }));
  }

  function addItem(key: CollectionKey) {
    const base = emptyItem[key];
    const id = makeId("title" in base ? base.title : "item");
    const nextItem = { ...base, id } as EditableItem;
    updateDraft((current) => ({ ...current, [key]: [nextItem, ...current[key]] as never }));
    setSelectedId(id);
  }

  function deleteItem(key: CollectionKey, id: string) {
    const item = contentRef.current[key].find((entry) => entry.id === id);
    setDeletePrompt({
      key,
      id,
      title: item ? itemTitle(item as EditableItem) : id
    });
  }

  async function confirmDeleteItem() {
    if (!deletePrompt) {
      return;
    }

    setBusy(true);
    try {
      const authToken = await getFreshAdminToken();
      const response = await fetch(
        `/api/admin/content?collection=${encodeURIComponent(deletePrompt.key)}&id=${encodeURIComponent(deletePrompt.id)}`,
        {
          method: "DELETE",
          cache: "no-store",
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
        }
      );
      const result = await readAdminApiResponse<{ mode?: string; content?: AdminContent; documents?: number }>(response);

      if (!response.ok || !result.content) {
        throw new Error(result.error || `Delete failed with status ${response.status}.`);
      }

      const normalized = normalizeContent(result.content);
      userEditedRef.current = false;
      setContent(normalized);
      window.localStorage.setItem(adminStorageKey, JSON.stringify(normalized));
      setSelectedId("");
      setDeletePrompt(null);
      setStatus(
        result.mode === "sanity"
          ? `Deleted from Sanity${typeof result.documents === "number" ? `; ${result.documents} split documents remain` : ""}.`
          : "Deleted locally. Add Sanity keys for production storage."
      );
    } catch (error) {
      setStatus(`Delete failed. ${error instanceof Error ? error.message : "Please check Firebase/Sanity settings."}`);
    } finally {
      setSavedAt(new Date().toLocaleTimeString());
      setBusy(false);
    }
  }

  function logout() {
    setLogoutBusy(true);
    window.localStorage.removeItem(adminTokenStorageKey);
    window.localStorage.removeItem(adminRefreshTokenStorageKey);
    window.localStorage.removeItem(adminEmailStorageKey);
    router.push("/admin/login");
  }

  async function getFreshAdminToken() {
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
    const refreshToken = window.localStorage.getItem(adminRefreshTokenStorageKey) ?? "";

    if (!firebaseApiKey || !refreshToken) {
      return token;
    }

    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      })
    });
    const payload = (await response.json()) as {
      id_token?: string;
      refresh_token?: string;
      error?: { message?: string };
    };

    if (!response.ok || !payload.id_token) {
      throw new Error(payload.error?.message ?? "Login session expired. Log out and log in again.");
    }

    window.localStorage.setItem(adminTokenStorageKey, payload.id_token);
    if (payload.refresh_token) {
      window.localStorage.setItem(adminRefreshTokenStorageKey, payload.refresh_token);
    }
    setToken(payload.id_token);
    return payload.id_token;
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
      const signInPayload = (await signInResponse.json()) as { idToken?: string; refreshToken?: string; error?: { message?: string } };

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
      const payload = (await response.json()) as { idToken?: string; refreshToken?: string; error?: { message?: string } };

      if (!response.ok || !payload.idToken) {
        throw new Error(payload.error?.message ?? "Password update failed.");
      }

      window.localStorage.setItem(adminTokenStorageKey, payload.idToken);
      if (payload.refreshToken ?? signInPayload.refreshToken) {
        window.localStorage.setItem(adminRefreshTokenStorageKey, payload.refreshToken ?? signInPayload.refreshToken ?? "");
      }
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

  async function loadAdminUsers() {
    if (!token) {
      setUserStatus("Login with Firebase before managing users.");
      return;
    }

    setUserStatus("Loading admin users...");

    try {
      const freshToken = await getFreshAdminToken();
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${freshToken}` }
      });
      const payload = await readAdminApiResponse<{ users?: AdminUser[]; protectedEmail?: string }>(response);

      if (!response.ok || !payload.users) {
        throw new Error(payload.error ?? "Unable to load admin users.");
      }

      setAdminUsers(payload.users);
      setUserEmailDrafts(Object.fromEntries(payload.users.map((user) => [user.uid, user.email])));
      setUsersLoaded(true);
      setUserStatus(`Loaded ${payload.users.length} admin user${payload.users.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setUserStatus(error instanceof Error ? error.message : "Unable to load admin users.");
    }
  }

  async function addAdminUser() {
    if (!newAdminEmail.trim() || newAdminPassword.length < 6) {
      setUserStatus("Email and a minimum 6 character password are required.");
      return;
    }

    setBusy(true);
    setUserStatus("Adding admin user...");

    try {
      const freshToken = await getFreshAdminToken();
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`
        },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword })
      });
      const payload = await readAdminApiResponse<{ user?: AdminUser }>(response);

      if (!response.ok || !payload.user) {
        throw new Error(payload.error ?? "Unable to add admin user.");
      }

      setNewAdminEmail("");
      setNewAdminPassword("");
      setAdminUsers((current) => [payload.user as AdminUser, ...current]);
      setUserEmailDrafts((current) => ({ ...current, [payload.user?.uid ?? ""]: payload.user?.email ?? "" }));
      setUserStatus("Admin user added.");
    } catch (error) {
      setUserStatus(error instanceof Error ? error.message : "Unable to add admin user.");
    } finally {
      setBusy(false);
    }
  }

  async function updateAdminUser(user: AdminUser, disabled?: boolean) {
    const nextEmail = userEmailDrafts[user.uid]?.trim() ?? user.email;
    const nextPassword = userPasswordDrafts[user.uid] ?? "";
    const emailChanged = nextEmail && nextEmail !== user.email;

    if (user.protected && emailChanged) {
      setUserStatus(`${protectedAdminEmail} is protected, so its email cannot be changed.`);
      return;
    }

    if (!emailChanged && !nextPassword && typeof disabled !== "boolean") {
      setUserStatus("Add an email/password change or toggle user status first.");
      return;
    }

    setBusy(true);
    setUserStatus("Updating admin user...");

    try {
      const freshToken = await getFreshAdminToken();
      const response = await fetch(`/api/admin/users/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`
        },
        body: JSON.stringify({
          email: emailChanged ? nextEmail : undefined,
          password: nextPassword || undefined,
          disabled
        })
      });
      const payload = await readAdminApiResponse<{ user?: AdminUser }>(response);

      if (!response.ok || !payload.user) {
        throw new Error(payload.error ?? "Unable to update admin user.");
      }

      setAdminUsers((current) => current.map((item) => (item.uid === user.uid ? (payload.user as AdminUser) : item)));
      setUserPasswordDrafts((current) => ({ ...current, [user.uid]: "" }));
      setUserEmailDrafts((current) => ({ ...current, [user.uid]: payload.user?.email ?? "" }));
      setUserStatus(payload.user.email === adminEmail ? "User updated. Log out and log back in if you changed your own email." : "Admin user updated.");
    } catch (error) {
      setUserStatus(error instanceof Error ? error.message : "Unable to update admin user.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAdminUser(user: AdminUser) {
    if (user.protected) {
      setUserStatus(`${protectedAdminEmail} is protected and cannot be deleted.`);
      return;
    }

    const confirmed = window.confirm(`Delete admin user ${user.email}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setUserStatus("Deleting admin user...");

    try {
      const freshToken = await getFreshAdminToken();
      const response = await fetch(`/api/admin/users/${user.uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${freshToken}` }
      });
      const payload = await readAdminApiResponse<{ ok?: boolean }>(response);

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Unable to delete admin user.");
      }

      setAdminUsers((current) => current.filter((item) => item.uid !== user.uid));
      setUserStatus("Admin user deleted.");
    } catch (error) {
      setUserStatus(error instanceof Error ? error.message : "Unable to delete admin user.");
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
          <button
            type="button"
            onClick={() => insertProjectMedia(projectId, "caption", index)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs shadow-sm dark:border-white/10 dark:bg-[#4a4a4a]"
          >
            <Plus size={13} /> Caption
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
            {[
              "homeTagline",
              "aboutStudioProfile",
              "aboutMission",
              "aboutVision",
              "founderMessage",
              "offices",
              "officeMaps",
              "servicesIntroBody",
              "serviceFreelanceBody",
              "serviceLocalSupportBody",
              "serviceSocialPresenceBody",
              "serviceTeamCultureBody"
            ].includes(key) ? (
              <TextArea value={content.settings[key]} onChange={(event) => updateSettings(key, event.target.value)} />
            ) : (
              <TextInput value={content.settings[key]} onChange={(event) => updateSettings(key, event.target.value)} />
            )}
            {["logoUrl", "founderImage", "aboutHeroImage", "homeImageUrl"].includes(key) && renderDropZone("Upload image", (file) => uploadToSettings(key, file), content.settings[key])}
          </Field>
        ))}
      </div>
    );
  }

  function renderAboutMessagesEditor() {
    const messages = aboutMessages();

    return (
      <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">About Page Messages</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Add founder, partner, or employee messages with a portrait, name, title, and message.
            </p>
          </div>
          <button
            type="button"
            onClick={addAboutMessage}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
          >
            <Plus size={15} /> Add Message
          </button>
        </div>

        <div className="grid gap-4">
          {messages.map((message, index) => (
            <div key={message.id} className="grid gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10 lg:grid-cols-[180px_1fr]">
              <div>
                <MediaPreview type="image" source={message.image} title={message.name} />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Message {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => deleteAboutMessage(message.id)}
                    className="rounded border border-red-500/30 p-2 text-red-600"
                    aria-label={`Delete message from ${message.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name">
                    <TextInput value={message.name} onChange={(event) => updateAboutMessage(message.id, "name", event.target.value)} />
                  </Field>
                  <Field label="Role / title">
                    <TextInput value={message.role} onChange={(event) => updateAboutMessage(message.id, "role", event.target.value)} />
                  </Field>
                </div>
                <Field label="Portrait image">
                  <TextInput value={message.image} onChange={(event) => updateAboutMessage(message.id, "image", event.target.value)} />
                  {renderDropZone("Upload portrait", (file) => uploadAboutMessageImage(message.id, file), message.image)}
                </Field>
                <Field label="Message">
                  <TextArea value={message.message} onChange={(event) => updateAboutMessage(message.id, "message", event.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSocialLinksEditor() {
    const links = socialLinks();
    const groupedLinks = socialPlatformGroups.map((group) => ({
      ...group,
      links: links.filter((link) => (group.platforms as readonly string[]).includes(normalizeSocialPlatform(link.platform)))
    }));
    const otherLinks = links.filter(
      (link) => !socialPlatformGroups.some((group) => (group.platforms as readonly string[]).includes(normalizeSocialPlatform(link.platform)))
    );

    return (
      <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
        <div className="mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Social Media Links</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Manage section-wise platform links for the contact page, footer, service social presence, and quick contact buttons.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          {groupedLinks.map((group) => (
            <div key={group.title} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{group.title}</p>
                  <p className="mt-1 text-xs text-muted">{group.links.length} link{group.links.length === 1 ? "" : "s"} added</p>
                </div>
                <button
                  type="button"
                  onClick={() => addSocialLink(group.platforms[0])}
                  className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>

              <div className="grid gap-3">
                {group.links.map((link) => (
                  <div key={link.id} className="grid gap-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-700/30 md:grid-cols-[260px_1fr_auto] md:items-end">
                    <Field label="Platform">
                      <SelectInput value={normalizeSocialPlatform(link.platform)} onChange={(event) => updateSocialLink(link.id, "platform", event.target.value)}>
                        {group.platforms.map((platform) => (
                          <option key={platform}>{platform}</option>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Link / phone / email">
                      <TextInput
                        value={link.href}
                        onChange={(event) => updateSocialLink(link.id, "href", event.target.value)}
                        placeholder="https://..., tel:+880..., or email@example.com"
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() => deleteSocialLink(link.id)}
                      className="h-11 rounded-md border border-red-500/30 px-4 text-xs uppercase tracking-[0.14em] text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {group.links.length === 0 && (
                  <p className="rounded-md border border-dashed border-black/10 p-4 text-sm text-muted dark:border-white/10">
                    No links added in this section.
                  </p>
                )}
              </div>
            </div>
          ))}

          {otherLinks.length > 0 && (
            <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Other Links</p>
              <div className="grid gap-3">
                {otherLinks.map((link) => (
                  <div key={link.id} className="grid gap-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-700/30 md:grid-cols-[260px_1fr_auto] md:items-end">
                    <Field label="Platform">
                      <SelectInput value={link.platform} onChange={(event) => updateSocialLink(link.id, "platform", event.target.value)}>
                        <option>{link.platform}</option>
                        {socialPlatformGroups.map((group) => (
                          <optgroup key={group.title} label={group.title}>
                            {group.platforms.map((platform) => (
                              <option key={platform}>{platform}</option>
                            ))}
                          </optgroup>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Link / phone / email">
                      <TextInput
                        value={link.href}
                        onChange={(event) => updateSocialLink(link.id, "href", event.target.value)}
                        placeholder="https://..., tel:+880..., or email@example.com"
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() => deleteSocialLink(link.id)}
                      className="h-11 rounded-md border border-red-500/30 px-4 text-xs uppercase tracking-[0.14em] text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {links.length === 0 && (
            <p className="rounded-md bg-neutral-50 p-4 text-sm text-muted dark:bg-neutral-700/40">
              No social media links added yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  function renderSocialPlacementEditor() {
    const links = socialLinks();
    const footerIds = selectedSocialIds("footerSocialIds");
    const quickIds = selectedSocialIds("quickContactSocialIds");

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          {
            title: "Footer Social Media",
            description: "Select which social links appear in the footer contact area.",
            key: "footerSocialIds" as const,
            selected: footerIds
          },
          {
            title: "Quick Contacts",
            description: "Select which social links appear in the floating quick-contact buttons.",
            key: "quickContactSocialIds" as const,
            selected: quickIds
          }
        ].map((group) => (
          <div key={group.key} className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{group.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{group.description}</p>
            {group.key === "quickContactSocialIds" ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {Math.min(group.selected.length, 5)} / 5 selected
              </p>
            ) : null}
            <div className="mt-5 grid gap-2">
              {links.map((link) => {
                const checked = group.selected.includes(link.id);
                const quickLimitReached = group.key === "quickContactSocialIds" && !checked && group.selected.length >= 5;

                return (
                  <label
                    key={`${group.key}-${link.id}`}
                    className={`flex items-center justify-between gap-4 rounded-md border border-black/10 px-3 py-3 text-sm dark:border-white/10 ${
                      quickLimitReached ? "opacity-50" : ""
                    }`}
                  >
                    <span>{link.platform}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelectedSocialId(group.key, link.id)}
                      className="h-4 w-4"
                    />
                  </label>
                );
              })}
              {links.length === 0 && <p className="text-sm text-muted">Add social links in Contact first.</p>}
            </div>
            {group.key === "quickContactSocialIds" && socialPlacementStatus ? (
              <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-200">
                {socialPlacementStatus}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  function renderServiceSocialPresenceSelector() {
    const links = socialLinks();
    const selected = selectedSocialIds("serviceSocialPresenceSocialIds");

    return (
      <div className="mt-5 rounded-lg border border-black/10 p-4 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Social Presence Links</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Select which accounts from the main Contact social list appear in the Services Social Presence block.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <label key={`service-social-${link.id}`} className="flex items-center justify-between gap-4 rounded-md border border-black/10 px-3 py-3 text-sm dark:border-white/10">
              <span>{link.platform}</span>
              <input
                type="checkbox"
                checked={selected.includes(link.id)}
                onChange={() => toggleSelectedSocialId("serviceSocialPresenceSocialIds", link.id)}
                className="h-4 w-4"
              />
            </label>
          ))}
          {links.length === 0 && <p className="text-sm text-muted">Add social links in Contact first.</p>}
        </div>
      </div>
    );
  }

  function renderBrandLinksEditor() {
    const brands = brandLinks();

    return (
      <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Footer Partners & Collaborations</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Add partner or collaborator logos shown in the footer. Each logo can link to that partner's website.
            </p>
          </div>
          <button
            type="button"
            onClick={addBrandLink}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
          >
            <Plus size={15} /> Add Partner
          </button>
        </div>

        <div className="grid gap-4">
          {brands.map((brand) => (
            <div key={brand.id} className="grid gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10 lg:grid-cols-[180px_1fr_auto] lg:items-start">
              <MediaPreview type="image" source={brand.logo} title={brand.name} />
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Partner name">
                    <TextInput value={brand.name} onChange={(event) => updateBrandLink(brand.id, "name", event.target.value)} />
                  </Field>
                  <Field label="Clickable link">
                    <TextInput value={brand.href} onChange={(event) => updateBrandLink(brand.id, "href", event.target.value)} />
                  </Field>
                </div>
                <Field label="Logo">
                  <TextInput value={brand.logo} onChange={(event) => updateBrandLink(brand.id, "logo", event.target.value)} />
                  {renderDropZone("Upload logo", (file) => uploadBrandLogo(brand.id, file), brand.logo)}
                </Field>
              </div>
              <button
                type="button"
                onClick={() => deleteBrandLink(brand.id)}
                className="h-11 rounded-md border border-red-500/30 px-4 text-xs uppercase tracking-[0.14em] text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
          {brands.length === 0 && (
            <p className="rounded-md bg-neutral-50 p-4 text-sm text-muted dark:bg-neutral-700/40">
              No footer partners added yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  function renderServiceTextItemsEditor({
    title,
    settingKey
  }: {
    title: string;
    settingKey: "serviceWorkflow" | "serviceWhyChoose";
  }) {
    const items = serviceTextItems(settingKey);

    return (
      <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{title}</p>
          <button
            type="button"
            onClick={() => addServiceTextItem(settingKey)}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
          >
            <Plus size={15} /> Add
          </button>
        </div>
        <div className="grid gap-3">
          {items.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10 md:grid-cols-[1fr_1fr_auto] md:items-start">
              <Field label={`${index + 1}. Title`}>
                <TextInput value={item.title} onChange={(event) => updateServiceTextItem(settingKey, item.id, "title", event.target.value)} />
              </Field>
              <Field label="Description">
                <TextArea value={item.body} onChange={(event) => updateServiceTextItem(settingKey, item.id, "body", event.target.value)} />
              </Field>
              <button
                type="button"
                onClick={() => deleteServiceTextItem(settingKey, item.id)}
                className="h-11 rounded-md border border-red-500/30 px-4 text-xs uppercase tracking-[0.14em] text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderServicePageSettingsEditor() {
    const platformLinks = serviceLinkItems();

    return (
      <div className="grid gap-6">
        <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Services Page Header</p>
          <div className="grid gap-5 md:grid-cols-2">
            {renderSettingsFields(["servicesIntroTitle", "servicesIntroBody"])}
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Section Visibility</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <ToggleField label="Show Workflow" checked={settingEnabled("serviceShowWorkflow")} onChange={(checked) => updateSettingEnabled("serviceShowWorkflow", checked)} />
            <ToggleField label="Show Why Choose Us" checked={settingEnabled("serviceShowWhyChoose")} onChange={(checked) => updateSettingEnabled("serviceShowWhyChoose", checked)} />
            <ToggleField label="Show Freelance Services" checked={settingEnabled("serviceShowFreelance")} onChange={(checked) => updateSettingEnabled("serviceShowFreelance", checked)} />
            <ToggleField label="Show Local Support" checked={settingEnabled("serviceShowLocalSupport")} onChange={(checked) => updateSettingEnabled("serviceShowLocalSupport", checked)} />
            <ToggleField label="Show Social Presence" checked={settingEnabled("serviceShowSocialPresence")} onChange={(checked) => updateSettingEnabled("serviceShowSocialPresence", checked)} />
            <ToggleField label="Show Team Culture" checked={settingEnabled("serviceShowTeamCulture")} onChange={(checked) => updateSettingEnabled("serviceShowTeamCulture", checked)} />
            <ToggleField label="Show Contact CTA" checked={settingEnabled("serviceShowCta")} onChange={(checked) => updateSettingEnabled("serviceShowCta", checked)} />
          </div>
        </div>

        {renderServiceTextItemsEditor({ title: "Workflow Steps", settingKey: "serviceWorkflow" })}
        {renderServiceTextItemsEditor({ title: "Why Choose Us", settingKey: "serviceWhyChoose" })}

        <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Global Freelance Services</p>
          <div className="grid gap-5 md:grid-cols-2">
            {renderSettingsFields(["serviceFreelanceTitle", "serviceFreelanceBody"])}
          </div>
          <div className="mt-5 grid gap-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addServiceLinkItem}
                className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-xs uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
              >
                <Plus size={15} /> Add Platform
              </button>
            </div>
            {platformLinks.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <Field label="Label">
                  <TextInput value={item.label} onChange={(event) => updateServiceLinkItem(item.id, "label", event.target.value)} />
                </Field>
                <Field label="Link">
                  <TextInput value={item.href} onChange={(event) => updateServiceLinkItem(item.id, "href", event.target.value)} />
                </Field>
                <button
                  type="button"
                  onClick={() => deleteServiceLinkItem(item.id)}
                  className="h-11 rounded-md border border-red-500/30 px-4 text-xs uppercase tracking-[0.14em] text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Support, Culture, and CTA</p>
          {renderSettingsFields([
            "serviceLocalSupportTitle",
            "serviceLocalSupportBody",
            "serviceSocialPresenceTitle",
            "serviceSocialPresenceBody",
            "serviceTeamCultureTitle",
            "serviceTeamCultureBody",
            "serviceCtaTitle",
            "serviceCtaPrimaryLabel",
            "serviceCtaSecondaryLabel"
          ])}
          {renderServiceSocialPresenceSelector()}
          <p className="mt-4 rounded-md bg-neutral-50 p-3 text-sm text-muted dark:bg-neutral-700/40">
            Start a Project and Contact Us buttons always open the internal /contact page in this codebase.
          </p>
        </div>
      </div>
    );
  }

  function renderPanel() {
    if (tab === "general") {
      return (
        <div className="grid gap-6">
          {renderSettingsFields(["companyName", "tagline", "logoUrl", "homeLogoText"])}
          {renderSocialPlacementEditor()}
          {renderBrandLinksEditor()}
        </div>
      );
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
                <PasswordInput
                  visible={visiblePasswords.current}
                  onToggle={() => setVisiblePasswords((current) => ({ ...current, current: !current.current }))}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Existing password"
                />
              </Field>
              <Field label="New password">
                <PasswordInput
                  visible={visiblePasswords.new}
                  onToggle={() => setVisiblePasswords((current) => ({ ...current, new: !current.new }))}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </Field>
              <Field label="Confirm password">
                <PasswordInput
                  visible={visiblePasswords.confirm}
                  onToggle={() => setVisiblePasswords((current) => ({ ...current, confirm: !current.confirm }))}
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

          {isProtectedOwnerSession && (
          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Manage Users</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Add, update, disable, or delete Firebase admin users. The protected owner account is hidden from this list.
                </p>
              </div>
              <button
                type="button"
                onClick={loadAdminUsers}
                className="h-11 rounded-md border border-black/10 px-4 text-xs uppercase tracking-[0.14em] dark:border-white/10"
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 grid gap-5 rounded-lg border border-black/10 p-4 dark:border-white/10 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <Field label="New admin email">
                <TextInput
                  type="email"
                  value={newAdminEmail}
                  onChange={(event) => setNewAdminEmail(event.target.value)}
                  placeholder="name@example.com"
                />
              </Field>
              <Field label="New admin password">
                <PasswordInput
                  visible={showNewAdminPassword}
                  onToggle={() => setShowNewAdminPassword((current) => !current)}
                  value={newAdminPassword}
                  onChange={(event) => setNewAdminPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </Field>
              <button
                type="button"
                onClick={addAdminUser}
                className="h-11 rounded-md bg-ink px-5 text-xs uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
              >
                Add Admin
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {adminUsers.map((user) => (
                <div key={user.uid} className="grid gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10 xl:grid-cols-[1fr_1fr_auto] xl:items-end">
                  <Field label="Email">
                    <TextInput
                      type="email"
                      value={userEmailDrafts[user.uid] ?? user.email}
                      disabled={user.protected}
                      onChange={(event) => setUserEmailDrafts((current) => ({ ...current, [user.uid]: event.target.value }))}
                    />
                  </Field>
                  <Field label="New password">
                    <PasswordInput
                      visible={Boolean(visibleUserPasswords[user.uid])}
                      onToggle={() => setVisibleUserPasswords((current) => ({ ...current, [user.uid]: !current[user.uid] }))}
                      value={userPasswordDrafts[user.uid] ?? ""}
                      onChange={(event) => setUserPasswordDrafts((current) => ({ ...current, [user.uid]: event.target.value }))}
                      placeholder="Leave blank to keep current"
                    />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    {user.protected && (
                      <span className="inline-flex h-11 items-center rounded-md border border-emerald-500/30 px-4 text-xs uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                        Protected
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => updateAdminUser(user)}
                      className="h-11 rounded-md bg-ink px-4 text-xs uppercase tracking-[0.14em] text-paper dark:bg-paper dark:text-ink"
                    >
                      Save User
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAdminUser(user, !user.disabled)}
                      disabled={user.protected}
                      className="h-11 rounded-md border border-black/10 px-4 text-xs uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"
                    >
                      {user.disabled ? "Enable" : "Disable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAdminUser(user)}
                      disabled={user.protected}
                      className="h-11 rounded-md border border-red-500/30 px-4 text-xs uppercase tracking-[0.14em] text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs text-muted xl:col-span-3">
                    UID: {user.uid}
                    {user.email === adminEmail ? " / Current session" : ""}
                    {user.disabled ? " / Disabled" : ""}
                    {user.lastSignInAt ? ` / Last login: ${user.lastSignInAt}` : ""}
                  </p>
                </div>
              ))}
              {adminUsers.length === 0 && (
                <p className="rounded-md bg-neutral-50 p-4 text-sm text-muted dark:bg-neutral-700/40">
                  {usersLoaded ? "No admin users found." : "Click refresh after Firebase Admin service credentials are configured."}
                </p>
              )}
            </div>
            {userStatus && <p className="mt-3 text-sm text-muted">{userStatus}</p>}
          </div>
          )}

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
          {renderSettingsFields(["homeHeadline", "homeTagline", "statYears", "statProjects", "statCountries"])}
          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Home hero media</p>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Media type">
                <SelectInput value={content.settings.homeMediaType || "none"} onChange={(event) => updateSettings("homeMediaType", event.target.value)}>
                  <option value="none">Plain background</option>
                  <option value="video">YouTube video</option>
                  <option value="image">Image</option>
                </SelectInput>
              </Field>
              <Field label="YouTube video URL">
                <TextInput value={content.settings.homeVideoUrl} onChange={(event) => updateSettings("homeVideoUrl", event.target.value)} placeholder="Optional YouTube link" />
              </Field>
              <Field label="Hero image URL / upload">
                <TextInput value={content.settings.homeImageUrl} onChange={(event) => updateSettings("homeImageUrl", event.target.value)} placeholder="Optional image URL" />
                {renderDropZone("Upload hero image", (file) => uploadToSettings("homeImageUrl", file), content.settings.homeImageUrl)}
              </Field>
            </div>
          </div>
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
      return (
        <div className="grid gap-6">
          {renderSettingsFields([
            "aboutStudioTitle",
            "aboutStudioProfile",
            "aboutMissionTitle",
            "aboutMission",
            "aboutVisionTitle",
            "aboutVision",
            "aboutHeroImage"
          ])}
          {renderAboutMessagesEditor()}
        </div>
      );
    }

    if (tab === "contact") {
      const offices = officeEntries();

      return (
        <div className="grid gap-6">
          {renderSettingsFields(["email", "phone", "address"])}
          {renderSocialLinksEditor()}
          <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#4a4a4a]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Offices and Maps</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Add each office separately to keep its address and map link matched correctly.
                </p>
              </div>
              <button
                type="button"
                onClick={addOfficeEntry}
                className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.14em] transition hover:bg-ink hover:text-paper dark:border-white/10 dark:hover:bg-paper dark:hover:text-ink"
              >
                <Plus size={15} /> Add Address
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              {offices.map((office, index) => (
                <div key={index} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Office {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeOfficeEntry(index)}
                      className="inline-flex items-center gap-2 rounded-md border border-red-500/30 px-3 py-2 text-xs uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Address">
                      <TextArea
                        value={office.address}
                        onChange={(event) => updateOfficeEntry(index, "address", event.target.value)}
                        placeholder="Office address"
                      />
                    </Field>
                    <Field label="Map location link">
                      <TextArea
                        value={office.map}
                        onChange={(event) => updateOfficeEntry(index, "map", event.target.value)}
                        placeholder="Google Maps share or embed link"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (tab === "services") {
      return (
        <div className="grid gap-8">
          {renderCollection("services")}
          <div className="grid gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Services Page Extra Sections</p>
              <h2 className="mt-2 font-serif text-3xl">Page content below service cards</h2>
            </div>
            {renderServicePageSettingsEditor()}
          </div>
        </div>
      );
    }

    return renderCollection(tab);
  }

  function renderCollection(key: CollectionKey) {
    const normalizedQuery = collectionQuery.trim().toLowerCase();
    const visibleItems = normalizedQuery
      ? content[key].filter((item) => itemSearchText(item).includes(normalizedQuery))
      : content[key];

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
    const subsectionOptions = projectSubsections()[section] ?? [];

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
          <Field label="Client">
            <TextInput value={project.client} onChange={(event) => updateItem("projects", project.id, "client", event.target.value)} placeholder="Client or organization name" />
          </Field>
          <Field label="Project status">
            <TextInput value={project.status} onChange={(event) => updateItem("projects", project.id, "status", event.target.value)} placeholder="Concept, Completed, Under construction..." />
          </Field>
          <Field label="Map location">
            <TextInput
              value={project.mapLocation}
              onChange={(event) => updateItem("projects", project.id, "mapLocation", event.target.value)}
              placeholder="Paste Google Maps share link or embed URL"
            />
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
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenSubsectionMenuId((current) => (current === project.id ? "" : project.id))}
                  className="flex h-11 w-full items-center justify-between rounded-md border border-black/10 bg-white px-3 text-left text-sm normal-case tracking-normal text-ink outline-none transition focus:border-ink dark:border-white/10 dark:bg-[#4a4a4a] dark:text-paper"
                >
                  <span>{project.subsection || "All / Not specified"}</span>
                  <ChevronUp
                    size={16}
                    className={`transition ${openSubsectionMenuId === project.id ? "rotate-0" : "rotate-180"}`}
                  />
                </button>
                {openSubsectionMenuId === project.id && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-md border border-black/10 bg-white py-1 shadow-soft dark:border-white/10 dark:bg-[#3f3f3f]">
                    <button
                      type="button"
                      onClick={() => {
                        updateItem("projects", project.id, "subsection", "");
                        setOpenSubsectionMenuId("");
                      }}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm normal-case tracking-normal transition hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                    >
                      <span>All / Not specified</span>
                    </button>
                    {subsectionOptions.map((item) => (
                      <div
                        key={item}
                        className="group grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            updateItem("projects", project.id, "subsection", item);
                            setOpenSubsectionMenuId("");
                          }}
                          className="text-left text-sm normal-case tracking-normal"
                        >
                          {item}
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeProjectSubsection(section, item);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                          aria-label={`Remove ${item} subsection`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setOpenSubsectionMenuId("")}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm normal-case tracking-normal transition hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
                    >
                      <span>Custom...</span>
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  addProjectSubsection(section, customSubsection, project.id);
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
              <button onClick={() => addProjectMedia(project.id, "caption")} className="rounded-md border border-black/10 px-3 py-2 text-xs uppercase tracking-[0.14em] dark:border-white/10">Add caption</button>
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
                    <MediaPreview type={media.type} source={media.source} caption={media.caption} title={`${project.title} media ${index + 1}`} />
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
                        <option value="caption">Caption</option>
                      </SelectInput>
                    </Field>
                    {media.type === "caption" ? (
                      <>
                        <Field label="Caption title">
                          <TextInput value={media.source} onChange={(event) => updateProjectMedia(project.id, media.id, "source", event.target.value)} />
                        </Field>
                        <Field label="Caption paragraph">
                          <TextArea value={media.caption} onChange={(event) => updateProjectMedia(project.id, media.id, "caption", event.target.value)} />
                        </Field>
                      </>
                    ) : (
                      <>
                        <Field label={media.type === "image" ? "Image URL / Upload" : "YouTube link"}>
                          <TextInput value={media.source} onChange={(event) => updateProjectMedia(project.id, media.id, "source", event.target.value)} />
                          {media.type === "image" && renderDropZone("Upload image", (file) => uploadProjectMedia(project.id, media.id, file), media.source)}
                        </Field>
                        <Field label="Optional internal note">
                          <TextArea
                            value={media.caption}
                            onChange={(event) => updateProjectMedia(project.id, media.id, "caption", event.target.value)}
                            placeholder="Optional note for admin reference. Add a Caption tile when this should appear in the public slider."
                          />
                        </Field>
                      </>
                    )}
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
    const selectedTags = service.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const availableTags = serviceCategories.filter((tag) => !selectedTags.includes(tag));
    const saveTags = (tags: string[]) => updateItem("services", service.id, "tags", tags.join(", "));

    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Service title"><TextInput value={service.title} onChange={(event) => updateItem("services", service.id, "title", event.target.value)} /></Field>
          <Field label="Category / tags">
            <SelectInput
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  saveTags([...selectedTags, event.target.value]);
                }
              }}
            >
              <option value="">Select tag to add</option>
              {availableTags.map((item) => <option key={item}>{item}</option>)}
            </SelectInput>
            <div className="flex min-h-11 flex-wrap gap-2 rounded-md border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#4a4a4a]">
              {selectedTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs normal-case tracking-normal dark:border-white/10">
                  {tag}
                  <button
                    type="button"
                    onClick={() => saveTags(selectedTags.filter((item) => item !== tag))}
                    className="text-muted transition hover:text-red-600"
                    aria-label={`Remove ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedTags.length === 0 && <span className="px-1 py-1 text-sm normal-case tracking-normal text-muted">No tags selected</span>}
            </div>
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
    const categoryOptions = newsCategories();
    const galleryImages = item.gallery
      .split(/\n+/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="News title"><TextInput value={item.title} onChange={(event) => updateItem("news", item.id, "title", event.target.value)} /></Field>
          <Field label="Category">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <SelectInput value={categoryOptions.includes(item.category) ? item.category : "custom"} onChange={(event) => updateItem("news", item.id, "category", event.target.value)}>
                {categoryOptions.map((category) => <option key={category}>{category}</option>)}
                <option value="custom">Custom...</option>
              </SelectInput>
              <button
                type="button"
                onClick={() => addNewsCategory(item.id)}
                className="rounded-md border border-black/10 px-3 dark:border-white/10"
                aria-label="Add custom news category"
              >
                <Plus size={16} />
              </button>
            </div>
            <TextInput placeholder="Custom category" value={customNewsCategory} onChange={(event) => setCustomNewsCategory(event.target.value)} />
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <span key={category} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs normal-case tracking-normal dark:border-white/10">
                  {category}
                  <button
                    type="button"
                    onClick={() => removeNewsCategory(category)}
                    className="text-muted transition hover:text-red-600"
                    aria-label={`Remove ${category} category`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            {!categoryOptions.includes(item.category) && (
              <TextInput value={item.category} onChange={(event) => updateItem("news", item.id, "category", event.target.value)} />
            )}
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
    const categoryOptions = peopleRoles();

    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name"><TextInput value={person.name} onChange={(event) => updateItem("people", person.id, "name", event.target.value)} /></Field>
          <Field label="Category">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <SelectInput value={categoryOptions.includes(person.category) ? person.category : "custom"} onChange={(event) => updateItem("people", person.id, "category", event.target.value)}>
                {categoryOptions.map((role) => <option key={role}>{role}</option>)}
                <option value="custom">Custom...</option>
              </SelectInput>
              <button
                type="button"
                onClick={() => addPeopleRole(person.id)}
                className="rounded-md border border-black/10 px-3 dark:border-white/10"
                aria-label="Add custom people role"
              >
                <Plus size={16} />
              </button>
            </div>
            <TextInput placeholder="Custom category" value={customPeopleRole} onChange={(event) => setCustomPeopleRole(event.target.value)} />
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((role) => (
                <span key={role} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs normal-case tracking-normal dark:border-white/10">
                  {role}
                  <button
                    type="button"
                    onClick={() => removePeopleRole(role)}
                    className="text-muted transition hover:text-red-600"
                    aria-label={`Remove ${role} category`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            {!categoryOptions.includes(person.category) && (
              <TextInput value={person.category} onChange={(event) => updateItem("people", person.id, "category", event.target.value)} />
            )}
          </Field>
        </div>
        <Field label="Role">
          <TextInput
            value={person.role}
            placeholder="Founding Partner, Architect, Project Manager..."
            onChange={(event) => updateItem("people", person.id, "role", event.target.value)}
          />
        </Field>
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
      {(busy || loadingContent || logoutBusy) && (
        <div className="fixed inset-0 z-[160] grid place-items-center bg-white/65 backdrop-blur-[2px] dark:bg-[#3f3f3f]/65">
          <div className="flex flex-col items-center gap-5">
            <div className="route-square-loader" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink dark:text-paper">
              {logoutBusy ? "Logging out" : busy ? "Saving" : "Loading"}
            </p>
          </div>
        </div>
      )}
      {deletePrompt && (
        <div className="fixed inset-0 z-[170] grid place-items-center bg-black/45 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-lg border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#4a4a4a]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Confirm delete</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight">Are you sure?</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Do you want to delete <span className="font-semibold text-ink dark:text-paper">{deletePrompt.title}</span> from {deletePrompt.key}? This will remove it from Sanity after confirmation.
            </p>
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletePrompt(null)}
                disabled={busy}
                className="rounded-md border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.14em] transition hover:bg-neutral-100 disabled:opacity-50 dark:border-white/10 dark:hover:bg-neutral-700/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                disabled={busy}
                className="rounded-md bg-red-600 px-4 py-3 text-xs uppercase tracking-[0.14em] text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {busy ? "Deleting" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 border-r border-black/10 bg-white transition-transform dark:border-white/10 dark:bg-[#4a4a4a] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
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

      <div className={`transition-[padding] duration-300 ${sidebarCollapsed ? "lg:pl-0" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-4 border-b border-black/10 bg-white px-5 dark:border-white/10 dark:bg-[#4a4a4a]">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="rounded-md border border-black/10 p-2 transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-700/50" aria-label="Toggle admin menu">
              <Menu size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Admin Panel</p>
              <h1 className="font-serif text-2xl capitalize">{tab}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-700/50"
              aria-label="Toggle admin theme"
              title="Toggle light / dark"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
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
            <span className="mr-3 inline-flex rounded-full border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink dark:border-white/10 dark:text-paper">
              {isProtectedOwnerSession ? "Super Admin" : "Admin"}
            </span>
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
