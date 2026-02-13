import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Proposta, TrabalhoRealizado, ResultadoObtido, Plano, Diferencial, ResultadoEsperado, updateProposta } from "@/lib/propostas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, ArrowLeft, Plus, Trash2, FileDown } from "lucide-react";

export default function PropostaEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('propostas').select('*').eq('id', id).single().then(({ data }) => {
      setProposta(data as unknown as Proposta);
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    if (!proposta) return;
    setSaving(true);
    const ok = await updateProposta(proposta.id, {
      nome_empresa: proposta.nome_empresa,
      cenario_atual: proposta.cenario_atual,
      objetivo: proposta.objetivo,
      trabalhos_realizados: proposta.trabalhos_realizados,
      resultados_obtidos: proposta.resultados_obtidos,
      planos: proposta.planos,
      diferenciais: proposta.diferenciais,
      resultados_esperados: proposta.resultados_esperados,
      cta_texto: proposta.cta_texto,
      cta_whatsapp_link: proposta.cta_whatsapp_link,
      plano_recomendado: proposta.plano_recomendado,
    } as any);
    if (ok) toast.success("Proposta salva!");
    else toast.error("Erro ao salvar.");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!proposta) return <p>Proposta não encontrada.</p>;

  const update = (field: keyof Proposta, value: any) => setProposta({ ...proposta, [field]: value });

  // Trabalhos
  const addTrabalho = () => update('trabalhos_realizados', [...proposta.trabalhos_realizados, { nome: '', segmento: '', descricao: '', video: '' }]);
  const removeTrabalho = (i: number) => { const t = [...proposta.trabalhos_realizados]; t.splice(i, 1); update('trabalhos_realizados', t); };
  const updateTrabalho = (i: number, f: keyof TrabalhoRealizado, v: string) => { const t = [...proposta.trabalhos_realizados]; t[i] = { ...t[i], [f]: v }; update('trabalhos_realizados', t); };

  // Resultados
  const addResultado = () => update('resultados_obtidos', [...proposta.resultados_obtidos, { titulo: '', descricao: '', imagem: '' }]);
  const removeResultado = (i: number) => { const r = [...proposta.resultados_obtidos]; r.splice(i, 1); update('resultados_obtidos', r); };
  const updateResultado = (i: number, f: keyof ResultadoObtido, v: string) => { const r = [...proposta.resultados_obtidos]; r[i] = { ...r[i], [f]: v }; update('resultados_obtidos', r); };

  // Planos
  const updatePlano = (i: number, f: keyof Plano, v: any) => { const p = [...proposta.planos]; p[i] = { ...p[i], [f]: v }; update('planos', p); };
  const addPlanoItem = (pi: number) => { const p = [...proposta.planos]; p[pi].itens.push(''); update('planos', p); };
  const removePlanoItem = (pi: number, ii: number) => { const p = [...proposta.planos]; p[pi].itens.splice(ii, 1); update('planos', p); };
  const updatePlanoItem = (pi: number, ii: number, v: string) => { const p = [...proposta.planos]; p[pi].itens[ii] = v; update('planos', p); };

  // Diferenciais
  const addDif = () => update('diferenciais', [...proposta.diferenciais, { titulo: '', descricao: '' }]);
  const removeDif = (i: number) => { const d = [...proposta.diferenciais]; d.splice(i, 1); update('diferenciais', d); };
  const updateDif = (i: number, f: keyof Diferencial, v: string) => { const d = [...proposta.diferenciais]; d[i] = { ...d[i], [f]: v }; update('diferenciais', d); };

  // Resultados esperados
  const addResEsp = () => update('resultados_esperados', [...proposta.resultados_esperados, { titulo: '', descricao: '' }]);
  const removeResEsp = (i: number) => { const r = [...proposta.resultados_esperados]; r.splice(i, 1); update('resultados_esperados', r); };
  const updateResEsp = (i: number, f: keyof ResultadoEsperado, v: string) => { const r = [...proposta.resultados_esperados]; r[i] = { ...r[i], [f]: v }; update('resultados_esperados', r); };

  const handlePDF = () => {
    window.open(`/${proposta.slug}`, '_blank');
    toast.info("Para gerar PDF, use Ctrl+P / Cmd+P na página da proposta.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/propostas')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">{proposta.nome_empresa}</h1>
            <p className="text-muted-foreground text-sm">/{proposta.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePDF} className="gap-2">
            <FileDown className="h-4 w-4" /> PDF
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-primary gap-2">
            <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Dados básicos */}
      <section className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <h2 className="font-display text-xl font-bold">Dados da Proposta</h2>
        <div className="space-y-2">
          <Label>Nome da Empresa</Label>
          <Input value={proposta.nome_empresa} onChange={(e) => update('nome_empresa', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Cenário Atual</Label>
          <Textarea value={proposta.cenario_atual} onChange={(e) => update('cenario_atual', e.target.value)} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>Objetivo</Label>
          <Textarea value={proposta.objetivo} onChange={(e) => update('objetivo', e.target.value)} rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Texto CTA</Label>
            <Input value={proposta.cta_texto} onChange={(e) => update('cta_texto', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Link WhatsApp</Label>
            <Input value={proposta.cta_whatsapp_link} onChange={(e) => update('cta_whatsapp_link', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Trabalhos Realizados */}
      <section className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Trabalhos Realizados</h2>
          <Button variant="outline" size="sm" onClick={addTrabalho} className="gap-1"><Plus className="h-3 w-3" /> Adicionar</Button>
        </div>
        {proposta.trabalhos_realizados.map((t, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Trabalho {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => removeTrabalho(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nome</Label><Input value={t.nome} onChange={(e) => updateTrabalho(i, 'nome', e.target.value)} /></div>
              <div className="space-y-1"><Label>Segmento</Label><Input value={t.segmento} onChange={(e) => updateTrabalho(i, 'segmento', e.target.value)} /></div>
            </div>
            <div className="space-y-1"><Label>Vídeo (URL YouTube ou upload)</Label><Input value={t.video || ''} onChange={(e) => updateTrabalho(i, 'video', e.target.value)} placeholder="https://youtube.com/..." /></div>
            <div className="space-y-1"><Label>Descrição</Label><Textarea value={t.descricao} onChange={(e) => updateTrabalho(i, 'descricao', e.target.value)} rows={2} /></div>
          </div>
        ))}
      </section>

      {/* Resultados Obtidos */}
      <section className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Resultados Obtidos</h2>
          <Button variant="outline" size="sm" onClick={addResultado} className="gap-1"><Plus className="h-3 w-3" /> Adicionar</Button>
        </div>
        {proposta.resultados_obtidos.map((r, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Resultado {i + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => removeResultado(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <div className="space-y-1"><Label>Imagem (URL)</Label><Input value={r.imagem || ''} onChange={(e) => updateResultado(i, 'imagem', e.target.value)} /></div>
            <div className="space-y-1"><Label>Título</Label><Input value={r.titulo} onChange={(e) => updateResultado(i, 'titulo', e.target.value)} /></div>
            <div className="space-y-1"><Label>Descrição</Label><Textarea value={r.descricao} onChange={(e) => updateResultado(i, 'descricao', e.target.value)} rows={2} /></div>
          </div>
        ))}
      </section>

      {/* Planos */}
      <section className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <h2 className="font-display text-xl font-bold">Planos</h2>
        {proposta.planos.map((p, pi) => (
          <div key={pi} className="border border-border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nome</Label><Input value={p.nome} onChange={(e) => updatePlano(pi, 'nome', e.target.value)} /></div>
              <div className="space-y-1"><Label>Valor</Label><Input value={p.valor} onChange={(e) => updatePlano(pi, 'valor', e.target.value)} /></div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={p.destaque} onCheckedChange={(v) => updatePlano(pi, 'destaque', v)} />
              <Label>Destaque</Label>
            </div>
            <div className="space-y-2">
              <Label>Itens</Label>
              {p.itens.map((item, ii) => (
                <div key={ii} className="flex gap-2">
                  <Input value={item} onChange={(e) => updatePlanoItem(pi, ii, e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removePlanoItem(pi, ii)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addPlanoItem(pi)} className="gap-1"><Plus className="h-3 w-3" /> Item</Button>
            </div>
          </div>
        ))}
      </section>

      {/* Diferenciais */}
      <section className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Diferenciais</h2>
          <Button variant="outline" size="sm" onClick={addDif} className="gap-1"><Plus className="h-3 w-3" /> Adicionar</Button>
        </div>
        {proposta.diferenciais.map((d, i) => (
          <div key={i} className="flex gap-3 items-start border border-border rounded-lg p-3">
            <div className="flex-1 space-y-2">
              <Input value={d.titulo} onChange={(e) => updateDif(i, 'titulo', e.target.value)} placeholder="Título" />
              <Input value={d.descricao} onChange={(e) => updateDif(i, 'descricao', e.target.value)} placeholder="Descrição" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeDif(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </section>

      {/* Resultados Esperados */}
      <section className="bg-card rounded-lg shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Resultados Esperados</h2>
          <Button variant="outline" size="sm" onClick={addResEsp} className="gap-1"><Plus className="h-3 w-3" /> Adicionar</Button>
        </div>
        {proposta.resultados_esperados.map((r, i) => (
          <div key={i} className="flex gap-3 items-start border border-border rounded-lg p-3">
            <div className="flex-1 space-y-2">
              <Input value={r.titulo} onChange={(e) => updateResEsp(i, 'titulo', e.target.value)} placeholder="Título" />
              <Input value={r.descricao} onChange={(e) => updateResEsp(i, 'descricao', e.target.value)} placeholder="Descrição" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeResEsp(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </section>
    </div>
  );
}
