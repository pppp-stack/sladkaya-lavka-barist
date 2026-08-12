import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Briefcase,
  Building2,
  Check,
  Flower2,
  Gift,
  GraduationCap,
  Handshake,
  Loader2,
  PartyPopper,
  Shield,
  Sparkles,
  TreePine,
  Users,
} from "lucide-react";
import { useContent } from "../content/ContentProvider";
import {
  budgetRange,
  CONFIGURATOR_STEPS,
  estimateHeadcount,
  saveConfiguratorLead,
  type ConfiguratorAnswers,
} from "../data/configurator";

const MATCHING_LINES = [
  "Смотрим подходящие наборы…",
  "Сверяем бюджет и количество…",
  "Учитываем повод и брендирование…",
  "Почти готово…",
];

const emptyAnswers: ConfiguratorAnswers = {
  recipientType: "",
  occasion: "",
  employeeCount: "",
  budget: "",
  needLogo: "",
  needCard: "",
  needDelivery: "",
  deadline: "",
};

type Phase = "steps" | "matching" | "results" | "success";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  users: Users,
  handshake: Handshake,
  briefcase: Briefcase,
  baby: Baby,
  sparkles: Sparkles,
  tree: TreePine,
  shield: Shield,
  flower: Flower2,
  graduation: GraduationCap,
  building: Building2,
  party: PartyPopper,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ConfiguratorWizard() {
  const { content } = useContent();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("steps");
  const [answers, setAnswers] = useState<ConfiguratorAnswers>(emptyAnswers);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [estimate, setEstimate] = useState({ min: 0, max: 0 });
  const [matchingLine, setMatchingLine] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    email: "",
  });

  const totalSteps = CONFIGURATOR_STEPS.length;
  const current = CONFIGURATOR_STEPS[step];
  const canNext = Boolean(answers[current.id]);

  const progress = useMemo(() => {
    if (phase === "matching") return 92;
    if (phase === "results" || phase === "success") return 100;
    return ((step + 1) / (totalSteps + 1)) * 100;
  }, [phase, step, totalSteps]);

  useEffect(() => {
    if (phase !== "matching") return;
    const id = window.setInterval(() => {
      setMatchingLine((i) => (i + 1) % MATCHING_LINES.length);
    }, 750);
    return () => window.clearInterval(id);
  }, [phase]);

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function recommend() {
    const range = budgetRange(answers.budget);
    const headcount = estimateHeadcount(answers.employeeCount);
    let list = content.products.filter(
      (p) =>
        p.price >= Math.max(0, range.min) &&
        (range.max >= 100000 || p.price <= range.max),
    );
    if (list.length < 3) {
      list = [...content.products].sort((a, b) => a.price - b.price);
    } else {
      list = [...list].sort((a, b) => a.price - b.price);
    }
    const picked = list.slice(0, 6);
    const perMin = picked.length
      ? Math.min(...picked.map((p) => p.price))
      : range.min || 500;
    const perMax = picked.length
      ? Math.max(...picked.map((p) => p.price))
      : range.max === 100000
        ? 3000
        : range.max;
    setProductIds(picked.map((p) => p.id));
    setEstimate({
      min: perMin * headcount,
      max: perMax * headcount,
    });
  }

  async function goNext() {
    if (!canNext) return;
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      return;
    }
    setPhase("matching");
    setMatchingLine(0);
    await sleep(2800);
    recommend();
    setPhase("results");
  }

  function goBack() {
    if (phase === "results") {
      setPhase("steps");
      setStep(totalSteps - 1);
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  }

  function submitLead(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (
      form.name.trim().length < 2 ||
      form.phone.trim().length < 6 ||
      form.company.trim().length < 2 ||
      !form.email.includes("@")
    ) {
      setError("Проверьте имя, телефон, компанию и email");
      return;
    }
    setSubmitting(true);
    saveConfiguratorLead({
      ...answers,
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      email: form.email.trim().toLowerCase(),
      recommendedProductIds: productIds,
      estimatedBudgetMin: estimate.min || undefined,
      estimatedBudgetMax: estimate.max || undefined,
    });
    setSubmitting(false);
    setPhase("success");
  }

  if (phase === "success") {
    return (
      <div className="cfg-card cfg-success">
        <div className="cfg-check">
          <Check size={28} strokeWidth={2.5} />
        </div>
        <h2>Заявка принята</h2>
        <p>
          Мы расскажем о подобранных наборах и свяжемся с вами в ближайшее
          время.
        </p>
        <div className="cfg-actions">
          <Link className="pill pill-accent" to="/catalog">
            Смотреть каталог
          </Link>
          <button
            type="button"
            className="pill pill-outline"
            onClick={() => {
              setPhase("steps");
              setStep(0);
              setAnswers(emptyAnswers);
              setForm({ name: "", phone: "", company: "", email: "" });
              setError("");
            }}
          >
            Пройти ещё раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cfg-card">
      <div className="cfg-head">
        <div>
          <p className="cfg-eyebrow">Конфигуратор</p>
          <p className="cfg-step-label">
            {phase === "steps" && `Шаг ${step + 1} из ${totalSteps}`}
            {phase === "matching" && "Подбираем варианты"}
            {phase === "results" && "Готово"}
          </p>
        </div>
        <Gift className="cfg-gift-icon" size={24} strokeWidth={1.75} aria-hidden />
      </div>

      <div className="cfg-progress" aria-hidden="true">
        <div className="cfg-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {phase === "matching" && (
        <div className="cfg-matching">
          <div className="cfg-spinner" />
          <p className="cfg-matching-line" key={matchingLine}>
            {MATCHING_LINES[matchingLine]}
          </p>
          <p className="cfg-matching-hint">Анализируем ваши ответы</p>
        </div>
      )}

      {phase === "steps" && (
        <div className="cfg-step" key={step}>
          <h2>{current.question}</h2>
          {current.hint && <p className="cfg-hint">{current.hint}</p>}
          <div className="cfg-options">
            {current.options.map((option) => {
              const active = answers[current.id] === option.value;
              const Icon = option.icon ? ICONS[option.icon] : undefined;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`cfg-option${active ? " is-active" : ""}`}
                  onClick={() => selectOption(option.value)}
                >
                  {Icon && (
                    <span className="cfg-option-icon">
                      <Icon className="cfg-lucide" />
                    </span>
                  )}
                  <span>{option.label}</span>
                  {active && (
                    <Check className="cfg-option-check" size={18} strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="cfg-nav">
            <button
              type="button"
              className="pill"
              onClick={goBack}
              disabled={step === 0}
            >
              <ArrowLeft size={16} />
              Назад
            </button>
            <button
              type="button"
              className="pill pill-accent"
              onClick={() => void goNext()}
              disabled={!canNext}
            >
              {step === totalSteps - 1 ? "Подобрать наборы" : "Далее"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {phase === "results" && (
        <div className="cfg-results">
          <div className="cfg-results-banner">
            <div className="cfg-check">
              <Check size={28} strokeWidth={2.5} />
            </div>
            <h2>Мы уже подобрали для вас подходящие наборы</h2>
            <p>
              Оставьте ваши данные — и мы расскажем о них, подскажем бюджет и
              подготовим коммерческое предложение.
            </p>
          </div>

          <div className="cfg-form-block">
            <h3>Получить коммерческое предложение</h3>
            <p className="cfg-hint">Оставьте контакты, и мы свяжемся с вами.</p>
            <form className="cfg-form" onSubmit={submitLead}>
              <label>
                <span>Имя *</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>Телефон *</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>Компания *</span>
                <input
                  required
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>Email *</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </label>
              {error && <p className="cfg-error">{error}</p>}
              <div className="cfg-nav">
                <button type="button" className="pill" onClick={goBack}>
                  <ArrowLeft size={16} />
                  Назад
                </button>
                <button
                  type="submit"
                  className="pill pill-accent"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="cfg-spin-icon" />
                      Отправка…
                    </>
                  ) : (
                    "Получить коммерческое предложение"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
