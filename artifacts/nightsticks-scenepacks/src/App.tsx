import { type ReactNode, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ArrowDownToLine, ArrowLeft, ArrowRight, Search } from "lucide-react";
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
  useParams,
} from "wouter";

type DownloadOption = {
  title: string;
  style?: string;
  url?: string;
};

type Pack = {
  slug: string;
  title: string;
  series: string;
  category: "TV show" | "Movie" | "Video game";
  characters: string[];
  palette: string;
  cover: string;
  type: string;
  description: string;
  scenes?: number;
  updated?: string;
  mood: string;
  isSample: boolean;
  pending?: boolean;
  downloadUrl?: string;
  downloads?: DownloadOption[];
};

// Edit this list to update the catalog. Add each real HTTPS URL to its matching
// download option; leave pending packs without a download URL.
const packs: Pack[] = [
  {
    slug: "call-of-duty-simon-ghost-riley",
    title: "Simon “Ghost” Riley",
    series: "Call of Duty",
    category: "Video game",
    characters: ["Simon “Ghost” Riley"],
    palette: "neon",
    cover: "covers/call-of-duty-ghost.jpeg",
    type: "Video game scenepack",
    description:
      "Aesthetic scenepack for Simon “Ghost” Riley from Call of Duty.",
    mood: "Tactical · cinematic",
    isSample: false,
    downloads: [
      {
        title: "Simon 'Ghost' Riley - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://link-target.net/1425742/dZGtKpTZ0kpo",
      },
    ],
  },
  {
    slug: "dexter-morgan",
    title: "Dexter Morgan",
    series: "Dexter",
    category: "TV show",
    characters: ["Dexter Morgan"],
    palette: "velvet",
    cover: "covers/dexter-morgan.jpeg",
    type: "Character scenepack",
    description: "Two Dexter Morgan scenepacks: aesthetic and sad.",
    mood: "Aesthetic · dramatic",
    isSample: false,
    downloads: [
      {
        title: "Dexter Morgan - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://link-hub.net/1425742/oqNXIbV01MTY",
      },
      {
        title: "Dexter Morgan - Sad Scenepack",
        style: "Sad",
        url: "https://direct-link.net/1425742/MsozlRxwWZZc",
      },
    ],
  },
  {
    slug: "game-of-thrones-jaime-lannister",
    title: "Jaime Lannister",
    series: "Game of Thrones",
    category: "TV show",
    characters: ["Jaime Lannister"],
    palette: "station",
    cover: "covers/game-of-thrones.jpeg",
    type: "Character scenepack",
    description: "Jaime Lannister’s scenepack is still being made.",
    mood: "Character · drama",
    isSample: false,
    pending: true,
  },
  {
    slug: "god-of-war-thor",
    title: "Thor",
    series: "God of War",
    category: "Video game",
    characters: ["Thor"],
    palette: "winter",
    cover: "covers/god-of-war.jpeg",
    type: "Video game scenepack",
    description: "Aesthetic scenepack for Thor from God of War.",
    mood: "Action · mythic",
    isSample: false,
    downloads: [
      {
        title: "Thor Odison - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://link-hub.net/1425742/fjCFzVtjPbMR",
      },
    ],
  },
  {
    slug: "harry-potter",
    title: "Harry Potter",
    series: "Harry Potter",
    category: "Movie",
    characters: ["Harry Potter"],
    palette: "velvet",
    cover: "covers/harry-potter.jpeg",
    type: "Film series scenepack",
    description: "Aesthetic scenepack for Harry Potter.",
    mood: "Fantasy · adventure",
    isSample: false,
    downloads: [
      {
        title: "Harry Potter - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://link-center.net/1425742/V4pZYvMsfryR",
      },
    ],
  },
  {
    slug: "resident-evil-leon-s-kennedy",
    title: "Leon S. Kennedy",
    series: "Resident Evil",
    category: "Video game",
    characters: ["Leon S. Kennedy"],
    palette: "skyline",
    cover: "covers/resident-evil-leon.jpeg",
    type: "Video game scenepack",
    description: "Aesthetic scenepack for Leon S. Kennedy from Resident Evil.",
    mood: "Survival · action",
    isSample: false,
    downloads: [
      {
        title: "Leon S. Kennedy - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://direct-link.net/1425742/z7yNsnY4FhKZ",
      },
    ],
  },
  {
    slug: "spider-man-andrew-garfield-tobey-maguire",
    title: "Andrew Garfield & Tobey Maguire",
    series: "Spider-Man",
    category: "Movie",
    characters: ["Andrew Garfield And Tobey Maguire Spider-Men"],
    palette: "skyline",
    cover: "covers/spider-man.jpeg",
    type: "Film character scenepack",
    description:
      "Aesthetic Spider-Man scenepacks for Andrew Garfield and Tobey Maguire as Peter Parker.",
    mood: "Superhero · action",
    isSample: false,
    downloads: [
      {
        title: "Andrew Garfield Spider-Man — Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://link-center.net/1425742/qEuOx8oDAUPC",
      },
      {
        title: "Tobey Maguire Spider-Man — Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://link-target.net/1425742/azzGgjG8pfov",
      },
    ],
  },
  {
    slug: "star-wars-anakin-skywalker",
    title: "Anakin Skywalker",
    series: "Star Wars",
    category: "Movie",
    characters: ["Anakin Skywalker"],
    palette: "station",
    cover: "covers/star-wars-anakin.jpeg",
    type: "Film character scenepack",
    description: "Aesthetic scenepack for Anakin Skywalker from Star Wars.",
    mood: "Sci-fi · dramatic",
    isSample: false,
    downloads: [
      {
        title: "Anakin Skywalker - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://direct-link.net/1425742/BnFUfze06MWY",
      },
    ],
  },
  {
    slug: "the-boys-homelander",
    title: "Homelander",
    series: "The Boys",
    category: "TV show",
    characters: ["Homelander"],
    palette: "velvet",
    cover: "covers/the-boys.jpeg",
    type: "Character scenepack",
    description: "Aesthetic scenepack for Homelander from The Boys.",
    mood: "Superhero · drama",
    isSample: false,
    downloads: [
      {
        title: "Homelander - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://mega.nz/file/kIojVA6A#Lcv3vu7R_OFh8vv7KOG6NTAjcir1_aLI5rzv2YVYi64",
      },
    ],
  },
  {
    slug: "the-last-of-us-tommy-miller",
    title: "Tommy Miller",
    series: "The Last of Us",
    category: "Video game",
    characters: ["Tommy Miller"],
    palette: "coast",
    cover: "covers/the-last-of-us.jpeg",
    type: "Video game scenepack",
    description: "Aesthetic scenepack for Tommy Miller from The Last of Us.",
    mood: "Drama · survival",
    isSample: false,
    downloads: [
      {
        title: "Tommy Miller - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://mega.nz/file/gcYDkZDS#sbv06RrScAURi6U8GElh5yUDPFAKHOXKdezdkjTy1GM",
      },
    ],
  },
  {
    slug: "the-walking-dead-rick-grimes",
    title: "Rick Grimes",
    series: "The Walking Dead",
    category: "TV show",
    characters: ["Rick Grimes"],
    palette: "skyline",
    cover: "covers/the-walking-dead-rick.jpeg",
    type: "Character scenepack",
    description: "Aesthetic, sad, and happy scenepacks for Rick Grimes.",
    mood: "Aesthetic · dramatic",
    isSample: false,
    downloads: [
      {
        title: "Rick Grimes - Aesthetic Scenepack",
        style: "Aesthetic",
        url: "https://mega.nz/file/odIUmRjI#-YElZzsH37M6NSnnzoeS9YGSmoc8OEspCAhZi6vSbzg",
      },
      {
        title: "Rick Grimes - Sad Scenepack",
        style: "Sad",
        url: "https://mega.nz/file/hEwmmDZJ#ftKWpisTzAYrr3FZ_Jj1q9C09z8KXpBqDk6T31goHmA",
      },
      {
        title: "Rick Grimes - Happy Scenepack",
        style: "Happy",
        url: "https://mega.nz/file/JVpBlRyT#SNN3O3-2xw_3oJDPcOuG27I9ESfOq--nVA-wZWWZOLQ",
      },
    ],
  },
];

