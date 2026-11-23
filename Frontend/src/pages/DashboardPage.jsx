import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Compass,
  FolderPlus,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { YatreoMark } from "../components/layout/Logo";
import * as projectsApi from "../services/projectsApi";
import { whatsappUrl } from "../data/destinations";

export function DashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { savedDestinations } = useWishlist();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: { pathname: "/dashboard" } } });
      return;
    }

    async function loadProjects() {
      try {
        const res = await projectsApi.getProjects();
        if (res?.items) {
          setProjects(res.items);
        }
      } catch (err) {
        console.warn("Could not fetch user projects:", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProjects();
    }
  }, [user, authLoading, navigate]);

  async function handleCreateProject(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await projectsApi.createProject({
        name: newName,
        description: newDesc,
        status: "active",
      });
      setProjects([created, ...projects]);
      setNewName("");
      setNewDesc("");
      setShowModal(false);
    } catch (err) {
      alert("Failed to create trip project: " + err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteProject(id) {
    if (!confirm("Are you sure you want to remove this trip project?")) return;
    try {
      await projectsApi.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  }

  const wishlistDestinations = savedDestinations;

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Compass className="animate-spin text-teal/40" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-12 sm:px-8 sm:pt-8 sm:pb-14">
      {/* Top Greeting Banner */}
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-sand bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-teal text-2xl font-serif text-cream shadow-sm">
            {user?.full_name ? user.full_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || "Y"}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-cream border border-sand">
              <YatreoMark size={16} />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-ink">
                Namaste, {user?.full_name || user?.username}
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warm/20 px-2.5 py-0.5 text-xs font-semibold text-warm-dark">
                  <Shield size={12} /> Admin
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">
              {user?.email} · Member since {new Date(user?.created_at || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream/30 px-4 py-2 text-xs font-semibold text-ink transition hover:bg-sand/40"
            to="/plan"
          >
            Custom Trip Builder
          </Link>
          {isAdmin && (
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-warm bg-warm/10 px-4 py-2 text-xs font-semibold text-warm-dark transition hover:bg-warm/20"
              to="/admin"
            >
              <Shield size={14} /> Open Admin Portal
            </Link>
          )}
          <button
            className="button-gold gap-2 px-5 py-2 text-xs font-semibold"
            onClick={() => setShowModal(true)}
            type="button"
          >
            <Plus size={16} /> New Trip Plan
          </button>
        </div>
      </div>

      {/* Wishlist Saved Section */}
      {wishlistDestinations.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="fill-rose-500 text-rose-500" size={18} />
              <h2 className="font-display text-xl font-semibold text-ink">Saved Journeys ({wishlistDestinations.length})</h2>
            </div>
            <Link className="text-xs font-semibold text-teal hover:underline" to="/destinations">
              Browse More
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistDestinations.map((d) => (
              <Link
                className="group flex items-center gap-3 rounded-2xl border border-sand bg-white p-3 shadow-sm transition hover:shadow-md"
                key={d.slug}
                to={`/destinations/${d.slug}`}
              >
                <img alt={d.name} className="h-12 w-12 rounded-xl object-cover" src={d.image} />
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-xs text-ink group-hover:text-teal">{d.name}</h3>
                  <p className="text-[11px] text-muted">{d.price} · {d.region}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trips & Projects Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Your Saved Trip Plans</h2>
            <p className="text-xs text-muted">Itineraries, holiday ideas, and custom routes planned with Yatreo</p>
          </div>
          <span className="text-xs font-medium text-muted">{projects.length} plans</span>
        </div>

        {projects.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <div
                className="group relative flex flex-col justify-between rounded-2xl border border-sand bg-white p-5 shadow-sm transition hover:shadow-md"
                key={proj.id}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal">
                      {proj.status.toUpperCase()}
                    </span>
                    <button
                      aria-label="Delete project"
                      className="text-muted/60 transition hover:text-red-500"
                      onClick={() => handleDeleteProject(proj.id)}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-medium text-ink">{proj.name}</h3>
                  {proj.description && <p className="mt-1 text-xs leading-5 text-muted">{proj.description}</p>}
                </div>

                <div className="mt-5 border-t border-sand/50 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">
                      Created {new Date(proj.created_at).toLocaleDateString()}
                    </span>
                    <a
                      className="inline-flex items-center gap-1 font-semibold text-teal hover:underline"
                      href={whatsappUrl(`Hi Yatreo! Let's work on my trip plan: "${proj.name}"`)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <MessageCircle size={13} /> Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-sand bg-white/60 p-8 text-center">
            <FolderPlus className="text-teal/40" size={32} />
            <h3 className="mt-3 font-display text-lg font-semibold text-ink">No trip plans saved yet</h3>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
              Start planning your next slow escape, mountain trail, or coastal getaway.
            </p>
            <button
              className="button-teal mt-4 px-4 py-2 text-xs"
              onClick={() => setShowModal(true)}
              type="button"
            >
              <Plus size={14} /> Create your first plan
            </button>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" data-lenis-prevent>
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl bg-white p-6 shadow-xl" data-lenis-prevent>
            <h3 className="font-display text-xl font-semibold text-ink">Create New Trip Plan</h3>
            <p className="mt-1 text-xs text-muted">
              Give your upcoming holiday plan a name and brief travel vision.
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleCreateProject}>
              <div>
                <label className="block text-xs font-semibold text-ink">Trip Title</label>
                <input
                  className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-sm text-ink outline-none focus:border-teal focus:bg-white"
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Winter in Himachal"
                  required
                  type="text"
                  value={newName}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Details or Preferences</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-sm text-ink outline-none focus:border-teal focus:bg-white"
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. 2 travelers, around December, quiet homestays and mountain views"
                  rows={3}
                  value={newDesc}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-muted hover:bg-sand/40"
                  onClick={() => setShowModal(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-teal px-5 py-2 text-xs font-semibold text-cream hover:bg-teal-hover disabled:opacity-50"
                  disabled={creating}
                  type="submit"
                >
                  {creating ? "Saving..." : "Save Trip Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
