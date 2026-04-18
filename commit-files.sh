#!/bin/bash

# Exit if no files provided
if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <file1> <file2> ..."
  exit 1
fi

BRANCH=$(git branch --show-current)

for file in "$@"; do
  # Check if file exists
  if [ -f "$file" ]; then
    echo "Processing $file..."

    git add "$file"

    # Only commit if there are staged changes
    if ! git diff --cached --quiet; then
      git commit -m "Update $file"
    else
      echo "No changes to commit for $file"
    fi
  else
    echo "File not found: $file"
  fi
done

# Push once at the end
git push origin "$BRANCH"