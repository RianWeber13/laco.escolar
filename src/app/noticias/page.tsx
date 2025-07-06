'use client';

import React, { useState } from 'react';
import NavBar from '../navbar/navBar';
import './noticias.css';

interface Noticia {
  id: number;
  autor: string;
  data: string;
  conteudo: string;
}

const NoticiasPage = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([
    {
      id: 1,
      autor: 'Prof.ª Ana',
      data: '18 de junho de 2024',
      conteudo: 'Lembrete: nossa festa junina será nesta sexta-feira! Não se esqueçam de trazer um prato típico e vir a caráter. Haverá muitas brincadeiras e comidas deliciosas para todos.',
    },
    {
      id: 2,
      autor: 'Diretoria',
      data: '15 de junho de 2024',
      conteudo: 'As reuniões de pais e mestres do segundo bimestre ocorrerão na próxima semana, entre os dias 24 e 28 de junho. Por favor, agendem um horário na secretaria.',
    },
  ]);

  const [novoConteudo, setNovoConteudo] = useState('');

  const handlePublicarNoticia = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoConteudo.trim() === '') {
      alert('Por favor, escreva algo antes de publicar.');
      return;
    }

    const novaNoticia: Noticia = {
      id: noticias.length + 1,
      autor: 'Você', // Assumindo que o usuário logado está publicando
      data: new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      conteudo: novoConteudo,
    };

    setNoticias([novaNoticia, ...noticias]);
    setNovoConteudo('');
  };

  return (
    <div className="noticias-page-wrapper">
      <NavBar onLogout={() => { /* TODO: implement logout logic */ }} />
      <div className="container-noticias">
        <h1 className="main-title-noticias">Mural de Notícias</h1>

        <div className="noticias-container-visual">
          {/* Formulário para criar uma nova postagem */}
          <div className="new-post-form">
            <form onSubmit={handlePublicarNoticia}>
              <textarea
                placeholder="Escreva uma nova notícia aqui..."
                value={novoConteudo}
                onChange={(e) => setNovoConteudo(e.target.value)}
                rows={4}
                className="post-textarea"
              />
              <button type="submit" className="post-button">Publicar</button>
            </form>
          </div>

          {/* Feed de notícias */}
          <div className="feed-container">
            {noticias.map((noticia) => (
              <div key={noticia.id} className="post-card">
                <div className="post-header">
                  <span className="post-author">{noticia.autor}</span>
                  <span className="post-date">{noticia.data}</span>
                </div>
                <div className="post-content">
                  <p>{noticia.conteudo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticiasPage;