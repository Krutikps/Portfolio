// ---- footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- splash screen cleanup ----
const splashScreen = document.getElementById('splashScreen');
if (splashScreen) {
  splashScreen.addEventListener('animationend', () => splashScreen.remove());
}

// ---- hero role cycler (typewriter) ----
const roleCycler = document.getElementById('roleCycler');
const roles = ['AI Developer', 'Backend Engineer', 'Real-Time Systems Builder'];

if (roleCycler) {
  if (prefersReducedMotion) {
    roleCycler.textContent = roles[0];
  } else {
    let roleIndex = 0, charIndex = 0, deleting = false;
    const TYPE_MS = 55, DELETE_MS = 30, HOLD_MS = 1600, PAUSE_MS = 300;

    (function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        roleCycler.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        setTimeout(tick, TYPE_MS);
      } else {
        charIndex--;
        roleCycler.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, PAUSE_MS);
          return;
        }
        setTimeout(tick, DELETE_MS);
      }
    })();
  }
}

// ---- browser tab title role cycler (same typewriter style) ----
const baseTitle = 'Krutik Shah';

if (!prefersReducedMotion) {
  let titleRoleIndex = 0, titleCharIndex = 0, titleDeleting = false;
  const TITLE_TYPE_MS = 90, TITLE_DELETE_MS = 45, TITLE_HOLD_MS = 1800, TITLE_PAUSE_MS = 400;

  (function titleTick() {
    const current = roles[titleRoleIndex];
    if (!titleDeleting) {
      titleCharIndex++;
      document.title = `${baseTitle} - ${current.slice(0, titleCharIndex)}`;
      if (titleCharIndex === current.length) {
        titleDeleting = true;
        setTimeout(titleTick, TITLE_HOLD_MS);
        return;
      }
      setTimeout(titleTick, TITLE_TYPE_MS);
    } else {
      titleCharIndex--;
      document.title = `${baseTitle} - ${current.slice(0, titleCharIndex)}`;
      if (titleCharIndex === 0) {
        titleDeleting = false;
        titleRoleIndex = (titleRoleIndex + 1) % roles.length;
        setTimeout(titleTick, TITLE_PAUSE_MS);
        return;
      }
      setTimeout(titleTick, TITLE_DELETE_MS);
    }
  })();
}

// ---- nav scroll state + mobile menu ----
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---- scroll to top ----
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ---- nav active-section highlight ----
const navAnchors = navLinks.querySelectorAll('a[data-section]');
const navSections = Array.from(navAnchors)
  .map(a => document.getElementById(a.dataset.section))
  .filter(Boolean);
if (navSections.length) {
  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('active', a.dataset.section === entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  navSections.forEach(sec => sectionIo.observe(sec));
}

// ---- reveal on scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- systems filter tabs ----
const filterTabs = document.querySelectorAll('.filter-tab');
const pipelineCards = document.querySelectorAll('.pipeline-card');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    pipelineCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('filtered-out', !show);
    });
  });
});

// ---- project detail modal ----
const projectModal = document.getElementById('projectModal');
const projectModalId = document.getElementById('projectModalId');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalRole = document.getElementById('projectModalRole');
const projectModalDetail = document.getElementById('projectModalDetail');
let activeDetailHome = null;

function openProjectModal(card) {
  const detail = card.querySelector('.pl-detail');
  if (!detail) return;
  const placeholder = document.createComment('pl-detail-slot');
  detail.parentNode.insertBefore(placeholder, detail);
  activeDetailHome = { detail, placeholder };

  projectModalId.textContent = card.querySelector('.pl-id').textContent;
  projectModalTitle.textContent = card.querySelector('h3').textContent;
  projectModalRole.textContent = card.querySelector('.pl-role').textContent;
  detail.classList.add('detail-open');
  projectModalDetail.appendChild(detail);

  projectModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeProjectModal() {
  if (activeDetailHome) {
    const { detail, placeholder } = activeDetailHome;
    detail.classList.remove('detail-open');
    placeholder.parentNode.replaceChild(detail, placeholder);
    activeDetailHome = null;
  }
  projectModal.classList.remove('open');
  document.body.style.overflow = '';
}
pipelineCards.forEach(card => {
  card.addEventListener('click', () => openProjectModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(card);
    }
  });
});
[projectModal, ...projectModal.querySelectorAll('[data-modal-close]')].forEach(t => t.addEventListener('click', (e) => {
  if (e.target === e.currentTarget || e.target.classList.contains('modal-close')) closeProjectModal();
}));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal.classList.contains('open')) closeProjectModal();
});

