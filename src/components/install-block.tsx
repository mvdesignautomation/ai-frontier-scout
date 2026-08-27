import { CopyButton } from "@/components/copy-button";

const COMMANDS = [
  {
    id: "hermes",
    title: "Hermes terminal",
    hint: "After this folder is on GitHub as YOURUSER/ai-frontier-scout",
    code: "hermes skills install YOURUSER/ai-frontier-scout",
  },
  {
    id: "bash",
    title: "Linux / macOS",
    hint: "From the unzipped folder, or pipe after you push",
    code: `./install.sh

# after push:
curl -fsSL https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.sh \\
  | AI_FRONTIER_SCOUT_REPO=YOURUSER/ai-frontier-scout bash`,
  },
  {
    id: "ps",
    title: "PowerShell",
    hint: "Native Windows — no WSL required for the copy",
    code: `.\\install.ps1

# after push:
$env:AI_FRONTIER_SCOUT_REPO = "YOURUSER/ai-frontier-scout"
irm https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.ps1 | iex`,
  },
  {
    id: "cron",
    title: "Schedule the job",
    hint: "In Hermes chat, or the same CLI on Windows and Unix",
    code: `Every weekday at 8am, run ai-frontier-scout and send me the brief.

hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "Run the ai-frontier-scout skill exactly as written. Research emerging AI technologies across methodologies, business models, industries, niches, case studies, papers, and unexplored frontiers. Score each on scalability, accessibility, growth potential, and adaptability using the skill rubric. Report at most 10 NEW topics. Skip anything already in the seen ledger. Your final response is the messaging-ready brief. Do not call send_message."`,
  },
];

export function InstallBlock() {
  return (
    <div className="grid min-w-0 gap-4">
      {COMMANDS.map((cmd) => (
        <div
          key={cmd.id}
          className="min-w-0 rounded-lg border border-border bg-surface p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-fg">{cmd.title}</h3>
              <p className="mt-1 text-sm text-muted">{cmd.hint}</p>
            </div>
            <CopyButton text={cmd.code} />
          </div>
          <pre className="mt-4 max-w-full min-w-0 overflow-x-auto rounded-md bg-bg p-3 font-mono text-[12px] leading-relaxed break-all whitespace-pre-wrap text-paper sm:text-xs">
            {cmd.code}
          </pre>
        </div>
      ))}
    </div>
  );
}
