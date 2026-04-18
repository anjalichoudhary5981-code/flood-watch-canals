import { useEffect, useRef, useState } from "react";
import { Search, Loader2, MapPin, X } from "lucide-react";
import { searchCities, type GeocodeResult } from "@/utils/weatherApi";
import { Input } from "@/components/ui/input";

interface CitySearchProps {
  onSelect: (result: GeocodeResult) => void;
}

const CitySearch = ({ onSelect }: CitySearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const r = await searchCities(query);
        setResults(r);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handlePick = (r: GeocodeResult) => {
    onSelect(r);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full sm:w-[260px]">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search any city worldwide…"
          className="h-9 pl-8 pr-8 text-sm bg-card"
          aria-label="Search city"
        />
        {loading ? (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        ) : null}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-popover border rounded-md shadow-lg z-50 max-h-72 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handlePick(r)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {r.admin1 ? `${r.admin1}, ` : ""}{r.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && !loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-popover border rounded-md shadow-lg z-50 px-3 py-3 text-sm text-muted-foreground">
          No cities found for "{query}"
        </div>
      )}
    </div>
  );
};

export default CitySearch;
