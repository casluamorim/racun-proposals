import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPropostaBySlug, Proposta } from "@/lib/propostas";
import { MessageSquare, CheckCircle, Target, Briefcase, TrendingUp, Star, ArrowRight } from "lucide-react";

function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <section className={`animate-fade-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </section>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground">{children}</h2>
      {subtitle && <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export default function PropostaPage() {
  const { slug } = useParams<{ slug: string }>();
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getPropostaBySlug(slug).then((p) => {
      if (!p) setNotFound(true);
      else setProposta(p);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !proposta) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Proposta não encontrada</h1>
          <p className="text-muted-foreground">Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const dataFormatada = new Date(proposta.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-primary text-primary-foreground py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <p className="text-sm uppercase tracking-[0.3em] opacity-80 mb-4">Proposta Comercial</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">{proposta.nome_empresa}</h1>
          <p className="opacity-70 text-lg">{dataFormatada}</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 space-y-20 md:space-y-32">
        {/* Cenário Atual */}
        {proposta.cenario_atual && (
          <Section delay={100}>
            <SectionTitle subtitle="Entendendo o momento da sua empresa">
              <Target className="inline-block mr-3 h-7 w-7 text-primary" />
              Análise Inicial
            </SectionTitle>
            <div className="bg-accent/50 rounded-lg p-6 md:p-8 text-foreground/80 leading-relaxed whitespace-pre-line">
              {proposta.cenario_atual}
            </div>
          </Section>
        )}

        {/* Objetivo */}
        {proposta.objetivo && (
          <Section delay={200}>
            <SectionTitle subtitle="O que vamos alcançar juntos">
              <Briefcase className="inline-block mr-3 h-7 w-7 text-primary" />
              Objetivo Estratégico
            </SectionTitle>
            <div className="bg-accent/50 rounded-lg p-6 md:p-8 text-foreground/80 leading-relaxed whitespace-pre-line">
              {proposta.objetivo}
            </div>
          </Section>
        )}

        {/* Trabalhos Realizados */}
        {proposta.trabalhos_realizados.length > 0 && (
          <Section delay={300}>
            <SectionTitle subtitle="Cases de sucesso da Agência Racun">
              <Star className="inline-block mr-3 h-7 w-7 text-primary" />
              Trabalhos Realizados
            </SectionTitle>
            <div className="grid gap-6 md:grid-cols-2">
              {proposta.trabalhos_realizados.map((t, i) => (
                <div key={i} className="bg-card rounded-lg shadow-card p-6 border border-border hover:shadow-elevated transition-shadow">
                  {t.video && (
                    <div className="mb-4 aspect-video rounded-md overflow-hidden bg-muted">
                      {t.video.includes('youtube') || t.video.includes('youtu.be') ? (
                        <iframe
                          src={t.video.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video src={t.video} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <span className="text-xs uppercase tracking-wider text-primary font-semibold">{t.segmento}</span>
                  <h3 className="font-display text-lg font-bold mt-1">{t.nome}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{t.descricao}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Resultados Obtidos */}
        {proposta.resultados_obtidos.length > 0 && (
          <Section delay={400}>
            <SectionTitle subtitle="Números que comprovam nosso trabalho">
              <TrendingUp className="inline-block mr-3 h-7 w-7 text-primary" />
              Resultados Obtidos
            </SectionTitle>
            <div className="grid gap-6 md:grid-cols-3">
              {proposta.resultados_obtidos.map((r, i) => (
                <div key={i} className="text-center bg-card rounded-lg shadow-card p-6 border border-border">
                  {r.imagem && (
                    <img src={r.imagem} alt={r.titulo} className="w-full h-32 object-cover rounded-md mb-4" />
                  )}
                  <h3 className="font-display text-lg font-bold">{r.titulo}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{r.descricao}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Planos */}
        {proposta.planos.length > 0 && (
          <Section delay={500}>
            <SectionTitle subtitle="Escolha o plano ideal para sua empresa">
              O que está incluso
            </SectionTitle>
            <div className="grid gap-6 md:grid-cols-3">
              {proposta.planos.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-6 border transition-shadow ${
                    p.destaque
                      ? "gradient-primary text-primary-foreground shadow-elevated scale-[1.03]"
                      : "bg-card border-border shadow-card hover:shadow-elevated"
                  } ${proposta.plano_recomendado === p.nome ? "ring-2 ring-primary" : ""}`}
                >
                  {proposta.plano_recomendado === p.nome && (
                    <span className={`text-xs uppercase tracking-wider font-semibold mb-2 block ${p.destaque ? "opacity-80" : "text-primary"}`}>
                      ★ Recomendado
                    </span>
                  )}
                  <h3 className="font-display text-lg font-bold">{p.nome}</h3>
                  <div className="mt-3 mb-4">
                    <span className="text-3xl font-bold">{p.valor}</span>
                    <span className={`text-sm ml-1 ${p.destaque ? "opacity-70" : "text-muted-foreground"}`}>/ {p.periodo}</span>
                  </div>
                  {p.itens.length > 0 && (
                    <ul className="space-y-2">
                      {p.itens.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${p.destaque ? "opacity-80" : "text-primary"}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Diferenciais */}
        {proposta.diferenciais.length > 0 && (
          <Section delay={600}>
            <SectionTitle subtitle="Por que escolher a Agência Racun">
              Nossos Diferenciais
            </SectionTitle>
            <div className="grid gap-6 md:grid-cols-3">
              {proposta.diferenciais.map((d, i) => (
                <div key={i} className="text-center p-6">
                  <div className="w-12 h-12 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{d.titulo}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{d.descricao}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Resultados Esperados */}
        {proposta.resultados_esperados.length > 0 && (
          <Section delay={700}>
            <SectionTitle subtitle="O que você pode esperar">
              Resultados Esperados
            </SectionTitle>
            <div className="grid gap-4 md:grid-cols-3">
              {proposta.resultados_esperados.map((r, i) => (
                <div key={i} className="bg-accent/50 rounded-lg p-6">
                  <h3 className="font-display font-bold">{r.titulo}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{r.descricao}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        <Section delay={800}>
          <div className="gradient-primary rounded-2xl p-10 md:p-16 text-center text-primary-foreground">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">{proposta.cta_texto}</h2>
            {proposta.cta_whatsapp_link && (
              <a
                href={proposta.cta_whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                <MessageSquare className="h-5 w-5" />
                Falar no WhatsApp
                <ArrowRight className="h-5 w-5" />
              </a>
            )}
          </div>
        </Section>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        <p>© {new Date().getFullYear()} Agência Racun. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
