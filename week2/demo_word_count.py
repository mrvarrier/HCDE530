import csv

# using csv.DictReader instead of regular reader because dictionaries let us
# access data by column name (row["response"]) which is more readable than
# by index (row[2]) - makes code easier to understand and maintain
filename = "demo_responses.csv"
responses = []

# encoding="utf-8" handles special characters that might appear in responses
# newline="" is required by csv module to handle line breaks correctly
with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        responses.append(row)

def count_words(response):
    """Count words in a text response by splitting on whitespace.

    Uses Python's split() method which breaks text into words at spaces, tabs,
    and newlines. This is simple but won't handle edge cases like multiple spaces
    or punctuation attached to words - acceptable for basic analysis.

    Args:
        response (str): The text response to analyze

    Returns:
        int: Number of words found in the response

    Example:
        >>> count_words("hello world")
        2
    """
    return len(response.split())

#print header
print(f"{'ID':<6} {'Role':<22} {'Words':<6} {'Response (first 60 chars)'}")
print("-" * 75)

# store word counts separately so we can calculate statistics later
# without having to loop through responses again
word_counts = []

for row in responses:
    participant = row["participant_id"]
    role = row["role"]
    response = row["response"]

    count = count_words(response)
    word_counts.append(count)

    # truncate at 60 chars to keep table readable - full responses might
    # be hundreds of words and would break the formatted output layout
    if len(response) > 60:
        preview = response[:60] + "..."
    else:
        preview = response

    print(f"{participant:<6} {role:<22} {count:<6} {preview}")

# summary statistics help identify outliers and patterns
# min/max show the range, average indicates typical response length
print()
print("── Summary ─────────────────────────────────")
print(f"  Total responses : {len(word_counts)}")
print(f"  Shortest        : {min(word_counts)} words")
print(f"  Longest         : {max(word_counts)} words")
# using :.1f to round to 1 decimal place - more precision isn't meaningful here
print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")
