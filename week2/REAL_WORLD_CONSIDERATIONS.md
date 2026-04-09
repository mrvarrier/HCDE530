# Real-World Data Considerations for demo_word_count.py

## Question
**What would happen if this script was run on a real dataset instead of this demo dataset? What considerations need to be taken? What could go wrong and how do we know?**

## Executive Summary

The current `demo_word_count.py` script works perfectly with clean, well-formatted demo data. However, **real-world data is messy, unpredictable, and often incomplete**. This document identifies 12 major failure scenarios, explains how to detect them, and provides solutions.

---

## Potential Failures & Detection Strategies

### 1. File Not Found Error

**What Could Go Wrong:**
```python
filename = "demo_responses.csv"
with open(filename, newline="", encoding="utf-8") as f:
```

If the CSV file doesn't exist or the path is wrong, the script crashes immediately with:
```
FileNotFoundError: [Errno 2] No such file or directory: 'demo_responses.csv'
```

**How to Detect:**
- Script crashes before processing any data
- Error message clearly states the file path that failed
- User sees a traceback pointing to the `open()` line

**Real-World Scenarios:**
- User forgot to place CSV in same directory
- File was renamed or moved
- Path separators different on Windows vs Mac/Linux
- User working in wrong directory

**How to Handle:**
```python
import os

if not os.path.exists(filename):
    print(f"ERROR: File '{filename}' not found!")
    print(f"Current directory: {os.getcwd()}")
    print(f"Please ensure the CSV file is in the same directory as this script.")
    exit(1)
```

**Better Approach:**
```python
import sys

try:
    with open(filename, newline="", encoding="utf-8") as f:
        # ... rest of code
except FileNotFoundError:
    print(f"ERROR: Cannot find file '{filename}'")
    print("Please check:")
    print("  1. File name is spelled correctly")
    print("  2. File is in the same directory as this script")
    print("  3. You're running the script from the correct location")
    sys.exit(1)
```

---

### 2. Encoding Issues

**What Could Go Wrong:**
```python
with open(filename, newline="", encoding="utf-8") as f:
```

Real-world CSV files may be encoded in:
- Latin-1 (ISO-8859-1) - common in European data
- Windows-1252 (CP1252) - Excel default on Windows
- ASCII with extended characters
- Mixed encodings (different rows have different encodings!)

**Error Example:**
```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 45: invalid continuation byte
```

**How to Detect:**
- Script crashes when reading certain rows
- Error message mentions "codec" or "decode"
- Problem appears partway through file (not all rows fail)

**Real-World Scenarios:**
- Data exported from Excel on Windows
- International characters (é, ñ, ü, 中文)
- User copied data from different sources
- Legacy systems using old encoding standards

**How to Handle:**
```python
import chardet

# Detect encoding automatically
with open(filename, 'rb') as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    detected_encoding = result['encoding']
    confidence = result['confidence']

print(f"Detected encoding: {detected_encoding} (confidence: {confidence:.1%})")

# Try multiple encodings with fallback
encodings_to_try = ['utf-8', 'latin-1', 'cp1252', 'utf-16']

for encoding in encodings_to_try:
    try:
        with open(filename, newline="", encoding=encoding) as f:
            reader = csv.DictReader(f)
            responses = list(reader)
        print(f"✓ Successfully read file with {encoding} encoding")
        break
    except UnicodeDecodeError:
        print(f"✗ Failed to read with {encoding} encoding, trying next...")
        continue
```

---

### 3. Missing Required Columns

**What Could Go Wrong:**
```python
participant = row["participant_id"]  # Line 92
role = row["role"]                   # Line 93
response = row["response"]           # Line 94
```

If the CSV doesn't have exactly these column names, the script crashes:
```
KeyError: 'participant_id'
```

**How to Detect:**
- Script crashes during first iteration of the loop
- Error message shows which column name is missing
- Happens even if CSV has data but with different column names

**Real-World Scenarios:**
- Column named "ID" instead of "participant_id"
- Column named "answer" instead of "response"
- Extra/missing spaces in column names ("role " vs "role")
- Different capitalization ("Role" vs "role")
- CSV from different source with different schema

