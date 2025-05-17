# [Tab Scraper](https://chromewebstore.google.com/detail/tab-scraper/ahdhhonppgdiglmppkcjckijelfdalho)

*Scrape and export URLs from all your open Chrome tabs in one click.*


## Overview

**Tab Scraper** is a lightweight, privacy-first Chrome extension that helps you quickly collect the URLs of all your open tabs and save them as a text file. Ideal for researchers, content creators, or anyone who needs to archive or share multiple links at once.


## Features

* **One‑Click Export**: Gather all open tab URLs instantly.
* **Advanced Filtering**: Include or exclude tabs by URL *prefix*, *suffix*, or custom *regular expressions*.
* **Invert Selection**: Flip filters to exclude matching patterns.
* **Persistent Settings**: Filter preferences sync across your Chrome profile.
* **Modern UI**: Dark mode support, responsive layout, and polished styling.
* **Privacy‑First**: All data stays local—no external servers or tracking.


## Installation

### From Chrome Web Store

1. Navigate to the [Tab Scraper page on the Chrome Web Store](https://chromewebstore.google.com/detail/tab-scraper/ahdhhonppgdiglmppkcjckijelfdalho).
2. Click **Add to Chrome**, then **Add extension**.
3. Pin the extension to your toolbar by clicking the puzzle-piece icon and selecting **Tab Scraper**.

### From Source (Development)

1. Clone this repository:

   ```bash
   git clone https://github.com/MCmoderSD/TabScraper.git
   cd TabScraper
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Build the extension:

   ```bash
   npm run build
   ```
4. Load into Chrome:

   * Open `chrome://extensions/` in your browser.
   * Enable **Developer mode** (toggle in top-right).
   * Click **Load unpacked**, then select the `dist` folder.


## Usage

1. Click the **Tab Scraper** icon in the Chrome toolbar.
2. (Optional) Set any combination of:

   * **Prefix**: Only include URLs starting with this string.
   * **Suffix**: Only include URLs ending with this string.
   * **Regex**: Match URLs against a custom pattern.
   * **Invert Selection**: Exclude all URLs matching the above.
3. Click **Scrape**.
4. Save the generated `.txt` file from the Chrome download dialog.

**Use cases:**

* Archive research sources from multiple tabs.
* Share product pages or articles with team members.
* Keep a record of your browsing session for later review.


## Permissions

* `tabs`: Read URLs from open tabs.
* `downloads`: Generate and save the output file.
* `storage`: Persist your filter settings.


## Privacy & Security

Tab Scraper operates entirely within your browser. No URLs or data are sent to any external server. You control what gets saved and shared.


## Contributing
Contributions and suggestions are welcome! Feel free to open issues or pull requests.