function getSafeDownloadUrl(downloadUrl?: string) {
  const value = downloadUrl?.trim();
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    return new URL(value).protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
}

function getPackDownloadOptions(pack: Pack): DownloadOption[] {
  const options = pack.downloads?.length
    ? pack.downloads
    : [{ title: `${pack.title} Scenepack`, url: pack.downloadUrl }];
  return options.map((option) => ({
    ...option,
    url: pack.isSample ? undefined : getSafeDownloadUrl(option.url),
  }));
}

function getPackStyleLabels(pack: Pack) {
  if (pack.pending) return ["Pending"];
  const labels = Array.from(
    new Set(
      pack.downloads
        ?.map(
          ({ title, style }) =>
            style?.trim() || title.replace(/\s+scenepack$/i, "").trim(),
        )
        .filter(Boolean),
    ),
  );
  return labels?.length ? labels : ["Aesthetic"];
}

const queryClient = new QueryClient();
const filters = [
  "All packs",
  "TV shows",
  "Movies",
  "Video games",
  "Characters",
];

function SampleBanner() {
  const hasSamplePacks = packs.some((pack) => pack.isSample);
  const downloadablePacks = packs.filter((pack) =>
    getPackDownloadOptions(pack).some((option) => option.url),
  ).length;
  const pendingCount = packs.filter((pack) => pack.pending).length;
  return (
    <div className="sample-banner" data-testid="status-download-notice">
      {hasSamplePacks ? "SAMPLE PACKS ARE MARKED" : "CURATED SCENEPACKS"}
      &nbsp; / &nbsp;
      {downloadablePacks
        ? `${downloadablePacks} COLLECTIONS WITH DOWNLOADS`
        : "NO DOWNLOAD FILES ADDED"}
      {pendingCount > 0 && <>&nbsp; / &nbsp;{pendingCount} PACK PENDING</>}
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="topbar">
      <div className="nav-inner">
        <Link href="/" className="brand" data-testid="link-brand-home">
          <span className="brand-mark">N.</span>
          <span className="brand-name">
            NIGHTSTICK’S <span>SCENEPACKS</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/" data-testid="link-nav-archive">
            Archive
          </Link>
          <a href="/#about" data-testid="link-nav-about">
            About
          </a>
        </nav>
        <span className="nav-note">An editor’s index / vol. 01</span>
      </div>
    </header>
  );
}

