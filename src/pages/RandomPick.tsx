import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shuffle } from "lucide-react";
import { useRecipes } from "@/contexts/RecipeContext";
import { CATEGORY_MAP } from "@/types/recipe";
import { Button } from "@/components/ui/button";

export default function RandomPick() {
  const navigate = useNavigate();
  const { recipes, addToToday, isInToday } = useRecipes();
  const [currentIndex, setCurrentIndex] = useState(() =>
    recipes.length > 0 ? Math.floor(Math.random() * recipes.length) : -1
  );

  const recipe = useMemo(() =>
    currentIndex >= 0 ? recipes[currentIndex] : null
  , [recipes, currentIndex]);

  const rollNext = useCallback(() => {
    if (recipes.length <= 1) return;
    let next: number;
    do {
      next = Math.floor(Math.random() * recipes.length);
    } while (next === currentIndex);
    setCurrentIndex(next);
  }, [recipes.length, currentIndex]);

  const inToday = recipe ? isInToday(recipe.id) : false;

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate("/")} className="rounded-lg p-1 text-foreground hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">随机推荐</h1>
      </header>

      <div className="px-5">
        {!recipe ? (
          <div className="py-16 text-center text-muted-foreground">
            还没有菜谱，先去添加几道吧
          </div>
        ) : (
          <div className="mt-8 animate-fade-in rounded-xl border border-border bg-card p-6 warm-shadow-lg">
            <p className="mb-1 text-xs text-muted-foreground">
              {CATEGORY_MAP[recipe.category].emoji} {CATEGORY_MAP[recipe.category].label}
            </p>
            <h2 className="text-2xl font-bold text-card-foreground">{recipe.name}</h2>
            {recipe.description && (
              <p className="mt-2 text-muted-foreground">{recipe.description}</p>
            )}
            {recipe.prepTime && (
              <p className="mt-3 text-sm text-muted-foreground">⏱ {recipe.prepTime}</p>
            )}

            <div className="mt-6 flex gap-3">
              <Button
                variant={inToday ? "secondary" : "default"}
                className="flex-1"
                disabled={inToday}
                onClick={() => recipe && addToToday(recipe.id)}
              >
                {inToday ? "已加入 ✓" : "加入今日菜单"}
              </Button>
              <Button variant="outline" onClick={rollNext}>
                <Shuffle className="mr-1.5 h-4 w-4" />
                换一个
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
