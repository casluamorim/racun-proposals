import { useEffect, useState } from "react";
import { getAllPropostas, Proposta } from "@/lib/propostas";
import { FileText, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  useEffect(() => {
    getAllPropostas().then(setPropostas);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral das suas propostas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-lg shadow-card p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{propostas.length}</p>
              <p className="text-muted-foreground text-sm">Propostas criadas</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {propostas.filter(p => {
                  const d = new Date(p.created_at);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-muted-foreground text-sm">Este mês</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card p-6 border border-border flex items-center justify-center">
          <Link to="/admin/propostas">
            <Button className="gradient-primary gap-2">
              <Plus className="h-4 w-4" />
              Nova Proposta
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent */}
      <div>
        <h2 className="font-display text-xl font-bold mb-4">Propostas Recentes</h2>
        {propostas.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma proposta criada ainda.</p>
        ) : (
          <div className="bg-card rounded-lg shadow-card border border-border divide-y divide-border">
            {propostas.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                to={`/admin/propostas/${p.id}`}
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{p.nome_empresa}</p>
                  <p className="text-muted-foreground text-sm">/{p.slug}</p>
                </div>
                <span className="text-muted-foreground text-sm">
                  {new Date(p.created_at).toLocaleDateString('pt-BR')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
