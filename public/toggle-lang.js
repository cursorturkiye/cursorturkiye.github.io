(function () {
  var html = document.documentElement;
  html.classList.add("dark");

  var path = location.pathname;
  var m = path.match(/^\/(tr|en)(?:\/|$)/);
  var lang = m ? m[1] : localStorage.getItem("lang") || "tr";
  if (lang !== "tr" && lang !== "en") lang = "tr";
  try {
    localStorage.setItem("lang", lang);
  } catch (e) {}

  html.lang = lang;
  html.dir = "ltr";

  var toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-label", lang === "tr" ? "Switch to English" : "Switch to Turkish");
  }
})();

function setupLangToggle() {
  var btn = document.getElementById("lang-toggle");
  if (!btn) return;
  if (btn.dataset.langToggleBound === "1") return;
  btn.dataset.langToggleBound = "1";

  function stripLocale(p) {
    var x = p.match(/^\/(tr|en)(\/.*)?$/);
    if (!x) return p || "/";
    return x[2] || "/";
  }

  function withLocale(p, nextLang) {
    var tail = stripLocale(p);
    if (tail === "/") return "/" + nextLang + "/";
    return "/" + nextLang + tail;
  }

  btn.addEventListener("click", function () {
    var cur = document.documentElement.lang === "en" ? "en" : "tr";
    var next = cur === "tr" ? "en" : "tr";
    try { localStorage.setItem("lang", next); } catch (e) {}
    btn.setAttribute("aria-label", next === "tr" ? "Switch to English" : "Switch to Turkish");
    window.location.href = withLocale(location.pathname, next) + location.search + location.hash;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLangToggle);
} else {
  setupLangToggle();
}

