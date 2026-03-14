import psycopg2

conn = psycopg2.connect(
    host="aws-1-ap-southeast-2.pooler.supabase.com",
    user="postgres.bgppycpctqoodnaczstj",
    password="Swapnil@2207",
    dbname="postgres",
    port=6543
)

print("Connected successfully")