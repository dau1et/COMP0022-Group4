import psycopg2
import csv
import time
import os
from dotenv import load_dotenv

load_dotenv()


def cast_check(val):
    if not val or val == 'None':
        return None  # account for the missing fields for a movie, and fill those fields with "NULL"

    try:
        val = float(val)
    except ValueError:
        pass

    return val


def populate_table(table_name, field_count):
    # for it to work on the docker container /code/csv_data
    # for it to work locally: ../csv_data
    # later create an env var to change depending where it is run from

    with open(f"/code/csv_data/tables/{table_name}.csv", newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            fields = [cast_check(field) for field in row]
            cur.execute(f"INSERT INTO {table_name} VALUES " +
                        f"({', '.join('%s' for _ in range(field_count))})", fields)


if __name__ == "__main__":

    for i in range(20):
        try:
            connection = psycopg2.connect(
                host="db",
                database=os.getenv("POSTGRES_DB"),
                user=os.getenv("POSTGRES_USER"),
                password=os.getenv("POSTGRES_PASSWORD"),
                port=5432
            )
        except:
            print("Unable to connect to the database.")
            print("\nRetrying...")
            time.sleep(2)
            continue
        break

    cur = connection.cursor()

    print("\npy: Populating the Database!", flush=True)

    # a list of (table_name, field_count) tuples
    tables = [
        ("Language", 2), ("Movie", 19), ("MovieTmdb", 2), ("Actor", 3),
        ("MovieActor", 2), ("MovieGenre", 2), ("Publisher", 3), ("MoviePublisher", 2),
        ("PersonalityData", 6), ("Rating", 4), ("MovieTranslation", 2),
        ("PredictedMovieRating", 2), ("PredictedPersonalityRatings",
                                      6), ("PredictedPersonalityTraits", 6),
        ("Tag", 2), ("TagPersonalities", 6), ("MovieTag", 2)
    ]

    for table_name, field_count in tables:
        populate_table(table_name, field_count)
        print(table_name, flush=True)

    connection.commit()
    cur.close()
    connection.close()
