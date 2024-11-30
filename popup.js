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
        rewriteApiCall(selectedText).then((rewrittenText) => {
            console.log(rewrittenText);
            outputElement.textContent = rewrittenText;
          });
        break;
      case "translate":
        console.log("Translating...")
        outputElement.textContent = `Translated: ${selectedText} (mock output)`;
        break;
      case "summarize":
        generateSummary(selectedText).then((summarizedText) => {
          console.log(summarizedText);
          outputElement.textContent = summarizedText;
        })
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


// init the prompt api session
var promptApiSession;

// rewrite api call based on the user selected text
async function rewriteApiCall(selectedText){
    console.log("Entered rewrite api call...");

    return await runPromptApi(selectedText);
};

// function to run prompt api
async function runPromptApi(prompt) {
    try {
      if (!promptApiSession) {
        promptApiSession = await chrome.aiOriginTrial.languageModel.create({
            systemPrompt: 'You are a content rewriting assistant.',
            temperature: 1.0,
            topK: 3
          });
        
        console.log("prompt api session created: ", promptApiSession);
      }

      console.log("Sending prompt...");
      return await promptApiSession.prompt(prompt);
    } 
    catch (e) {
      console.log('Prompt failed');
      console.error(e);
      console.log('Prompt:', prompt);
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
        format: "markdown",
        length: "medium"
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
    console.log('Summary generation failed');
    console.error(e);
    return 'Error: ' + e.message;
  }
}

// creates gemini summarizer
async function createSummarizer(config, downloadProgressCallback) {
  if (!window.ai || !window.ai.summarizer) {
    throw new Error('AI Summarization is not supported in this browser');
  }
  const canSummarize = await window.ai.summarizer.capabilities();
  if (canSummarize.available === 'no') {
    throw new Error('AI Summarization is not supported');
  }
  const summarizationSession = await self.ai.summarizer.create(
    config,
    downloadProgressCallback
  );
  if (canSummarize.available === 'after-download') {
    summarizationSession.addEventListener(
      'downloadprogress',
      downloadProgressCallback
    );
    await summarizationSession.ready;
  }

  console.log("Summarizer created successfully...");
  return summarizationSession;
}