export type ConfiguratorAnswers = {
  recipientType: string;
  occasion: string;
  employeeCount: string;
  budget: string;
  needLogo: string;
  needCard: string;
  needDelivery: string;
  deadline: string;
};

export type ConfiguratorOption = {
  value: string;
  label: string;
  icon?: string;
};

export type ConfiguratorStep = {
  id: keyof ConfiguratorAnswers;
  question: string;
  hint?: string;
  options: ConfiguratorOption[];
};

export const CONFIGURATOR_STEPS: ConfiguratorStep[] = [
  {
    id: "recipientType",
    question: "Для кого подарок?",
    options: [
      { value: "Сотрудникам", label: "Сотрудникам", icon: "users" },
      { value: "Клиентам", label: "Клиентам", icon: "handshake" },
      { value: "Партнерам", label: "Партнерам", icon: "briefcase" },
      { value: "Детям сотрудников", label: "Детям сотрудников", icon: "baby" },
      { value: "Другое", label: "Другое", icon: "sparkles" },
    ],
  },
  {
    id: "occasion",
    question: "Какой повод?",
    options: [
      { value: "Новый год", label: "Новый год", icon: "tree" },
      { value: "23 февраля", label: "23 февраля", icon: "shield" },
      { value: "8 марта", label: "8 марта", icon: "flower" },
      { value: "Выпускной", label: "Выпускной", icon: "graduation" },
      { value: "День компании", label: "День компании", icon: "building" },
      { value: "Детский праздник", label: "Детский праздник", icon: "party" },
      { value: "Другое", label: "Другое", icon: "sparkles" },
    ],
  },
  {
    id: "employeeCount",
    question: "Сколько получателей?",
    options: [
      { value: "До 20 человек", label: "До 20 человек" },
      { value: "20–50 человек", label: "20–50 человек" },
      { value: "50–100 человек", label: "50–100 человек" },
      { value: "100–500 человек", label: "100–500 человек" },
      { value: "Более 500 человек", label: "Более 500 человек" },
    ],
  },
  {
    id: "budget",
    question: "Какой бюджет на один подарок?",
    options: [
      { value: "До 500 ₽", label: "До 500 ₽" },
      { value: "500–1000 ₽", label: "500–1000 ₽" },
      { value: "1000–2000 ₽", label: "1000–2000 ₽" },
      { value: "Более 2000 ₽", label: "Более 2000 ₽" },
    ],
  },
  {
    id: "needLogo",
    question: "Нужно ли разместить логотип компании?",
    hint: "Мы можем добавить ваш логотип на открытку или упаковку.",
    options: [
      { value: "Да", label: "Да" },
      { value: "Нет", label: "Нет" },
    ],
  },
  {
    id: "needCard",
    question: "Нужна поздравительная открытка?",
    options: [
      { value: "Да", label: "Да" },
      { value: "Нет", label: "Нет" },
    ],
  },
  {
    id: "needDelivery",
    question: "Нужна доставка?",
    options: [
      { value: "Да", label: "Да" },
      { value: "Нет", label: "Нет" },
      { value: "Самовывоз", label: "Самовывоз" },
    ],
  },
  {
    id: "deadline",
    question: "Когда нужен заказ?",
    options: [
      { value: "Срочно (до 7 дней)", label: "Срочно (до 7 дней)" },
      { value: "В течение месяца", label: "В течение месяца" },
      { value: "Через 1–3 месяца", label: "Через 1–3 месяца" },
      {
        value: "Пока просто изучаю варианты",
        label: "Пока просто изучаю варианты",
      },
    ],
  },
];

export function budgetRange(budget: string): { min: number; max: number } {
  switch (budget) {
    case "До 500 ₽":
      return { min: 0, max: 500 };
    case "500–1000 ₽":
      return { min: 500, max: 1000 };
    case "1000–2000 ₽":
      return { min: 1000, max: 2000 };
    case "Более 2000 ₽":
      return { min: 2000, max: 100000 };
    default:
      return { min: 0, max: 100000 };
  }
}

export function estimateHeadcount(employeeCount: string): number {
  switch (employeeCount) {
    case "До 20 человек":
      return 15;
    case "20–50 человек":
      return 35;
    case "50–100 человек":
      return 75;
    case "100–500 человек":
      return 200;
    case "Более 500 человек":
      return 600;
    default:
      return 50;
  }
}

export type ConfiguratorLead = ConfiguratorAnswers & {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  company: string;
  email: string;
  recommendedProductIds: string[];
  estimatedBudgetMin?: number;
  estimatedBudgetMax?: number;
};

export const LEADS_STORAGE_KEY = "sl-barist-config-leads";

export function loadConfiguratorLeads(): ConfiguratorLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConfiguratorLead[];
  } catch {
    return [];
  }
}

export function saveConfiguratorLead(
  lead: Omit<ConfiguratorLead, "id" | "createdAt">,
): ConfiguratorLead {
  const entry: ConfiguratorLead = {
    ...lead,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const list = [entry, ...loadConfiguratorLeads()];
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(list));
  return entry;
}