**How to Detect & Handle:**
```python
# After reading the file
reader = csv.DictReader(f)

# Check column names immediately
required_columns = ['participant_id', 'role', 'response']
actual_columns = reader.fieldnames

missing_columns = [col for col in required_columns if col not in actual_columns]

if missing_columns:
    print(f"ERROR: CSV is missing required columns: {missing_columns}")
    print(f"Found columns: {actual_columns}")
    print("\nColumn mapping suggestions:")
    for missing in missing_columns:
        # Try to find similar column names
        suggestions = [col for col in actual_columns if missing.lower() in col.lower()]
        if suggestions:
            print(f"  '{missing}' might be: {suggestions}")
    exit(1)
```

---

### 4. Empty or Missing Data in Rows

**What Could Go Wrong:**
```python
response = row["response"]
count = count_words(response)  # What if response is empty string or None?
```

**Failure Scenario 1 - Empty String:**
```python
count_words("")  # Returns 1 instead of 0!
# Because "".split() returns [''] - a list with one empty string
```

**Failure Scenario 2 - None Value:**
```python
count_words(None)  # Crashes!
# AttributeError: 'NoneType' object has no attribute 'split'
```

**How to Detect:**
- For empty strings: Wrong statistics (appears as 1 word instead of 0)
- For None: Script crashes with AttributeError
- For whitespace-only: Counted as multiple words

**Real-World Scenarios:**
- Participant skipped question
- Data entry error
- Incomplete survey submission
- Database NULL exported as empty field
- Excel formula error exported as #N/A

**Testing Strategy:**
```python
# Test with edge cases
test_cases = [
    "",           # Empty string
    None,         # None value
    "   ",        # Whitespace only
    "\n\t",       # Just newlines/tabs
    "word",       # Single word
]

for test in test_cases:
    try:
        result = count_words(test)
        print(f"count_words({repr(test)}) = {result}")
    except Exception as e:
        print(f"count_words({repr(test)}) = ERROR: {e}")
```

**Robust Solution:**
```python
def count_words(response):
    """Count words with proper handling of edge cases."""
    # Handle None values
    if response is None:
        return 0

    # Handle empty or whitespace-only strings
    if not response or not response.strip():
        return 0

    # Count actual words
    return len(response.split())
```

---

### 5. Division by Zero Error

**What Could Go Wrong:**
```python
print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")  # Line 140
```

If `word_counts` is empty (no valid responses), this crashes:
```
ZeroDivisionError: division by zero
```

**How to Detect:**
- Script runs successfully through processing
- Crashes at the very end when printing statistics
- Only happens with completely empty datasets

**Real-World Scenarios:**
- Empty CSV file (headers only)
- All responses filtered out due to missing data
- CSV with no data rows
- All responses were None/empty

**How to Handle:**
```python
if not word_counts:
    print("\nWARNING: No valid responses found to analyze!")
    print("Please check that:")
    print("  - CSV file contains data rows")
    print("  - 'response' column has text data")
    print("  - File was exported correctly")
else:
    print(f"  Total responses : {len(word_counts)}")
    print(f"  Shortest        : {min(word_counts)} words")
    print(f"  Longest         : {max(word_counts)} words")
    print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")
```

---

### 6. Memory Issues with Large Files

**What Could Go Wrong:**
```python
responses = []
for row in reader:
    responses.append(row)  # Loads ENTIRE file into memory!
```

For large datasets (100K+ rows), this can:
- Consume gigabytes of RAM
- Slow down the computer
- Crash with `MemoryError` on resource-constrained systems

**How to Detect:**
- Script becomes very slow
- Computer fans spin up
- System monitor shows high memory usage
- Script crashes with MemoryError on large files

**Real-World Scenarios:**
- Survey with 500,000 responses
- All customer reviews from app store
- Multi-year historical data
- Merged datasets from multiple sources

**Better Approach (Streaming):**
```python
import csv

# Don't load everything into memory
# Process row-by-row instead
word_counts = []

with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for i, row in enumerate(reader, 1):
        # Process one row at a time
        response = row.get("response", "")
        count = count_words(response)
        word_counts.append(count)

        # Print progress for large files
        if i % 10000 == 0:
            print(f"Processed {i:,} rows...")

# Only store statistics, not all responses
print(f"Processed {len(word_counts):,} total responses")
```

---

### 7. Extremely Long Responses

**What Could Go Wrong:**
```python
print(f"{participant:<6} {role:<22} {count:<6} {preview}")
```

If a response is thousands of words long:
- Preview still works (truncated to 60 chars)
- But the word count could be misleading
- Terminal output becomes hard to read

