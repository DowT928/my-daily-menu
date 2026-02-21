import { useLocation, useNavigate } from "react-router-dom";
import { Dice5, Plus, UtensilsCrossed, History } from "lucide-react";
import { useRecipes } from "@/contexts/RecipeContext";

const NAV_ITEMS = [
  { path: "/random", label: "随机", icon: Dice5 },
  { path: "/add", label: "添加", icon: Plus },
  { path: "/today", label: "今日", icon: UtensilsCrossed },
  { path: "/history", label: "历史", icon: History },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { todayMenu } = useRecipes();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card warm-shadow">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {path === "/today" && todayMenu.length > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {todayMenu.length}
                  </span>
                )}
              </span>
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
