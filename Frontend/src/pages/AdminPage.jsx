import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { YatreoMark } from "../components/layout/Logo";
import * as adminApi from "../services/adminApi";
import * as destinationsApi from "../services/destinationsApi";
import { demoDb, resetDemoDb } from "../services/demoDb";

// Curated high-res Unsplash travel photos for one-click assignment
const CURATED_PHOTO_PRESETS = [
  {
    title: "Kerala Backwaters",
    tag: "Houseboat & Palms",
    url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Bali Tropical",
    tag: "Rice Terraces & Mist",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Kashmir Dal Lake",
    tag: "Shikara & Snow Peaks",
    url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Goa Beachfront",
    tag: "Sunset Palms & Shore",
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Rajasthan Heritage",
    tag: "Amber Fort & Royalty",
    url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Ladakh High Passes",
    tag: "Pangong Lake & Rugged",
    url: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Thailand Island",
    tag: "Emerald Bay & Cliffs",
    url: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Vietnam Ha Long",
    tag: "Limestone Karsts & Boats",
    url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Sri Lanka Tea Hills",
    tag: "Nine Arch Bridge",
    url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Andaman Radhanagar",
    tag: "Turquoise Cove & Sands",
    url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Himachal Pine Forests",
    tag: "Snowy Ridge & Valley",
    url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Varanasi River Ghats",
    tag: "Morning Aarti & Boats",
    url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=85",
  },
];

const MOOD_PRESETS = [
  "Slow mornings",
  "Big adventures",
  "Coastal escapes",
  "Mountain hideaways",
  "Heritage walks",
  "Party & Nightlife",
  "Romantic escapes",
  "Island paradise",
  "Wildlife & Safaris",
];

const REGIONS = ["All", "North", "South", "West", "East", "Islands", "International"];

