/**
 * Viatryon Virtual Try-On Widget
 *
 * MODE 1 — Tenant auto-match (recommended):
 *   <script src="https://yourapp.com/vto-widget.js" data-tenant="store-slug"></script>
 *   <div data-viatryon-name="{{product.title}}"></div>
 *
 * MODE 2 — Explicit product ID:
 *   <script src="https://yourapp.com/vto-widget.js"></script>
 *   <div data-viatryon="PRODUCT_UUID"></div>
 */
(function () {
  "use strict";

  var SCRIPT = document.currentScript;
  if (!SCRIPT) return;

  var BASE_URL = SCRIPT.src.replace(/\/vto-widget\.js(\?.*)?$/, "");
  var TENANT_SLUG = SCRIPT.getAttribute("data-tenant");

  var STYLE_ID = "viatryon-styles";
  if (!document.getElementById(STYLE_ID)) {
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".viatryon-btn{" +
        "display:inline-flex;align-items:center;gap:8px;" +
        "padding:12px 24px;border:none;border-radius:50px;" +
        "background:linear-gradient(135deg,#2D8C88 0%,#247a77 100%);" +
        "color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
        "font-size:14px;font-weight:600;cursor:pointer;" +
        "transition:all .2s ease;box-shadow:0 2px 8px rgba(45,140,136,.3);" +
      "}" +
      ".viatryon-btn:hover{" +
        "background:linear-gradient(135deg,#F28C38 0%,#e07d2d 100%);" +
        "box-shadow:0 4px 16px rgba(242,140,56,.35);transform:translateY(-1px);" +
      "}" +
      ".viatryon-btn svg{width:18px;height:18px;flex-shrink:0;}" +
      ".viatryon-overlay{" +
        "position:fixed;inset:0;z-index:999999;" +
        "background:rgba(0,0,0,.7);backdrop-filter:blur(4px);" +
        "display:flex;align-items:center;justify-content:center;" +
        "padding:16px;opacity:0;transition:opacity .25s ease;" +
      "}" +
      ".viatryon-overlay.active{opacity:1;}" +
      ".viatryon-modal{" +
        "position:relative;width:100%;max-width:460px;" +
        "height:90vh;max-height:720px;border-radius:16px;" +
        "overflow:hidden;background:#fff;" +
        "box-shadow:0 24px 48px rgba(0,0,0,.3);" +
        "transform:scale(.95);transition:transform .25s ease;" +
      "}" +
      ".viatryon-overlay.active .viatryon-modal{transform:scale(1);}" +
      ".viatryon-modal iframe{width:100%;height:100%;border:0;}" +
      ".viatryon-close{" +
        "position:absolute;top:12px;right:12px;z-index:10;" +
        "width:36px;height:36px;border-radius:50%;border:none;" +
        "background:rgba(0,0,0,.6);color:#fff;font-size:18px;" +
        "cursor:pointer;display:flex;align-items:center;justify-content:center;" +
        "transition:background .2s;" +
      "}" +
      ".viatryon-close:hover{background:rgba(0,0,0,.85);}";
    document.head.appendChild(style);
  }

  function createIcon() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "7");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 5V2M12 22v-3");
    svg.appendChild(circle);
    svg.appendChild(path);
    return svg;
  }

  function createButton(productId) {
    var btn = document.createElement("button");
    btn.className = "viatryon-btn";
    btn.appendChild(createIcon());
    btn.appendChild(document.createTextNode(" Try It On"));
    btn.addEventListener("click", function () {
      openModal(productId);
    });
    return btn;
  }

  function openModal(productId) {
    var overlay = document.createElement("div");
    overlay.className = "viatryon-overlay";

    var modal = document.createElement("div");
    modal.className = "viatryon-modal";

    var closeBtn = document.createElement("button");
    closeBtn.className = "viatryon-close";
    closeBtn.textContent = "\u2715";
    closeBtn.addEventListener("click", function () {
      close();
    });

    var iframe = document.createElement("iframe");
    iframe.src = BASE_URL + "/widget/" + productId;
    iframe.allow = "camera";
    iframe.loading = "lazy";

    modal.appendChild(closeBtn);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", onEsc);

    requestAnimationFrame(function () {
      overlay.classList.add("active");
    });

    function onEsc(e) {
      if (e.key === "Escape") close();
    }

    function close() {
      overlay.classList.remove("active");
      document.removeEventListener("keydown", onEsc);
      setTimeout(function () {
        overlay.remove();
      }, 250);
    }
  }

  /** Normalize a product name for fuzzy matching */
  function normalize(str) {
    return (str || "").toLowerCase().trim().replace(/\s+/g, " ");
  }

  /** MODE 1: Explicit product ID — data-viatryon="UUID" */
  function initExplicit() {
    var targets = document.querySelectorAll("[data-viatryon]");
    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      if (el.getAttribute("data-viatryon-init")) continue;
      var productId = el.getAttribute("data-viatryon");
      if (!productId) continue;
      el.setAttribute("data-viatryon-init", "1");
      el.appendChild(createButton(productId));
    }
  }

  /** MODE 2: Tenant auto-match — data-tenant on script + data-viatryon-name on elements */
  function initTenantMode(slug) {
    var apiUrl = BASE_URL + "/api/widget/" + encodeURIComponent(slug) + "/products";

    fetch(apiUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var products = data.products;
        if (!products || !products.length) return;

        // Build a lookup: normalized name -> product id
        var catalog = {};
        for (var i = 0; i < products.length; i++) {
          var key = normalize(products[i].name);
          if (key) catalog[key] = products[i].id;
        }

        // Find all elements with data-viatryon-name and match them
        var targets = document.querySelectorAll("[data-viatryon-name]");
        for (var j = 0; j < targets.length; j++) {
          var el = targets[j];
          if (el.getAttribute("data-viatryon-init")) continue;

          var name = normalize(el.getAttribute("data-viatryon-name"));
          var matchedId = catalog[name];

          // If exact match fails, try partial matching (catalog name contains or is contained by page name)
          if (!matchedId) {
            var catalogKeys = Object.keys(catalog);
            for (var k = 0; k < catalogKeys.length; k++) {
              if (name.indexOf(catalogKeys[k]) !== -1 || catalogKeys[k].indexOf(name) !== -1) {
                matchedId = catalog[catalogKeys[k]];
                break;
              }
            }
          }

          if (matchedId) {
            el.setAttribute("data-viatryon-init", "1");
            el.appendChild(createButton(matchedId));
          }
        }
      })
      .catch(function () {
        // Silently fail — don't break the host site
      });
  }

  function init() {
    // Always process explicit product IDs
    initExplicit();

    // If data-tenant is set, also run auto-match mode
    if (TENANT_SLUG) {
      initTenantMode(TENANT_SLUG);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.Viatryon = {
    init: init,
    tryOn: openModal,
  };
})();