**How to Detect:**
- Output looks normal but statistics seem wrong
- Max word count is unexpectedly high (thousands)
- Average is skewed by outliers

**Real-World Scenarios:**
- Someone pasted entire essay into text box
- Data entry error (pasted from wrong source)
- Bot/spam submission with generated text
- Form didn't enforce character limit

**How to Handle:**
```python
# Add outlier detection
count = count_words(response)

# Flag unusually long responses
if count > 500:  # Threshold depends on your context
    print(f"WARNING: {participant} has unusually long response ({count} words)")
    print(f"  Preview: {response[:100]}...")

# Calculate statistics with and without outliers
from statistics import mean, median

print(f"  Average (mean)   : {mean(word_counts):.1f} words")
print(f"  Average (median) : {median(word_counts):.1f} words")

# Show outliers
outliers = [c for c in word_counts if c > 100]
if outliers:
    print(f"  Outliers (>100)  : {len(outliers)} responses")
```

---

### 8. Non-Text Content

**What Could Go Wrong:**
```python
response = row["response"]
count = count_words(response)  # What if response contains URLs, emails, code?
```

Real responses might contain:
- URLs: `"Check out https://example.com for more info"`
- Emails: `"Contact me at user@example.com"`
- Numbers: `"My score is 95 out of 100"`
- Code: `"Use the function print('hello')"`
- Emojis: `"This is great! 🎉😊👍"`

**Issues:**
- URLs counted as one word despite being long
- Email addresses split on @ or dots
- Emojis might cause encoding issues
- Numbers counted as words

**How to Detect:**
- Manual inspection of sample responses
- Word counts seem lower than expected
- Character count vs word count ratio is off
- Preview shows unusual characters

**Advanced Word Counting:**
```python
import re

def count_words_advanced(response):
    """Count words with better handling of special content."""
    if not response or not response.strip():
        return 0

    # Remove URLs
    text = re.sub(r'http\S+|www.\S+', '', response)

    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)

    # Remove numbers that aren't part of words
    text = re.sub(r'\b\d+\b', '', text)

    # Remove punctuation but keep contractions
    text = re.sub(r'[^\w\s\']', ' ', text)

    # Split and count non-empty words
    words = [w for w in text.split() if w.strip()]
    return len(words)
```

---

### 9. CSV Format Variations

**What Could Go Wrong:**
```python
reader = csv.DictReader(f)  # Assumes comma-separated
```

Real-world CSV files might use:
- Semicolons: `participant_id;role;response` (common in Europe)
- Tabs: `participant_id\trole\tresponse` (TSV files)
- Pipes: `participant_id|role|response`
- Different quote characters

**Error:**
- Script runs but shows all data in one column
- Every row has only one field
- Column names look like: `"participant_id;role;response"`

**How to Detect:**
```python
# Check first row
with open(filename, 'r') as f:
    first_line = f.readline()

    # Count different delimiters
    comma_count = first_line.count(',')
    semicolon_count = first_line.count(';')
    tab_count = first_line.count('\t')
    pipe_count = first_line.count('|')

    print(f"Delimiter analysis of first line:")
    print(f"  Commas: {comma_count}")
    print(f"  Semicolons: {semicolon_count}")
    print(f"  Tabs: {tab_count}")
    print(f"  Pipes: {pipe_count}")
```

**How to Handle:**
```python
# Auto-detect delimiter
import csv

with open(filename, 'r') as f:
    sample = f.read(1024)  # Read first 1KB
    f.seek(0)

    # csv.Sniffer can detect delimiter
    sniffer = csv.Sniffer()
    dialect = sniffer.sniff(sample)

    print(f"Detected delimiter: {repr(dialect.delimiter)}")

    reader = csv.DictReader(f, dialect=dialect)
```

---

### 10. Multiline Responses

**What Could Go Wrong:**
Responses might contain line breaks:
```
"This is a response
that spans multiple lines
and has paragraph breaks"
```

**Issues:**
- If not properly quoted in CSV, this breaks parsing
- csv.DictReader might treat each line as separate row
- Data becomes misaligned

**How to Detect:**
- Row count is higher than expected
- Some rows have missing fields
- Data appears "shifted" or misaligned
- Error: Row has wrong number of fields

**Real-World Scenarios:**
- User pressed Enter while typing response
- Copy-pasted text with line breaks
- Form allowed textarea input
- Data exported from system that preserved formatting

**Proper CSV Format:**
```csv
id,response
P01,"This is a response
that spans multiple lines
and has paragraph breaks"
P02,"Single line response"
```

**Detection:**
```python
with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    expected_fields = len(reader.fieldnames)

    for i, row in enumerate(reader, 1):
        actual_fields = len(row)
        if actual_fields != expected_fields:
            print(f"WARNING: Row {i} has {actual_fields} fields, expected {expected_fields}")
```

---

### 11. Special Characters in Data

**What Could Go Wrong:**
Responses might contain:
- Quotes: `She said "hello" to me`
- Commas: `I like apples, oranges, and bananas`
- Newlines: `First line\nSecond line`
- Tabs: `Column1\tColumn2`

**Issues:**
- Unescaped quotes break CSV parsing
- Commas might be interpreted as field separators
- Special characters cause encoding errors

**How to Detect:**
- Parse errors midway through file
- Fields appear split incorrectly
- Quote marks appear in wrong places

**Robust Parsing:**
```python
# csv module handles this IF properly formatted
# But you can validate:

with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f, quoting=csv.QUOTE_MINIMAL)

    for row in reader:
        response = row.get("response", "")

        # Check for suspicious patterns
        if response.count('"') % 2 != 0:
            print(f"WARNING: Unmatched quotes in response: {response[:50]}...")
```

---

### 12. Data Type Assumptions

**What Could Go Wrong:**
```python
count = count_words(response)  # Assumes response is a string
```

In poorly formatted CSVs, you might get:
- Numbers: `12345` (participant entered number instead of text)
- Booleans: `True`/`False`
- Dates: `2024-01-15`
- Floats: `3.14159`

**Error:**
```
AttributeError: 'int' object has no attribute 'split'
```

**How to Handle:**
```python
def count_words(response):
    """Count words with type safety."""
    # Convert everything to string first
    if response is None:
        return 0

    # Convert to string if it isn't already
    response_str = str(response).strip()

    if not response_str:
        return 0

    return len(response_str.split())
```

---

## Comprehensive Testing Strategy

### Test Data You Should Create

```python
# test_edge_cases.csv
"""
participant_id,role,response
P001,UX Researcher,Normal response here
P002,UX Designer,
P003,UX Designer,
P004,Product Manager,
P005,UX Researcher,"Response with, commas and ""quotes"""
P006,UX Designer,🎉 Emoji response 😊
P007,Product Manager,https://example.com/very/long/url
P008,UX Researcher,"Multi
line
response"
P009,UX Designer,user@example.com contact me
P010,Product Manager,12345
P011,,Missing role
P012,UX Researcher,
"""
```

### Validation Checklist

Before using script on real data:

- [ ] **File exists** - Check file path
- [ ] **Encoding correct** - Try opening in text editor
- [ ] **Delimiter correct** - Inspect first line
- [ ] **Columns present** - Verify column names
- [ ] **No empty file** - File has data rows
- [ ] **Sample check** - Manually verify first few rows
- [ ] **Size check** - For large files, test with subset first
- [ ] **Data types** - Ensure response column is text
- [ ] **Special characters** - Check for quotes, commas, newlines
- [ ] **Encoding issues** - Look for � or weird characters

---

## Production-Ready Version

Here's what a robust version would look like:

