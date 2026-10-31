const button = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
if (button && nav) {
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
}
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const researchNodeContent = {
  'security-community': {
    title: 'Security Community',
    text: 'My doctoral research examines how major regional powers, or anchor states, enable, constrain, and under some conditions destabilize regional security communities.'
  },
  'indo-pacific': {
    title: 'Indo-Pacific',
    text: 'I study the Indo-Pacific as a strategic and diplomatic space shaped by regional order, maritime interactions, defence partnerships, and competing narratives of autonomy and alignment.'
  },
  'south-asia': {
    title: 'South Asia',
    text: 'My South Asia research focuses on regional security, India–Pakistan crises, Bangladesh’s strategic choices, public diplomacy, and the politics of regional hierarchy.'
  },
  'migration': {
    title: 'Migration',
    text: 'My migration research examines refugee securitization, nativist discourse, internal migration, media framing, and the political construction of mobility as a security issue.'
  },
  'maritime-security': {
    title: 'Maritime Security',
    text: 'My maritime work covers governance, freedom of navigation, naval diplomacy, defence relations, and the strategic politics of the Bay of Bengal and wider Indo-Pacific.'
  },
  'middle-power': {
    title: 'Middle Power Diplomacy',
    text: 'I examine how middle powers use diplomatic networks, strategic narratives, partnerships, and selective autonomy to operate within increasingly competitive regional orders.'
  }
};

const researchNodes = document.querySelectorAll('[data-research-node]');
const researchTitle = document.getElementById('network-detail-title');
const researchText = document.getElementById('network-detail-text');

function activateResearchNode(node) {
  const key = node.dataset.researchNode;
  const content = researchNodeContent[key];
  if (!content || !researchTitle || !researchText) return;
  researchNodes.forEach(item => item.classList.toggle('is-active', item === node));
  researchTitle.textContent = content.title;
  researchText.textContent = content.text;
}

researchNodes.forEach(node => {
  node.addEventListener('mouseenter', () => activateResearchNode(node));
  node.addEventListener('focus', () => activateResearchNode(node));
  node.addEventListener('click', () => activateResearchNode(node));
  node.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateResearchNode(node);
    }
  });
});

if (researchNodes.length) activateResearchNode(researchNodes[0]);


// First-visit research-network intro on the home page.
(() => {
  const intro = document.getElementById('site-intro');
  if (!intro) return;

  const root = document.documentElement;
  const skip = intro.querySelector('[data-intro-skip]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let forceIntro = false;
  let shouldShow = root.classList.contains('intro-pending');

  try {
    forceIntro = new URLSearchParams(window.location.search).get('intro') === '1';
    shouldShow = !reducedMotion && (forceIntro || !localStorage.getItem('rsNetworkIntroSeen'));
  } catch (e) {}

  const finish = () => {
    intro.classList.add('is-leaving');
    document.body.classList.remove('intro-active');
    root.classList.remove('intro-pending');
    try { localStorage.setItem('rsNetworkIntroSeen', '1'); } catch (e) {}
    window.setTimeout(() => {
      intro.hidden = true;
      intro.setAttribute('aria-hidden', 'true');
    }, 520);
  };

  if (!shouldShow) {
    intro.hidden = true;
    root.classList.remove('intro-pending');
    return;
  }

  intro.hidden = false;
  intro.setAttribute('aria-hidden', 'false');
  document.body.classList.add('intro-active');
  requestAnimationFrame(() => intro.classList.add('is-running'));

  const timer = window.setTimeout(finish, 2700);
  if (skip) {
    skip.addEventListener('click', () => {
      window.clearTimeout(timer);
      finish();
    }, { once: true });
  }
})();
