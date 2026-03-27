import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { CatalogItem } from "@/hooks/useCatalogs";

interface CatalogManagerProps {
  items: CatalogItem[] | undefined;
  isLoading: boolean;
  onCreate: (name: string) => Promise<unknown>;
  onUpdate: (id: number, name?: string, is_active?: boolean) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function CatalogManager({
  items,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
}: CatalogManagerProps) {
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await onCreate(name);
      setNewName("");
    } catch (err) {
      toast({
        title: "Error al crear",
        description: err instanceof Error ? err.message : "Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async (id: number) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      await onUpdate(id, name, undefined);
      setEditingId(null);
    } catch (err) {
      toast({
        title: "Error al actualizar",
        description: err instanceof Error ? err.message : "Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (item: CatalogItem) => {
    try {
      await onUpdate(item.id, undefined, !item.is_active);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      setDeletingId(null);
    } catch (err) {
      toast({
        title: "No se puede eliminar",
        description: err instanceof Error ? err.message : "Inténtalo de nuevo.",
        variant: "destructive",
      });
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add new */}
      <div className="flex gap-2">
        <Input
          placeholder="Nuevo elemento..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="max-w-xs text-sm"
        />
        <Button
          size="sm"
          onClick={handleCreate}
          disabled={!newName.trim() || isCreating}
        >
          {isCreating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1" />
          )}
          Agregar
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : !items || items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic py-4 text-center">
          Sin elementos. Agrega el primero.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-lg border">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-2.5 ${!item.is_active ? "opacity-50" : ""}`}
            >
              {editingId === item.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(item.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="h-7 text-sm flex-1 max-w-xs"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-green-600 hover:text-green-700"
                    onClick={() => handleSaveEdit(item.id)}
                    disabled={isUpdating}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium">{item.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${item.is_active ? "border-green-300 text-green-700" : "border-gray-300 text-gray-500"}`}
                  >
                    {item.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    title="Editar"
                    onClick={() => { setEditingId(item.id); setEditingName(item.name); }}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title={item.is_active ? "Desactivar" : "Activar"}
                    onClick={() => handleToggle(item)}
                    disabled={isUpdating}
                  >
                    <Power className="w-3 h-3" />
                  </Button>
                  {deletingId === item.id ? (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setDeletingId(null)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Eliminar"
                      onClick={() => setDeletingId(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