export function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // Filters & Display
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'published', 'draft', 'featured'
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'media' | 'timeline' | 'pricing'
  const [editingDest, setEditingDest] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCountry, setFormCountry] = useState("India");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formRegion, setFormRegion] = useState("North");
  const [formLabel, setFormLabel] = useState("Slow mornings");
  const [formPrice, setFormPrice] = useState("19500");
  const [formDuration, setFormDuration] = useState("6");
  const [formSeason, setFormSeason] = useState("October – March");
  const [formDesc, setFormDesc] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formGallery, setFormGallery] = useState([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formHighlights, setFormHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [formTimeline, setFormTimeline] = useState([
    { day: 1, title: "Arrival & Sunset Welcome", vibe: "Chilled check-in, beach sunset walk" },
    { day: 2, title: "Local Trails & Hidden Cafes", vibe: "Scattered morning coffee, heritage lanes" },
    { day: 3, title: "Scenic Viewpoint & Stargazing", vibe: "Golden hour drive, private dinner" },
  ]);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [destRes, analRes] = await Promise.allSettled([
        adminApi.getAdminDestinations({ search: "", pageSize: 100 }),
        adminApi.getAdminAnalytics(),
      ]);

      if (destRes.status === "fulfilled" && destRes.value?.items) {
        setDestinations(destRes.value.items);
      } else {
        const pub = await destinationsApi.getDestinations({ pageSize: 100 });
        if (pub?.items) setDestinations(pub.items);
      }

      if (analRes.status === "fulfilled" && analRes.value) {
        setAnalytics(analRes.value);
      }
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Open Add Modal
  function openCreateModal() {
    setEditingDest(null);
    setActiveTab("general");
    setFormTitle("");
    setFormSlug("");
    setFormCountry("India");
    setFormCity("");
    setFormState("");
    setFormRegion("North");
    setFormLabel("Slow mornings");
    setFormPrice("19500");
    setFormDuration("6");
    setFormSeason("October – March");
    setFormDesc("Discover serenity, boutique stays, and thoughtfully planned journeys with private transit.");
    setFormHighlights(["Boutique heritage stay", "Dedicated local chauffeur", "Scenic viewpoints"]);
    setHighlightInput("");
    setFormImageUrl("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85");
    setFormGallery([]);
    setFormPublished(true);
    setFormFeatured(false);
    setFormTimeline([
      { day: 1, title: "Touchdown & Scenic Transfer", vibe: "Airport pick up, boutique check-in" },
      { day: 2, title: "Secret Trails & Local Flavours", vibe: "Morning tea estate walk, artisanal lunch" },
      { day: 3, title: "Sunset Leisure & Stargazing", vibe: "Golden hour viewpoint, bonfire dinner" },
    ]);
    setIsModalOpen(true);
  }

  // Open Edit Modal
  function openEditModal(dest) {
    setEditingDest(dest);
    setActiveTab("general");
    setFormTitle(dest.title || dest.name || "");
    setFormSlug(dest.slug || "");
    setFormCountry(dest.country || "India");
    setFormCity(dest.city || "");
    setFormState(dest.state || "");
    setFormRegion(dest.region || "North");
    setFormLabel(dest.label || "Slow mornings");
    setFormPrice(dest.price ? String(dest.price).replace(/[^0-9]/g, "") : "19500");
    setFormDuration(String(dest.duration_days || dest.durationDays || 6));
    setFormSeason(dest.season || "October – March");
    setFormDesc(dest.description || "");

    const hl = Array.isArray(dest.highlights)
      ? dest.highlights
      : typeof dest.highlights === "string"
      ? dest.highlights.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    setFormHighlights(hl.length > 0 ? hl : ["Boutique stay", "Private cab"]);
    setHighlightInput("");

    setFormImageUrl(
      dest.image || dest.image_url || dest.media?.[0]?.url || "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85"
    );
    setFormGallery(Array.isArray(dest.gallery) ? dest.gallery : []);
    setFormPublished(dest.is_published !== false);
    setFormFeatured(Boolean(dest.featured));

    if (Array.isArray(dest.timeline) && dest.timeline.length > 0) {
      setFormTimeline(dest.timeline);
    } else {
      setFormTimeline([
        { day: 1, title: "Touchdown & Easy Check-in", vibe: "Private cab transfer, sunset drinks" },
        { day: 2, title: "Local Wonder & Hidden Spots", vibe: "Guided walk, scenic lunch" },
        { day: 3, title: "Leisure Morning & Departure", vibe: "Slow brunch, souvenirs, airport drop" },
      ]);
    }
    setIsModalOpen(true);
  }

  // Quick duplicate destination
  function handleDuplicate(dest) {
    const copyTitle = `${dest.title || dest.name} (Copy)`;
    const copySlug = `${dest.slug}-copy-${Date.now().toString().slice(-4)}`;
    const copyPayload = {
      ...dest,
      id: undefined,
      title: copyTitle,
      name: dest.name ? `${dest.name} (Copy)` : copyTitle,
      slug: copySlug,
      is_published: false, // Start as draft
      created_at: new Date().toISOString(),
    };

    demoDb.createDestination(copyPayload);
    showToast(`Created draft duplicate "${copyTitle}"!`);
    loadData();
  }

  // Direct toggle published state from table / card
  async function handleTogglePublish(dest, e) {
    e?.stopPropagation();
    const newStatus = dest.is_published === false;
    try {
      await adminApi.updateAdminDestination(dest.id, { is_published: newStatus });
      setDestinations((prev) =>
        prev.map((d) => (d.id === dest.id ? { ...d, is_published: newStatus } : d))
      );
      showToast(`${dest.name || dest.title} is now ${newStatus ? "Published" : "Draft"}`);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  }

  // Direct toggle featured state
  async function handleToggleFeatured(dest, e) {
    e?.stopPropagation();
    const newFeatured = !dest.featured;
    try {
      await adminApi.updateAdminDestination(dest.id, { featured: newFeatured });
      setDestinations((prev) =>
        prev.map((d) => (d.id === dest.id ? { ...d, featured: newFeatured } : d))
      );
      showToast(`${dest.name || dest.title} ${newFeatured ? "marked as Featured" : "removed from Featured"}`);
    } catch (err) {
      alert("Failed to toggle featured: " + err.message);
    }
  }

  // Delete Destination
  async function handleDelete(id, name, e) {
    e?.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${name}" from the database?`)) return;
    try {
      await adminApi.deleteAdminDestination(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      showToast(`Deleted "${name}" successfully.`);
    } catch (err) {
      alert("Failed to delete destination: " + err.message);
    }
  }

  // Save Modal Form
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formTitle.trim(),
      name: formTitle.trim(),
      slug: (formSlug.trim() || formTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, ""),
      country: formCountry,
      city: formCity.trim(),
      state: formState.trim(),
      region: formRegion,
      label: formLabel,
      price: parseInt(String(formPrice).replace(/[^0-9]/g, ""), 10) || 19500,
      duration_days: parseInt(String(formDuration).replace(/[^0-9]/g, ""), 10) || 6,
      duration: `${formDuration} days`,
      season: formSeason.trim(),
      description: formDesc.trim(),
      highlights: formHighlights,
      image: formImageUrl.trim(),
      image_url: formImageUrl.trim(),
      gallery: formGallery,
      timeline: formTimeline,
      is_published: formPublished,
      featured: formFeatured,
    };

    try {
      if (editingDest) {
        await adminApi.updateAdminDestination(editingDest.id, payload);
        showToast(`Updated "${payload.title}" successfully!`);
      } else {
        await adminApi.createAdminDestination(payload);
        showToast(`Created new destination "${payload.title}"!`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert("Failed to save destination: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // Highlights handlers
  function addHighlight() {
    const trimmed = highlightInput.trim();
    if (trimmed && !formHighlights.includes(trimmed)) {
      setFormHighlights([...formHighlights, trimmed]);
      setHighlightInput("");
    }
  }

  function removeHighlight(index) {
    setFormHighlights(formHighlights.filter((_, i) => i !== index));
  }

  // Timeline handlers
  function addTimelineDay() {
    const nextDay = formTimeline.length + 1;
    setFormTimeline([
      ...formTimeline,
      { day: nextDay, title: `Day ${nextDay} Exploration`, vibe: "Local sights & signature memories" },
    ]);
  }

  function updateTimelineDay(index, field, value) {
    const next = [...formTimeline];
    next[index] = { ...next[index], [field]: value };
    setFormTimeline(next);
  }

  function removeTimelineDay(index) {
    setFormTimeline(formTimeline.filter((_, i) => i !== index));
  }

  // Gallery handlers
  function addGalleryImage() {
    if (newGalleryUrl.trim()) {
      setFormGallery([...formGallery, newGalleryUrl.trim()]);
      setNewGalleryUrl("");
    }
  }

  function removeGalleryImage(index) {
    setFormGallery(formGallery.filter((_, i) => i !== index));
  }

  // Filtered destinations list
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Search
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        (dest.title || dest.name || "").toLowerCase().includes(q) ||
        (dest.state || "").toLowerCase().includes(q) ||
        (dest.city || "").toLowerCase().includes(q) ||
        (dest.region || "").toLowerCase().includes(q) ||
        (dest.country || "").toLowerCase().includes(q);

      // Status
      let matchesStatus = true;
      if (statusFilter === "published") matchesStatus = dest.is_published !== false;
      if (statusFilter === "draft") matchesStatus = dest.is_published === false;
      if (statusFilter === "featured") matchesStatus = Boolean(dest.featured);

      // Region
      let matchesRegion = true;
      if (selectedRegion !== "All") matchesRegion = (dest.region || "North").toLowerCase() === selectedRegion.toLowerCase();

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [destinations, search, statusFilter, selectedRegion]);

  // Counts
  const counts = useMemo(() => {
    const published = destinations.filter((d) => d.is_published !== false).length;
    const drafts = destinations.length - published;
    const featured = destinations.filter((d) => Boolean(d.featured)).length;
    return { all: destinations.length, published, drafts, featured };
  }, [destinations]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Shield className="animate-pulse text-warm" size={32} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <div className="rounded-3xl border border-sand bg-white p-8 shadow-[0_16px_40px_rgba(15,92,94,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warm/20 text-warm-dark">
            <Shield size={28} />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">Yatreo Admin Console</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            You are currently browsing without an active admin session. Click below to enter the console using the local Demo Database engine.
          </p>
          <button
            className="button-gold mt-6 w-full justify-center py-3 text-xs font-bold shadow-sm"
            onClick={() => {
              const demoUser = demoDb.getDemoAdminUser();
              localStorage.setItem("yatrio_token", "demo-token-admin");
              localStorage.setItem("yatrio_user", JSON.stringify(demoUser));
              window.location.reload();
            }}
            type="button"
          >
            ⚡ Enter Demo Admin Console (Instant Test)
          </button>
          <Link className="mt-4 inline-block text-xs text-teal hover:underline" to="/">
            ← Back to Public Site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream/35 pb-12 sm:pb-14">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-teal/20 bg-ink px-4 py-3 text-xs font-semibold text-cream shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner / Sync Indicator */}
      <div className="border-b border-sand/70 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal text-cream shadow-xs">
              <YatreoMark size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-ink">Yatreo Studio</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Demo DB Connected
                </span>
              </div>
              <p className="text-[11px] text-muted hidden sm:block">
                All changes persist to local database (`db.ts` / `localStorage`)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3.5 py-1.5 font-medium text-ink transition hover:bg-sand/40"
              target="_blank"
              to="/"
            >
              <ExternalLink size={13} /> View Site
            </Link>
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3 py-1.5 font-medium text-muted transition hover:bg-sand/40 hover:text-ink"
              onClick={() => {
                if (window.confirm("Reset demo database back to default seed destinations?")) {
                  resetDemoDb();
                  loadData();
                  showToast("Demo database reset to factory presets!");
                }
              }}
              title="Reset Database to original 12 destinations"
              type="button"
            >
              <RefreshCw size={12} /> Reset DB
            </button>
            <button
              className="button-gold inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-semibold shadow-xs"
              onClick={openCreateModal}
              type="button"
            >
              <Plus size={15} /> Add Destination
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-5 pt-8 sm:px-8">
        {/* Executive Overview Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Link className="hover:text-teal" to="/dashboard">Dashboard</Link>
              <span>/</span>
              <span className="text-ink font-medium">Destination Catalog & Inventory</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
              Destination & Package Manager
            </h1>
            <p className="mt-1 text-xs text-muted">
              Live configuration for itineraries, media galleries, pricing tiers, and holiday publication state.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex rounded-xl border border-sand bg-white p-1 shadow-2xs">
              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "table" ? "bg-teal text-cream shadow-xs" : "text-muted hover:text-ink"
                }`}
                onClick={() => setViewMode("table")}
                type="button"
              >
                <List size={14} /> Table
              </button>
              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "cards" ? "bg-teal text-cream shadow-xs" : "text-muted hover:text-ink"
                }`}
                onClick={() => setViewMode("cards")}
                type="button"
              >
                <LayoutGrid size={14} /> Visual Cards
              </button>
            </div>
          </div>
        </div>

        {/* Analytics KPI Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-sand/80 bg-white p-4 shadow-2xs transition hover:shadow-sm">
            <div className="flex items-center justify-between text-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">Catalog Inventory</span>
              <Globe className="text-teal" size={17} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">{counts.all}</span>
              <span className="text-[11px] text-muted">total</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {counts.published} Live
              </span>
              <span className="text-muted">·</span>
              <span className="font-medium text-amber-700">{counts.drafts} Drafts</span>
            </div>
          </div>

          <div className="rounded-2xl border border-sand/80 bg-white p-4 shadow-2xs transition hover:shadow-sm">
            <div className="flex items-center justify-between text-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">Featured Yatras</span>
              <Star className="text-gold fill-gold" size={17} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">{counts.featured}</span>
              <span className="text-[11px] text-muted">pinned</span>
            </div>
            <p className="mt-2 text-[11px] text-muted">Hero carousel highlights</p>
          </div>

          <div className="rounded-2xl border border-sand/80 bg-white p-4 shadow-2xs transition hover:shadow-sm">
            <div className="flex items-center justify-between text-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp Inquiries</span>
              <Users className="text-warm" size={17} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {analytics?.total_inquiries ?? (148 + destinations.length * 4)}
              </span>
              <span className="text-[11px] font-medium text-emerald-600">+12% this wk</span>
            </div>
            <p className="mt-2 text-[11px] text-muted">1-on-1 human planner chats</p>
          </div>

          <div className="rounded-2xl border border-sand/80 bg-white p-4 shadow-2xs transition hover:shadow-sm">
            <div className="flex items-center justify-between text-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">Avg Package Value</span>
              <DollarSign className="text-emerald-600" size={17} />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink sm:text-3xl">₹24,800</span>
              <span className="text-[11px] text-muted">/ person</span>
            </div>
            <p className="mt-2 text-[11px] text-muted">100% tailor-made quote tier</p>
          </div>
        </div>

        {/* Filter & Toolbar Area */}
        <div className="mt-8 rounded-2xl border border-sand/80 bg-white p-4 shadow-2xs">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
              <input
                className="w-full rounded-xl border border-sand bg-cream/30 py-2 pl-9 pr-4 text-xs text-ink outline-none transition focus:border-teal focus:bg-white"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by destination name, state, region, or city..."
                type="search"
                value={search}
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  onClick={() => setSearch("")}
                  type="button"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === "all"
                    ? "bg-teal text-cream"
                    : "bg-sand/30 text-ink hover:bg-sand/60"
                }`}
                onClick={() => setStatusFilter("all")}
                type="button"
              >
                All ({counts.all})
              </button>
              <button
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === "published"
                    ? "bg-emerald-700 text-white"
                    : "bg-sand/30 text-ink hover:bg-sand/60"
                }`}
                onClick={() => setStatusFilter("published")}
                type="button"
              >
                Published ({counts.published})
              </button>
              <button
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === "draft"
                    ? "bg-amber-600 text-white"
                    : "bg-sand/30 text-ink hover:bg-sand/60"
                }`}
                onClick={() => setStatusFilter("draft")}
                type="button"
              >
                Drafts ({counts.drafts})
              </button>
              <button
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === "featured"
                    ? "bg-gold text-deep font-bold"
                    : "bg-sand/30 text-ink hover:bg-sand/60"
                }`}
                onClick={() => setStatusFilter("featured")}
                type="button"
              >
                ⭐ Featured ({counts.featured})
              </button>
            </div>
          </div>

          {/* Region Sub-Filter Pills */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-sand/50 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted mr-1">Region:</span>
            {REGIONS.map((reg) => (
              <button
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                  selectedRegion === reg
                    ? "bg-ink text-cream"
                    : "text-muted hover:bg-sand/30 hover:text-ink"
                }`}
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                type="button"
              >
                {reg}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-muted">
              Showing {filteredDestinations.length} of {destinations.length} records
            </span>
          </div>
        </div>

        {/* Content Listing (Table or Grid Cards) */}
        {loading ? (
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-sand bg-white">
            <RefreshCw className="animate-spin text-teal" size={24} />
            <p className="mt-3 text-xs font-medium text-muted">Loading destination records...</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-sand bg-white p-8 text-center">
            <Compass className="text-sand-dark" size={36} />
            <h3 className="mt-3 font-display text-base font-semibold text-ink">No destinations match filters</h3>
            <p className="mt-1 text-xs text-muted">Try adjusting your search query, region filter, or publication status.</p>
            <button
              className="mt-4 rounded-full border border-sand px-4 py-1.5 text-xs font-semibold text-ink hover:bg-sand/30"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setSelectedRegion("All");
              }}
              type="button"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="mt-6 overflow-hidden rounded-2xl border border-sand/80 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-sand bg-sand/20 font-bold uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-3.5">Destination & Media</th>
                    <th className="px-4 py-3.5">Region & Vibe</th>
                    <th className="px-4 py-3.5">Pricing & Nights</th>
                    <th className="px-4 py-3.5">Highlights</th>
                    <th className="px-4 py-3.5">Status & Feat</th>
                    <th className="px-5 py-3.5 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/40">
                  {filteredDestinations.map((dest) => {
                    const isPub = dest.is_published !== false;
                    const isFeat = Boolean(dest.featured);
                    const heroImg = dest.image || dest.image_url || dest.media?.[0]?.url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80";

                    return (
                      <tr
                        className="group transition hover:bg-sand/15"
                        key={dest.id || dest.slug}
                      >
                        {/* Destination Thumbnail + Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-xl border border-sand/60 bg-sand/30 shadow-2xs">
                              <img
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=200&q=80";
                                }}
                                src={heroImg}
                              />
                              {isFeat && (
                                <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold shadow-xs">
                                  <Star className="fill-deep text-deep" size={9} />
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-ink group-hover:text-teal transition">
                                  {dest.title || dest.name}
                                </span>
                              </div>
                              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                                <MapPin size={11} />
                                <span>{dest.state ? `${dest.state}, ` : ""}{dest.country || "India"}</span>
                                <span className="text-sand-dark">·</span>
                                <code className="text-[10px] text-muted">/{dest.slug}</code>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Region & Vibe Label */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1">
                            <span className="inline-block w-fit rounded-md bg-sand/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal">
                              {dest.region || "North"}
                            </span>
                            {dest.label && (
                              <span className="text-[11px] font-medium text-ink/80 italic">
                                "{dest.label}"
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Price & Duration */}
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-ink">
                            ₹{Number(String(dest.price || "19500").replace(/[^0-9]/g, "")).toLocaleString("en-IN")}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted">
                            <Clock size={11} />
                            <span>{dest.duration || `${dest.duration_days || 6} days`}</span>
                          </div>
                        </td>

                        {/* Highlights pills */}
                        <td className="px-4 py-3.5">
                          <div className="flex max-w-[220px] flex-wrap gap-1">
                            {Array.isArray(dest.highlights) && dest.highlights.slice(0, 2).map((h, i) => (
                              <span
                                className="truncate rounded-md bg-cream border border-sand px-1.5 py-0.5 text-[10px] font-medium text-ink"
                                key={i}
                              >
                                {h}
                              </span>
                            ))}
                            {Array.isArray(dest.highlights) && dest.highlights.length > 2 && (
                              <span className="text-[10px] text-muted">
                                +{dest.highlights.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 1-Click Status Toggles */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1.5">
                            {/* Published / Draft Pill Button */}
                            <button
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition shadow-2xs ${
                                isPub
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              }`}
                              onClick={(e) => handleTogglePublish(dest, e)}
                              title="Click to toggle between Published and Draft"
                              type="button"
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${isPub ? "bg-emerald-600" : "bg-amber-500"}`} />
                              {isPub ? "Live" : "Draft"}
                            </button>

                            {/* Featured toggle */}
                            <button
                              className={`inline-flex w-fit items-center gap-1 text-[10px] font-medium transition ${
                                isFeat ? "text-gold font-bold" : "text-muted hover:text-ink"
                              }`}
                              onClick={(e) => handleToggleFeatured(dest, e)}
                              type="button"
                            >
                              <Star className={isFeat ? "fill-gold text-gold" : "text-muted"} size={11} />
                              {isFeat ? "Featured" : "Standard"}
                            </button>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              className="rounded-lg p-2 text-muted transition hover:bg-sand/40 hover:text-teal"
                              target="_blank"
                              title="Preview on live site"
                              to={`/destinations/${dest.slug}`}
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <button
                              className="rounded-lg p-2 text-muted transition hover:bg-sand/40 hover:text-ink"
                              onClick={() => handleDuplicate(dest)}
                              title="Duplicate Destination"
                              type="button"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              className="rounded-lg bg-teal/10 p-2 font-medium text-teal transition hover:bg-teal hover:text-white"
                              onClick={() => openEditModal(dest)}
                              title="Edit destination details & imagery"
                              type="button"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                              onClick={(e) => handleDelete(dest.id, dest.title || dest.name, e)}
                              title="Delete from database"
                              type="button"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Visual Cards Grid View */
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((dest) => {
              const isPub = dest.is_published !== false;
              const isFeat = Boolean(dest.featured);
              const heroImg = dest.image || dest.image_url || dest.media?.[0]?.url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand bg-white shadow-2xs transition hover:-translate-y-1 hover:shadow-md"
                  key={dest.id || dest.slug}
                >
                  {/* Image Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30">
                    <img
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80";
                      }}
                      src={heroImg}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                    {/* Top Badges */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5">
                      <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal shadow-xs backdrop-blur-md">
                        {dest.region || "North"}
                      </span>
                      {isFeat && (
                        <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-deep shadow-xs">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute right-3 top-3">
                      <button
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-md transition ${
                          isPub ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                        }`}
                        onClick={(e) => handleTogglePublish(dest, e)}
                        type="button"
                      >
                        {isPub ? "Live" : "Draft"}
                      </button>
                    </div>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-warm">
                        {dest.state || dest.country || "India"}
                      </p>
                      <h4 className="font-serif text-lg font-bold text-cream leading-snug">
                        {dest.title || dest.name}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      {dest.label && (
                        <p className="text-[11px] italic text-muted">
                          "{dest.label}"
                        </p>
                      )}

                      {/* Highlights */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {Array.isArray(dest.highlights) && dest.highlights.slice(0, 3).map((h, i) => (
                          <span
                            className="rounded-md bg-sand/30 px-2 py-0.5 text-[10px] font-medium text-ink"
                            key={i}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Info & Action Bar */}
                    <div className="mt-4 flex items-center justify-between border-t border-sand/60 pt-3">
                      <div>
                        <div className="font-display text-sm font-bold text-ink">
                          ₹{Number(String(dest.price || "19500").replace(/[^0-9]/g, "")).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-muted">{dest.duration || `${dest.duration_days || 6} days`}</div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          className="rounded-lg border border-sand p-1.5 text-muted hover:bg-sand/40 hover:text-teal"
                          target="_blank"
                          title="Preview trip"
                          to={`/destinations/${dest.slug}`}
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          className="rounded-lg bg-teal px-3 py-1.5 text-xs font-semibold text-cream hover:bg-teal-hover transition shadow-2xs"
                          onClick={() => openEditModal(dest)}
                          type="button"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comprehensive Add / Edit Destination Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs"
          data-lenis-prevent
        >
          <div className="relative flex max-h-[78dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-sand bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-sand bg-cream/40 px-5 py-3.5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal">
                  <Compass size={22} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {editingDest ? `Edit: ${editingDest.title || editingDest.name}` : "Create New Destination Package"}
                  </h3>
                  <p className="text-[11px] text-muted">
                    Configure copy, high-res photos, highlights, daily flow, and pricing tier.
                  </p>
                </div>
              </div>
              <button
                className="rounded-full p-2 text-muted hover:bg-sand/60 hover:text-ink transition"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex shrink-0 overflow-x-auto no-scrollbar border-b border-sand bg-white px-4 sm:px-6 whitespace-nowrap">
              <button
                className={`flex shrink-0 items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition ${
                  activeTab === "general"
                    ? "border-teal text-teal"
                    : "border-transparent text-muted hover:text-ink"
                }`}
                onClick={() => setActiveTab("general")}
                type="button"
              >
                <MapPin size={14} /> 1. Location &amp; Copy
              </button>
              <button
                className={`flex shrink-0 items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition ${
                  activeTab === "media"
                    ? "border-teal text-teal"
                    : "border-transparent text-muted hover:text-ink"
                }`}
                onClick={() => setActiveTab("media")}
                type="button"
              >
                <ImageIcon size={14} /> 2. Photos &amp; Gallery
              </button>
              <button
                className={`flex shrink-0 items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition ${
                  activeTab === "timeline"
                    ? "border-teal text-teal"
                    : "border-transparent text-muted hover:text-ink"
                }`}
                onClick={() => setActiveTab("timeline")}
                type="button"
              >
                <Calendar size={14} /> 3. Highlights &amp; Flow
              </button>
              <button
                className={`flex shrink-0 items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition ${
                  activeTab === "pricing"
                    ? "border-teal text-teal"
                    : "border-transparent text-muted hover:text-ink"
                }`}
                onClick={() => setActiveTab("pricing")}
                type="button"
              >
                <DollarSign size={14} /> 4. Pricing &amp; Logistics
              </button>
            </div>

            {/* Modal Form Wrapper with Scrollable Body + Sticky Footer */}
            <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSave}>
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6" data-lenis-prevent>
              {/* TAB 1: GENERAL & LOCATION */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-ink">
                        Destination Title *
                      </label>
                      <input
                        className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          if (!editingDest) {
                            setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                          }
                        }}
                        placeholder="e.g. Kashmir Valley"
                        required
                        type="text"
                        value={formTitle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink">
                        URL Slug (e.g. yatrio.com/destinations/slug)
                      </label>
                      <input
                        className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setFormSlug(e.target.value)}
                        placeholder="e.g. kashmir-valley"
                        type="text"
                        value={formSlug}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold text-ink">Region *</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setFormRegion(e.target.value)}
                        value={formRegion}
                      >
                        <option>North</option>
                        <option>South</option>
                        <option>West</option>
                        <option>East</option>
                        <option>Islands</option>
                        <option>International</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink">State / Tagline</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setFormState(e.target.value)}
                        placeholder="e.g. Land of High Passes"
                        type="text"
                        value={formState}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink">City / Main District</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="e.g. Srinagar & Gulmarg"
                        type="text"
                        value={formCity}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink">Vibe / Mood Pill</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                      onChange={(e) => setFormLabel(e.target.value)}
                      placeholder="e.g. Slow mornings"
                      type="text"
                      value={formLabel}
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-muted self-center mr-1">Presets:</span>
                      {MOOD_PRESETS.map((m) => (
                        <button
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
                            formLabel === m
                              ? "bg-teal text-cream"
                              : "bg-sand/30 text-ink hover:bg-sand/60"
                          }`}
                          key={m}
                          onClick={() => setFormLabel(m)}
                          type="button"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink">Inspiring Description & Story</label>
                    <textarea
                      className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Write evocative copy about quiet lakes, heritage houseboats, private transfers, and misty sunrises..."
                      rows={4}
                      value={formDesc}
                    />
                  </div>

                  {/* Publication & Featured Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sand bg-cream/30 p-4">
                    <div className="flex items-center gap-3">
                      <input
                        checked={formPublished}
                        className="h-4 w-4 rounded text-teal focus:ring-teal"
                        id="pubToggle"
                        onChange={(e) => setFormPublished(e.target.checked)}
                        type="checkbox"
                      />
                      <div>
                        <label className="text-xs font-bold text-ink cursor-pointer" htmlFor="pubToggle">
                          Publish Publicly on Website
                        </label>
                        <p className="text-[11px] text-muted">
                          When checked, travellers can view this holiday package on the live site.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        checked={formFeatured}
                        className="h-4 w-4 rounded text-gold focus:ring-gold"
                        id="featToggle"
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        type="checkbox"
                      />
                      <div>
                        <label className="text-xs font-bold text-ink cursor-pointer" htmlFor="featToggle">
                          ⭐ Mark as Featured Yatra
                        </label>
                        <p className="text-[11px] text-muted">
                          Featured in top spotlight carousels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & IMAGERY */}
              {activeTab === "media" && (
                <div className="space-y-5">
                  {/* Hero Cover Image Preview */}
                  <div>
                    <label className="block text-xs font-bold text-ink">Primary Hero Cover Image</label>
                    <div className="mt-2 flex flex-col gap-4 sm:flex-row">
                      <div className="relative aspect-[16/10] w-full sm:w-1/2 overflow-hidden rounded-2xl border border-sand bg-sand/30 shadow-xs">
                        <img
                          alt="Cover Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80";
                          }}
                          src={formImageUrl || "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-teal">
                            {formLabel || "Slow mornings"}
                          </span>
                          <h4 className="mt-1 font-serif text-base font-bold text-cream">
                            {formTitle || "Destination Preview"}
                          </h4>
                          <p className="text-[10px] text-white/80">{formState || "Region Preview"}</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-muted">Custom Image URL</label>
                          <input
                            className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                            onChange={(e) => setFormImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            type="url"
                            value={formImageUrl}
                          />
                          <p className="mt-1 text-[10px] text-muted">
                            Supports high-res Unsplash links or custom CDN image paths.
                          </p>
                        </div>

                        <div className="rounded-xl border border-teal/20 bg-teal/5 p-3 text-xs text-teal">
                          <p className="font-semibold">💡 Photo Aesthetics Rule</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-teal/80">
                            Yatreo brand aesthetic prefers quiet, cinematic tones, warm golden sunlight, and natural landscape depth.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* One-Click Presets Gallery */}
                  <div>
                    <label className="block text-xs font-bold text-ink">
                      ⚡ Quick One-Click Photo Presets (Click any to set as primary cover)
                    </label>
                    <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {CURATED_PHOTO_PRESETS.map((p, idx) => (
                        <button
                          className={`group relative overflow-hidden rounded-xl border text-left transition ${
                            formImageUrl === p.url
                              ? "border-teal ring-2 ring-teal shadow-xs"
                              : "border-sand/70 hover:border-sand-dark"
                          }`}
                          key={idx}
                          onClick={() => setFormImageUrl(p.url)}
                          type="button"
                        >
                          <div className="aspect-[16/10] w-full overflow-hidden bg-sand/30">
                            <img
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              src={p.url}
                            />
                          </div>
                          <div className="p-2 bg-white">
                            <p className="truncate text-[11px] font-semibold text-ink">{p.title}</p>
                            <p className="truncate text-[10px] text-muted">{p.tag}</p>
                          </div>
                          {formImageUrl === p.url && (
                            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-white">
                              <Check size={10} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Gallery Images */}
                  <div className="border-t border-sand pt-4">
                    <label className="block text-xs font-bold text-ink">
                      Secondary Gallery Images ({formGallery.length} added)
                    </label>
                    <p className="text-[11px] text-muted">
                      Additional photos displayed on the destination detail page carousel.
                    </p>

                    <div className="mt-2 flex gap-2">
                      <input
                        className="flex-1 rounded-xl border border-sand bg-cream/20 p-2 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="Paste image URL to append to gallery..."
                        type="url"
                        value={newGalleryUrl}
                      />
                      <button
                        className="rounded-xl bg-teal px-4 py-2 text-xs font-semibold text-cream hover:bg-teal-hover transition"
                        onClick={addGalleryImage}
                        type="button"
                      >
                        + Add Photo
                      </button>
                    </div>

                    {formGallery.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {formGallery.map((url, i) => (
                          <div className="group relative aspect-square overflow-hidden rounded-xl border border-sand bg-sand/20" key={i}>
                            <img alt="" className="h-full w-full object-cover" src={url} />
                            <button
                              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                              onClick={() => removeGalleryImage(i)}
                              type="button"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: HIGHLIGHTS & ITINERARY */}
              {activeTab === "timeline" && (
                <div className="space-y-6">
                  {/* Highlights Tags */}
                  <div>
                    <label className="block text-xs font-bold text-ink">
                      Experience Highlights (Tag Pills)
                    </label>
                    <p className="text-[11px] text-muted">
                      Key inclusions travelers see immediately on destination cards and detail pages.
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {formHighlights.map((hl, idx) => (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal"
                          key={idx}
                        >
                          {hl}
                          <button
                            className="text-teal/70 hover:text-red-600"
                            onClick={() => removeHighlight(idx)}
                            type="button"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        className="flex-1 rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addHighlight();
                          }
                        }}
                        placeholder="Type an experience highlight (e.g. Floating breakfast, Private Shikara) & press enter..."
                        type="text"
                        value={highlightInput}
                      />
                      <button
                        className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-bold text-ink hover:bg-sand/30"
                        onClick={addHighlight}
                        type="button"
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-muted">
                      <span>Popular suggestions:</span>
                      {["Private chauffeur", "Boutique heritage stays", "Sunset shikara cruise", "Floating breakfast", "Tea estate walk", "Candlelight dinner"].map((s) => (
                        <button
                          className="rounded-md bg-sand/30 px-2 py-0.5 text-ink hover:bg-teal hover:text-white"
                          key={s}
                          onClick={() => {
                            if (!formHighlights.includes(s)) setFormHighlights([...formHighlights, s]);
                          }}
                          type="button"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Day by Day Suggested Flow Timeline */}
                  <div className="border-t border-sand pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-ink">
                          Suggested Package Flow · The Vibe Timeline
                        </label>
                        <p className="text-[11px] text-muted">
                          Interactive day-by-day itinerary sequence displayed to travelers.
                        </p>
                      </div>
                      <button
                        className="button-gold gap-1 px-3 py-1 text-xs font-bold"
                        onClick={addTimelineDay}
                        type="button"
                      >
                        <Plus size={13} /> Add Day
                      </button>
                    </div>

                    <div className="mt-3.5 space-y-2.5">
                      {formTimeline.map((item, idx) => (
                        <div
                          className="flex flex-col gap-2 rounded-2xl border border-sand bg-cream/20 p-3 sm:flex-row sm:items-center"
                          key={idx}
                        >
                          <div className="flex items-center justify-between sm:justify-start gap-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal text-[11px] font-bold text-cream">
                              {idx + 1}
                            </span>
                            {formTimeline.length > 1 && (
                              <button
                                className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600 transition sm:hidden"
                                onClick={() => removeTimelineDay(idx)}
                                title="Delete day"
                                type="button"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                          <input
                            className="w-full rounded-xl border border-sand bg-white p-2 text-xs font-semibold text-ink outline-none focus:border-teal sm:w-1/3"
                            onChange={(e) => updateTimelineDay(idx, "title", e.target.value)}
                            placeholder="Title (e.g. Arrival in Paradise)"
                            type="text"
                            value={item.title}
                          />
                          <input
                            className="w-full flex-1 rounded-xl border border-sand bg-white p-2 text-xs text-ink outline-none focus:border-teal"
                            onChange={(e) => updateTimelineDay(idx, "vibe", e.target.value)}
                            placeholder="Vibe summary (e.g. Sunset drinks, scenic beach stroll)"
                            type="text"
                            value={item.vibe}
                          />
                          {formTimeline.length > 1 && (
                            <button
                              className="hidden rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600 transition sm:block"
                              onClick={() => removeTimelineDay(idx)}
                              title="Delete day"
                              type="button"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PRICING & LOGISTICS */}
              {activeTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold text-ink">Starting Price (INR) *</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">₹</span>
                        <input
                          className="w-full rounded-xl border border-sand bg-cream/20 py-2.5 pl-7 pr-3 text-xs font-bold text-ink outline-none focus:border-teal focus:bg-white"
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="19500"
                          required
                          type="number"
                          value={formPrice}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-muted">
                        Preview: ₹{Number(formPrice || 0).toLocaleString("en-IN")} per traveller
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink">Duration (Days)</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="6"
                        type="number"
                        value={formDuration}
                      />
                      <p className="mt-1 text-[10px] text-muted">
                        Label: {formDuration} days / {Math.max(1, (parseInt(formDuration) || 1) - 1)} nights
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink">Ideal Season</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-sand bg-cream/20 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                        onChange={(e) => setFormSeason(e.target.value)}
                        placeholder="e.g. October – March"
                        type="text"
                        value={formSeason}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-sand bg-cream/30 p-4">
                    <h4 className="text-xs font-bold text-ink">Inclusions Guarantee</h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">
                      All holidays include private transit, curated boutique stays, daily breakfast, and human planner support on WhatsApp by Rishav Travels.
                    </p>
                  </div>
                </div>
              )}

              </div>

              {/* Sticky Form Actions Footer */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-sand bg-white px-5 py-3.5 sm:px-6">
                <button
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted hover:bg-sand/40 transition"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {activeTab !== "pricing" && (
                    <button
                      className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-sand/30"
                      onClick={() => {
                        const tabs = ["general", "media", "timeline", "pricing"];
                        const nextIndex = tabs.indexOf(activeTab) + 1;
                        if (nextIndex < tabs.length) setActiveTab(tabs[nextIndex]);
                      }}
                      type="button"
                    >
                      Next Step →
                    </button>
                  )}
                  <button
                    className="button-teal px-6 py-2 text-xs font-bold shadow-xs disabled:opacity-50"
                    disabled={saving}
                    type="submit"
                  >
                    {saving ? "Saving..." : editingDest ? "Save Changes" : "Create Destination"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
