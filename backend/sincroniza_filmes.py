import requests
import os
from models.mongo_config import get_collection

API_URL = "https://the-one-api.dev/v2/movie"
API_KEY = os.getenv("THE_ONE_API_KEY")

def sincronizar_filmes():
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.get(API_URL, headers=headers)
    
    if response.status_code != 200:
        print("Erro ao sincronizar filmes:", response.text)
        return
    
    dados_filme = response.json().get('docs', [])
    filmes_collection = get_collection("filmes")
    
    # Limpa a coleção e insere todos os filmes atualizados
    filmes_collection.delete_many({})
    filmes_collection.insert_many(dados_filme)
    print("Filmes sincronizados com sucesso no MongoDB.")
