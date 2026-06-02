# week 3: c3 competency claim - data cleaning and file handling

## competency claim

i demonstrate c3 (data cleaning and file handling) by identifying and fixing two distinct types of data problems in messy survey data: one that caused the script to crash (non-numeric value "fifteen" in experience_years), and one that produced wrong output without crashing (ascending sort returning lowest scores instead of highest). the key c3 skill here is recognizing when code is wrong - not just when it crashes with an error message, but also when it runs successfully but produces incorrect results because of how it handles messy data.

## specific evidence of data cleaning and file handling

### bug 1: crash from non-numeric data (row r009)

**what broke**: the script crashed with a ValueError when trying to calculate average experience because row R009 had "fifteen" (a word) instead of a number in the experience_years column.

**the error message**:
```
ValueError: invalid literal for int() with base 10: 'fifteen'
```

**reading the traceback**: this error told me exactly what was wrong - the code was trying to convert the string "fifteen" to an integer using int(), which only works with numeric strings like "15". the traceback pointed to the line doing `int(row["experience_years"])`, showing me where the crash happened.

**the fix** (bscript.py lines 36-38):
```python
if row["experience_years"].strip().isdigit():  # Only process if it's a number
    total_experience += int(row["experience_years"])
    valid_count += 1
```

**why this fix works**: the isdigit() check validates that the value is numeric before attempting to convert it to int. this prevents the crash by skipping rows with non-numeric data like "fifteen". the script now handles messy data gracefully instead of crashing.

**commit message**: "Fixed valueString error: ensured that numbers written as words can be handled too."

### bug 2: wrong output from incorrect sort logic (no crash)

**what was wrong**: this bug was harder to catch because the script didn't crash - it just gave wrong results. when i ran the code, it showed the 5 participants with the LOWEST satisfaction scores instead of the highest. the data looked plausible at first glance, but when i checked the numbers, i realized 1, 1, 2, 2, 2 were the lowest scores in the dataset, not the highest.

**recognizing the silent error**: this demonstrates c3 because i had to recognize the code was wrong even though it ran successfully. i had to understand what the OUTPUT should look like and notice the discrepancy. the bug wasn't a crash - it was a logic error that produced believable but incorrect results.

**understanding what messy data does**: even with clean data, the sort logic was backwards. but this kind of bug is especially dangerous with messy data because you might not notice the wrong output if you're not paying attention to what the numbers actually mean.

**the fix** (bscript.py line 74):
```python
scored_rows.sort(key=lambda x: x[1], reverse=True)  # highest first
```

**why this fix works**: adding `reverse=True` changes the sort from ascending (smallest to largest) to descending (largest to smallest). now the top 5 items in the sorted list are the highest scores, not the lowest.

**commit message**: "Fixed ascending order: need to display top 5 highest scores, so changed the sorting order from ascending to descending order."

## how this demonstrates c3: data cleaning and file handling

### 1. handling messy real-world data

the week3_survey_messy.csv file has real data quality problems:
- **non-numeric values**: "fifteen" instead of 15 in experience_years (row R009)
- **inconsistent formatting**: role names like "UX Researcher", "ux researcher", "UX RESEARCHER" (handled with .strip().title())
- **missing data**: row R005 has empty participant_name field
- **mixed case**: department values like "Product", "product", "DESIGN", "RESEARCH"

my script handles these problems by:
- validating numeric data before conversion (isdigit() check)
- normalizing role names for counting (strip and title case)
- checking for empty fields before processing
- filtering out invalid rows when writing cleaned output

### 2. recognizing when code is wrong (not just when it crashes)

**the crash bug (bug 1)** was obvious because:
- the script stopped running
- python printed a traceback
- the error message told me exactly what was wrong

**the logic bug (bug 2)** required deeper understanding because:
- the script ran successfully
- it produced output that looked plausible
- i had to recognize the OUTPUT was wrong by understanding what "top 5 highest scores" actually means
- the data itself wasn't messy here - the logic was wrong

this is the key c3 insight: messy data can break code in two ways - it can cause crashes (bug 1) or produce wrong outputs (bug 2). both need to be caught and fixed.

### 3. reading error messages as diagnostic information

the ValueError traceback gave me three pieces of diagnostic information:
1. **what failed**: converting "fifteen" to int
2. **where it failed**: the line calling int(row["experience_years"])
3. **why it failed**: "fifteen" is not a valid literal for base 10 integer conversion

i used this information to understand the problem and write a targeted fix (validate before convert) rather than just wrapping everything in a try/except and hiding the problem.

### 4. writing scripts that produce consistent, repeatable output

the fixed script now:
- **handles invalid data gracefully**: skips rows with non-numeric experience instead of crashing
- **produces correct results**: returns highest scores, not lowest
- **outputs cleaned data**: writes cleaned_data.csv with only valid rows
- **reports what it did**: prints summary showing how many rows, unique roles, and empty name fields

the script runs cleanly on the messy input file and produces consistent output every time.

### 5. understanding what messy data does to outputs

**before the fix**:
- messy data caused crashes (can't process "fifteen" as int)
- wrong logic produced wrong results (lowest scores instead of highest)
- no way to know which rows were excluded or why

**after the fix**:
- messy data is identified and handled (isdigit() validation)
- correct logic produces correct results (reverse=True for descending sort)
- cleaned output file shows which rows were kept (only rows with valid experience_years)

## files referenced

- **bscript.py** - main script with both bug fixes:
  - lines 36-38: isdigit() validation to handle non-numeric experience_years
  - line 74: reverse=True to fix sorting order for highest scores
  - lines 83-87: filtering logic to exclude invalid rows from cleaned output

- **week3_survey_messy.csv** - input file with messy data:
  - row R009: "fifteen" in experience_years column (causes ValueError)
  - multiple rows: inconsistent role name formatting
  - row R005: empty participant_name field

- **cleaned_data.csv** - output file with validated data:
  - excludes row R009 (invalid experience_years)
  - includes all other rows with valid numeric experience values

## commit message

"Fixed valueString error: ensured that numbers written as words can be handled too. Fixed ascending order: need to display top 5 highest scores, so changed the sorting order from ascending to descending order."

this commit documents both fixes in one message, showing i understood what both bugs were and how to fix them.
