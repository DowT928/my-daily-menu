import { useState } from "react";
import { Recipe, CATEGORY_MAP } from "@/types/recipe";
import { useRecipes } from "@/contexts/RecipeContext";
import { MoreHorizontal, Pencil, Trash2, ChevronDown, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function daysAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "今天";
  if (diff === 1) return "昨天";
  return `${diff}天前`;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { addToToday, isInToday, deleteRecipe, getLastCooked } = useRecipes();
  const navigate = useNavigate();

  const inToday = isInToday(recipe.id);
  const lastCooked = getLastCooked(recipe.id);

  return (
    <>
      <div className="animate-fade-in rounded-lg border border-border bg-card overflow-hidden warm-shadow transition-all">
        {/* Image area */}
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-36 w-full object-cover cursor-pointer"
            onClick={() => setExpanded(!expanded)}
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <div
            className="flex h-28 w-full items-center justify-center bg-muted/50 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="text-3xl opacity-40">🍽</span>
          </div>
        )}
        <div className="p-4">
        <div className="flex items-start justify-between">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <h3 className="text-lg font-semibold text-card-foreground">{recipe.name}</h3>
            {recipe.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{recipe.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <ChevronDown
              className={`h-4 w-4 cursor-pointer text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
              onClick={() => setExpanded(!expanded)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/edit/${recipe.id}`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  编辑菜谱
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除菜谱
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Last cooked */}
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {lastCooked ? `上次做：${daysAgo(lastCooked)}` : "从未做过"}
        </div>

        {/* Expanded content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? "mt-3 max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 border-t border-border pt-3">
            {recipe.ingredients && (
              <div>
                <h4 className="text-sm font-medium text-foreground">食材：</h4>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{recipe.ingredients}</p>
              </div>
            )}
            {recipe.steps && (
              <div>
                <h4 className="text-sm font-medium text-foreground">步骤：</h4>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{recipe.steps}</p>
              </div>
            )}
            {recipe.prepTime && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">准备时间：</span>{recipe.prepTime}
              </p>
            )}
            {recipe.notes && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">备注：</span>{recipe.notes}
              </p>
            )}
          </div>
        </div>

        {/* Add to today button */}
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            variant={inToday ? "secondary" : "default"}
            onClick={() => !inToday && addToToday(recipe.id)}
            disabled={inToday}
          >
            {inToday ? "已加入 ✓" : "加入今日菜单"}
          </Button>
        </div>
      </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              {recipe.name}
              <br />
              删除后无法恢复
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteRecipe(recipe.id)}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
