import { useEffect, useState } from "react";
import { getTemplate, updateTemplate, TemplateProposta, Plano, Diferencial, ResultadoEsperado } from "@/lib/propostas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

export default function TemplatePage() {
  const [template, setTemplate] = useState<TemplateProposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTemplate().then((t) => {
      setTemplate(t);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!template) return;
    setSaving(true);
    const ok = await updateTemplate(template);
    if (ok) toast.success("Template salvo com sucesso!");
    else toast.error("Erro ao salvar template.");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!template) return <p className="text-muted-foreground">Template não encontrado.</p>;

  const updateField = (field: keyof TemplateProposta, value: any) => {
    setTemplate({ ...template, [field]: value });
  };

  const updatePlano = (index: number, field: keyof Plano, value: any) => {
    const planos = [...template.planos];
    planos[index] = { ...planos[index], [field]: value };
    updateField('planos', planos);
  };

  const addPlanoItem = (planoIndex: number) => {
    const planos = [...template.planos];
    planos[planoIndex].itens.push('');
    updateField('planos', planos);
  };

  const removePlanoItem = (planoIndex: number, itemIndex: number) => {
    const planos = [...template.planos];
    planos[planoIndex].itens.splice(itemIndex, 1);
    updateField('planos', planos);
  };

  const updatePlanoItem = (planoIndex: number, itemIndex: number, value: string) => {
    const planos = [...template.planos];
    planos[planoIndex].itens[itemIndex] = value;
    updateField('planos', planos);
  };

  const addDiferencial = () => {
    updateField('diferenciais', [...template.diferenciais, { titulo: '', descricao: '' }]);
  };

  const removeDiferencial = (i: number) => {
    const d = [...template.diferenciais];
    d.splice(i, 1);
    updateField('diferenciais', d);
  };

  const updateDiferencial = (i: number, field: keyof Diferencial, value: string) => {
    const d = [...template.diferenciais];
    d[i] = { ...d[i], [field]: value };
    updateField('diferenciais', d);
  };

  const addResultadoEsperado = () => {
    updateField('resultados_esperados', [...template.resultados_esperados, { titulo: '', descricao: '' }]);
  };

  const removeResultadoEsperado = (i: number) => {
    const r = [...template.resultados_esperados];
    r.splice(i, 1);
    updateField('resultados_esperados', r);
  };

  const updateResultadoEsperado = (i: number, field: keyof ResultadoEsperado, value: string) => {
    const r = [...template.resultados_esperados];
    r[i] = { ...r[i], [field]: value };
    updateField('resultados_esperados', r);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Template Padrão</h1>
          <p className="text-muted-foreground mt-1">Edite o modelo que será copiado para novas propostas</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-primary gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      {/* Textos */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <h2 className="font-display text-xl font-bold">Textos Padrão</h2>
        <div className="space-y-2">
          <Label>Cenário Atual</Label>
          <Textarea value={template.cenario_atual} onChange={(e) => updateField('cenario_atual', e.target.value)} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>Objetivo</Label>
          <Textarea value={template.objetivo} onChange={(e) => updateField('objetivo', e.target.value)} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>Texto CTA</Label>
          <Input value={template.cta_texto} onChange={(e) => updateField('cta_texto', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Link WhatsApp</Label>
          <Input value={template.cta_whatsapp_link} onChange={(e) => updateField('cta_whatsapp_link', e.target.value)} placeholder="https://wa.me/5500000000000" />
        </div>
      </div>

      {/* Planos */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <h2 className="font-display text-xl font-bold">Planos</h2>
        {template.planos.map((plano, pi) => (
          <div key={pi} className="border border-border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input value={plano.nome} onChange={(e) => updatePlano(pi, 'nome', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Valor</Label>
                <Input value={plano.valor} onChange={(e) => updatePlano(pi, 'valor', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Itens inclusos</Label>
              {plano.itens.map((item, ii) => (
                <div key={ii} className="flex gap-2">
                  <Input value={item} onChange={(e) => updatePlanoItem(pi, ii, e.target.value)} placeholder="Item do plano" />
                  <Button variant="ghost" size="icon" onClick={() => removePlanoItem(pi, ii)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addPlanoItem(pi)} className="gap-1">
                <Plus className="h-3 w-3" /> Adicionar item
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Diferenciais */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Diferenciais</h2>
          <Button variant="outline" size="sm" onClick={addDiferencial} className="gap-1">
            <Plus className="h-3 w-3" /> Adicionar
          </Button>
        </div>
        {template.diferenciais.map((d, i) => (
          <div key={i} className="flex gap-3 items-start border border-border rounded-lg p-3">
            <div className="flex-1 space-y-2">
              <Input value={d.titulo} onChange={(e) => updateDiferencial(i, 'titulo', e.target.value)} placeholder="Título" />
              <Input value={d.descricao} onChange={(e) => updateDiferencial(i, 'descricao', e.target.value)} placeholder="Descrição" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeDiferencial(i)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* Resultados Esperados */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Resultados Esperados</h2>
          <Button variant="outline" size="sm" onClick={addResultadoEsperado} className="gap-1">
            <Plus className="h-3 w-3" /> Adicionar
          </Button>
        </div>
        {template.resultados_esperados.map((r, i) => (
          <div key={i} className="flex gap-3 items-start border border-border rounded-lg p-3">
            <div className="flex-1 space-y-2">
              <Input value={r.titulo} onChange={(e) => updateResultadoEsperado(i, 'titulo', e.target.value)} placeholder="Título" />
              <Input value={r.descricao} onChange={(e) => updateResultadoEsperado(i, 'descricao', e.target.value)} placeholder="Descrição" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeResultadoEsperado(i)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
