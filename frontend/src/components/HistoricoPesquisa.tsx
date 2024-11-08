"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HistoricoItem {
  userName: string;
  searchTerm: string;
  timestamp: string;
  resultsCount: number;
}

const HistoricoPesquisa: React.FC = () => {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [filtro, setFiltro] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/historico');
        if (!response.ok) {
          throw new Error('Erro ao buscar o histórico de pesquisas');
        }
        const data = await response.json();
        setHistorico(data);
        setErro('');
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar o histórico.');
      }
    };

    fetchHistorico();
  }, []);

  // Função para filtrar o histórico com base no termo de busca
  const historicoFiltrado = historico.filter((item) => {
    const termo = filtro.toLowerCase();
    return (
      item.userName.toLowerCase().includes(termo) ||
      item.searchTerm.toLowerCase().includes(termo) ||
      new Date(item.timestamp).toLocaleString('pt-BR').includes(termo)
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Histórico de Pesquisas</h1>

      {erro && <p className="text-red-500 text-center">{erro}</p>}

      {/* Campo de busca */}
      <div className="mb-4 flex justify-center">
        <Input
          placeholder="Buscar no histórico..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Tabela de histórico */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Nome do Usuário</th>
              <th className="px-4 py-2 border">Nome do Filme</th>
              <th className="px-4 py-2 border">Data/Hora da Consulta</th>
              <th className="px-4 py-2 border">Resultados Encontrados</th>
            </tr>
          </thead>
          <tbody>
            {historicoFiltrado.length > 0 ? (
              historicoFiltrado.map((item) => (
                <tr key={`${item.userName}-${item.timestamp}`}>
                  <td className="px-4 py-2 border text-center">{item.userName}</td>
                  <td className="px-4 py-2 border text-center">{item.searchTerm}</td>
                  <td className="px-4 py-2 border text-center">
                    {new Date(item.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-2 border text-center">{item.resultsCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  Nenhum histórico encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="link" onClick={() => router.push('/')}>
          Voltar para a Pesquisa
        </Button>
      </div>
    </div>
  );
};

export default HistoricoPesquisa;
