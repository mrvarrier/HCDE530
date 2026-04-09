# HCDE 530 - Week 2: Data Processing Demonstration

## Project Context

This project is part of HCDE 530 coursework, designed to teach students fundamental data processing skills using Python. It demonstrates practical techniques for analyzing text-based survey or interview data - a common task in HCD (Human-Centered Design) practice.

## Learning Objectives

By working with this demonstration, students will:
- Understand how to read and process CSV data files
- Learn to write reusable functions for data analysis
- Practice string manipulation and basic statistics
- See how to format and present data analysis results
- Build confidence working with real-world data structures

## Real-World Application

This type of data processing is commonly used in UX research for:
- Analyzing open-ended survey responses
- Processing interview transcripts
- Quantifying qualitative data
- Identifying patterns in user feedback
- Creating summary reports from research data

## Project Structure

```
week2/
├── demo_responses.csv      # Sample data file (survey responses)
├── demo_word_count.py      # Main analysis script
├── CLAUDE.md              # AI assistant instructions
├── CONTEXT.md             # This file - project overview
└── .gitignore             # Git ignore rules
```

## How to Use

1. **Run the Python script**:
   ```bash
   python demo_word_count.py
   ```

2. **View console output**: See formatted table and statistics

3. **Generate web output**: (To be implemented) Interactive HTML visualization

## Data Format

The CSV file contains participant responses with these fields:
- **participant_id**: Unique identifier (e.g., P001, P002)
- **role**: Participant role or category
- **response**: Text response to analyze

## Key Concepts Demonstrated

### 1. File I/O
- Opening and reading CSV files
- Using context managers (`with` statement)
- Handling file encoding

### 2. Data Structures
- Lists for storing collections
- Dictionaries for structured data
- Iteration and data access

### 3. Functions
- Defining reusable functions
- Documentation with docstrings
- Single responsibility principle

### 4. String Operations
- Splitting text into words
- Truncating strings for display
- Formatting output

### 5. Basic Statistics
- Counting and aggregation
- Finding minimum and maximum values
- Calculating averages

## Expected Output

### Console Display
A formatted table showing:
- Participant ID
- Role
- Word count
- Response preview (first 60 characters)

### Summary Statistics
- Total number of responses
- Shortest response length
- Longest response length
- Average response length

## Next Steps for Students

After understanding this demonstration, students can:
1. Modify the script to analyze different data fields
2. Add additional statistics (median, mode, etc.)
3. Create visualizations of the data
4. Export results to different formats
5. Apply these techniques to their own research data

## Questions to Explore

- How would you modify this to count unique words?
- What other metrics might be useful for analyzing responses?
- How could you identify the most common words or themes?
- What visualizations would make this data easier to understand?
- How would you handle missing or incomplete data?

## Resources

- [Python CSV Module Documentation](https://docs.python.org/3/library/csv.html)
- [Python String Methods](https://docs.python.org/3/library/stdtypes.html#string-methods)
- Basic statistics and data analysis concepts

---

*This demonstration prioritizes clarity and educational value over performance optimization.*
