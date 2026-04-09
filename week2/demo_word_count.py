"""
HCDE 530 - Week 2: Word Count Analysis Demonstration

This script demonstrates how to:
1. Read data from a CSV file
2. Process text data (count words)
3. Calculate and display summary statistics

Key Learning Concepts:
- File input/output with CSV
- Reusable functions
- String manipulation
- Basic statistical analysis
- Formatted output
"""

import csv  # Python's built-in module for reading/writing CSV files


# ============================================================================
# STEP 1: Load and Read the CSV File
# ============================================================================
# Define which file to analyze
filename = "demo_responses.csv"

# Create an empty list to store all our response data
# We'll add each row from the CSV to this list
responses = []

# Open the CSV file and read its contents
# The 'with' statement automatically closes the file when done
# - newline="" handles different line endings across operating systems
# - encoding="utf-8" ensures special characters display correctly
with open(filename, newline="", encoding="utf-8") as f:
    # csv.DictReader converts each CSV row into a dictionary
    # This lets us access data by column name (like "participant_id")
    # instead of by position (like row[0])
    reader = csv.DictReader(f)

    # Loop through each row in the CSV file
    for row in reader:
        # Add this row (as a dictionary) to our responses list
        responses.append(row)


# ============================================================================
# STEP 2: Define a Reusable Function for Word Counting
# ============================================================================
def count_words(response):
    """Count the number of words in a response string.

    This function demonstrates how to create reusable code.
    Instead of writing the same word-counting logic multiple times,
    we write it once in a function and call it whenever needed.

    How it works:
    1. Takes a string (text response) as input
    2. Uses .split() to break the string into words (splits on whitespace)
    3. Returns the count of words using len()

    Args:
        response (str): The text response to analyze

    Returns:
        int: The number of words in the response

    Example:
        >>> count_words("This is a test")
        4
    """
    # .split() breaks a string into a list of words
    # len() counts how many items are in that list
    return len(response.split())


# ============================================================================
# STEP 3: Process Each Response and Display Results
# ============================================================================
# Print a formatted header for our results table
# The syntax like {' ID':<6} means "left-align this text in a 6-character space"
print(f"{'ID':<6} {'Role':<22} {'Words':<6} {'Response (first 60 chars)'}")
print("-" * 75)  # Print a line of 75 dashes as a separator

# Create a list to store all word counts
# We'll use this later for calculating statistics
word_counts = []

# Loop through each response in our data
for row in responses:
    # Extract the data fields we need from this row
    # Since we used DictReader, we can access values by column name
    participant = row["participant_id"]
    role = row["role"]
    response = row["response"]

    # Call our count_words function to analyze this response
    # This demonstrates reusing the function we defined earlier
    count = count_words(response)

    # Save this count to our list for later statistical analysis
    word_counts.append(count)

    # Create a preview of the response for display
    # We only show the first 60 characters to keep the table readable
    if len(response) > 60:
        # If response is long, cut it at 60 chars and add "..."
        preview = response[:60] + "..."
    else:
        # If response is short, show the whole thing
        preview = response

    # Print this row of data in a formatted table
    # The <6, <22, etc. ensure columns align nicely
    print(f"{participant:<6} {role:<22} {count:<6} {preview}")


# ============================================================================
# STEP 4: Calculate and Display Summary Statistics
# ============================================================================
# Print a blank line for spacing, then a section header
print()
print("── Summary ─────────────────────────────────")

# Calculate and display key statistics about the responses:

# Total number of responses analyzed
print(f"  Total responses : {len(word_counts)}")

# Shortest response (minimum word count)
# min() finds the smallest number in the list
print(f"  Shortest        : {min(word_counts)} words")

# Longest response (maximum word count)
# max() finds the largest number in the list
print(f"  Longest         : {max(word_counts)} words")

# Average response length (mean word count)
# sum() adds all numbers, then we divide by count
# The :.1f formats the number to show 1 decimal place
print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")
