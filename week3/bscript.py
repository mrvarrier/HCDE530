import csv

# ========================================
# SECTION 1: Load Survey Data from CSV
# ========================================
# This section reads the survey data from a CSV file and stores all rows in a list
# Each row is a dictionary where keys are column names (e.g., "role", "experience_years")

filename = "week3_survey_messy.csv"
rows = []  # Initialize empty list to store all survey responses

# Open the CSV file with UTF-8 encoding to handle special characters
with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)  # DictReader creates dictionaries from each row
    for row in reader:
        rows.append(row)  # Add each row dictionary to our list

# ========================================
# SECTION 2: Count Responses by Role
# ========================================
# This section normalizes role names and counts how many responses each role has
# Normalization ensures "ux researcher", "UX Researcher", and "UX RESEARCHER" are all counted together

role_counts = {}  # Dictionary to store role names as keys and counts as values

for row in rows:
    # Normalize the role name:
    # .strip() removes leading/trailing whitespace
    # .title() converts to Title Case (first letter capitalized)
    role = row["role"].strip().title()

    # Check if this role already exists in our dictionary
    if role in role_counts:
        role_counts[role] += 1  # Increment count if role already exists
    else:
        role_counts[role] = 1  # Initialize count to 1 if this is the first occurrence

# Display the results sorted alphabetically by role name
print("Responses by role:")
for role, count in sorted(role_counts.items()):
    print(f"  {role}: {count}")

# ========================================
# SECTION 3: Calculate Average Years of Experience
# ========================================
# This section computes the average years of experience across all valid responses
# BUG FIX 2: Added validation to handle non-numeric values (e.g., "fifteen")

total_experience = 0  # Sum of all valid experience years
valid_count = 0  # Track how many valid numeric entries we found

for row in rows:
    # Check if experience_years contains only digits (is numeric)
    # .strip() removes whitespace, .isdigit() checks if all characters are digits
    if row["experience_years"].strip().isdigit():
        total_experience += int(row["experience_years"])  # Add to running total
        valid_count += 1  # Increment count of valid entries
    # If not numeric (like "fifteen"), skip this row

# Calculate average, protecting against division by zero
avg_experience = total_experience / valid_count if valid_count > 0 else 0
print(f"\nAverage years of experience: {avg_experience:.1f}")

# ========================================
# SECTION 4: Find Top 5 Highest Satisfaction Scores
# ========================================
# This section identifies participants with the highest satisfaction scores
# BUG FIX 1: Added reverse=True to sort in descending order (highest first)

scored_rows = []  # List to store tuples of (participant_name, satisfaction_score)

for row in rows:
    # Only include rows that have a non-empty satisfaction score
    if row["satisfaction_score"].strip():
        # Create a tuple with name and score, add to list
        scored_rows.append((row["participant_name"], int(row["satisfaction_score"])))

# Sort by satisfaction score (second element of tuple, index 1)
# reverse=True ensures we get highest scores first (5, 4, 3...) instead of lowest (1, 2, 3...)
scored_rows.sort(key=lambda x: x[1], reverse=True)

# Take the first 5 entries (which are now the highest scores)
top5 = scored_rows[:5]

# Display the results
print("\nTop 5 satisfaction scores:")
for name, score in top5:
    print(f"  {name}: {score}")
