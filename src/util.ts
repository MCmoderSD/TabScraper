const FILE_NAME: string = "Download.txt";

export function describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export async function downloadUrls(urls: readonly string[]): Promise<void> {
    const content: string = `${urls.join("\n")}\n`;

    await chrome.downloads.download({
        url: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
        filename: FILE_NAME,
        saveAs: true
    });
}