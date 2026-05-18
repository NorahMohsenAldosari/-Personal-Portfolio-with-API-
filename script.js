/* ===================================
   Norah Aldosari — Portfolio JS
=================================== */

// ─── Loading Screen ───
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
    triggerHeroAnimations();
  }, 1600);
});

// ─── Custom Cursor ───
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .skill-category, .repo-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '48px';
      cursorRing.style.height = '48px';
      cursorRing.style.borderColor = 'rgba(124,92,252,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '32px';
      cursorRing.style.height = '32px';
      cursorRing.style.borderColor = 'rgba(124,92,252,0.5)';
    });
  });
}

// ─── Navbar ───
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ─── Theme Toggle ───
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
});

// ─── Typewriter Effect ───
const roles = [
  'elegant web apps.',
  'data insights.',
  'SQL solutions.',
  'clean Java code.',
  'beautiful UIs.',
];

let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const roleEl = document.getElementById('roleDynamic');

function typeRole() {
  if (!roleEl) return;
  const current = roles[roleIdx];

  if (!isDeleting) {
    roleEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    roleEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }

  setTimeout(typeRole, isDeleting ? 50 : 90);
}

// ─── Reveal on Scroll ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Trigger skill bars
        const bars = entry.target.querySelectorAll('.skill-fill');
        bars.forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
        // Counter animation
        const counters = entry.target.querySelectorAll('[data-target]');
        counters.forEach(counter => animateCounter(counter));
      }, 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Counter Animation ───
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + '+';
  }, 16);
}

// ─── Hero Entry Animations ───
function triggerHeroAnimations() {
  const heroEls = document.querySelectorAll('.hero .reveal');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 120);
  });
  setTimeout(typeRole, 800);
}

// ─── GitHub API ───
const GITHUB_USERNAME = 'norahmohsenaldosari';

async function fetchGitHubData() {
  const profileCard = document.getElementById('githubProfile');
  const reposGrid = document.getElementById('reposGrid');

  try {
    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    const user = await userRes.json();

    if (user.message === 'Not Found') throw new Error('User not found');

    // Render profile
    profileCard.innerHTML = `
      <div class="gh-profile-content">
        <img src="${user.avatar_url}" alt="${user.login}" class="gh-avatar" onerror="this.outerHTML='<div class=gh-avatar-placeholder>NA</div>'" />
        <div class="gh-info">
          <h3>${user.name || user.login}</h3>
          <p class="gh-bio">${user.bio || 'IT Student | Data & Software Enthusiast'}</p>
          <div class="gh-stats">
            <div class="gh-stat">
              <span class="gh-stat-num">${user.public_repos}</span>
              <span class="gh-stat-label">Repos</span>
            </div>
            <div class="gh-stat">
              <span class="gh-stat-num">${user.followers}</span>
              <span class="gh-stat-label">Followers</span>
            </div>
            <div class="gh-stat">
              <span class="gh-stat-num">${user.following}</span>
              <span class="gh-stat-label">Following</span>
            </div>
          </div>
          <a href="${user.html_url}" target="_blank" class="gh-link">
            <i class="fab fa-github"></i> View GitHub Profile <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

    // Fetch repos
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    const repos = await reposRes.json();

    if (repos && repos.length > 0) {
      reposGrid.innerHTML = repos.map(repo => `
        <div class="repo-card glass">
          <div class="repo-header">
            <span class="repo-name">${repo.name}</span>
            <a href="${repo.html_url}" target="_blank" class="proj-link" style="width:28px;height:28px">
              <i class="fas fa-external-link-alt" style="font-size:0.7rem"></i>
            </a>
          </div>
          <p class="repo-desc">${repo.description || 'No description provided.'}</p>
          <div class="repo-footer">
            ${repo.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${getLangColor(repo.language)}"></span>${repo.language}</span>` : ''}
            <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span class="repo-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
          </div>
        </div>
      `).join('');

      // Re-observe new cards
      reposGrid.querySelectorAll('.repo-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100);
      });
    } else {
      reposGrid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">No public repositories found.</p>';
    }

    // Fetch commits from latest repo
    if (repos && repos.length > 0) {
      fetchRecentCommits(repos[0].name);
    }

  } catch (err) {
    profileCard.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--text-muted)">
        <i class="fab fa-github" style="font-size:3rem; margin-bottom:1rem; display:block; color:var(--accent)"></i>
        <p>GitHub data temporarily unavailable.</p>
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="btn btn-ghost" style="margin-top:1rem; display:inline-flex">
          <i class="fab fa-github"></i> Visit GitHub Profile
        </a>
      </div>
    `;
    console.log('GitHub API:', err.message);
  }
}

async function fetchRecentCommits(repoName) {
  const commitsSection = document.getElementById('commitsSection');
  const commitsList = document.getElementById('commitsList');

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=5`);
    const commits = await res.json();

    if (commits && commits.length > 0 && !commits.message) {
      commitsSection.style.display = 'block';
      commitsList.innerHTML = commits.map(c => `
        <div class="commit-item glass">
          <span class="commit-hash">${c.sha.substring(0,7)}</span>
          <span class="commit-msg">${escapeHTML(c.commit.message.split('\n')[0])}</span>
          <span class="commit-date">${formatDate(c.commit.author.date)}</span>
        </div>
      `).join('');
    }
  } catch (err) {
    // Silently fail for commits
  }
}

function getLangColor(lang) {
  const colors = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', 'C++': '#f34b7d',
    C: '#555555', Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584',
    Swift: '#F05138', Kotlin: '#A97BFF', PHP: '#4F5D95'
  };
  return colors[lang] || 'var(--accent)';
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Contact Form ───
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.innerHTML = '<div class="loading-spinner" style="width:18px;height:18px;border-width:2px"></div><span>Sending...</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    success.style.display = 'flex';
    e.target.reset();
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }, 1500);
}

// ─── Smooth Scroll for anchors ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Skill bar re-layout fix ───
// Fix: make skill-item rows display properly
document.querySelectorAll('.skill-item').forEach(item => {
  const info = item.querySelector('.skill-info');
  const pct = item.querySelector('.skill-pct');
  const bar = item.querySelector('.skill-bar');
  if (info && pct && bar) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem';
    item.insertBefore(row, info);
    row.appendChild(info);
    row.appendChild(pct);
  }
});

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', () => {
  // GitHub section observer
  const githubSection = document.getElementById('github');
  let githubLoaded = false;

  const githubObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !githubLoaded) {
      githubLoaded = true;
      fetchGitHubData();
    }
  }, { threshold: 0.1 });

  if (githubSection) githubObserver.observe(githubSection);

  // Stagger reveal for skill items
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));
});
