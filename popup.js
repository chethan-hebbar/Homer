document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("text");
  const outputElement = document.getElementById("output");

  // Retrieve the selected text from storage
  chrome.storage.local.get("selectedText", (data) => {
    if (data.selectedText) {
      textElement.textContent = data.selectedText;
      // add code to display detected language using the detector
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
        outputElement.innerHTML = '<div class="spinner"></div>';
        rewriteApiCall(selectedText).then((rewrittenText) => {
          console.log(rewrittenText);
          outputElement.textContent = rewrittenText;
        });
        break;
      case "translateToZh":
        outputElement.innerHTML = '<div class="spinner"></div>';
        // translate selectedText to ZH
        console.log("Translating to ZH...");
        translateText(selectedText, "zh").then(
          (tranlatedTextResult) =>
            (outputElement.textContent = tranlatedTextResult)
        );
        break;
      case "translateToJa":
        outputElement.innerHTML = '<div class="spinner"></div>';
        // translate selectedText to JA
        console.log("Translating to JA ...");
        translateText(selectedText, "ja").then(
          (tranlatedTextResult) =>
            (outputElement.textContent = tranlatedTextResult)
        );
        break;
      case "translateToEs":
        outputElement.innerHTML = '<div class="spinner"></div>';
        // translate selectedText to ES
        console.log("Translating to ES ...");
        translateText(selectedText, "es").then(
          (tranlatedTextResult) =>
            (outputElement.textContent = tranlatedTextResult)
        );
        break;
      case "summarize":
        outputElement.innerHTML = '<div class="spinner"></div>';
        generateSummary(selectedText).then((summarizedText) => {
          console.log(summarizedText);
          outputElement.textContent = summarizedText;
        });
        break;
    }
  };

  // Event listeners for buttons
  document
    .getElementById("rewrite")
    .addEventListener("click", () => performAction("rewrite"));
  document
    .getElementById("translateToZh")
    .addEventListener("click", () => performAction("translateToZh"));
  document
    .getElementById("translateToEs")
    .addEventListener("click", () => performAction("translateToEs"));
  document
    .getElementById("translateToJa")
    .addEventListener("click", () => performAction("translateToJa"));
  document
    .getElementById("summarize")
    .addEventListener("click", () => performAction("summarize"));
});

// init the prompt api session
var promptApiSession;

// rewrite api call based on the user selected text
async function rewriteApiCall(selectedText) {
  console.log("Entered rewrite api call...");

  return await runPromptApi(selectedText);
}

// function to run prompt api
async function runPromptApi(prompt) {
  try {
    if (!promptApiSession) {
      promptApiSession = await chrome.aiOriginTrial.languageModel.create({
        systemPrompt: "You are a content rewriting assistant.",
        temperature: 1.0,
        topK: 3,
      });

      console.log("prompt api session created: ", promptApiSession);
    }

    console.log("Sending prompt...");
    return await promptApiSession.prompt(prompt);
  } catch (e) {
    console.log("Prompt failed");
    console.error(e);
    console.log("Prompt:", prompt);
    // Reset session
    reset();
    throw e;
  }
}

// reset promptApi session
async function reset() {
  if (promptApiSession) {
    promptApiSession.destroy();
  }
  promptApiSession = null;
}

// generates summary
async function generateSummary(text) {
  try {
    const session = await createSummarizer(
      {
        type: "key-points",
        format: "plain-text",
        length: "short",
      },
      (message, progress) => {
        console.log(`${message} (${progress.loaded}/${progress.total})`);
      }
    );

    console.log("Proceeding to summarize text...");

    const summary = await session.summarize(text);
    session.destroy();

    return summary;
  } catch (e) {
    console.log("Summary generation failed");
    console.error(e);
    return "Error: " + e.message;
  }
}

// creates gemini summarizer
async function createSummarizer(config, downloadProgressCallback) {
  if (!window.ai || !window.ai.summarizer) {
    throw new Error("AI Summarization is not supported in this browser");
  }
  const canSummarize = await window.ai.summarizer.capabilities();
  if (canSummarize.available === "no") {
    throw new Error("AI Summarization is not supported");
  }
  const summarizationSession = await self.ai.summarizer.create(
    config,
    downloadProgressCallback
  );
  if (canSummarize.available === "after-download") {
    summarizationSession.addEventListener(
      "downloadprogress",
      downloadProgressCallback
    );
    await summarizationSession.ready;
  }

  console.log("Summarizer created successfully...");
  return summarizationSession;
}

// language detector
var languageDetector;

// perform language detection
async function detectLanguage(selectedText) {
  if (!languageDetector) {
    languageDetector = await createLanguageDetector();
  }

  const detectorResult = await detector.detect(selectedText);

  return detectorResult.detectedLanguage;
}

// create language detector session
async function createLanguageDetector() {
  if (!("translation" in self && "canDetect" in self.translation)) {
    // The Language Detector API is not available
    throw new Error("Language Detecting capabilities absent...");
  }

  const canDetect = await translation.canDetect();
  if (canDetect === "no") {
    // The language detector isn't usable.
    throw new Error("Language Detector unavailable at the moment...");
  }
  if (canDetect === "readily") {
    // The language detector can immediately be used.
    detector = await translation.createDetector();
  } else {
    // The language detector can be used after model download.
    detector = await translation.createDetector();
    detector.addEventListener("downloadprogress", (e) => {
      console.log(e.loaded, e.total);
    });
    await detector.ready;
  }

  return detector;
}

// translate text
async function translateText(selectedText, targetLanguage) {
  if (!("translation" in self && "createTranslator" in self.translation)) {
    // The Translator API is not supported.
    throw new Error("Translate capability not available...");
  }

  try {
    console.log("Creating translator...");
    const translator = await self.translation.createTranslator({
      sourceLanguage: "en",
      targetLanguage: targetLanguage,
    });

    console.log("Proceeding to translate given text...");
    return await translator.translate(selectedText);
  } catch (e) {
    console.log(
      "Error during creation of translator or during translation of text",
      e
    );
    throw e;
  }
}