function Art({ pack, detail = false }: { pack: Pack; detail?: boolean }) {
  return (
    <div
      className={`art art-${pack.palette}${detail ? " detail-art" : ""}`}
      data-testid={`img-artwork-${pack.slug}`}
      role="img"
      aria-label={`${pack.series} scenepack cover`}
    >
      <img
        className="cover-image"
        src={`${import.meta.env.BASE_URL}${pack.cover}`}
        alt=""
        loading={detail ? "eager" : "lazy"}
      />
      <span className="art-title">
        <span>{pack.category}</span>
        {pack.series}
      </span>
    </div>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  return (
    <Link
      href={`/scenepacks/${pack.slug}`}
      className="pack-card"
      data-testid={`card-pack-${pack.slug}`}
    >
      <Art pack={pack} />
      <div className="card-content">
        <div className="card-topline">
          <span>
            {pack.category} · {pack.isSample ? "Sample" : "Scenepack"}
          </span>
          <span>
            {pack.pending
              ? "Pending"
              : pack.downloads?.length
                ? `${pack.downloads.length} downloads`
                : "Download ready"}
          </span>
        </div>
        <h3 data-testid={`text-pack-types-${pack.slug}`}>
          {getPackStyleLabels(pack).join(" · ")}
        </h3>
        <p className="card-characters">
          Featuring {pack.characters.join(" · ")}
        </p>
        <div className="card-footer">
          <span>{pack.mood}</span>
          <span>
            VIEW PACK <ArrowRight size={12} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const [activeFilter, setActiveFilter] = useState("All packs");
  const [activeCharacter, setActiveCharacter] = useState("");
  const [search, setSearch] = useState("");
  const characters = useMemo(
    () => Array.from(new Set(packs.flatMap((pack) => pack.characters))).sort(),
    [],
  );
  const visiblePacks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return packs.filter((pack) => {
      const categoryMatch =
        activeFilter === "All packs" ||
        (activeFilter === "TV shows" && pack.category === "TV show") ||
        (activeFilter === "Movies" && pack.category === "Movie") ||
        (activeFilter === "Video games" && pack.category === "Video game") ||
        activeFilter === "Characters";
      const characterMatch =
        !activeCharacter || pack.characters.includes(activeCharacter);
      const searchMatch =
        !term ||
        [
          pack.title,
          pack.series,
          pack.category,
          pack.description,
          pack.mood,
          ...pack.characters,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return categoryMatch && characterMatch && searchMatch;
    });
  }, [activeFilter, activeCharacter, search]);

  const chooseFilter = (filter: string) => {
    setActiveFilter(filter);
    setActiveCharacter("");
  };

  return (
    <main>
      <div className="page-shell">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="eyebrow">
              High-quality scenepacks for your next edit
            </div>
            <h1 id="hero-heading">
              Find the frame
              <br />
              that <em>feels like you.</em>
            </h1>
            <p>
              Browse curated TV, movie, and video game scene collections,
              organized to help your next edit start with the right moment.
            </p>
            <div className="hero-meta">
              <b>
                {packs.some((pack) => pack.isSample)
                  ? "Sample packs clearly marked"
                  : "Curated pack library"}
              </b>
              <i /> {packs.length} collections
              <i /> Always free to browse
            </div>
          </div>
        </section>

        <section id="archive" aria-labelledby="archive-heading">
          <div className="archive-head">
            <div>
              <div className="section-kicker">
                The collection / 001—{packs.length.toString().padStart(3, "0")}
              </div>
              <h2 id="archive-heading">Browse the archive</h2>
            </div>
            <span className="count" data-testid="status-result-count">
              {visiblePacks.length.toString().padStart(2, "0")} PACKS
            </span>
          </div>
          <div className="browse-tools">
            <div
              className="filter-tabs"
              role="tablist"
              aria-label="Filter scenepacks"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`filter-tab${activeFilter === filter ? " active" : ""}`}
                  onClick={() => chooseFilter(filter)}
                  data-testid={`button-filter-${filter.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <label className="search-box">
              <Search size={15} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search titles, characters…"
                aria-label="Search scenepacks"
                data-testid="input-search-packs"
              />
            </label>
          </div>
          {activeFilter === "Characters" && (
            <div className="character-row" aria-label="Browse by character">
              <span className="character-label">Characters</span>
              {characters.map((character) => (
                <button
                  key={character}
                  type="button"
                  className={`character-chip${activeCharacter === character ? " active" : ""}`}
                  onClick={() =>
                    setActiveCharacter(
                      activeCharacter === character ? "" : character,
                    )
                  }
                  aria-pressed={activeCharacter === character}
                  data-testid={`button-character-${character.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {character}
                </button>
              ))}
            </div>
          )}
          <div className="pack-grid" data-testid="list-scenepacks">
            {visiblePacks.length ? (
              visiblePacks.map((pack) => (
                <PackCard key={pack.slug} pack={pack} />
              ))
            ) : (
              <div className="empty-state" data-testid="status-no-results">
                <strong>No scenes in this frame.</strong>
                <p>Try another title, character, or category.</p>
                <button
                  className="clear-search"
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCharacter("");
                    setActiveFilter("All packs");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
        <section id="about" className="info-panel" style={{ marginBottom: 65 }}>
          <div className="section-kicker">A note from the archive</div>
          <h2 style={{ marginTop: 10 }}>Made for the feeling, not the file.</h2>
          <p>
            Completed scenepacks have direct download links. Packs still being
            made are marked Pending.
          </p>
        </section>
      </div>
    </main>
  );
}

