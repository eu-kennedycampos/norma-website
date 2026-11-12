import type { ComparisonRow, FaqItem, ProcessStep, ProductSummary } from './types';

export const signals: string[] = [
  'A mesma informação é digitada em dois lugares.',
  'Só uma pessoa sabe como aquele relatório é montado.',
  'Aprovações acontecem no WhatsApp e se perdem.',
  'O fechamento do mês leva dias, não horas.',
  'O sistema atual tem mais telas do que você usa.',
];

export const comparison: ComparisonRow[] = [
  {
    criterion: 'Quem se adapta',
    shelf: 'A sua equipe, ao jeito do software.',
    norma: 'O software, ao jeito da sua equipe.',
  },
  { criterion: 'O que não cabe', shelf: 'Vira planilha paralela.', norma: 'Vira parte do sistema.' },
  {
    criterion: 'Suas regras',
    shelf: 'Escondidas em configurações genéricas.',
    norma: 'Escritas, revisadas e aprovadas por você.',
  },
  {
    criterion: 'Quando o processo muda',
    shelf: 'Abre um chamado e espera a próxima versão.',
    norma: 'O sistema muda junto, na próxima rodada.',
  },
  {
    criterion: 'Integrações',
    shelf: 'As que o fornecedor decidiu oferecer.',
    norma: 'As que a sua operação precisa.',
  },
  {
    criterion: 'Tarefa repetitiva',
    shelf: 'Continua com alguém da equipe.',
    norma: 'O sistema faz, a pessoa confere.',
  },
];

export const processSteps: ProcessStep[] = [
  {
    verb: 'Conhecer',
    text: 'Vamos até a sua empresa e acompanhamos quem faz o trabalho, do atendimento ao financeiro. Cada passo, cada planilha, cada exceção.',
    deliverable: 'O mapa da sua operação',
  },
  {
    verb: 'Riscar',
    text: 'Cada regra do negócio vira uma decisão escrita, que você lê, corrige e aprova antes de qualquer código.',
    deliverable: 'O plano do sistema, com prioridades e prazos',
  },
  {
    verb: 'Cortar',
    text: 'Construímos em rodadas curtas, cada uma revisada e testada. Você vê funcionando a cada etapa, não só no fim.',
    deliverable: 'Módulos prontos, um de cada vez',
  },
  {
    verb: 'Encaixar',
    text: 'Trazemos os dados das planilhas, treinamos a equipe no próprio ambiente e acompanhamos o primeiro ciclo completo.',
    deliverable: 'A equipe operando, a planilha aposentada',
  },
  {
    verb: 'Ajustar',
    text: 'Medimos o uso real, encontramos o próximo gargalo e o sistema cresce no ritmo da empresa.',
    deliverable: 'Evolução contínua, sem recomeçar',
  },
];

export const products: ProductSummary[] = [
  {
    product: 'ponto',
    name: 'Norma Ponto',
    href: '/ponto-eletronico',
    dot: 'var(--c-ruler)',
    pitch: 'Ponto eletrônico em nuvem, do celular da equipe ao relógio que você já tem.',
    highlights: [
      'REP-P conforme a Portaria 671',
      'App, totem e relógios de qualquer marca',
      'Banco de horas e espelho assinado',
      'Exportação direta para a folha',
    ],
    trial: '30 dias grátis, sem cartão',
  },
  {
    product: 'assinatura',
    name: 'Norma Assinatura',
    href: '/assinatura-eletronica',
    dot: 'var(--c-mark)',
    pitch: 'Contratos e documentos assinados por onde o cliente já está.',
    highlights: [
      'Simples, avançada ou qualificada (ICP-Brasil)',
      'Envio e código de confirmação pelo WhatsApp',
      'Verificação pública de cada documento',
      'Trilha de auditoria completa',
    ],
    trial: '14 dias grátis, sem cartão',
  },
];

export const homeFaq: FaqItem[] = [
  {
    question: 'Quanto custa um sistema sob medida?',
    answer:
      'Depende do que a sua operação precisa — e é justamente por isso que começamos conhecendo a empresa. Ao fim da primeira etapa você recebe o plano do sistema, com prioridades e prazos, e decide a partir dele.',
  },
  {
    question: 'Preciso abandonar o sistema que uso hoje?',
    answer:
      'Não. Dá para começar pelo que mais dói e ligar o novo sistema ao que já funciona. Os módulos entram um de cada vez, sem parar a operação.',
  },
  {
    question: 'O que acontece com as nossas planilhas?',
    answer:
      'Elas viram ponto de partida. Na etapa de implantação trazemos os dados para o sistema e só aposentamos a planilha quando a equipe já está operando sem ela.',
  },
  {
    question: 'Quanto tempo leva até usar alguma coisa?',
    answer:
      'O prazo de cada módulo sai no plano. Como construímos em rodadas curtas, você vê partes funcionando ao longo do caminho, e não só no fim do projeto.',
  },
  {
    question: 'Funciona no celular e no chão de fábrica?',
    answer:
      'Sim. O sistema roda no navegador do computador, no celular da equipe e em tablets na produção, e conversa com banco, prefeitura, WhatsApp e equipamentos que você já tem.',
  },
  {
    question: 'E se o processo da empresa mudar depois?',
    answer:
      'O sistema muda junto. Cada regra do negócio está escrita e aprovada por você, então ajustar uma delas é uma decisão clara, não uma reescrita.',
  },
];
