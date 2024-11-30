document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("text");
  const outputElement = document.getElementById("output");

  // Retrieve the selected text from storage
  chrome.storage.local.get("selectedText", (data) => {
    if (data.selectedText) {
      textElement.textContent = data.selectedText;
    } else {
      textElement.textContent = "No text selected.";
    }
  });

  // Perform action based on button clicked
  const performAction = (action) => {
    const selectedText = textElement.textContent;
    if (!selectedText || selectedText === "No text selected.") {
      outputElement.textContent = "Please select some text first.";
      return;
    }

    switch (action) {
      case "rewrite":
        outputElement.textContent = `Rewritten: ${selectedText} (mock output)`;
        break;
      case "translate":
        outputElement.textContent = `Translated: ${selectedText} (mock output)`;
        break;
      case "summarize":
        outputElement.textContent = `Summary: ${selectedText} (mock output)`;
        break;
    }
  };

  // Event listeners for buttons
  document
    .getElementById("rewrite")
    .addEventListener("click", () => performAction("rewrite"));
  document
    .getElementById("translate")
    .addEventListener("click", () => performAction("translate"));
  document
    .getElementById("summarize")
    .addEventListener("click", () => performAction("summarize"));
});
