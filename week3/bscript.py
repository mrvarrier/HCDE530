import csv

# Load the survey data from a CSV file
filename = "week3_survey_messy.csv"
rows = []

# Open the CSV and read each row into a list
with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:  # Loop through each row and add it to our list
        rows.append(row)

# Count responses by role
# Normalize role names so "ux researcher" and "UX Researcher" are counted together
role_counts = {}

# Loop through each row and count how many times each role appears
for row in rows:
    role = row["role"].strip().title()  # Clean up the role name (remove spaces, capitalize)
    if role in role_counts:
        role_counts[role] += 1  # Add 1 to the count if we've seen this role before
    else:
        role_counts[role] = 1  # Start counting at 1 if this is the first time we see this role

print("Responses by role:")
for role, count in sorted(role_counts.items()):
    print(f"  {role}: {count}")

def calculate_average_experience(rows):
    """Calculate the average years of experience, skipping non-numeric values."""
    total_experience = 0
    valid_count = 0

    # Loop through each row and add up the experience years
    for row in rows:
        if row["experience_years"].strip().isdigit():  # Only process if it's a number (skip "fifteen")
            total_experience += int(row["experience_years"])
            valid_count += 1  # Count how many valid numbers we found

    return total_experience / valid_count if valid_count > 0 else 0  # Calculate average


def summarize_data(rows):
    """Return a plain-language summary of the data."""
    row_count = len(rows)

    # Count unique roles by adding each cleaned role name to a set
    unique_roles = set()
    for row in rows:  # Loop through each row
        unique_roles.add(row["role"].strip().title())  # Add normalized role to the set (duplicates are ignored)

    # Count how many rows have empty participant names
    empty_names = 0
    for row in rows:  # Loop through each row
        if not row["participant_name"].strip():  # If the name field is empty
            empty_names += 1  # Count it

    # Build a summary sentence with the counts
    summary = f"The dataset contains {row_count} rows with {len(unique_roles)} unique roles and {empty_names} empty name field(s)."
    return summary


# Calculate the average years of experience
avg_experience = calculate_average_experience(rows)
print(f"\nAverage years of experience: {avg_experience:.1f}")

# Find the top 5 highest satisfaction scores
scored_rows = []
# Loop through each row and collect names with their scores
for row in rows:
    if row["satisfaction_score"].strip():  # Only include rows that have a score
        scored_rows.append((row["participant_name"], int(row["satisfaction_score"])))  # Store as (name, score) tuple

scored_rows.sort(key=lambda x: x[1], reverse=True)  # Sort by score (second item in tuple), highest first
top5 = scored_rows[:5]  # Take the first 5 entries (which are now the highest)

print("\nTop 5 satisfaction scores:")
for name, score in top5:
    print(f"  {name}: {score}")

# Write cleaned data to a new CSV file
# Only include rows with valid numeric experience_years
cleaned_rows = []
# Loop through original data and filter out rows with bad experience values
for row in rows:
    if row["experience_years"].strip().isdigit():  # Only keep rows with valid experience data
        cleaned_rows.append(row)  # Add this row to the cleaned list

# Write the cleaned data to a new CSV file
output_filename = "cleaned_data.csv"
with open(output_filename, "w", newline="", encoding="utf-8") as f:
    if cleaned_rows:
        fieldnames = cleaned_rows[0].keys()  # Get column names from first row
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()  # Write column names as first row
        writer.writerows(cleaned_rows)  # Write all cleaned rows to the file

print(f"\nCleaned data saved to {output_filename}")

# Display summary of cleaned data
summary = summarize_data(cleaned_rows)
print(f"\n{summary}")
