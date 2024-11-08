from flask import Blueprint, request, jsonify
from models.mongo_config import get_collection
from datetime import datetime
import logging

bp_busca_filmes = Blueprint('busca_filmes', __name__)

@bp_busca_filmes.route('/buscar_filme', methods=['GET'])
def buscar_filme():
    # Ajuste dos parâmetros para corresponder aos enviados pelo frontend
    nome_filme = request.args.get('nomeFilme', '').strip().lower()
    nome_usuario = request.args.get('nomeUsuario', '').strip()

    if not nome_filme or not nome_usuario:
        return jsonify({"erro": "Nome do filme e nome do usuário são obrigatórios"}), 400
    
    filmes_collection = get_collection("filmes")
    historico_collection = get_collection("historico")
    
    # Realiza a filtragem no MongoDB local com regex para busca insensível a maiúsculas/minúsculas
    query = {"name": {"$regex": nome_filme, "$options": "i"}}
    filmes_encontrados = list(filmes_collection.find(query, {"_id": 0}))
    
    # Registro no MongoDB em 'historico'
    try:
        historico_collection.insert_one({
            "userName": nome_usuario,
            "searchTerm": nome_filme,
            "timestamp": datetime.now(),
            "resultsCount": len(filmes_encontrados)
        })
        logging.info("Histórico salvo com sucesso.")
    except Exception as e:
        logging.error("Erro ao salvar o histórico: %s", str(e))
        return jsonify({"erro": "Erro ao salvar o histórico da busca"}), 500

    return jsonify({"dados_do_filme": filmes_encontrados})
