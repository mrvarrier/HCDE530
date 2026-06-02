# week 2: c2 competency claim - code literacy and documentation

## competency claim

i demonstrate c2 (code literacy and documentation) through the documentation decisions and reasoning applied in `demo_word_count.py` and `analyze_reviews.py`. the comments and docstrings i chose to include show my understanding of what the code does, why specific technical choices were made, and how to explain those choices to different audiences.

## specific evidence of code literacy

### 1. docstring on count_words() function

i added a docstring to the `count_words()` function in `demo_word_count.py` (lines 12-24) that includes:
- **what it does**: "Count words in a text response by splitting on whitespace"
- **why this approach**: explains that split() is "simple but won't handle edge cases like multiple spaces" - acknowledging the limitation shows i understand what the code actually does and what it doesn't do
- **parameters and return value**: clear Args and Returns sections
- **example**: a docstring example showing expected input/output

this docstring demonstrates code literacy because i'm not just describing the syntax - i'm explaining the reasoning behind using split(), acknowledging its limitations, and showing i understand the trade-off between simplicity and robustness.

### 2. inline comments explaining WHY, not just WHAT

the inline comments in `demo_word_count.py` explain the reasoning behind technical decisions:

**csv.DictReader choice** (lines 3-5):
```python
# using csv.DictReader instead of regular reader because dictionaries let us
# access data by column name (row["response"]) which is more readable than
# by index (row[2]) - makes code easier to understand and maintain
```
this comment shows i understand the difference between csv.reader and csv.DictReader, and can explain why one choice is better for maintainability.

**encoding parameter** (lines 8-9):
```python
# encoding="utf-8" handles special characters that might appear in responses
# newline="" is required by csv module to handle line breaks correctly
```
these parameters are easy to overlook, but the comments show i understand they're not just boilerplate - they solve specific problems (special characters, line break handling).

**word_counts list** (lines 21-22):
```python
# store word counts separately so we can calculate statistics later
# without having to loop through responses again
```
this explains the performance reasoning - understanding that storing data prevents redundant loops shows algorithmic thinking.

**truncation at 60 chars** (lines 29-30):
```python
# truncate at 60 chars to keep table readable - full responses might
# be hundreds of words and would break the formatted output layout
```
this shows understanding of the practical reason for truncation - not just "it looks better" but specifically that long text would break the formatted layout.

### 3. comprehensive documentation in analyze_reviews.py

the `analyze_reviews.py` file demonstrates a different documentation approach - verbose educational comments suitable for teaching beginners. key examples:

**module-level docstring** (lines 1-15): explains what the script demonstrates and lists key learning concepts - this frames the entire file as a teaching tool.

**function docstring with example** (lines 45-63): the count_words() function includes a complete docstring with Args, Returns, and a doctest-style example. this shows i know how to document functions for reuse.

**section headers** (lines 20-23, 42-44, etc.): using comment headers like "STEP 1: Load the App Reviews CSV File" organizes the code for beginners and makes it easier to navigate.

**explanatory comments** (lines 31-34):
```python
# csv.DictReader reads each row as a dictionary
# This allows us to access data by column name (e.g., row["response"])
```
these explain both what the code does AND why that matters - showing i understand the concept well enough to teach it.

## documentation decisions and reasoning

### decision 1: two different documentation styles for two different audiences

- **demo_word_count.py**: concise comments explaining reasoning behind technical choices. assumes the reader knows python basics but might not understand why you'd choose one approach over another.

- **analyze_reviews.py**: verbose educational comments with step-by-step explanations. designed for beginners who need both the "what" and the "why" explained in detail.

this shows i understand that documentation isn't one-size-fits-all - it depends on the audience and purpose.

### decision 2: explaining trade-offs and limitations

in the count_words() docstring, i explicitly note that split() "won't handle edge cases like multiple spaces or punctuation attached to words - acceptable for basic analysis." this shows:
- i understand what the code actually does
- i recognize its limitations
- i can articulate when those limitations are acceptable
- i'm being honest about what the code can and can't do

### decision 3: explaining the reasoning behind parameters

comments like the one explaining `encoding="utf-8"` and `newline=""` show i don't just copy-paste boilerplate - i understand why these parameters exist and what problems they solve. this is code literacy: being able to read the code and explain why each piece is there.

## what this demonstrates about code literacy

code literacy isn't just about writing code - it's about:
1. **understanding what code does**: shown through my explanations of csv.DictReader, split(), encoding parameters
2. **explaining technical decisions**: shown through comments that explain WHY choices were made
3. **recognizing trade-offs**: shown in the count_words() docstring acknowledging limitations
4. **adapting communication to audience**: shown through two different documentation styles for different purposes

the comments and docstrings i wrote demonstrate i can read python code, understand what it's doing, and explain both the mechanics and the reasoning to others. that's what c2 is asking for.

## files referenced

- `demo_word_count.py` - main evidence for c2, especially:
  - count_words() docstring (lines 12-24)
  - inline comments explaining technical decisions (lines 3-5, 8-9, 21-22, 29-30, 33-35)

- `analyze_reviews.py` - demonstrates educational documentation style with comprehensive docstrings and step-by-step explanations
