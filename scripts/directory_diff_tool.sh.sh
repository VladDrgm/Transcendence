#!/bin/bash

# Display the description of script functionality
echo "=============================="
echo "Local Git Repository Code Comparison Script"
echo "=============================="
echo "This script compares the contents of two directories while excluding .git subdirectories."
echo "It prompts the user for the paths to the directories and displays whether they are the same or different."
echo "If they are different, it also displays the differences between them."
echo "=============================="

# Ask the user for the paths to the two directories
read -p "Enter the path to the first directory: " dir1
read -p "Enter the path to the second directory: " dir2

# Use diff to compare the contents of the two directories, excluding .git subdirectories
if diff -rq --exclude=".git" "$dir1" "$dir2"; then
  echo "The code in the two directories is the same."
else
  echo "The code in the two directories is different."
  echo "Differences:"
  diff -rq --exclude=".git" "$dir1" "$dir2"
fi