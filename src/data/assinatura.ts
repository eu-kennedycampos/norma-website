import type { ProductPage } from './types';

export const assinatura: ProductPage = {
  path: '/assinatura-eletronica',
  product: 'assinatura',
  name: 'Norma Assinatura',
  dot: 'var(--c-mark)',
  interest: 'assinatura',
  seo: {
    title: 'Assinatura eletrônica com validade jurídica e ICP-Brasil — Norma Assinatura',
    description:
      'Assinatura eletrônica simples, avançada ou qualificada (ICP-Brasil), enviada por WhatsApp ou e-mail, com verificação pública e evidência de longo prazo. Pague só o que for concluído.',
    image: '/og/assinatura.png',
  },
  schema: { category: 'Assinatura eletrônica de documentos', os: 'Web' },
  hero: {
    title: 'Contrato assinado por onde o cliente já está.',
    lead: 'Envie pelo WhatsApp ou pelo e-mail, acompanhe em tempo real e guarde com validade jurídica — da assinatura simples à qualificada ICP-Brasil.',
  },
  features: {
    title: 'Do envio ao documento que se prova sozinho.',
    lead: 'Feito para quem assina contrato todo dia e não pode perder nenhum.',
    items: [
      {
        title: 'Os três níveis da lei',
        text: 'Simples, avançada ou qualificada ICP-Brasil — inclusive com certificado em nuvem ou A1 direto no navegador.',
      },
      {
        title: 'WhatsApp ou e-mail',
        text: 'O convite chega por onde a pessoa responde, com código de confirmação.',
      },
      {
        title: 'Modelos e campos',
        text: 'Suba PDF ou DOCX, use modelos, arraste os campos de assinatura e rubrica, defina ordem e quórum.',
      },
      {
        title: 'Acompanhamento em tempo real',
        text: 'Veja quem já abriu e quem falta, reenvie por outro canal e programe lembretes.',
      },
      {
        title: 'Evidência de longo prazo',
        text: 'Selo PAdES com carimbo do tempo, para o documento continuar provando o que diz daqui a anos.',
      },
      {
        title: 'Verificação pública',
        text: 'Qualquer pessoa confere a autenticidade pelo código, sem que o documento seja exposto.',
      },
      {
        title: 'Traga o que você já tem',
        text: 'PDFs que já chegam assinados e o acervo de outro provedor entram no mesmo lugar.',
      },
      {
        title: 'Usuários ilimitados',
        text: 'A equipe inteira envia e acompanha, sem pagar por cadeira.',
      },
      {
        title: 'API para o seu sistema',
        text: 'Envie e receba documentos assinados direto do seu ERP, CRM ou sistema próprio.',
      },
    ],
  },
  included: {
    title: 'Você paga o que foi assinado.',
    text: 'Envelope cancelado ou esquecido não entra na conta. Usuários ilimitados e API fazem parte de todo plano.',
    points: [
      'Cobrança só do envelope concluído',
      'Usuários ilimitados',
      'API inclusa',
      '14 dias grátis, sem cartão',
    ],
  },
  faq: [
    {
      question: 'Assinatura eletrônica tem validade jurídica?',
      answer:
        'Sim. A MP 2.200-2/2001 e a Lei 14.063/2020 reconhecem a assinatura eletrônica em três níveis — simples, avançada e qualificada —, e cada um serve a um tipo de documento.',
    },
    {
      question: 'Qual nível de assinatura devo usar?',
      answer:
        'A simples resolve a maior parte dos contratos do dia a dia; a avançada acrescenta mais provas de quem assinou; a qualificada usa certificado ICP-Brasil e é a exigida em alguns atos e órgãos públicos.',
    },
    {
      question: 'Quem assina precisa criar conta?',
      answer:
        'Não. A pessoa recebe o convite pelo WhatsApp ou e-mail, confirma o código e assina pelo navegador do celular ou do computador.',
    },
    {
      question: 'Consigo integrar ao meu sistema?',
      answer:
        'Sim. A API está inclusa em todo plano, com ambiente de testes e avisos automáticos de cada assinatura.',
    },
    {
      question: 'Quando o Norma Assinatura estará disponível?',
      answer:
        'O lançamento está previsto para 2027. Quem entra na lista de espera é avisado primeiro e começa pelo teste de 14 dias, sem cartão.',
    },
  ],
  waitlist: {
    title: 'Seja avisado no lançamento.',
    text: 'Entre na lista de espera do Norma Assinatura. Você recebe o convite para o teste antes de todo mundo.',
  },
};
