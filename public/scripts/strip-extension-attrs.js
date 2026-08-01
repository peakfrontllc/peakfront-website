(function () {
  var ATTRS = ["bis_skin_checked"];

  function strip(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      if (el.hasAttribute(ATTRS[i])) {
        el.removeAttribute(ATTRS[i]);
      }
    }
  }

  function stripTree(root) {
    if (!root || root.nodeType !== 1) return;
    strip(root);
    var nodes = root.querySelectorAll("*");
    for (var i = 0; i < nodes.length; i++) {
      strip(nodes[i]);
    }
  }

  stripTree(document.documentElement);

  new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];

      if (mutation.type === "attributes" && mutation.target.nodeType === 1) {
        strip(mutation.target);
      }

      for (var j = 0; j < mutation.addedNodes.length; j++) {
        var node = mutation.addedNodes[j];
        if (node.nodeType === 1) {
          stripTree(node);
        }
      }
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ATTRS,
  });
})();
