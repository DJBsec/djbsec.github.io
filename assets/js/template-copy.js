(function () {
  function setFeedback(el, text) {
    if (!el) return;
    el.textContent = text;
    setTimeout(function () {
      el.textContent = "";
    }, 2200);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-tpl-copy]");
    if (!btn) return;
    var src = document.getElementById("tpl-md-source");
    var feedback = document.querySelector("[data-tpl-copy-feedback]");
    if (!src) {
      setFeedback(feedback, "Source unavailable");
      return;
    }
    var text = src.value || src.textContent || "";
    if (!text) {
      setFeedback(feedback, "Empty source");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          setFeedback(feedback, "Copied " + text.length + " chars");
        },
        function () {
          setFeedback(feedback, "Copy blocked — select & copy manually");
        }
      );
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setFeedback(feedback, "Copied");
      } catch (err) {
        setFeedback(feedback, "Copy failed");
      }
      document.body.removeChild(ta);
    }
  });
})();
