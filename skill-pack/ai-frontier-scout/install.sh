#!/usr/bin/env bash
# Install ai-frontier-scout into ~/.hermes/skills/
# Usage:
#   ./install.sh
#   curl -fsSL https://raw.githubusercontent.com/OWNER/ai-frontier-scout/main/install.sh | bash
#   AI_FRONTIER_SCOUT_REPO=OWNER/ai-frontier-scout bash install.sh
set -euo pipefail

SKILL_NAME="ai-frontier-scout"
HERMES_HOME="${HERMES_HOME:-${HOME}/.hermes}"
DEST="${HERMES_HOME}/skills/${SKILL_NAME}"
REPO="${AI_FRONTIER_SCOUT_REPO:-${1:-}}"
REF="${AI_FRONTIER_SCOUT_REF:-main}"

say() { printf '%s\n' "$*"; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }

need() { command -v "$1" >/dev/null 2>&1 || die "missing dependency: $1"; }

copy_tree() {
  local src="$1"
  mkdir -p "${DEST}"
  # Portable: don't rely on GNU cp -a
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete \
      --exclude '.git/' \
      --exclude '__pycache__/' \
      --exclude '*.pyc' \
      "${src}/" "${DEST}/"
  else
    rm -rf "${DEST}"
    mkdir -p "${DEST}"
    (cd "${src}" && tar cf - \
      --exclude '.git' \
      --exclude '__pycache__' \
      --exclude '*.pyc' \
      .) | (cd "${DEST}" && tar xf -)
  fi
}

resolve_source() {
  local here
  if [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then
    here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [ -f "${here}/SKILL.md" ]; then
      echo "${here}"
      return 0
    fi
  fi
  if [ -f "./SKILL.md" ]; then
    pwd
    return 0
  fi
  return 1
}

fetch_repo() {
  local repo="$1"
  need git
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "${tmp}"' EXIT
  say "Cloning ${repo}@${REF}…"
  git clone --depth 1 --branch "${REF}" "https://github.com/${repo}.git" "${tmp}/repo" >/dev/null
  if [ -f "${tmp}/repo/SKILL.md" ]; then
    echo "${tmp}/repo"
  elif [ -f "${tmp}/repo/${SKILL_NAME}/SKILL.md" ]; then
    echo "${tmp}/repo/${SKILL_NAME}"
  else
    die "cloned ${repo} but could not find SKILL.md"
  fi
}

SRC=""
if SRC="$(resolve_source)"; then
  say "Installing from local copy: ${SRC}"
elif [ -n "${REPO}" ]; then
  SRC="$(fetch_repo "${REPO}")"
else
  cat >&2 <<EOF
No local SKILL.md and no repo specified.

From a cloned or unzipped folder:
  ./install.sh

From GitHub (after you push this folder):
  AI_FRONTIER_SCOUT_REPO=YOURUSER/ai-frontier-scout ./install.sh
  curl -fsSL https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.sh | AI_FRONTIER_SCOUT_REPO=YOURUSER/ai-frontier-scout bash

Or copy the folder yourself:
  mkdir -p "${DEST}"
  cp -R . "${DEST}"
EOF
  exit 1
fi

[ -f "${SRC}/SKILL.md" ] || die "SKILL.md missing in ${SRC}"
copy_tree "${SRC}"
chmod +x "${DEST}/install.sh" 2>/dev/null || true
chmod +x "${DEST}/scripts/scout.py" 2>/dev/null || true

PY="python3"
command -v python3 >/dev/null 2>&1 || PY="python"
"${PY}" "${DEST}/scripts/scout.py" init >/dev/null

say ""
say "Installed ${SKILL_NAME} → ${DEST}"
say ""
say "Verify:"
say "  hermes skills list"
say "  ${PY} ${DEST}/scripts/scout.py status"
say ""
say "Schedule (Hermes CLI or PowerShell):"
"${PY}" "${DEST}/scripts/scout.py" cron-help
say ""
say "In chat:  Every weekday at 8am, run ai-frontier-scout and send me the brief."
