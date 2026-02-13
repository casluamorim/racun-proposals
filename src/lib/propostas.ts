import { supabase } from "@/integrations/supabase/client";

export interface Proposta {
  id: string;
  slug: string;
  nome_empresa: string;
  data: string;
  plano_recomendado: string | null;
  cenario_atual: string;
  objetivo: string;
  trabalhos_realizados: TrabalhoRealizado[];
  resultados_obtidos: ResultadoObtido[];
  planos: Plano[];
  diferenciais: Diferencial[];
  resultados_esperados: ResultadoEsperado[];
  cta_texto: string;
  cta_whatsapp_link: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateProposta {
  id: string;
  cenario_atual: string;
  objetivo: string;
  trabalhos_realizados: TrabalhoRealizado[];
  resultados_obtidos: ResultadoObtido[];
  planos: Plano[];
  diferenciais: Diferencial[];
  resultados_esperados: ResultadoEsperado[];
  cta_texto: string;
  cta_whatsapp_link: string;
  created_at: string;
  updated_at: string;
}

export interface TrabalhoRealizado {
  id?: string;
  video?: string;
  nome: string;
  segmento: string;
  descricao: string;
}

export interface ResultadoObtido {
  id?: string;
  imagem?: string;
  titulo: string;
  descricao: string;
}

export interface Plano {
  nome: string;
  valor: string;
  periodo: string;
  itens: string[];
  destaque: boolean;
}

export interface Diferencial {
  titulo: string;
  descricao: string;
}

export interface ResultadoEsperado {
  titulo: string;
  descricao: string;
}

export async function getPropostaBySlug(slug: string): Promise<Proposta | null> {
  const { data, error } = await supabase
    .from('propostas')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !data) return null;
  return data as unknown as Proposta;
}

export async function getAllPropostas(): Promise<Proposta[]> {
  const { data, error } = await supabase
    .from('propostas')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return (data || []) as unknown as Proposta[];
}

export async function getTemplate(): Promise<TemplateProposta | null> {
  const { data, error } = await supabase
    .from('template_proposta')
    .select('*')
    .limit(1)
    .single();
  
  if (error || !data) return null;
  return data as unknown as TemplateProposta;
}

export async function updateTemplate(template: Partial<TemplateProposta>): Promise<boolean> {
  const existing = await getTemplate();
  if (!existing) return false;
  
  const { error } = await supabase
    .from('template_proposta')
    .update(template as any)
    .eq('id', existing.id);
  
  return !error;
}

export async function createProposta(params: {
  slug: string;
  nome_empresa: string;
  data: string;
  plano_recomendado?: string;
}): Promise<Proposta | null> {
  const template = await getTemplate();
  if (!template) return null;

  const { data, error } = await supabase
    .from('propostas')
    .insert({
      slug: params.slug,
      nome_empresa: params.nome_empresa,
      data: params.data,
      plano_recomendado: params.plano_recomendado || null,
      cenario_atual: template.cenario_atual,
      objetivo: template.objetivo,
      trabalhos_realizados: template.trabalhos_realizados as any,
      resultados_obtidos: template.resultados_obtidos as any,
      planos: template.planos as any,
      diferenciais: template.diferenciais as any,
      resultados_esperados: template.resultados_esperados as any,
      cta_texto: template.cta_texto,
      cta_whatsapp_link: template.cta_whatsapp_link,
    })
    .select()
    .single();
  
  if (error || !data) return null;
  return data as unknown as Proposta;
}

export async function updateProposta(id: string, updates: Partial<Proposta>): Promise<boolean> {
  const { error } = await supabase
    .from('propostas')
    .update(updates as any)
    .eq('id', id);
  
  return !error;
}

export async function deleteProposta(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('propostas')
    .delete()
    .eq('id', id);
  
  return !error;
}
