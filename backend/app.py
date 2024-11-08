from flask import Flask
from flask_cors import CORS
from api.busca_filmes import bp_busca_filmes
from api.historico_buscas import bp_historico_buscas
from sincroniza_filmes import sincronizar_filmes

app = Flask(__name__)

# Habilita CORS para todas as rotas
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Sincroniza filmes ao iniciar a aplicação
sincronizar_filmes()

app.register_blueprint(bp_busca_filmes, url_prefix='/api')
app.register_blueprint(bp_historico_buscas, url_prefix='/api')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
