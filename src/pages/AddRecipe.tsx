import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
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
        setIngredients(recipe.ingredients);
        setSteps(recipe.steps);
        setPrepTime(recipe.prepTime);
        setNotes(recipe.notes);
        setImage(recipe.image || "");
      }
    }
  }, [id, isEdit, recipes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

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
          <Label htmlFor="ingredients">食材</Label>
          <Textarea id="ingredients" value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="每行一种食材" rows={4} />
        </div>

        <div>
          <Label htmlFor="steps">步骤</Label>
          <Textarea id="steps" value={steps} onChange={e => setSteps(e.target.value)} placeholder="每行一个步骤" rows={4} />
        </div>

        <div>
          <Label htmlFor="prepTime">准备时间</Label>
          <Input id="prepTime" value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder="例如：30分钟" />
        </div>

        <div>
          <Label htmlFor="image">图片链接（可选）</Label>
          <Input id="image" value={image} onChange={e => setImage(e.target.value)} placeholder="粘贴图片URL，留空则不显示图片" />
          {image.trim() && (
            <img src={image} alt="预览" className="mt-2 h-32 w-full rounded-lg border border-border object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
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