// ---- contact modal ----
const contactModal = document.getElementById('contactModal');

function openContactModal() {
  contactModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const firstField = contactModal.querySelector('input[type="text"]');
  if (firstField) firstField.focus();
}
function closeContactModal() {
  contactModal.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-modal-open]').forEach(t => t.addEventListener('click', openContactModal));
[contactModal, ...contactModal.querySelectorAll('[data-modal-close]')].forEach(t => t.addEventListener('click', (e) => {
  if (e.target === e.currentTarget || e.target.classList.contains('modal-close')) closeContactModal();
}));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('open')) closeContactModal();
});

// ---- copy-to-clipboard for contact rows ----
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const original = btn.textContent;
      btn.textContent = 'copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1500);
    } catch (err) {
      /* clipboard unavailable - mailto/tel link still works as fallback */
    }
  });
});

// ---- contact form submit (Web3Forms) ----
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  formMsg.className = 'form-msg';
  formMsg.textContent = '';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
    });
    const data = await res.json();
    if (data.success) {
      formMsg.textContent = "Message sent. I'll get back to you soon.";
      formMsg.classList.add('success');
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Send failed');
    }
  } catch (err) {
    formMsg.textContent = 'Could not send. Try emailing directly instead.';
    formMsg.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
});

// ---- AI agent widget (rule-based FAQ bot, fully client-side) ----
(function () {
  const toggle = document.getElementById('agentToggle');
  const panel = document.getElementById('agentPanel');
  const body = document.getElementById('agentBody');
  const quick = document.getElementById('agentQuick');
  const form = document.getElementById('agentForm');
  const input = document.getElementById('agentInput');
  const badge = document.getElementById('agentBadge');
  const closeBtn = document.getElementById('agentCloseBtn');
  if (!toggle || !panel) return;

  const faqs = [
    { id: 'skills', keywords: ['skill', 'stack', 'tech', 'tool', 'language', 'framework', 'expertise', 'technologies'],
      answer: "Backend: Python, Django, Django REST Framework, FastAPI, REST APIs and GraphQL. Real-time and async: WebSockets, Celery and Redis. AI: LLM integration, prompt engineering and object-detection pipelines. Data and infra: PostgreSQL, SPLUNK, Docker and Git.",
      link: { href: '#stack', label: 'View skills ↓' } },
    { id: 'experience', keywords: ['experience', 'work history', 'job', 'career', 'company', 'employer', 'background', 'role'],
      answer: "Currently a Software Engineer at Sigma Solve Pvt. Ltd., building real-time trading and analytics backends. Before that, an internship at Crest Data working on SPLUNK dashboards.",
      link: { href: '#experience', label: 'View experience ↓' } },
    { id: 'years_experience', keywords: ['years of experience', 'how long have you', 'how experienced', 'how many years'],
      answer: "Working professionally as a Software Engineer since September 2024, after an internship in mid-2024. Full timeline's in the Experience section.",
      link: { href: '#experience', label: 'View experience ↓' } },
    { id: 'projects', keywords: ['project', 'built', 'shipped', 'portfolio', 'apps', 'systems'],
      answer: "Key projects: AI369 (F1 race video highlights with object detection), AiFitCoaches (fitness and diet backend on FastAPI and Celery) and BirchGold (audio-to-text with prompt engineering).",
      link: { href: '#systems', label: 'View projects ↓' } },
    { id: 'resume', keywords: ['resume', 'cv', 'download'], answer: "Here you go.",
      link: { href: 'resume.html', label: 'Download resume ↗', external: true } },
    { id: 'contact', keywords: ['contact', 'hire', 'reach', 'email', 'connect', 'linkedin', 'github', 'talk', 'get in touch'],
      answer: "Best way is the contact form, or email krutikpshah2003@gmail.com.",
      link: { href: '#contact', label: 'Go to contact ↓' } },
    { id: 'availability', keywords: ['available', 'availability', 'open to work', 'looking for', 'opportunities', 'freelance'],
      answer: "Open to backend and AI engineering roles and interesting problems. Best way to follow up is the Contact section.",
      link: { href: '#contact', label: 'Go to contact ↓' } },
    { id: 'salary', keywords: ['salary', 'compensation', 'pay range', 'rate', 'cost to hire'],
      answer: "That's a conversation for a real inbox, not a chatbot. Reach out directly and we can talk specifics.",
      link: { href: '#contact', label: 'Go to contact ↓' } },
    { id: 'education', keywords: ['education', 'degree', 'college', 'university', 'study', 'school'],
      answer: "BE in Information Technology from Gandhinagar Institute of Technology (2021–2024, GPA 8.65/10), after a Diploma at Government Polytechnic (2018–2021, GPA 8.99/10)." },
    { id: 'about', keywords: ['who are you', 'about you', 'who is krutik', 'introduce', 'yourself'],
      answer: "I'm a Backend Engineer building scalable real-time applications with Python, Django and FastAPI, plus AI/LLM integrations and async processing.",
      link: { href: '#telemetry', label: 'Read more ↓' } },
    { id: 'philosophy', keywords: ['philosophy', 'approach', 'principle', 'mindset', 'belief', 'focus'],
      answer: "Backend automation, async processing and distributed systems that hold up under live data." },
    { id: 'greeting', keywords: ['hi', 'hello', 'hey', 'yo', 'howdy', 'sup'],
      answer: "Hello!! I know this site inside out. Ask me about skills, projects, experience, resume, or how to get in touch." },
    { id: 'thanks', keywords: ['thanks', 'thank you', 'cheers'], answer: "Anytime! Anything else you want to know?" }
  ];

  const fallback = "I don't have a canned answer for that one. Try asking about skills, experience, projects, resume, or contact.";

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const row = [i];
      for (let j = 1; j <= n; j++) {
        row[j] = a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], row[j - 1]);
      }
      prev = row;
    }
    return prev[n];
  }

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function scoreFaq(faq, norm, words) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (norm.includes(keyword)) { score += 2; continue; }
      if (keyword.includes(' ')) continue;
      for (const word of words) {
        if (word.length < 4 || keyword.length < 4) continue;
        const threshold = keyword.length <= 5 ? 1 : 2;
        if (levenshtein(word, keyword) <= threshold) { score += 1; break; }
      }
    }
    return score;
  }

  const quickReplies = [
    { label: 'Skills', text: 'skills', color: 'var(--accent-blue)' },
    { label: 'Experience', text: 'experience', color: 'var(--accent-amber)' },
    { label: 'Projects', text: 'projects', color: 'var(--accent)' },
    { label: 'Resume', text: 'resume', color: 'var(--accent-cyan)' },
    { label: 'Contact', text: 'contact', color: 'var(--accent-magenta)' }
  ];

  const greeting = "Hello!! I know this site inside out. Ask about skills, experience, projects, resume, or how to reach me.";

  let opened = false;

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function appendMessage(text, sender, link) {
    const msg = document.createElement('div');
    msg.className = 'agent-msg agent-msg-' + sender;
    msg.textContent = text;
    const isInternalLink = link && link.href.startsWith('#');
    if (link && !(isInternalLink && isMobileAgent())) {
      msg.appendChild(document.createElement('br'));
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'agent-link';
      a.textContent = link.label;
      if (link.external) { a.target = '_blank'; a.rel = 'noopener'; }
      msg.appendChild(a);
    }
    body.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'agent-typing';
    typing.id = 'agentTypingIndicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.getElementById('agentTypingIndicator');
    if (typing) typing.remove();
  }

  function findFaq(text) {
    const norm = normalize(text);
    const words = norm.split(' ').filter(Boolean);
    let best = null, bestScore = 0;
    for (const faq of faqs) {
      const score = scoreFaq(faq, norm, words);
      if (score > bestScore) { bestScore = score; best = faq; }
    }
    return bestScore > 0 ? best : null;
  }

  const detailAnswers = {
    projects: { text: "AI369 builds highlight clips from F1 race footage using Roboflow and custom object detection models. AiFitCoaches is a FastAPI and Celery backend for meal scheduling, notifications and scalable APIs. BirchGold covers audio-to-text processing, prompt engineering and automated response validation in Python.",
      link: { href: '#systems', label: 'View projects ↓' } },
    experience: { text: "Day to day at Sigma Solve: Django, Celery and PostgreSQL backends for real-time trading and analytics, WebSocket/GraphQL/REST pipelines for live data, customized Django admin tools, Celery automation for alerts and scheduling, and Redis and third-party integrations.",
      link: { href: '#experience', label: 'View experience ↓' } },
    skills: { text: "Grouped into six areas on the site: backend services, real-time and async, AI/LLM engineering, data tools, infrastructure and integrations.",
      link: { href: '#stack', label: 'View skills ↓' } },
    about: { text: "Backend automation, async processing and distributed systems that hold up under live data, with AI/LLM integrations where they help.",
      link: { href: '#telemetry', label: 'Read more ↓' } }
  };

  const moreDetailKeywords = ['more detail', 'more details', 'elaborate', 'tell me more', 'expand', 'give more', 'go deeper', 'more info'];

  function isMoreDetailRequest(norm) {
    return moreDetailKeywords.some(k => norm.includes(k));
  }

  let lastTopic = null;
  let botQueue = Promise.resolve();
  let pendingBotMessages = 0;
  const sendBtn = form.querySelector('.agent-send');
  const inputPlaceholder = input.placeholder;

  function setInputLocked(locked) {
    input.disabled = locked;
    sendBtn.disabled = locked;
    input.placeholder = locked ? 'agent is typing...' : inputPlaceholder;
    quick.querySelectorAll('button').forEach(b => { b.disabled = locked; });
  }

  function queueBotMessage(getContent, delay) {
    pendingBotMessages++;
    setInputLocked(true);
    botQueue = botQueue.then(() => new Promise(resolve => {
      showTyping();
      setTimeout(() => {
        hideTyping();
        const { text, link } = getContent();
        appendMessage(text, 'bot', link);
        pendingBotMessages--;
        if (pendingBotMessages === 0) setInputLocked(false);
        resolve();
      }, delay);
    }));
    return botQueue;
  }

  function respond(userText) {
    if (input.disabled) return;
    appendMessage(userText, 'user');
    queueBotMessage(() => {
      const norm = normalize(userText);
      if (isMoreDetailRequest(norm) && lastTopic && detailAnswers[lastTopic]) {
        return detailAnswers[lastTopic];
      }
      const faq = findFaq(userText);
      if (faq) {
        lastTopic = faq.id;
        return { text: faq.answer, link: faq.link };
      }
      return { text: fallback };
    }, 500 + Math.random() * 300);
  }

  quickReplies.forEach(q => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = q.label;
    btn.style.setProperty('--chip-color', q.color);
    btn.addEventListener('click', () => respond(q.text));
    quick.appendChild(btn);
  });

  const isMobileAgent = () => window.matchMedia('(max-width: 500px)').matches;

  function openPanel() {
    opened = true;
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    badge.classList.add('hidden');
    if (isMobileAgent()) document.body.style.overflow = 'hidden';
    if (!body.hasChildNodes()) {
      queueBotMessage(() => ({ text: greeting }), 550);
    }
    setTimeout(() => input.focus(), 200);
  }

  function closePanel() {
    opened = false;
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (opened) closePanel(); else openPanel();
  });
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    respond(text);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && opened) closePanel();
  });
})();
