import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useRecipes } from "@/contexts/RecipeContext";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, reAddHistory, recipes } = useRecipes();

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate("/")} className="rounded-lg p-1 text-foreground hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">历史菜单</h1>
      </header>

      <div className="px-5">
        {history.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">还没有历史记录</p>
            <p className="mt-1 text-sm text-muted-foreground">完成今日菜单后会自动记录</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map(entry => {
              const hasExistingRecipes = entry.items.some(item =>
                recipes.some(r => r.id === item.id)
              );
              return (
                <div key={entry.date} className="animate-fade-in">
                  <h2 className="mb-2 text-sm font-medium text-muted-foreground">{entry.date}</h2>
                  <div className="rounded-lg border border-border bg-card p-4 warm-shadow">
                    <ul className="space-y-1">
                      {entry.items.map(item => {
                        const exists = recipes.some(r => r.id === item.id);
                        return (
                          <li key={item.id} className={`text-sm ${exists ? "text-card-foreground" : "text-muted-foreground line-through"}`}>
                            {item.name}
                          </li>
                        );
                      })}
                    </ul>
                    {hasExistingRecipes && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => reAddHistory(entry)}
                      >
                        <RotateCcw className="mr-1.5 h-3 w-3" />
                        重新加入今日菜单
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
