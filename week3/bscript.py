import csv

# Load the survey data from a CSV file
filename = "week3_survey_messy.csv"
rows = []

with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

# Count responses by role
# Normalize role names so "ux researcher" and "UX Researcher" are counted together
role_counts = {}

for row in rows:
    role = row["role"].strip().title()
    if role in role_counts:
        role_counts[role] += 1
    else:
        role_counts[role] = 1

print("Responses by role:")
for role, count in sorted(role_counts.items()):
    print(f"  {role}: {count}")

def calculate_average_experience(rows):
    #Calculate the average years of experience, skipping non-numeric values.
    total_experience = 0
    valid_count = 0

    for row in rows:
        if row["experience_years"].strip().isdigit():  # Skip non-numeric values like "fifteen"
            total_experience += int(row["experience_years"])
            valid_count += 1

    return total_experience / valid_count if valid_count > 0 else 0


def summarize_data(rows):
    """Return a plain-language summary of the data."""
    row_count = len(rows)

    # Count unique roles
    unique_roles = set()
    for row in rows:
        unique_roles.add(row["role"].strip().title())

    # Count empty name fields
    empty_names = 0
    for row in rows:
        if not row["participant_name"].strip():
            empty_names += 1

    summary = f"The dataset contains {row_count} rows with {len(unique_roles)} unique roles and {empty_names} empty name field(s)."
    return summary


# Calculate the average years of experience
avg_experience = calculate_average_experience(rows)
print(f"\nAverage years of experience: {avg_experience:.1f}")

# Find the top 5 highest satisfaction scores
scored_rows = []
for row in rows:
    if row["satisfaction_score"].strip():
        scored_rows.append((row["participant_name"], int(row["satisfaction_score"])))

scored_rows.sort(key=lambda x: x[1], reverse=True)  # Fixed bug: sort descending to get highest scores first
top5 = scored_rows[:5]

print("\nTop 5 satisfaction scores:")
for name, score in top5:
    print(f"  {name}: {score}")

# Write cleaned data to a new CSV file
# Only include rows with valid numeric experience_years
cleaned_rows = []
for row in rows:
    if row["experience_years"].strip().isdigit():  # Only keep rows with valid experience data
        cleaned_rows.append(row)

output_filename = "cleaned_data.csv"
with open(output_filename, "w", newline="", encoding="utf-8") as f:
    if cleaned_rows:
        fieldnames = cleaned_rows[0].keys()  # Get column names from first row
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cleaned_rows)

print(f"\nCleaned data saved to {output_filename}")

# Display summary of cleaned data
summary = summarize_data(cleaned_rows)
print(f"\n{summary}")
