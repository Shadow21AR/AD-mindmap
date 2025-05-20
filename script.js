const contentEl = document.getElementById('content');
const navEl = document.getElementById('module-nav');
const toolboxEl = document.getElementById('toolbox');
const navSearch = document.getElementById('nav-search');
const navPrev = document.getElementById('nav-prev');
const navNext = document.getElementById('nav-next');
const navWrapper = document.getElementById('nav-wrapper');
const navExpanded = document.getElementById('nav-expanded');

const navButtonsWrapper = document.createElement('div');
navButtonsWrapper.style.display = 'flex';
navButtonsWrapper.style.alignItems = 'center';
navButtonsWrapper.style.gap = '8px';
navButtonsWrapper.style.flexGrow = '1';
navButtonsWrapper.style.position = 'relative';

const expandAllBtn = document.createElement('button');
expandAllBtn.id = 'expand-all-btn';
expandAllBtn.textContent = 'Expand All ▼';
expandAllBtn.style.width = '100%';
expandAllBtn.style.marginTop = '8px';
expandAllBtn.style.padding = '0.75rem 1rem';
expandAllBtn.style.fontWeight = 'bold';
expandAllBtn.style.border = '1px solid var(--border-color, #ccc)';
expandAllBtn.style.borderRadius = '8px';
expandAllBtn.style.backgroundColor = 'var(--ribbon-bg, #eee)';
expandAllBtn.style.color = 'var(--text-color, #222)';
expandAllBtn.style.cursor = 'pointer';
expandAllBtn.style.userSelect = 'none';

const expandAllContainer = document.createElement('div');
expandAllContainer.id = 'expand-all-container';
expandAllContainer.style.marginTop = '8px';
expandAllContainer.style.flexWrap = 'wrap';
expandAllContainer.style.gap = '8px';
expandAllContainer.style.border = '1px solid var(--border-color, #444)';
expandAllContainer.style.borderRadius = '8px';
expandAllContainer.style.padding = '1rem';
expandAllContainer.style.backgroundColor = 'var(--content-bg, #222)';
expandAllContainer.style.maxHeight = '300px';
expandAllContainer.style.overflowY = 'auto';
expandAllContainer.style.display = 'none';
expandAllContainer.style.color = 'var(--text-color, #fff)';
expandAllContainer.style.flexDirection = 'row';

navWrapper.insertBefore(navButtonsWrapper, navSearch);
navButtonsWrapper.appendChild(navPrev);
navButtonsWrapper.appendChild(navEl);
navButtonsWrapper.appendChild(navNext);

navWrapper.style.display = 'flex';
navWrapper.style.flexDirection = 'column';
navWrapper.style.gap = '8px';
navWrapper.style.position = 'relative';

[navPrev, navNext].forEach(btn => {
  btn.style.flex = '0 0 40px';
  btn.style.cursor = 'pointer';
  btn.style.userSelect = 'none';
  btn.style.fontSize = '1.5rem';
  btn.style.lineHeight = '1';
  btn.style.border = 'none';
  btn.style.background = 'none';
  btn.style.color = 'var(--text-color, black)';
  btn.style.display = 'none';
});

navEl.style.flex = '1 1 auto';
navEl.style.display = 'flex';
navEl.style.overflowX = 'auto';
navEl.style.whiteSpace = 'nowrap';
navEl.style.scrollBehavior = 'smooth';
navEl.style.gap = '8px';

navExpanded.style.position = 'absolute';
navExpanded.style.top = '100%';
navExpanded.style.left = '0';
navExpanded.style.right = '0';
navExpanded.style.background = 'var(--header-bg, #eee)';
navExpanded.style.border = '1px solid var(--border-color, #ccc)';
navExpanded.style.borderRadius = '0 0 8px 8px';
navExpanded.style.maxHeight = '300px';
navExpanded.style.overflowY = 'auto';
navExpanded.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
navExpanded.style.zIndex = '1000';
navExpanded.style.padding = '0.5rem';
navExpanded.style.display = 'none';

navSearch.type = 'search';
navSearch.placeholder = 'Search tabs...';
navSearch.style.width = '100%';

function updateScrollButtons() {
  navPrev.style.display = navEl.scrollLeft > 0 ? 'block' : 'none';
  navNext.style.display = navEl.scrollLeft + navEl.clientWidth < navEl.scrollWidth ? 'block' : 'none';
}

navPrev.onclick = () => navEl.scrollBy({ left: -200, behavior: 'smooth' });
navNext.onclick = () => navEl.scrollBy({ left: 200, behavior: 'smooth' });
navEl.onscroll = updateScrollButtons;

async function loadMarkdown(file) {
  const res = await fetch(`/AD-mindmap/data/${file}`);
  if (!res.ok) return `<p>Error loading ${file}</p>`;
  const text = await res.text();
  return marked.parse(text);
}

