import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Check } from "lucide-react";
import { useRecipes } from "@/contexts/RecipeContext";
import { Button } from "@/components/ui/button";

export default function TodayMenu() {
  const navigate = useNavigate();
  const { recipes, todayMenu, removeFromToday, completeToday } = useRecipes();
  const todayStr = new Date().toISOString().slice(0, 10);

  const menuRecipes = todayMenu
    .map(id => recipes.find(r => r.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate("/")} className="rounded-lg p-1 text-foreground hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">今日菜单</h1>
      </header>

      <div className="px-5">
        <p className="mb-4 text-sm text-muted-foreground">{todayStr}</p>

        {menuRecipes.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">还没选菜呢</p>
            <p className="mt-1 text-sm text-muted-foreground">去首页挑几道喜欢的吧</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
              去选菜
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {menuRecipes.map(recipe => recipe && (
              <div
                key={recipe.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 warm-shadow animate-fade-in"
              >
                <div>
                  <h3 className="font-medium text-card-foreground">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="text-sm text-muted-foreground">{recipe.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeFromToday(recipe.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <Button
              className="mt-6 w-full"
              size="lg"
              onClick={() => {
                completeToday();
                navigate("/");
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              完成今日菜单
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
