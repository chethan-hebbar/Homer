# Homer
Homer, your homie is a content writing browser extension that utilizes Gemini APIs to generate and translate content for users on the go

## System Requirements

Ensure your system meets the following specifications to utilize Chrome AI effectively:

- **Browser**: Chromium-based (Google Chrome, Brave, Microsoft Edge) version 127 or higher.

## Setup Instructions

### Install and Configure

1. **Install Chrome**: Required version 127 or above.
2. **Enable Prompt API**: In Chrome, navigate to `chrome://flags/#prompt-api-for-gemini-nano` and set it to "Enabled".
3. **Enable Summarization  API**: In Chrome, navigate to `chrome://flags/#summarization-api-for-gemini-nano` and set it to "Enabled". 
4. **Enable Optimization Guide**: Navigate to `chrome://flags/#optimization-guide-on-device-model`, setting it to "Enabled BypassPerfRequirement".
5. **Restart Browser**: Necessary for changes to take effect.
6. **Download Model**: Navigate to `chrome://components/`, locate "Optimization Guide On Device Model", and click "Check for update" if it shows "0.0.0.0".

### Verification

Open any webpage, press `F12` to open the console, and type `window.ai` to check the setup.

### Sample Code

```javascript
const session = await window.ai.createTextSession();
await session.prompt("What can you do?");
```

### Troubleshooting

If you encounter issues accessing `window.ai` or missing "Optimization Guide On Device Model" option:
- Try disabling and re-enabling the aforementioned options in `chrome://flags`.
- Restart your computer completely and then attempt to access `window.ai` again.


## Running this extension

1. Clone this repository.
2. Make sure get your own trial tokens by following this [documentation](https://developer.chrome.com/docs/ai/built-in-apis)
3. Update the obatined trial_tokens in [manifest.json](https://github.com/chethan-hebbar/Homer/blob/main/manifest.json)
4. Load the cloned project directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
5. Go to any webpage, select a block of text and right click. 
6. In the context menu, click on "Homer - AI actions for this text".
7. The extension popup will appear with options to Rewrite, Summarize and Translate (from english to chinese, spanish, japanese).
8. Have fun and play around with the extension.

## Disclaimer
This extension utilizes Gemini Nano which runs locally on your device. Action output might take time depending on your machine's GPU/CPU capabilities.
