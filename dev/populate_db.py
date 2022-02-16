import psycopg2
import csv

def cast_check(val):
    if not val:
        return None  # account for the missing fields for a movie, and fill those fields with "NULL"

    try:
        val = float(val)
    except ValueError:
        pass

    return val

def populate_table(table_name, field_count):

    with open(f"../csv_data/{table_name}.csv", newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            fields = [cast_check(field) for field in row]
            cur.execute(f"INSERT INTO {table_name} VALUES " + f"({', '.join('%s' for _ in range(field_count))})", fields)

if __name__ == "__main__":
    connection = psycopg2.connect(
                host = "localhost",
                database = "moviedb",
                user = "moviedb-dev",
                password = "moviedb-dev",
                port = 5432
            )

    cur = connection.cursor()

    # a list of (table_name, field_count) tuples
    tables = [("Language", 2), ("Movie", 13), ("MovieTmdb", 2), ("Actor", 3), ("MovieActor", 2), ("MovieGenre", 2), ("Publisher", 3), ("MoviePublisher", 2), ("PersonalityData", 6), ("MovieTag", 2), ("Rating", 4), ("MovieTranslation", 2)]

    for table_name, field_count in tables:
        populate_table(table_name, field_count)
        print(table_name)

    connection.commit()
    cur.close()
    connection.close()

