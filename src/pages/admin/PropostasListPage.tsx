import { useEffect, useState } from "react";
import { getAllPropostas, createProposta, deleteProposta, Proposta } from "@/lib/propostas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, Edit, Copy } from "lucide-react";
import { Link } from "react-router-dom";

export default function PropostasListPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [slug, setSlug] = useState("");
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [planoRecomendado, setPlanoRecomendado] = useState("");

  const load = () => getAllPropostas().then((p) => { setPropostas(p); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!nomeEmpresa || !slug) {
      toast.error("Preencha nome e slug.");
      return;
    }

    const slugClean = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (propostas.some(p => p.slug === slugClean)) {
      toast.error("Esse slug já está em uso.");
      return;
    }

    setCreating(true);
    const result = await createProposta({
      slug: slugClean,
      nome_empresa: nomeEmpresa,
      data,
      plano_recomendado: planoRecomendado || undefined,
    });

    if (result) {
      toast.success("Proposta criada com sucesso!");
      setOpen(false);
      setNomeEmpresa("");
      setSlug("");
      setPlanoRecomendado("");
      load();
    } else {
      toast.error("Erro ao criar proposta.");
    }
    setCreating(false);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a proposta de ${nome}?`)) return;
    const ok = await deleteProposta(id);
    if (ok) { toast.success("Proposta excluída."); load(); }
    else toast.error("Erro ao excluir.");
  };

  const copyLink = (s: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${s}`);
    toast.success("Link copiado!");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Propostas</h1>
          <p className="text-muted-foreground mt-1">{propostas.length} proposta(s) criada(s)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gap-2">
              <Plus className="h-4 w-4" />
              Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Proposta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} placeholder="Ex: Braseiro Grill" />
              </div>
              <div className="space-y-2">
                <Label>Slug da URL</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="Ex: braseiro" />
                <p className="text-xs text-muted-foreground">URL: /{slug || 'slug'}</p>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Plano Recomendado (opcional)</Label>
                <Input value={planoRecomendado} onChange={(e) => setPlanoRecomendado(e.target.value)} placeholder="Ex: Plano Racun Crescimento" />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full gradient-primary">
                {creating ? "Criando..." : "Criar Proposta"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {propostas.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma proposta criada ainda.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-card border border-border divide-y divide-border">
          {propostas.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
              <div className="min-w-0">
                <p className="font-medium truncate">{p.nome_empresa}</p>
                <p className="text-sm text-muted-foreground">/{p.slug} • {new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-4">
                <Button variant="ghost" size="icon" onClick={() => copyLink(p.slug)} title="Copiar link">
                  <Copy className="h-4 w-4" />
                </Button>
                <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" title="Ver proposta">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <Link to={`/admin/propostas/${p.id}`}>
                  <Button variant="ghost" size="icon" title="Editar">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id, p.nome_empresa)} title="Excluir">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
    </svg>
  );
}
