"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';


const FormularioPesquisa: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState<string>('');
  const [nomeFilme, setNomeFilme] = useState<string>('');
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nomeUsuario || !nomeFilme) {
      setErro('Por favor, insira seu nome e o nome do filme.');
      return;
    }

    setErro('');
    setCarregando(true);
    setResultado(null);

    try {
      const params = new URLSearchParams({
        nomeFilme: nomeFilme,
        nomeUsuario: nomeUsuario,
      });

      const response = await fetch(`http://localhost:5000/api/buscar_filme?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        setErro(errorData.erro || 'Ocorreu um erro ao buscar os dados do filme.');
        setCarregando(false);
        return;
      }

      const data = await response.json();
      setResultado(data.dados_do_filme);
      setErro('');
    } catch (err) {
      console.error(err);
      setErro('Ocorreu um erro ao buscar os dados do filme.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Título */}
        <h1 className="text-2xl font-bold text-center">Pesquisar Filme</h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Seu Nome"
            value={nomeUsuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
          />
          <Input
            placeholder="Nome do Filme"
            value={nomeFilme}
            onChange={(e) => setNomeFilme(e.target.value)}
          />
          <Button type="submit" className="w-full bg-purple-800 hover:bg-blue-600" disabled={carregando}>
            Pesquisar
          </Button>
          {carregando && <Progress className="mt-2" />}
        </form>

        {/* Mensagem de erro */}
        {erro && <p className="text-red-500 text-center">{erro}</p>}

        {/* Resultado da pesquisa */}
        {resultado && resultado.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Resultados da Pesquisa</h2>
            <div className="space-y-4">
              {resultado.map((filme: any) => (
                <div key={filme._id} className="border p-4 rounded bg-gray-50">
                  <h3 className="text-lg font-bold">{filme.name}</h3>
                  <p><strong>Duração:</strong> {filme.runtimeInMinutes} minutos</p>
                  <p><strong>Orçamento:</strong> ${filme.budgetInMillions} milhões</p>
                  <p><strong>Bilheteria:</strong> ${filme.boxOfficeRevenueInMillions} milhões</p>
                  <p><strong>Indicações ao Oscar:</strong> {filme.academyAwardNominations}</p>
                  <p><strong>Vitórias no Oscar:</strong> {filme.academyAwardWins}</p>
                  <p><strong>Nota no Rotten Tomatoes:</strong> {filme.rottenTomatoesScore}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {resultado && resultado.length === 0 && (
          <p className="text-gray-600 text-center">Nenhum filme encontrado com esse nome.</p>
        )}

        {/* Botão para ver o histórico */}
        <Button variant="link" onClick={() => router.push('/historico')} className="w-full text-center mt-4">
          Ver Histórico de Pesquisas
        </Button>
      </div>
    </div>
  );
};

export default FormularioPesquisa;
