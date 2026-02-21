import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Recipe, HistoryEntry } from "@/types/recipe";
import { SEED_RECIPES } from "@/lib/seedData";

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface RecipeContextType {
  recipes: Recipe[];
  todayMenu: string[];
  history: HistoryEntry[];
  addRecipe: (recipe: Omit<Recipe, "id" | "createdAt">) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  addToToday: (recipeId: string) => void;
  removeFromToday: (recipeId: string) => void;
  completeToday: () => void;
  reAddHistory: (entry: HistoryEntry) => void;
  getLastCooked: (recipeId: string) => string | null;
  isInToday: (recipeId: string) => boolean;
}

const RecipeContext = createContext<RecipeContextType | null>(null);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const stored = localStorage.getItem("recipes");
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fall through */ }
    }
    return SEED_RECIPES;
  });

  const [todayMenu, setTodayMenu] = useState<string[]>(() => {
    const stored = localStorage.getItem("todayMenu");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === getTodayStr()) return parsed.recipeIds;
      } catch { /* fall through */ }
    }
    return [];
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const stored = localStorage.getItem("history");
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fall through */ }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("todayMenu", JSON.stringify({ date: getTodayStr(), recipeIds: todayMenu }));
  }, [todayMenu]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const addRecipe = useCallback((recipe: Omit<Recipe, "id" | "createdAt">) => {
    setRecipes(prev => [...prev, { ...recipe, id: generateId(), createdAt: getTodayStr() }]);
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    setTodayMenu(prev => prev.filter(rid => rid !== id));
  }, []);

  const addToToday = useCallback((recipeId: string) => {
    setTodayMenu(prev => prev.includes(recipeId) ? prev : [...prev, recipeId]);
  }, []);

  const removeFromToday = useCallback((recipeId: string) => {
    setTodayMenu(prev => prev.filter(rid => rid !== recipeId));
  }, []);

  const completeToday = useCallback(() => {
    if (todayMenu.length === 0) return;
    const entry: HistoryEntry = {
      date: getTodayStr(),
      items: todayMenu.map(id => {
        const r = recipes.find(r => r.id === id);
        return { id, name: r?.name || "未知菜谱" };
      }),
    };
    setHistory(prev => {
      const existing = prev.findIndex(h => h.date === entry.date);
      if (existing >= 0) {
        const updated = [...prev];
        const existingItems = updated[existing].items;
        const newItems = entry.items.filter(
          item => !existingItems.some(e => e.id === item.id)
        );
        updated[existing] = { ...updated[existing], items: [...existingItems, ...newItems] };
        return updated;
      }
      return [entry, ...prev];
    });
    setTodayMenu([]);
  }, [todayMenu, recipes]);

  const reAddHistory = useCallback((entry: HistoryEntry) => {
    const existingIds = new Set(recipes.map(r => r.id));
    entry.items.forEach(item => {
      if (existingIds.has(item.id)) {
        setTodayMenu(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
      }
    });
  }, [recipes]);

  const getLastCooked = useCallback((recipeId: string): string | null => {
    for (const entry of history) {
      if (entry.items.some(item => item.id === recipeId)) {
        return entry.date;
      }
    }
    return null;
  }, [history]);

  const isInToday = useCallback((recipeId: string) => todayMenu.includes(recipeId), [todayMenu]);

  return (
    <RecipeContext.Provider value={{
      recipes, todayMenu, history,
      addRecipe, updateRecipe, deleteRecipe,
      addToToday, removeFromToday, completeToday, reAddHistory,
      getLastCooked, isInToday,
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipeProvider");
  return ctx;
}
