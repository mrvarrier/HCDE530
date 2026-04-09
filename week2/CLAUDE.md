# Week 2: Data Processing Demonstration

## Project Overview
This is a teaching demonstration for HCDE 530 students showing how to effectively process CSV data files using Python. The project analyzes survey response data and presents results in both console and web formats.

## Target Audience
- **Primary Users**: HCDE 530 students (mostly beginners)
- **Technical Level**: Beginner programmers
- **Background**: HCD practitioners learning data analysis
- **Expected Knowledge**: Basic understanding of Python syntax

## Project Goals
1. Demonstrate best practices for reading and processing CSV files
2. Show clear, beginner-friendly code structure with educational comments
3. Highlight key programming concepts through practical examples
4. Provide interactive, dynamic web-based output for better engagement

## Data Processing Concepts Covered
- Reading CSV files using Python's csv module
- Working with dictionaries and lists
- String manipulation and text analysis
- Basic statistical calculations (min, max, average)
- Formatted output and data presentation
- Function definition and reusability

## Files in This Project

### `demo_responses.csv`
Sample data file containing participant survey responses with:
- `participant_id`: Unique identifier for each respondent
- `role`: Participant's role or category
- `response`: Text response to analyze

### `demo_word_count.py`
Main Python script demonstrating:
- CSV file reading
- Word counting function
- Data processing loop
- Summary statistics calculation
- Formatted console output

### Output Requirements
The project should produce:
1. **Console Output**: Formatted table with individual response analysis
2. **Web Page**: Dynamic, interactive HTML visualization with:
   - Sortable/filterable data tables
   - Visual charts or graphs
   - Interactive elements appropriate for beginners
   - Clear presentation of statistics

## Code Style Guidelines
- **Heavily commented**: Every section should explain what and why
- **Simple and readable**: Avoid complex one-liners
- **Step-by-step approach**: Break complex operations into clear steps
- **Educational focus**: Prioritize learning over optimization
- **Beginner-friendly**: Use clear variable names and straightforward logic

## Technical Constraints
- No hard technical constraints
- Prefer standard library when possible
- Keep dependencies minimal for easy setup
- Ensure code runs on common Python installations

## Teaching Philosophy
This demonstration should:
- Make data processing approachable for non-engineers
- Highlight important code patterns and concepts
- Show real-world application of basic Python skills
- Build confidence in working with data files
- Provide a foundation for more complex analysis

## Future Enhancements (Optional)
- Additional data visualization options
- Export results to different formats
- More sophisticated text analysis
- Comparison across different data subsets
- Error handling examples

## Notes for AI Assistants
- When modifying code, maintain the educational focus
- Add comments that explain both "what" and "why"
- Keep the code structure simple enough for beginners to follow
- Suggest web frameworks/libraries appropriate for beginners (e.g., simple HTML/CSS/JS)
- Test all code modifications to ensure they work as expected
- Preserve the core logic while improving clarity and documentation

## Git Workflow Instructions
- **Commit messages**: Use clean, descriptive commit messages WITHOUT:
  - "Generated with Claude Code" attribution
  - "Co-Authored-By: Claude" attribution
  - Any AI-generated footer content
- **Commit frequency**: Create commits after each file change or logical grouping of changes
- **Push policy**: Do NOT push commits to remote repository (GitHub) automatically
  - Only commit locally
  - User will push manually when ready
