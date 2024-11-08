from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # Carrega as variáveis do .env

client = MongoClient(os.getenv("MONGO_URI"))
db = client["banco_filmes"]

def get_collection(nome):
    return db[nome]