function Detail() {
  const { slug } = useParams<{ slug: string }>();
  const pack = packs.find((item) => item.slug === slug);
  if (!pack) return <NotFound />;
  const downloadOptions = getPackDownloadOptions(pack);
  return (
    <main className="page-shell detail">
      <Link href="/" className="back-link" data-testid="link-back-archive">
        <ArrowLeft size={14} /> Back to the archive
      </Link>
      <article>
        <div className="detail-hero">
          <Art pack={pack} detail />
          <div className="detail-copy">
            <div className="eyebrow">
              {pack.category} /{" "}
              {pack.pending
                ? "pending"
                : pack.isSample
                  ? "sample content"
                  : "scenepack"}
            </div>
            <h1 data-testid={`text-detail-title-${pack.slug}`}>{pack.title}</h1>
            <p>{pack.description}</p>
            <div className="detail-tags">
              <span className="detail-tag">{pack.type}</span>
              <span className="detail-tag">{pack.mood}</span>
              {pack.characters.map((character) => (
                <span className="detail-tag" key={character}>
                  {character}
                  {pack.isSample ? " · sample" : ""}
                </span>
              ))}
            </div>
            <div className="detail-meta">
              {pack.scenes != null && (
                <span>
                  {pack.scenes}
                  {pack.isSample ? " sample" : ""} scenes
                </span>
              )}
              {pack.updated && <span>Updated {pack.updated}</span>}
              {pack.pending ? (
                <span>Scenepack pending</span>
              ) : (
                pack.scenes == null &&
                !pack.updated && (
                  <span>Give Credit to @nightstickkk on TikTok</span>
                )
              )}
            </div>
            <div
              className="download-options"
              data-testid={`list-download-options-${pack.slug}`}
            >
              {downloadOptions.map((option, index) => (
                <div
                  className="download-option"
                  key={`${option.title}-${index}`}
                >
                  <h3 className="download-option-title">{option.title}</h3>
                  {option.url ? (
                    <a
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-button"
                      aria-label={`Download ${option.title}`}
                      data-testid={`link-download-${pack.slug}-${index}`}
                    >
                      <ArrowDownToLine size={15} /> Download
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="download-button"
                      disabled
                      aria-describedby={`download-note-${pack.slug}-${index}`}
                      data-testid={`button-disabled-download-${pack.slug}-${index}`}
                    >
                      <ArrowDownToLine size={15} />{" "}
                      {pack.pending
                        ? "Scenepack pending"
                        : "Download unavailable"}
                    </button>
                  )}
                  <p
                    className="download-note"
                    id={`download-note-${pack.slug}-${index}`}
                    data-testid={`status-download-${pack.slug}-${index}`}
                  >
                    {option.url
                      ? "Download link provided for this option."
                      : pack.pending
                        ? "This scenepack is still being made."
                        : "No download file attached yet."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="detail-lower">
          <section className="info-panel">
            <div className="section-kicker">Inside this collection</div>
            <h2>Scenes for your next cut</h2>
            <ul>
              <li>
                {pack.scenes != null
                  ? `${pack.scenes}${pack.isSample ? " sample" : ""} scenes`
                  : "Scene details not added yet"}
              </li>
              <li>Character browse tags for {pack.characters.join(" and ")}</li>
              <li>
                {pack.isSample
                  ? "Original artwork created for this demonstration"
                  : "Artwork supplied for this pack"}
              </li>
            </ul>
          </section>
          <section className="info-panel">
            <div className="section-kicker">Archive note</div>
            <h2>
              {pack.pending
                ? "This scenepack is pending."
                : pack.isSample
                  ? "This is sample content."
                  : "About this pack."}
            </h2>
            <p>
              {pack.pending
                ? `${pack.title} has not been completed yet.`
                : pack.isSample
                  ? `This is a sample listing for ${pack.series}. No scenepack files have been added yet.`
                  : `${pack.series} is listed as a ${pack.category.toLowerCase()} scenepack.`}
            </p>
            <Link
              href="/"
              className="back-link"
              style={{ marginTop: 8, marginBottom: 0 }}
              data-testid="link-return-browse"
            >
              Explore another pack <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}

function SiteFooter() {
  const sampleCount = packs.filter((pack) => pack.isSample).length;
  const downloadableCount = packs.reduce(
    (count, pack) =>
      count +
      getPackDownloadOptions(pack).filter((option) => option.url).length,
    0,
  );
  const pendingCount = packs.filter((pack) => pack.pending).length;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>
          <strong>NIGHTSTICK’S SCENEPACKS</strong> &nbsp; A catalog for people
          who make things.
        </span>
        <span data-testid="text-footer-download-status">
          {downloadableCount} downloads available
          {pendingCount ? ` · ${pendingCount} pending` : ""}
          {sampleCount ? ` · ${sampleCount} sample packs` : ""}.
        </span>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <ErrorBoundary>
      <div className="site-wrap">
        <SampleBanner />
        <SiteHeader />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/scenepacks/:slug" component={Detail} />
          <Route component={NotFound} />
        </Switch>
        <SiteFooter />
      </div>
    </ErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <RoutedErrorBoundary>
            <Router />
          </RoutedErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
