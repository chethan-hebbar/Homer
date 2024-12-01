# Homer
Homer, your homie is a content writing browser extension that utilizes Gemini APIs to generate and translate content for users on the go

## Running this extension

1. Clone this repository\
2. Make sure get your own trial tokens by following this [documentation](https://developer.chrome.com/docs/ai/built-in-apis)
3. Update the obatined trial_tokens in [manifest.json](https://github.com/chethan-hebbar/Homer/blob/main/manifest.json)
4. Load the cloned project directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
5. Go to any webpage, select a block of text and right click. 
6. In the context menu, click on "Homer - AI actions for this text".
7. The extension popup will appear with options to Rewrite, Summarize and Translate (from english to chinese, spanish, japanese).
8. Have fun and play around with the extension.

## Disclaimer
This extension utilizes Gemini Nano which runs locally on your device. Action output might take time depending on your machine's GPU/CPU capabilities.