```python
"""
Robust Word Count Analysis - Production Version
Handles real-world data edge cases
"""

import csv
import os
import sys
from typing import List, Dict, Optional

def count_words(response: Optional[str]) -> int:
    """
    Count words with robust handling of edge cases.

    Args:
        response: Text to analyze (can be None or empty)

    Returns:
        Number of words in response (0 for None/empty)
    """
    if response is None:
        return 0

    response_str = str(response).strip()

    if not response_str:
        return 0

    return len(response_str.split())


def validate_file(filename: str) -> bool:
    """Check if file exists and is readable."""
    if not os.path.exists(filename):
        print(f"ERROR: File '{filename}' not found!")
        return False

    if not os.path.isfile(filename):
        print(f"ERROR: '{filename}' is not a file!")
        return False

    return True


def validate_columns(fieldnames: List[str], required: List[str]) -> bool:
    """Check if all required columns are present."""
    missing = [col for col in required if col not in fieldnames]

    if missing:
        print(f"ERROR: Missing required columns: {missing}")
        print(f"Found columns: {fieldnames}")
        return False

    return True


def analyze_responses(filename: str) -> None:
    """Main analysis function with error handling."""

    # Validate file exists
    if not validate_file(filename):
        sys.exit(1)

    try:
        # Open and read CSV
        with open(filename, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)

            # Validate required columns
            required_cols = ['participant_id', 'role', 'response']
            if not validate_columns(reader.fieldnames, required_cols):
                sys.exit(1)

            # Process data
            word_counts = []
            row_count = 0
            error_count = 0

            print(f"{'ID':<6} {'Role':<22} {'Words':<6} {'Response Preview'}")
            print("-" * 75)

            for row in reader:
                row_count += 1

                try:
                    participant = row.get("participant_id", "UNKNOWN")
                    role = row.get("role", "UNKNOWN")
                    response = row.get("response")

                    count = count_words(response)
                    word_counts.append(count)

                    # Create preview
                    preview = str(response)[:60] if response else "[empty]"
                    if response and len(response) > 60:
                        preview += "..."

                    print(f"{participant:<6} {role:<22} {count:<6} {preview}")

                except Exception as e:
                    error_count += 1
                    print(f"ERROR processing row {row_count}: {e}")
                    continue

            # Print statistics
            print()
            print("=" * 75)
            print("SUMMARY STATISTICS")
            print("=" * 75)

            if word_counts:
                print(f"Total responses      : {len(word_counts)}")
                print(f"Errors encountered   : {error_count}")
                print(f"Shortest response    : {min(word_counts)} words")
                print(f"Longest response     : {max(word_counts)} words")
                print(f"Average response     : {sum(word_counts)/len(word_counts):.1f} words")

                # Median for robustness against outliers
                sorted_counts = sorted(word_counts)
                median_idx = len(sorted_counts) // 2
                median = sorted_counts[median_idx]
                print(f"Median response      : {median} words")
            else:
                print("WARNING: No valid responses found!")
                print(f"Total rows processed : {row_count}")
                print(f"Errors encountered   : {error_count}")

    except UnicodeDecodeError as e:
        print(f"ERROR: File encoding issue - {e}")
        print("Try re-saving the CSV as UTF-8 encoding")
        sys.exit(1)

    except Exception as e:
        print(f"UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    filename = "demo_responses.csv"
    analyze_responses(filename)
```

---

## Key Takeaways for HCD Practitioners

### Why This Matters for UX Research

1. **Data Quality**: Real user research data is messy
   - Participants skip questions
   - Copy-paste introduces formatting
   - International users = encoding issues
   - Mobile users = autocorrect artifacts

2. **Reliability**: Scripts must handle edge cases
   - A crash loses trust with stakeholders
   - Missing one participant's data affects insights
   - Inconsistent results reduce credibility

3. **Scalability**: Research scales up
   - 10 participants → 100 → 1,000 → 10,000
   - Demo code breaks at production scale
   - Need robust error handling

4. **Communication**: Error messages matter
   - Engineers: Want stack traces
   - Researchers: Want actionable guidance
   - Stakeholders: Want to know impact

### Production-Ready Code Characteristics

✅ **Graceful error handling** - Never crash without explanation
✅ **Input validation** - Check assumptions before processing
✅ **Clear error messages** - Help users fix problems
✅ **Logging/progress** - Show what's happening with large files
✅ **Edge case handling** - Test with bad/missing/weird data
✅ **Documentation** - Explain limitations and assumptions
✅ **Performance** - Work with realistic data sizes
✅ **Type safety** - Don't assume data types

### Testing Mindset

**Demo code thinks:** "Data is perfect"
**Production code thinks:** "Data is broken, prove it isn't"

Always test with:
- Empty files
- Missing columns
- Null/None values
- Very large files
- International characters
- Copy-pasted content
- Exported Excel data
- Incomplete submissions

---

## Conclusion

The `demo_word_count.py` script is **perfect for learning** - it's clean, simple, and teaches core concepts clearly. But for real-world use, you'd need to add:

1. Error handling for file operations
2. Column validation
3. Data type safety
4. Empty data handling
5. Encoding flexibility
6. Progress indication for large files
7. Outlier detection
8. Graceful degradation

This is the difference between **educational code** and **production code**. Both have their place - educational code teaches concepts clearly, production code handles reality robustly.

**The skill** is knowing when you need which version, and how to transform one into the other.
