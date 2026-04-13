(function () {
  var html = document.documentElement;
  html.classList.add("dark");

  var path = location.pathname;
  var m = path.match(/^\/(ar|en)(?:\/|$)/);
  var lang = m ? m[1] : localStorage.getItem("lang") || "ar";
  if (lang !== "ar" && lang !== "en") lang = "ar";
  try {
    localStorage.setItem("lang", lang);
  } catch (e) {}

  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";
})();

function setupLangToggle() {
  var btn = document.getElementById("lang-toggle");
  if (!btn) return;
  if (btn.dataset.langToggleBound === "1") return;
  btn.dataset.langToggleBound = "1";

  function stripLocale(p) {
    var x = p.match(/^\/(ar|en)(\/.*)?$/);
    if (!x) return p || "/";
    return x[2] || "/";
  }

  function withLocale(p, nextLang) {
    var tail = stripLocale(p);
    if (tail === "/") return "/" + nextLang + "/";
    return "/" + nextLang + tail;
  }

  function navigateToNextLang() {
    var cur = document.documentElement.lang === "en" ? "en" : "ar";
    var next = cur === "ar" ? "en" : "ar";
    window.location.href = withLocale(location.pathname, next) + location.search + location.hash;
  }

  var shouldIgnoreNextClick = false;

  if ("onpointerup" in window) {
    btn.addEventListener("pointerup", function (event) {
      // Keep pointer responsiveness on mobile while preserving click a11y path.
      shouldIgnoreNextClick = true;
      navigateToNextLang();
    });
  }

  btn.addEventListener("click", function () {
    if (shouldIgnoreNextClick) {
      shouldIgnoreNextClick = false;
      return;
    }
    navigateToNextLang();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLangToggle);
} else {
  setupLangToggle();
}
