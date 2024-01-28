document.addEventListener("DOMContentLoaded", () => {
  const GITHUB_PAGES_URI_MAX_LENGTH = 8200;
  const regex = document.getElementById("regex");
  const text = document.getElementById("extractionText");

  const jqlElement = document.getElementById("jql");
  const bashElement = document.getElementById("bash");
  const listElement = document.getElementById("issues");

  let issues = {};
  let keys = [];

  function findIssues() {
    const matches = text.value.match(new RegExp(regex.value, "g"));
    issues = matches.reduce((acc, match) => {
      if (match in acc) {
        acc[match]++;
      } else {
        acc[match] = 1;
      }
      return acc;
    }, {});
    keys = Object.keys(issues);
  }

  function updateJql() {
    jqlElement.value = keys ? "issuekey in (" + keys.join(", ") + ")" : "";
  }

  document.getElementById("copyJql").addEventListener("click", () => {
    genericCopy(jqlElement);
  });

  document.getElementById("copyBash").addEventListener("click", () => {
    genericCopy(bashElement);
  });

  document.getElementById("copyList").addEventListener("click", () => {
    navigator.clipboard.writeText(keys.join("\n"));
  });

  function genericCopy(element) {
    element.select();
    element.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  function updateNumber() {
    document.getElementById("number").innerText = keys.length;
  }

  function updateIssues() {
    const list = listElement;
    list.innerHTML = "";
    for (const issue of keys) {
      const li = document.createElement("li");
      li.innerText = issue;
      if (issues[issue] > 1) {
        const span = document.createElement("span");
        span.innerText = " (" + issues[issue] + ")";
        li.appendChild(span);
      }
      list.appendChild(li);
    }
  }

  function updateBash() {
    bashElement.value = `echo "${keys.join("\\n")}" > extracted_issues.txt`;
  }

  function decodeTextAndRegexFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("text") != null) {
      const decodedText = globalThis.LZString.decompressFromEncodedURIComponent(
        urlParams.get("text"),
      );
      text.value = decodedText;
    }
    if (urlParams.get("regex" != null)) {
      const decodedRegex =
        globalThis.LZString.decompressFromEncodedURIComponent(
          urlParams.get("regex"),
        );
      regex.value = decodedRegex;
    }
  }

  function decodeDimensionsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("width") != null) {
      const width = parseInt(urlParams.get("width"), 10);
      if (!isNaN(width)) {
        text.style.width = width + "px";
      }
    }
    if (urlParams.get("height") != null) {
      const height = parseInt(urlParams.get("height"), 10);
      if (!isNaN(height)) {
        text.style.height = height + "px";
      }
    }
  }

  function encodeDimensionsAndAddToUrl() {
    const width = text.offsetWidth.toString();
    const height = text.offsetHeight.toString();
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("width", width);
    currentParams.set("height", height);
    window.history.replaceState(
      null,
      null,
      "issue_extractor.html?" + currentParams.toString(),
    );
  }

  function encodeTextAndRegexAndAddToUrl() {
    const encodedText = globalThis.LZString.compressToEncodedURIComponent(
      text.value,
    );
    const encodedRegex = globalThis.LZString.compressToEncodedURIComponent(
      regex.value,
    );
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("text", encodedText);
    currentParams.set("regex", encodedRegex);
    window.history.replaceState(
      null,
      null,
      "issue_extractor.html?" + currentParams.toString(),
    );
    handleUriLength();
  }

  function handleUriLength() {
    document.getElementById("uriLimit").innerText =
      Math.round(
        (window.location.href.length / GITHUB_PAGES_URI_MAX_LENGTH) * 100,
      ) + "%";
    if (window.location.href.length > GITHUB_PAGES_URI_MAX_LENGTH) {
      const currentParams = new URLSearchParams(window.location.search);
      document.getElementById("uriDisclaimer").style.display = "block";
      currentParams.delete("text");
      currentParams.delete("regex");
      window.history.replaceState(
        null,
        null,
        "issue_extractor.html?" + currentParams.toString(),
      );
    } else {
      document.getElementById("uriDisclaimer").style.display = "none";
    }
  }

  function refresh() {
    findIssues();
    updateIssues();
    updateJql();
    updateNumber();
    updateBash();
    encodeTextAndRegexAndAddToUrl();
  }

  for (const element of [regex, text]) {
    element.addEventListener("input", () => {
      refresh();
    });
  }

  text.addEventListener("mouseup", () => {
    encodeDimensionsAndAddToUrl();
  });

  exampleText =
    "V načrtu bomo naredili več stvari.\n\nV prvem delu bomo implementirali zaledje (IX-503940) in UI, ta je že napol narejen v IX-123456.\n\nPotem pa bomo to še testirali v IX-333333";
  text.value = exampleText;

  decodeTextAndRegexFromUrl();
  decodeDimensionsFromUrl();
  refresh();
});
