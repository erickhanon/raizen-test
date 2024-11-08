from flask import Blueprint, jsonify
from models.mongo_config import get_collection

bp_historico_buscas = Blueprint('historico_buscas', __name__)

@bp_historico_buscas.route('/historico', methods=['GET'])
def historico():
    historico = get_collection("historico")
    registros = list(historico.find({}, {"_id": 0}))
    return jsonify(registros)
