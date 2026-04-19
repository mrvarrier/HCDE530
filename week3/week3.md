# Week 3 - Data Cleaning and Functions

## Competency Claim: C5 - Data Cleaning and Preparation

My bscript.py script analyzes messy survey data and handles two key data quality issues. The first bug caused a ValueError because row R009 had "fifteen" instead of a number in the experience_years column - I fixed this by adding isdigit() validation to skip non-numeric values before converting to int. The second bug returned the lowest satisfaction scores instead of highest because the sort was ascending - I added reverse=True to fix the sorting logic. The script now outputs cleaned data to cleaned_data.csv (excluding invalid rows) and includes a summarize_data() function that reports row count, unique roles, and empty name fields.