function loadModule(file, btn) {
  loadMarkdown(file).then(html => {
    contentEl.innerHTML = html;
  });
  document.querySelectorAll('#module-nav button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  navExpanded.style.display = 'none';
}

async function loadToolbox() {
  const res = await fetch('/AD-mindmap/tools.yml');
  const text = await res.text();
  const data = jsyaml.load(text);
  const tools = data.tools;
  toolboxEl.innerHTML = '';

  for (const [name, { link, icon }] of Object.entries(tools)) {
    const block = document.createElement('button');
    block.className = 'tool-block';
    if (icon) {
      const img = document.createElement('img');
      img.src = `/AD-mindmap/icon/${icon}.png`;
      img.alt = icon;
      img.style.height = '1em';
      img.style.verticalAlign = 'middle';
      img.style.marginRight = '0.5em';
      block.appendChild(img);
    }
    block.appendChild(document.createTextNode(name));
    block.onclick = () => window.open(link, '_blank');
    toolboxEl.appendChild(block);
  }
}

function createTabButton(title, file) {
  const btn = document.createElement('button');
  btn.textContent = title;
  btn.onclick = () => loadModule(file, btn);
  btn.style.whiteSpace = 'nowrap';
  btn.className = 'nav-tab';
  return btn;
}

let expandBtn;
function createExpandButton() {
  const btn = document.createElement('button');
  btn.id = 'expand-btn';
  btn.textContent = 'More ▼';
  btn.style.whiteSpace = 'nowrap';
  btn.style.flex = '0 0 auto';
  btn.style.padding = '0.6rem 1rem';
  btn.style.fontWeight = 'bold';
  btn.style.textAlign = 'center';
  btn.style.backgroundColor = 'var(--ribbon-bg, #ddd)';
  btn.style.color = 'var(--text-color, #333)';
  btn.style.border = '1px solid var(--border-color, #aaa)';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  btn.style.userSelect = 'none';
  btn.style.marginLeft = 'auto';
  btn.style.transition = 'background-color 0.3s ease';
  btn.onmouseenter = () => navExpanded.style.display = 'block';
  btn.onmouseleave = () => {
    setTimeout(() => {
      if (!navExpanded.matches(':hover') && !btn.matches(':hover')) {
        navExpanded.style.display = 'none';
      }
    }, 150);
  };
  return btn;
}

navWrapper.appendChild(expandAllBtn);
navWrapper.appendChild(expandAllContainer);

let expandAllOpen = false;
expandAllBtn.onclick = async () => {
  if (expandAllOpen) {
    expandAllContainer.style.display = 'none';
    expandAllBtn.textContent = 'Expand All ▼';
    expandAllOpen = false;
  } else {
    expandAllBtn.textContent = 'Collapse All ▲';
    expandAllContainer.style.display = 'flex';
    if (!expandAllContainer.hasChildNodes()) {
      const res = await fetch('/AD-mindmap/data/manifest.json');
      if (!res.ok) {
        expandAllContainer.innerHTML = '<p>Error loading modules</p>';
        return;
      }
      const modules = await res.json();
      expandAllContainer.innerHTML = '';
      for (const { title, file } of modules) {
        const btn = document.createElement('button');
        btn.textContent = title;
        btn.className = 'nav-tab';
        btn.style.whiteSpace = 'nowrap';
        btn.style.flex = '0 0 auto';
        btn.onclick = () => {
          navSearch.value = '';
          filterTabs('');
          loadModule(file, btn);
          const tabBtns = [...navEl.querySelectorAll('button')];
          const match = tabBtns.find(t => t.textContent === title);
          if (match) {
            match.classList.add('active');
            tabBtns.forEach(b => { if (b !== match) b.classList.remove('active'); });
            match.scrollIntoView({ behavior: 'smooth', inline: 'center' });
          }
          expandAllContainer.style.display = 'none';
          expandAllBtn.textContent = 'Expand All ▼';
          expandAllOpen = false;
        };
        expandAllContainer.appendChild(btn);
      }
    }
    expandAllOpen = true;
  }
};

navExpanded.onmouseleave = () => {
  setTimeout(() => {
    if (!expandBtn.matches(':hover') && !navExpanded.matches(':hover')) {
      navExpanded.style.display = 'none';
    }
  }, 150);
};

function filterTabs(filterText) {
  const tabs = document.querySelectorAll('#module-nav button');
  tabs.forEach(tab => {
    const matches = tab.textContent.toLowerCase().includes(filterText.toLowerCase());
    tab.style.display = matches ? '' : 'none';
  });
}

navSearch.addEventListener('input', e => {
  filterTabs(e.target.value);
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadToolbox();
  const res = await fetch('/AD-mindmap/data/manifest.json');
  const modules = await res.json();
  navEl.innerHTML = '';
  modules.forEach(({ title, file }) => {
    const btn = createTabButton(title, file);
    navEl.appendChild(btn);
  });
  expandBtn = createExpandButton();
  navButtonsWrapper.appendChild(expandBtn);
  modules.forEach(({ title, file }) => {
    const btn = createTabButton(title, file);
    navExpanded.appendChild(btn);
  });
  loadModule(modules[0].file, navEl.querySelector('button'));
  updateScrollButtons();
});
