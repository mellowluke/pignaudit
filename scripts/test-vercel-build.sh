#!/usr/bin/env bash
# =============================================================================
# Vercel Build Simulation
# =============================================================================
# Simulates the Vercel deployment pipeline in a clean-room environment.
# This catches issues that don't appear locally (e.g., missing prisma generate,
# unresolved workspace deps, missing env vars, turbo pipeline failures).
#
# Vercel behavior: when turbo.json is detected, Vercel may override the
# buildCommand with its own turbo-based build. This simulation tests BOTH
# the explicit vercel.json command AND the turbo pipeline path.
#
# Usage: ./scripts/test-vercel-build.sh
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="/tmp/vercel-build-sim-$$"
FAILURES=0

cleanup() {
  echo -e "\n${BLUE}[cleanup]${NC} Removing build directory: $BUILD_DIR"
  rm -rf "$BUILD_DIR"
}
trap cleanup EXIT

# Creates a clean-room copy of the repo (simulates fresh git clone)
create_clean_room() {
  rm -rf "$BUILD_DIR"
  mkdir -p "$BUILD_DIR"
  git -C "$REPO_ROOT" archive HEAD | tar -x -C "$BUILD_DIR"
}

# Runs pnpm install in the clean-room
run_install() {
  local install_cmd="$1"
  cd "$BUILD_DIR"
  if eval "$install_cmd" 2>&1; then
    echo -e "${GREEN}  -> Install succeeded${NC}"
    return 0
  else
    echo -e "${RED}  -> INSTALL FAILED${NC}"
    return 1
  fi
}

# Runs a build command and checks for output
run_build() {
  local build_cmd="$1"
  local output_dir="$2"
  cd "$BUILD_DIR"
  if eval "$build_cmd" 2>&1; then
    echo -e "${GREEN}  -> Build succeeded${NC}"
  else
    local exit_code=$?
    echo -e "${RED}  -> BUILD FAILED (exit code: $exit_code)${NC}"
    return $exit_code
  fi

  # Verify output exists
  if [ -d "$BUILD_DIR/$output_dir" ]; then
    local file_count
    file_count=$(find "$BUILD_DIR/$output_dir" -type f | wc -l)
    echo -e "${GREEN}  -> Output: $output_dir ($file_count files)${NC}"
  else
    echo -e "${RED}  -> Output directory NOT found: $output_dir${NC}"
    return 1
  fi
}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} Vercel Build Simulation${NC}"
echo -e "${BLUE}========================================${NC}"

# ---- Read vercel.json config ----
echo -e "\n${YELLOW}[config]${NC} Reading vercel.json..."
INSTALL_CMD=$(python3 -c "import json; c=json.load(open('$REPO_ROOT/vercel.json')); print(c.get('installCommand', 'npm install'))")
BUILD_CMD=$(python3 -c "import json; c=json.load(open('$REPO_ROOT/vercel.json')); print(c.get('buildCommand', 'npm run build'))")
OUTPUT_DIR=$(python3 -c "import json; c=json.load(open('$REPO_ROOT/vercel.json')); print(c.get('outputDirectory', '.next'))")
echo -e "  installCommand:  ${BLUE}$INSTALL_CMD${NC}"
echo -e "  buildCommand:    ${BLUE}$BUILD_CMD${NC}"
echo -e "  outputDirectory: ${BLUE}$OUTPUT_DIR${NC}"

# ======================================================================
# Test 1: Explicit vercel.json buildCommand (what vercel.json says)
# ======================================================================
echo -e "\n${BLUE}========================================${NC}"
echo -e "${YELLOW}[Test 1/3]${NC} vercel.json buildCommand"
echo -e "${BLUE}========================================${NC}"
echo -e "  Command: ${BLUE}$BUILD_CMD${NC}"

create_clean_room
echo -e "  Clean-room created (no node_modules, no .env files)"

if run_install "$INSTALL_CMD" && run_build "$BUILD_CMD" "$OUTPUT_DIR"; then
  echo -e "${GREEN}  => Test 1 PASSED${NC}"
else
  echo -e "${RED}  => Test 1 FAILED${NC}"
  FAILURES=$((FAILURES + 1))
fi

# ======================================================================
# Test 2: Turbo pipeline (what Vercel actually runs when it detects turbo)
# ======================================================================
echo -e "\n${BLUE}========================================${NC}"
echo -e "${YELLOW}[Test 2/3]${NC} Turbo pipeline (Vercel turbo detection)"
echo -e "${BLUE}========================================${NC}"
TURBO_CMD="pnpm turbo build --filter=@pignaudit/web"
echo -e "  Command: ${BLUE}$TURBO_CMD${NC}"

create_clean_room
echo -e "  Clean-room created (no node_modules, no .env files)"

if run_install "$INSTALL_CMD" && run_build "$TURBO_CMD" "$OUTPUT_DIR"; then
  echo -e "${GREEN}  => Test 2 PASSED${NC}"
else
  echo -e "${RED}  => Test 2 FAILED${NC}"
  FAILURES=$((FAILURES + 1))
fi

# ======================================================================
# Test 3: Direct next build (fallback/debug path)
# ======================================================================
echo -e "\n${BLUE}========================================${NC}"
echo -e "${YELLOW}[Test 3/3]${NC} Direct next build (fallback)"
echo -e "${BLUE}========================================${NC}"
DIRECT_CMD="pnpm --dir apps/web build"
echo -e "  Command: ${BLUE}$DIRECT_CMD${NC}"

create_clean_room
echo -e "  Clean-room created (no node_modules, no .env files)"

if run_install "$INSTALL_CMD" && run_build "$DIRECT_CMD" "$OUTPUT_DIR"; then
  echo -e "${GREEN}  => Test 3 PASSED${NC}"
else
  echo -e "${RED}  => Test 3 FAILED${NC}"
  FAILURES=$((FAILURES + 1))
fi

# ======================================================================
# Summary
# ======================================================================
echo -e "\n${BLUE}========================================${NC}"
if [ "$FAILURES" -eq 0 ]; then
  echo -e "${GREEN} All 3 tests PASSED${NC}"
  echo -e "${GREEN}========================================${NC}"
  exit 0
else
  echo -e "${RED} $FAILURES/3 tests FAILED${NC}"
  echo -e "${RED}========================================${NC}"
  exit 1
fi
