(function () {
  "use strict";

  function normalizePath(pathname) {
    if (!pathname) {
      return "/";
    }

    var normalized = pathname.replace(/\/+$/, "");
    return normalized === "" ? "/" : normalized;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initThemeToggle() {
    var themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) {
      return;
    }

    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || "light";
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (_) {
        // Ignore storage failures.
      }
    });
  }

  function initSidebarState() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".sidebar-nav a"));
    if (!links.length) {
      return;
    }

    var currentPath = normalizePath(window.location.pathname);
    var activeLink = null;

    links.forEach(function (link) {
      link.classList.remove("active");
      var href = link.getAttribute("href");
      if (!href || href.indexOf("/") !== 0) {
        return;
      }

      var linkPath = normalizePath(href);
      var isMatch =
        currentPath === linkPath ||
        (linkPath !== "/" && currentPath.indexOf(linkPath + "/") === 0);

      if (!isMatch) {
        return;
      }

      if (!activeLink || linkPath.length > normalizePath(activeLink.getAttribute("href")).length) {
        activeLink = link;
      }
    });

    if (!activeLink) {
      return;
    }

    activeLink.classList.add("active");

    var parent = activeLink.parentElement;
    while (parent) {
      if (parent.tagName === "DETAILS") {
        parent.open = true;
      }
      parent = parent.parentElement;
    }
  }

  function parseSearchIndex() {
    var element = document.getElementById("search-index");
    if (!element) {
      return [];
    }

    try {
      var parsed = JSON.parse(element.textContent || "[]");
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (_) {
      // Ignore parse errors.
    }

    return [];
  }

  function buildSearchResults(query, searchIndex) {
    var normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    var tokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return searchIndex
      .map(function (entry) {
        var title = String(entry.title || "").toLowerCase();
        var summary = String(entry.summary || "").toLowerCase();
        var content = String(entry.content || "").toLowerCase();

        var score = 0;

        if (title.indexOf(normalizedQuery) === 0) {
          score += 12;
        }
        if (title.indexOf(normalizedQuery) !== -1) {
          score += 8;
        }

        tokens.forEach(function (token) {
          if (title.indexOf(token) !== -1) {
            score += 4;
          }
          if (summary.indexOf(token) !== -1) {
            score += 2;
          }
          if (content.indexOf(token) !== -1) {
            score += 1;
          }
        });

        return {
          score: score,
          data: entry,
        };
      })
      .filter(function (entry) {
        return entry.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 12)
      .map(function (entry) {
        return entry.data;
      });
  }

  function initSearch() {
    var trigger = document.querySelector(".search-trigger");
    var overlay = document.getElementById("search-overlay");
    var input = document.getElementById("search-input");
    var resultsContainer = document.getElementById("search-results");
    var closeButton = document.querySelector(".search-close");

    if (!trigger || !overlay || !input || !resultsContainer) {
      return;
    }

    var searchIndex = parseSearchIndex();
    var renderedResults = [];
    var selectedIndex = -1;

    function getResultNodes() {
      return Array.prototype.slice.call(resultsContainer.querySelectorAll(".search-result"));
    }

    function setSelected(nextIndex) {
      var nodes = getResultNodes();
      if (!nodes.length) {
        selectedIndex = -1;
        return;
      }

      if (nextIndex < 0) {
        nextIndex = nodes.length - 1;
      }
      if (nextIndex >= nodes.length) {
        nextIndex = 0;
      }

      selectedIndex = nextIndex;
      nodes.forEach(function (node, index) {
        var isSelected = index === selectedIndex;
        node.classList.toggle("selected", isSelected);
        node.setAttribute("aria-selected", isSelected ? "true" : "false");
      });

      nodes[selectedIndex].scrollIntoView({ block: "nearest" });
    }

    function renderResults(query) {
      renderedResults = buildSearchResults(query, searchIndex);
      selectedIndex = -1;

      if (!query.trim()) {
        resultsContainer.innerHTML = '<div class="search-empty">Type to search documentation</div>';
        return;
      }

      if (!renderedResults.length) {
        resultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
        return;
      }

      resultsContainer.innerHTML = renderedResults
        .map(function (item, index) {
          var excerpt = item.summary || item.content || "";
          return (
            '<a class="search-result" role="option" aria-selected="false" data-index="' +
            index +
            '" href="' +
            escapeHtml(item.url) +
            '">' +
            '<div class="search-result-title">' +
            escapeHtml(item.title) +
            "</div>" +
            '<div class="search-result-excerpt">' +
            escapeHtml(excerpt) +
            "</div>" +
            "</a>"
          );
        })
        .join("");
    }

    function openSearch() {
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      input.focus();
      renderResults(input.value);
    }

    function closeSearch() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      selectedIndex = -1;
    }

    trigger.addEventListener("click", function () {
      openSearch();
    });

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        closeSearch();
      });
    }

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeSearch();
      }
    });

    input.addEventListener("input", function () {
      renderResults(input.value);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelected(selectedIndex + 1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelected(selectedIndex - 1);
      }

      if (event.key === "Enter") {
        var nodes = getResultNodes();
        if (!nodes.length) {
          return;
        }

        event.preventDefault();
        if (selectedIndex < 0) {
          setSelected(0);
        }

        var target = nodes[selectedIndex >= 0 ? selectedIndex : 0];
        if (target) {
          window.location.href = target.getAttribute("href");
        }
      }
    });

    document.addEventListener("keydown", function (event) {
      var isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        if (overlay.classList.contains("active")) {
          closeSearch();
        } else {
          openSearch();
        }
      }

      if (event.key === "Escape" && overlay.classList.contains("active")) {
        event.preventDefault();
        closeSearch();
      }
    });

    resultsContainer.addEventListener("mousemove", function (event) {
      var item = event.target.closest(".search-result");
      if (!item) {
        return;
      }
      setSelected(Number(item.getAttribute("data-index")));
    });
  }

  function initTocHighlight() {
    var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc-nav a[href^='#']"));
    if (!tocLinks.length || typeof IntersectionObserver === "undefined") {
      return;
    }

    var sections = tocLinks
      .map(function (link) {
        var href = link.getAttribute("href");
        if (!href || href.length < 2) {
          return null;
        }

        var id = href.slice(1);
        var section = document.getElementById(id);
        if (!section) {
          return null;
        }

        return {
          id: id,
          link: link,
          section: section,
        };
      })
      .filter(Boolean);

    if (!sections.length) {
      return;
    }

    function activate(id) {
      sections.forEach(function (item) {
        item.link.classList.toggle("active", item.id === id);
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activate(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach(function (item) {
      observer.observe(item.section);
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      });
    }

    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    var success = false;
    try {
      success = document.execCommand("copy");
    } catch (_) {
      success = false;
    }

    document.body.removeChild(textarea);
    return Promise.resolve(success);
  }

  function detectCodeLabel(codeElement) {
    if (codeElement.dataset && codeElement.dataset.filename) {
      return codeElement.dataset.filename;
    }

    var className = codeElement.className || "";
    var match = className.match(/language-([a-z0-9_+-]+)/i);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }

    return "code";
  }

  function initCodeBlocks() {
    var codeBlocks = Array.prototype.slice.call(document.querySelectorAll(".docs-content pre > code"));
    if (!codeBlocks.length) {
      return;
    }

    codeBlocks.forEach(function (codeElement) {
      var pre = codeElement.parentElement;
      if (!pre || pre.closest(".code-block")) {
        return;
      }

      var wrapper = document.createElement("div");
      wrapper.className = "code-block";

      var header = document.createElement("div");
      header.className = "code-header";

      var label = document.createElement("span");
      label.textContent = detectCodeLabel(codeElement);

      var actions = document.createElement("div");
      actions.className = "code-actions";

      var wrapButton = document.createElement("button");
      wrapButton.type = "button";
      wrapButton.className = "code-action";
      wrapButton.textContent = "Wrap";
      wrapButton.setAttribute("aria-pressed", "false");

      var copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "copy-button";
      copyButton.textContent = "Copy";

      actions.appendChild(wrapButton);
      actions.appendChild(copyButton);
      header.appendChild(label);
      header.appendChild(actions);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      wrapButton.addEventListener("click", function () {
        var enabled = wrapper.classList.toggle("wrap-enabled");
        wrapButton.setAttribute("aria-pressed", enabled ? "true" : "false");
        wrapButton.textContent = enabled ? "No Wrap" : "Wrap";
      });

      copyButton.addEventListener("click", function () {
        copyText(codeElement.textContent || "").then(function (ok) {
          copyButton.textContent = ok ? "Copied" : "Failed";
          window.setTimeout(function () {
            copyButton.textContent = "Copy";
          }, 1200);
        });
      });
    });
  }

  function initMermaid() {
    var mermaidCodes = Array.prototype.slice.call(
      document.querySelectorAll(".docs-content pre > code.language-mermaid")
    );

    if (!mermaidCodes.length) {
      return;
    }

    mermaidCodes.forEach(function (codeElement) {
      var pre = codeElement.parentElement;
      if (!pre || !pre.parentElement) {
        return;
      }

      var diagram = document.createElement("div");
      diagram.className = "mermaid";
      diagram.textContent = codeElement.textContent || "";
      pre.parentElement.replaceChild(diagram, pre);
    });

    if (!window.mermaid) {
      return;
    }

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default",
    });
    window.mermaid.run({ querySelector: ".mermaid" });
  }

  function initTabs() {
    var tabBlocks = Array.prototype.slice.call(document.querySelectorAll(".tabs"));
    if (!tabBlocks.length) {
      return;
    }

    tabBlocks.forEach(function (tabs, blockIndex) {
      var tabList = tabs.querySelector(".tab-list");
      var buttons = Array.prototype.slice.call(tabs.querySelectorAll(".tab-button"));
      var panels = Array.prototype.slice.call(tabs.querySelectorAll(".tab-panel"));

      if (!tabList || buttons.length < 2 || !panels.length) {
        return;
      }

      tabList.setAttribute("role", "tablist");

      var tabEntries = buttons.map(function (button, tabIndex) {
        var panel = panels[tabIndex] || null;
        var tabId = button.id || "tab-" + blockIndex + "-" + tabIndex;
        var panelId = panel && panel.id ? panel.id : "tab-panel-" + blockIndex + "-" + tabIndex;

        button.id = tabId;
        button.setAttribute("role", "tab");
        button.setAttribute("aria-controls", panelId);

        if (panel) {
          panel.id = panelId;
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("aria-labelledby", tabId);
        }

        return {
          button: button,
          panel: panel,
        };
      });

      var activeIndex = tabEntries.findIndex(function (entry) {
        return entry.button.classList.contains("active") || entry.button.getAttribute("aria-selected") === "true";
      });

      if (activeIndex < 0) {
        activeIndex = 0;
      }

      function activate(index, shouldFocus) {
        tabEntries.forEach(function (entry, currentIndex) {
          var isActive = currentIndex === index;
          entry.button.classList.toggle("active", isActive);
          entry.button.setAttribute("aria-selected", isActive ? "true" : "false");
          entry.button.setAttribute("tabindex", isActive ? "0" : "-1");

          if (entry.panel) {
            entry.panel.hidden = !isActive;
          }

          if (shouldFocus && isActive) {
            entry.button.focus();
          }
        });
      }

      activate(activeIndex, false);

      tabEntries.forEach(function (entry, index) {
        entry.button.addEventListener("click", function () {
          activate(index, false);
        });

        entry.button.addEventListener("keydown", function (event) {
          var nextIndex = null;

          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            nextIndex = (index + 1) % tabEntries.length;
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            nextIndex = (index - 1 + tabEntries.length) % tabEntries.length;
          }
          if (event.key === "Home") {
            nextIndex = 0;
          }
          if (event.key === "End") {
            nextIndex = tabEntries.length - 1;
          }

          if (nextIndex === null) {
            return;
          }

          event.preventDefault();
          activate(nextIndex, true);
        });
      });
    });
  }

  function initCallouts() {
    var blockquotes = Array.prototype.slice.call(document.querySelectorAll(".docs-content blockquote"));
    if (!blockquotes.length) {
      return;
    }

    var typeMap = {
      note: "info",
      info: "info",
      warning: "warn",
      warn: "warn",
      danger: "danger",
      error: "danger",
      success: "success",
    };

    blockquotes.forEach(function (blockquote) {
      if (blockquote.classList.contains("callout")) {
        return;
      }

      var firstStrong = blockquote.querySelector("p strong");
      if (!firstStrong) {
        return;
      }

      var rawLabel = (firstStrong.textContent || "").replace(/:$/, "").trim().toLowerCase();
      var normalizedType = typeMap[rawLabel];
      if (!normalizedType) {
        return;
      }

      blockquote.classList.add("callout", "callout-" + normalizedType);
    });
  }

  function initialize() {
    initThemeToggle();
    initSidebarState();
    initSearch();
    initTocHighlight();
    initMermaid();
    initCodeBlocks();
    initTabs();
    initCallouts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
