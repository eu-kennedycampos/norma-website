import type { ProductPage } from './types';

export const ponto: ProductPage = {
  path: '/ponto-eletronico',
  product: 'ponto',
  name: 'Norma Ponto',
  dot: 'var(--c-ruler)',
  interest: 'ponto',
  seo: {
    title: 'Ponto eletrônico REP-P em nuvem (Portaria 671) — Norma Ponto',
    description:
      'Ponto eletrônico REP-P conforme a Portaria 671: app, totem com reconhecimento facial e relógios de qualquer marca. Banco de horas, espelho assinado e exportação para a folha.',
    image: '/og/ponto.png',
  },
  schema: { category: 'Controle de ponto eletrônico', os: 'Web, Android, iOS' },
  hero: {
    title: 'O ponto que marca, fecha e assina. Sem planilha no meio.',
    lead: 'REP-P em nuvem conforme a Portaria 671. A equipe marca pelo app, pelo totem ou pelo relógio que você já tem; o RH trata, fecha e manda para a folha no formato do seu contador.',
  },
  features: {
    title: 'Do primeiro registro ao arquivo da folha.',
    lead: 'Tudo o que o RH faz no mês, num lugar só — e cada marcação com prova legal.',
    items: [
      {
        title: 'Marque de onde a equipe estiver',
        text: 'App no celular com perímetro por local, totem na entrada e relógios de qualquer marca ligados ao mesmo sistema.',
      },
      {
        title: 'Totem com reconhecimento facial',
        text: 'Prova de vida no totem, sem limite de uso e sem cobrança à parte.',
      },
      {
        title: 'Tratamento do dia',
        text: 'Inconsistências, pedidos de ajuste e atestados aparecem para quem decide, com aprovação em massa.',
      },
      {
        title: 'Escalas e banco de horas',
        text: 'Calendário mensal, atribuição em massa, feriados e saldo de horas calculado sozinho.',
      },
      {
        title: 'Fechamento com espelho assinado',
        text: 'O período fecha, o espelho vai para cada pessoa assinar e fica guardado com validade.',
      },
      {
        title: 'Exportação para a folha',
        text: 'Os formatos que o seu contador importa, sem redigitar nada.',
      },
      {
        title: 'Arquivos legais em um clique',
        text: 'AFD, AEJ, Atestado Técnico e comprovantes de marcação, como pede a fiscalização.',
      },
      {
        title: 'Várias unidades, um painel',
        text: 'Organograma, relatórios e painel por centro de custo para quem cuida de mais de um lugar.',
      },
      {
        title: 'Migração sem digitar',
        text: 'Pessoas, escalas e histórico importados do sistema anterior.',
      },
    ],
  },
  included: {
    title: 'Tudo incluso. Sem franquia, sem fidelidade.',
    text: 'O preço não cresce com o que deveria vir de fábrica. Se um dia você quiser sair, cancela pelo próprio painel e vê a fatura de encerramento na hora.',
    points: [
      'Reconhecimento facial no totem',
      'Assinatura do espelho',
      'API e webhooks para integrar',
      '30 dias grátis, sem cartão',
    ],
  },
  faq: [
    {
      question: 'O que é um REP-P?',
      answer:
        'É o Registrador Eletrônico de Ponto via Programa, previsto na Portaria 671 do Ministério do Trabalho: o ponto registrado por software, com os mesmos arquivos legais e comprovantes exigidos de um relógio físico.',
    },
    {
      question: 'Posso continuar usando o relógio de ponto que já tenho?',
      answer:
        'Sim. Os relógios de qualquer marca podem ser ligados ao Norma Ponto, ao lado do app e do totem, e todas as marcações caem no mesmo lugar.',
    },
    {
      question: 'Funciona para empresa com mais de uma unidade?',
      answer:
        'Sim. Cada unidade tem as próprias escalas, locais e coletores, e a gestão acompanha tudo por organograma e centro de custo.',
    },
    {
      question: 'Como o contador recebe o fechamento?',
      answer:
        'Pela exportação para a folha, no formato que o sistema dele importa. Não é preciso redigitar horas nem montar planilha.',
    },
    {
      question: 'Quando o Norma Ponto estará disponível?',
      answer:
        'O lançamento está previsto para 2027. Quem entra na lista de espera é avisado primeiro e começa pelo teste de 30 dias, sem cartão.',
    },
  ],
  waitlist: {
    title: 'Seja avisado no lançamento.',
    text: 'Entre na lista de espera do Norma Ponto. Você recebe o convite para o teste antes de todo mundo.',
  },
};
