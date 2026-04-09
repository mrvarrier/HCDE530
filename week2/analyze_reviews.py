"""
HCDE 530 - Week 2: App Reviews Word Count Analysis

This script demonstrates how to:
1. Read app review data from a CSV file
2. Count words in each review
3. Display formatted results with statistics
4. Write analysis results to a new CSV file (stretch goal)

Key Learning Concepts:
- CSV file reading and writing
- Data analysis and statistics
- String manipulation
- File output operations
"""

import csv  # Python's built-in module for CSV file operations


# ============================================================================
# STEP 1: Load the App Reviews CSV File
# ============================================================================
# Specify the input file containing app reviews
input_filename = "app_reviews.csv"

# Create an empty list to store all review data
reviews = []

# Open and read the CSV file
# Using 'with' ensures the file closes automatically when done
with open(input_filename, newline="", encoding="utf-8") as f:
    # csv.DictReader reads each row as a dictionary
    # This allows us to access data by column name (e.g., row["response"])
    reader = csv.DictReader(f)

    # Loop through each review in the file
    for row in reader:
        # Add this review to our list
        reviews.append(row)


# ============================================================================
# STEP 2: Define Word Counting Function
# ============================================================================
def count_words(text):
    """Count the number of words in a text string.

    This reusable function takes any text and returns how many words it contains.
    It works by splitting the text on whitespace (spaces, tabs, newlines).

    Args:
        text (str): The text to analyze

    Returns:
        int: Number of words in the text

    Example:
        >>> count_words("Hello world")
        2
    """
    # .split() breaks text into a list of words
    # len() counts how many words are in that list
    return len(text.split())


# ============================================================================
# STEP 3: Analyze Each Review and Display Results
# ============================================================================
# Print a nicely formatted header for the results table
print(f"{'ID':<8} {'Words':<8} {'Review Preview (first 60 chars)'}")
print("-" * 80)  # Print a line separator

# Create lists to store our analysis results
word_counts = []  # Will hold word counts for statistics
results_data = []  # Will hold full results for CSV export

# Process each review one by one
for row in reviews:
    # Extract the data we need from this review
    review_id = row["id"]
    response_text = row["response"]

    # Count words in this review using our function
    word_count = count_words(response_text)

    # Save the word count for later statistical analysis
    word_counts.append(word_count)

    # Create a preview of the review (first 60 characters only)
    # This keeps our table readable without showing entire long reviews
    if len(response_text) > 60:
        # Review is long - truncate and add "..." to show there's more
        preview = response_text[:60] + "..."
    else:
        # Review is short - show the whole thing
        preview = response_text

    # Print this review's information in a formatted row
    print(f"{review_id:<8} {word_count:<8} {preview}")

    # Store the complete results for CSV export later
    # We save: id, word_count, and full response text
    results_data.append({
        'id': review_id,
        'word_count': word_count,
        'response': response_text
    })


# ============================================================================
# STEP 4: Calculate and Display Summary Statistics
# ============================================================================
# Add some spacing before the summary section
print()
print("=" * 80)
print("SUMMARY STATISTICS")
print("=" * 80)

# Calculate key statistics from all the word counts

# Total number of reviews analyzed
total_reviews = len(word_counts)
print(f"Total responses      : {total_reviews}")

# Find the shortest review (minimum word count)
shortest = min(word_counts)
print(f"Shortest response    : {shortest} words")

# Find the longest review (maximum word count)
longest = max(word_counts)
print(f"Longest response     : {longest} words")

# Calculate average review length
# sum() adds all word counts together
# We divide by the total count to get the mean
average = sum(word_counts) / len(word_counts)
print(f"Average response     : {average:.1f} words")
# The :.1f formats the number to show 1 decimal place


# ============================================================================
# STEP 5: Write Results to New CSV File (STRETCH GOAL)
# ============================================================================
# Specify the output filename for our analysis results
output_filename = "review_analysis_results.csv"

# Open a new CSV file for writing
# mode='w' means "write mode" - creates a new file (or overwrites existing)
with open(output_filename, mode='w', newline='', encoding='utf-8') as f:
    # Define which columns we want in our output file
    fieldnames = ['id', 'word_count', 'response']

    # Create a CSV writer object that knows about our columns
    writer = csv.DictWriter(f, fieldnames=fieldnames)

    # Write the header row (column names)
    writer.writeheader()

    # Write each result as a new row in the CSV file
    for result in results_data:
        writer.writerow(result)

# Print confirmation message
print()
print("=" * 80)
print(f"✓ Results saved to '{output_filename}'")
print("=" * 80)
