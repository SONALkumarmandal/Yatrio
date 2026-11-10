import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Globe,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { YatreoMark } from "../components/layout/Logo";
import * as adminApi from "../services/adminApi";
import * as destinationsApi from "../services/destinationsApi";

export function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [analytics, setAnalytics] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCountry, setFormCountry] = useState("India");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formRegion, setFormRegion] = useState("North");
  const [formLabel, setFormLabel] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDuration, setFormDuration] = useState("6");
  const [formSeason, setFormSeason] = useState("October – March");
  const [formDesc, setFormDesc] = useState("");
  const [formHighlights, setFormHighlights] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formPublished, setFormPublished] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login", { state: { from: { pathname: "/admin" } } });
      } else if (!isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  async function loadData() {
    setLoading(true);
    try {
      const [destRes, analRes] = await Promise.allSettled([
        adminApi.getAdminDestinations({ search, pageSize: 50 }),
        adminApi.getAdminAnalytics(),
      ]);

      if (destRes.status === "fulfilled" && destRes.value?.items) {
        setDestinations(destRes.value.items);
      } else {
        // Fallback to public list
        const pub = await destinationsApi.getDestinations({ pageSize: 50 });
        if (pub?.items) setDestinations(pub.items);
      }

      if (analRes.status === "fulfilled") {
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
  }, [isAdmin, search]);

  function openCreateModal() {
    setEditingDest(null);
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
    setFormDesc("");
    setFormHighlights("Quiet walks, Heritage stays, Mountain trails");
    setFormImageUrl("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85");
    setFormPublished(true);
    setIsModalOpen(true);
  }

  function openEditModal(dest) {
    setEditingDest(dest);
    setFormTitle(dest.title || dest.name || "");
    setFormSlug(dest.slug || "");
    setFormCountry(dest.country || "India");
    setFormCity(dest.city || "");
    setFormState(dest.state || "");
    setFormRegion(dest.region || "North");
    setFormLabel(dest.label || "");
    setFormPrice(dest.price ? String(dest.price).replace(/[^0-9]/g, "") : "");
    setFormDuration(String(dest.duration_days || dest.durationDays || 6));
    setFormSeason(dest.season || "");
    setFormDesc(dest.description || "");
    setFormHighlights(
      Array.isArray(dest.highlights)
        ? dest.highlights.join(", ")
        : String(dest.highlights || "")
    );
    setFormImageUrl(
      dest.media?.[0]?.url || dest.image || ""
    );
    setFormPublished(dest.is_published ?? true);
    setIsModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", formTitle);
      formData.append("slug", formSlug || formTitle.toLowerCase().replace(/\s+/g, "-"));
      formData.append("country", formCountry);
      formData.append("city", formCity);
      formData.append("state", formState);
      formData.append("region", formRegion);
      formData.append("label", formLabel);
      if (formPrice) formData.append("price", formPrice);
      if (formDuration) formData.append("duration_days", formDuration);
      formData.append("season", formSeason);
      formData.append("description", formDesc);
      formData.append("is_published", formPublished ? "true" : "false");

      if (editingDest) {
        await adminApi.updateAdminDestination(editingDest.id, formData);
      } else {
        await adminApi.createAdminDestination(formData);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert("Failed to save destination: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this destination from the database?")) return;
    try {
      await adminApi.deleteAdminDestination(id);
      setDestinations(destinations.filter((d) => d.id !== id));
    } catch (err) {
      alert("Failed to delete destination: " + err.message);
    }
  }

  if (authLoading || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Shield className="animate-pulse text-warm" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-12">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Link className="inline-flex items-center gap-1 text-xs text-muted hover:text-teal" to="/dashboard">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <YatreoMark size={32} />
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Yatreo Admin Portal
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted">Manage destinations catalog, publication status, and view platform metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3.5 py-2 text-xs font-semibold text-ink transition hover:bg-sand/40"
            onClick={loadData}
            type="button"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            className="button-gold gap-1.5 px-4 py-2 text-xs font-semibold"
            onClick={openCreateModal}
            type="button"
          >
            <Plus size={16} /> Add Destination
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Destinations</span>
            <Globe className="text-teal" size={18} />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-ink">
            {analytics?.destinations_count ?? destinations.length}
          </p>
          <p className="mt-1 text-[11px] text-muted">Across India & Beyond</p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
            <Users className="text-warm" size={18} />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-ink">
            {analytics?.users_count ?? "Active"}
          </p>
          <p className="mt-1 text-[11px] text-muted">Travelers with accounts</p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Audit Log Status</span>
            <Activity className="text-emerald-600" size={18} />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-emerald-600">Active</p>
          <p className="mt-1 text-[11px] text-muted">Security events logged</p>
        </div>
      </div>

      {/* Search & Destinations Management */}
      <div className="mt-10 rounded-2xl border border-sand bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-sand p-5 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              className="w-full rounded-full border border-sand bg-cream/40 py-2 pl-9 pr-4 text-xs text-ink outline-none focus:border-teal focus:bg-white"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations..."
              type="search"
              value={search}
            />
          </div>
          <span className="text-xs text-muted">{destinations.length} destination records</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-sand bg-sand/30 font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3.5">Destination</th>
                <th className="px-4 py-3.5">Region</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {destinations.map((dest) => (
                <tr className="transition hover:bg-sand/20" key={dest.id || dest.slug}>
                  <td className="px-5 py-4 font-medium text-ink">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-sand/60">
                        <img
                          alt=""
                          className="h-full w-full object-cover"
                          src={dest.media?.[0]?.url || dest.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80"}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-ink">{dest.title || dest.name}</div>
                        <div className="text-[11px] text-muted">{dest.state || dest.country || "India"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted">{dest.region || "All"}</td>
                  <td className="px-4 py-4 font-serif text-ink">
                    {typeof dest.price === "number" ? `₹${Number(dest.price).toLocaleString("en-IN")}` : dest.price || "₹18,500"}
                  </td>
                  <td className="px-4 py-4 text-muted">
                    {dest.duration_days ? `${dest.duration_days} days` : dest.duration || "5 nights / 6 days"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        dest.is_published !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {dest.is_published !== false ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="rounded-lg p-1.5 text-muted hover:bg-sand/60 hover:text-teal"
                        onClick={() => openEditModal(dest)}
                        title="Edit"
                        type="button"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-muted hover:bg-sand/60 hover:text-red-500"
                        onClick={() => handleDelete(dest.id)}
                        title="Delete"
                        type="button"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-sand pb-4">
              <h3 className="font-display text-xl font-semibold text-ink">
                {editingDest ? "Edit Destination" : "Add New Destination"}
              </h3>
              <button
                className="rounded-full p-1 text-muted hover:bg-sand/50"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={handleSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink">Title / Name *</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Munnar Hills"
                    required
                    type="text"
                    value={formTitle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Slug (unique URL path)</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. munnar-hills"
                    type="text"
                    value={formSlug}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Region</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormRegion(e.target.value)}
                    value={formRegion}
                  >
                    <option>North</option>
                    <option>South</option>
                    <option>West</option>
                    <option>East</option>
                    <option>Islands</option>
                    <option>Beyond</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">State / Tagline</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormState(e.target.value)}
                    placeholder="e.g. Valley of Tea"
                    type="text"
                    value={formState}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">City / Town</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Munnar"
                    type="text"
                    value={formCity}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Price (INR)</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="19500"
                    type="number"
                    value={formPrice}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Duration (Days)</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="6"
                    type="number"
                    value={formDuration}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Season</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                    onChange={(e) => setFormSeason(e.target.value)}
                    placeholder="October – March"
                    type="text"
                    value={formSeason}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Highlights (comma-separated)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                  onChange={(e) => setFormHighlights(e.target.value)}
                  placeholder="Tea plantation walk, Waterfalls, Colonial church"
                  type="text"
                  value={formHighlights}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Description</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none focus:border-teal focus:bg-white"
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Write an inspiring description of this trip..."
                  rows={3}
                  value={formDesc}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  checked={formPublished}
                  className="h-4 w-4 rounded text-teal focus:ring-teal"
                  id="published"
                  onChange={(e) => setFormPublished(e.target.checked)}
                  type="checkbox"
                />
                <label className="text-xs font-semibold text-ink" htmlFor="published">
                  Publish publicly on website
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-sand pt-4">
                <button
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted hover:bg-sand/40"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-teal px-5 py-2 text-xs font-semibold text-cream hover:bg-teal-hover disabled:opacity-50"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? "Saving..." : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
