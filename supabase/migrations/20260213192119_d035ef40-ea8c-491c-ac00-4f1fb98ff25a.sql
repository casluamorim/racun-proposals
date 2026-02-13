
-- Template de proposta (modelo editável)
CREATE TABLE public.template_proposta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cenario_atual TEXT NOT NULL DEFAULT '',
  objetivo TEXT NOT NULL DEFAULT '',
  trabalhos_realizados JSONB NOT NULL DEFAULT '[]'::jsonb,
  resultados_obtidos JSONB NOT NULL DEFAULT '[]'::jsonb,
  planos JSONB NOT NULL DEFAULT '[
    {"nome": "Plano Racun Presença", "valor": "R$ 1.800", "periodo": "mês", "itens": [], "destaque": false},
    {"nome": "Plano Racun Crescimento", "valor": "R$ 2.600", "periodo": "mês", "itens": [], "destaque": true},
    {"nome": "Plano Racun Autoridade", "valor": "R$ 3.800", "periodo": "mês", "itens": [], "destaque": false}
  ]'::jsonb,
  diferenciais JSONB NOT NULL DEFAULT '[]'::jsonb,
  resultados_esperados JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_texto TEXT NOT NULL DEFAULT 'Vamos começar?',
  cta_whatsapp_link TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Propostas (snapshots congelados)
CREATE TABLE public.propostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nome_empresa TEXT NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  plano_recomendado TEXT,
  cenario_atual TEXT NOT NULL DEFAULT '',
  objetivo TEXT NOT NULL DEFAULT '',
  trabalhos_realizados JSONB NOT NULL DEFAULT '[]'::jsonb,
  resultados_obtidos JSONB NOT NULL DEFAULT '[]'::jsonb,
  planos JSONB NOT NULL DEFAULT '[]'::jsonb,
  diferenciais JSONB NOT NULL DEFAULT '[]'::jsonb,
  resultados_esperados JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_texto TEXT NOT NULL DEFAULT 'Vamos começar?',
  cta_whatsapp_link TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on slug for fast lookups
CREATE INDEX idx_propostas_slug ON public.propostas (slug);

-- Enable RLS
ALTER TABLE public.template_proposta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- Public read access for propostas (anyone can view a proposal by slug)
CREATE POLICY "Public can view propostas" ON public.propostas
  FOR SELECT USING (true);

-- Only authenticated users (admin) can manage propostas
CREATE POLICY "Admin can insert propostas" ON public.propostas
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update propostas" ON public.propostas
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin can delete propostas" ON public.propostas
  FOR DELETE TO authenticated USING (true);

-- Template: authenticated users only
CREATE POLICY "Admin can view template" ON public.template_proposta
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can insert template" ON public.template_proposta
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update template" ON public.template_proposta
  FOR UPDATE TO authenticated USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_template_proposta_updated_at
  BEFORE UPDATE ON public.template_proposta
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_propostas_updated_at
  BEFORE UPDATE ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default template
INSERT INTO public.template_proposta (cenario_atual, objetivo, cta_texto, cta_whatsapp_link, diferenciais, resultados_esperados)
VALUES (
  'Sua empresa ainda não explora todo o potencial do marketing digital. A presença online é limitada e as estratégias atuais não geram os resultados esperados.',
  'Posicionar sua marca como referência no segmento, aumentar a visibilidade online e gerar resultados mensuráveis através de estratégias de marketing digital personalizadas.',
  'Vamos transformar seus resultados?',
  'https://wa.me/5500000000000',
  '[{"titulo": "Equipe Especializada", "descricao": "Profissionais com anos de experiência em marketing digital"}, {"titulo": "Resultados Mensuráveis", "descricao": "Relatórios detalhados e KPIs claros"}, {"titulo": "Atendimento Personalizado", "descricao": "Estratégias sob medida para cada cliente"}]',
  '[{"titulo": "Aumento de Visibilidade", "descricao": "Crescimento significativo na presença digital"}, {"titulo": "Geração de Leads", "descricao": "Mais oportunidades de negócio qualificadas"}, {"titulo": "ROI Positivo", "descricao": "Retorno sobre investimento comprovado"}]'
);
