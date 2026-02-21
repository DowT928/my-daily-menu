import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useRecipes } from "@/contexts/RecipeContext";
import { CATEGORIES, CATEGORY_MAP, Category } from "@/types/recipe";
import RecipeCard from "@/components/RecipeCard";

export default function Index() {
  const { recipes } = useRecipes();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return recipes;
    const q = search.toLowerCase();
    return recipes.filter(
      r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }, [recipes, search]);

  const grouped = useMemo(() => {
    const map: Record<Category, typeof recipes> = {
      meat: [], vegetable: [], soup: [], staple: [], other: [],
    };
    filtered.forEach(r => map[r.category].push(r));
    return map;
  }, [filtered]);

  const scrollToCategory = (key: Category) => {
    setActiveCategory(key);
    document.getElementById(`cat-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-5 pt-8 pb-2">
        <h1 className="text-2xl font-bold text-foreground">今天吃什么</h1>
        <p className="mt-1 text-sm text-muted-foreground">像点菜一样，选几道喜欢的吧</p>
      </header>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 warm-shadow">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="搜索菜名或描述…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category nav */}
      <div className="px-5 pb-2">
        <p className="mb-2 text-xs font-medium text-muted-foreground">分类</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => scrollToCategory(cat.key)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                activeCategory === cat.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe sections */}
      <div className="mt-2 space-y-6 px-5">
        {CATEGORIES.map(cat => {
          const items = grouped[cat.key];
          if (items.length === 0) return null;
          return (
            <section key={cat.key} id={`cat-${cat.key}`} className="scroll-mt-4">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className="text-xs font-normal text-muted-foreground">({items.length})</span>
              </h2>
              <div className="space-y-3">
                {items.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            没有找到匹配的菜谱
          </div>
        )}
      </div>
    </div>
  );
}
