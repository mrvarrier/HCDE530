import csv

#load the csv file
filename = "demo_responses.csv"
responses = []

with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        responses.append(row)

#function to count words in a response
def count_words(response):
    return len(response.split())

#print header
print(f"{'ID':<6} {'Role':<22} {'Words':<6} {'Response (first 60 chars)'}")
print("-" * 75)

word_counts = []

#process each response
for row in responses:
    participant = row["participant_id"]
    role = row["role"]
    response = row["response"]

    #count words
    count = count_words(response)
    word_counts.append(count)

    #truncate response for preview
    if len(response) > 60:
        preview = response[:60] + "..."
    else:
        preview = response

    print(f"{participant:<6} {role:<22} {count:<6} {preview}")

#print summary statistics
print()
print("── Summary ─────────────────────────────────")
print(f"  Total responses : {len(word_counts)}")
print(f"  Shortest        : {min(word_counts)} words")
print(f"  Longest         : {max(word_counts)} words")
print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")
