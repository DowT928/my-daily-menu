import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useRecipes } from "@/contexts/RecipeContext";
import { CATEGORIES, Category } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AddRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { recipes, addRecipe, updateRecipe } = useRecipes();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("meat");
  const [description, setDescription] = useState("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([""]);
  const [stepsList, setStepsList] = useState<string[]>([""]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newStep, setNewStep] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (isEdit) {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        setName(recipe.name);
        setCategory(recipe.category);
        setDescription(recipe.description);
        const ingList = recipe.ingredients ? recipe.ingredients.split("\n").filter(Boolean) : [""];
        setIngredientsList(ingList.length ? ingList : [""]);
        const stpList = recipe.steps ? recipe.steps.split("\n").map(s => s.replace(/^\d+\.\s*/, "")).filter(Boolean) : [""];
        setStepsList(stpList.length ? stpList : [""]);
        setPrepTime(recipe.prepTime);
        setNotes(recipe.notes);
        setImage(recipe.image || "");
      }
    }
  }, [id, isEdit, recipes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ingredients = ingredientsList.filter(i => i.trim()).join("\n");
    const steps = stepsList.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join("\n");

    const data = { name: name.trim(), category, description, ingredients, steps, prepTime, notes, image: image.trim() || undefined };
    if (isEdit) {
      updateRecipe(id!, data);
    } else {
      addRecipe(data);
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="rounded-lg p-1 text-foreground hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{isEdit ? "编辑菜谱" : "添加菜谱"}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 px-5">
        <div>
          <Label htmlFor="name">菜名 *</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="例如：红烧鸡腿" required />
        </div>

        <div>
          <Label>分类</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  category === cat.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="desc">描述</Label>
          <Input id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="例如：孩子最爱，冬天必做" />
        </div>

        <div>
          <Label>食材</Label>
          <div className="mt-1.5 space-y-2">
            {ingredientsList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">•</span>
                <Input
                  value={item}
                  onChange={e => {
                    const updated = [...ingredientsList];
                    updated[idx] = e.target.value;
                    setIngredientsList(updated);
                  }}
                  placeholder="例如：鸡腿 2个"
                  className="flex-1"
                />
                {ingredientsList.length > 1 && (
                  <button type="button" onClick={() => setIngredientsList(prev => prev.filter((_, i) => i !== idx))} className="rounded-md p-1 text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIngredientsList(prev => [...prev, ""])}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> 添加食材
            </button>
          </div>
        </div>

        <div>
          <Label>步骤</Label>
          <div className="mt-1.5 space-y-2">
            {stepsList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">{idx + 1}</span>
                <Input
                  value={item}
                  onChange={e => {
                    const updated = [...stepsList];
                    updated[idx] = e.target.value;
                    setStepsList(updated);
                  }}
                  placeholder="描述这一步操作"
                  className="flex-1"
                />
                {stepsList.length > 1 && (
                  <button type="button" onClick={() => setStepsList(prev => prev.filter((_, i) => i !== idx))} className="rounded-md p-1 text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setStepsList(prev => [...prev, ""])}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> 添加步骤
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="prepTime">准备时间</Label>
          <Input id="prepTime" value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder="例如：30分钟" />
        </div>

        <div>
          <Label>菜谱图片（可选）</Label>
          <div className="mt-1.5 flex gap-2">
            <label className="flex-1 cursor-pointer">
              <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-accent transition-colors">
                📷 拍照 / 从相册选择
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setImage(reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {image && (
              <button type="button" onClick={() => setImage("")} className="rounded-md border border-input px-3 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                移除
              </button>
            )}
          </div>
          {image && (
            <img src={image} alt="预览" className="mt-2 h-32 w-full rounded-lg border border-border object-cover" />
          )}
        </div>

        <div>
          <Label htmlFor="notes">备注</Label>
          <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="小技巧或注意事项" rows={2} />
        </div>

        <Button type="submit" className="w-full" size="lg">
          {isEdit ? "保存修改" : "添加菜谱"}
        </Button>
      </form>
    </div>
  );
}
