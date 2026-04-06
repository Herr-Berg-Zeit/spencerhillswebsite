(function () {
  const data = window.siteData;
  const currentPage = document.body.dataset.page || "";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    const p = data.person;
    sidebar.innerHTML = `
      <div class="sidebar-inner">
        <div class="portrait-wrap">
          <img class="portrait" src="${escapeHtml(p.portrait)}" alt="Portrait for ${escapeHtml(p.name)}">
        </div>
        <h1>${escapeHtml(p.name)}</h1>
        <p class="tagline">${escapeHtml(p.tagline)}</p>
        <div class="meta">
          <div>${escapeHtml(p.affiliation)}</div>
          <div>${escapeHtml(p.location)}</div>
        </div>
        <div class="follow-links">
          ${p.links.map(link => {
            const external = /^https?:\/\//.test(link.href);
            return `<a href="${escapeHtml(link.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(link.label)}</a>`;
          }).join("")}
        </div>

        <div class="sidebar-spacer"></div>

        <div class="reading-controls-row">
          <button type="button" class="font-btn" id="font-decrease" aria-label="Decrease font size">A−</button>
          <button type="button" class="font-btn" id="font-reset" aria-label="Reset font size">Reset</button>
          <button type="button" class="font-btn" id="font-increase" aria-label="Increase font size">A+</button>
        </div>
        </div>
      </div>
    `;
  }

  function renderNav() {
    const masthead = document.getElementById("masthead");
    if (!masthead) return;
    masthead.innerHTML = `
      <nav class="topnav" aria-label="Main navigation">
        ${data.nav.map(item => `<a href="${escapeHtml(item.href)}" class="${item.key === currentPage ? "active" : ""}" ${item.key === currentPage ? 'aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`).join("")}
      </nav>
    `;
  }

  function cardMarkup(project) {
    return `
      <article class="research-card" data-slug="${escapeHtml(project.slug)}">
        <a class="card-image" href="project.html?slug=${encodeURIComponent(project.slug)}" aria-label="${escapeHtml(project.title)}">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || project.title)}" loading="lazy">
        </a>
        <div class="card-body">
          <div class="badge">${escapeHtml(project.status)} · ${escapeHtml(project.venue)}</div>
          <h3><a href="project.html?slug=${encodeURIComponent(project.slug)}">${escapeHtml(project.title)}</a></h3>
          <p class="card-summary">${escapeHtml(project.summary)}</p>
          <div class="tag-row">${project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
          <a class="card-link" href="project.html?slug=${encodeURIComponent(project.slug)}">Read more</a>
        </div>
      </article>
    `;
  }

  function renderFeaturedProjects() {
    const container = document.getElementById("featured-projects");
    if (!container) return;
    const featured = data.projects.slice(0, 3);
    container.innerHTML = featured.map(cardMarkup).join("");
  }

  function renderResearchPage() {
    const grid = document.getElementById("research-grid");
    const filterContainer = document.getElementById("research-filters");
    if (!grid || !filterContainer) return;

    let activeFilter = "all";

    function drawProjects() {
      const filtered = activeFilter === "all"
        ? data.projects
        : data.projects.filter(project => project.category === activeFilter || project.tags.includes(activeFilter));

      grid.innerHTML = filtered.length
        ? filtered.map(cardMarkup).join("")
        : `<div class="empty-state">No projects match this filter yet.</div>`;
    }

    filterContainer.innerHTML = `<div class="filters">${data.filters.map(filter => `
      <button type="button" data-filter="${escapeHtml(filter)}" class="${filter === activeFilter ? "active" : ""}">${escapeHtml(filter)}</button>
    `).join("")}</div>`;

    filterContainer.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterContainer.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
        drawProjects();
      });
    });

    drawProjects();
  }

  function renderProjectPage() {
    const container = document.getElementById("project-page");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || data.projects[0].slug;
    const project = data.projects.find(item => item.slug === slug) || data.projects[0];
    document.title = `${project.title} | Spencer J. Hills`;

    container.innerHTML = `
      <article>
        <div class="badge">${escapeHtml(project.status)} · ${escapeHtml(project.venue)}</div>
        <h1>${escapeHtml(project.title)}</h1>
        <p class="lead">${escapeHtml(project.summary)}</p>
        <div class="meta-grid">
          <div class="meta-box">
            <div class="meta-label">Type</div>
            <div>${escapeHtml(project.status)}</div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Category</div>
            <div>${escapeHtml(project.category)}</div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Year</div>
            <div>${escapeHtml(project.year)}</div>
          </div>
        </div>
        <div class="project-hero">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || project.title)}">
        </div>
        ${project.bodyHtml
          ? project.bodyHtml
          : project.description.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")
        }
        <div class="tag-row">${project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="project-actions">
          ${project.links.map(link => {
            const external = /^https?:\/\//.test(link.href);
            return `<a class="button" href="${escapeHtml(link.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(link.label)}</a>`;
          }).join("")}
        </div>
      </article>
    `;
  }
  function applyFontScale(scale) {
  document.documentElement.style.fontSize = `${scale}px`;
}

  function initReadingControls() {
    const defaultScale = 16;
    const minScale = 14;
    const maxScale = 22;
    const step = 1;

    let savedScale = parseInt(localStorage.getItem("siteFontScale"), 10);
    if (Number.isNaN(savedScale)) savedScale = defaultScale;

    applyFontScale(savedScale);

    const decreaseBtn = document.getElementById("font-decrease");
    const resetBtn = document.getElementById("font-reset");
    const increaseBtn = document.getElementById("font-increase");

    if (!decreaseBtn || !resetBtn || !increaseBtn) return;

    decreaseBtn.addEventListener("click", () => {
      savedScale = Math.max(minScale, savedScale - step);
      localStorage.setItem("siteFontScale", savedScale);
      applyFontScale(savedScale);
    });
    
    resetBtn.addEventListener("click", () => {
      savedScale = defaultScale;
      localStorage.setItem("siteFontScale", savedScale);
      applyFontScale(savedScale);
    });
    
    increaseBtn.addEventListener("click", () => {
      savedScale = Math.min(maxScale, savedScale + step);
      localStorage.setItem("siteFontScale", savedScale);
      applyFontScale(savedScale);
    });
  }
  renderSidebar();
  renderNav();
  renderFeaturedProjects();
  renderResearchPage();
  renderProjectPage();
  initReadingControls();
})();
