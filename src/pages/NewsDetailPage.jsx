import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, User, Tag, Heart, MessageCircle, 
  Send, ChevronLeft, ChevronRight, Share2, Copy, X 
} from 'lucide-react';
import { db } from '../utils/database';

// ==========================================
// COMPONENTE: CARROSSEL DE IMAGENS
// ==========================================
const ImageCarousel = ({ images, caption }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <figure className="my-8 flex flex-col items-center">
        <img 
          src={images[0]} 
          alt={caption || "Ilustração"} 
          className="w-full rounded-xl shadow-md" 
        />
        {caption && (
          <figcaption className="mt-3 text-sm text-slate-500 italic text-center border-b border-slate-100 pb-4 w-full">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <figure className="my-8 flex flex-col items-center w-full">
      <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-slate-900 group">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-64 md:h-96" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`Slide ${idx}`} 
              className="w-full h-full object-contain shrink-0" 
            />
          ))}
        </div>
        
        <button 
          onClick={prevSlide} 
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition z-20"
        >
          <ChevronLeft size={24}/>
        </button>
        
        <button 
          onClick={nextSlide} 
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition z-20"
        >
          <ChevronRight size={24}/>
        </button>
        
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80 cursor-pointer'}`} 
              onClick={() => setCurrentIndex(idx)} 
            />
          ))}
        </div>
      </div>
      
      {caption && (
        <figcaption className="mt-3 text-sm text-slate-500 italic text-center border-b border-slate-100 pb-4 w-full">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL DA PÁGINA
// ==========================================
export default function NewsDetailPage({ news, onBack, user }) {
  const [likes, setLikes] = useState(news?.likes || []);
  const [comments, setComments] = useState(news?.comments || []);
  const [commentText, setCommentText] = useState('');
  
  // Controle do Modal de Compartilhamento
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!news) return null;
  
  const isLiked = user && likes.includes(user.id);

  // --- FUNÇÕES DE INTERAÇÃO ---
  const handleLike = async () => {
    if (!user) return alert("Faça login para curtir!");
    const newLikes = isLiked ? likes.filter(id => id !== user.id) : [...likes, user.id];
    setLikes(newLikes);
    await db.toggleLike(news._collection || 'news', news.id, user.id);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Faça login para comentar!");
    if (!commentText.trim()) return;
    
    const newComment = { 
      text: commentText, 
      userName: user.name, 
      userId: user.id, 
      date: new Date().toISOString() 
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
    await db.addComment(news._collection || 'news', news.id, newComment);
  };

  // --- FUNÇÕES DE COMPARTILHAMENTO ---
  const currentUrl = window.location.href;
  const shareText = `Veja esta notícia no Link da Cidade: ${news.title}`;

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("Link copiado com sucesso! Cole nas suas redes sociais.");
    setIsShareModalOpen(false);
  };

  return (
    <div className="bg-white min-h-screen pb-12 animate-in fade-in">
      
      {/* MODAL DE COMPARTILHAMENTO */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" 
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl text-slate-800">Compartilhar Notícia</h3>
              <button 
                onClick={() => setIsShareModalOpen(false)} 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={shareToWhatsApp} 
                className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-sm"
              >
                <MessageCircle size={20}/> Enviar no WhatsApp
              </button>
              
              <button 
                onClick={shareToFacebook} 
                className="w-full bg-[#1877F2] hover:bg-[#155fc2] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-sm"
              >
                 Compartilhar no Facebook
              </button>

              <button 
                onClick={copyToClipboard} 
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition"
              >
                <Copy size={20}/> Copiar Link (Para Instagram, etc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAPA DA NOTÍCIA */}
      <div className="relative h-96 w-full">
        <img 
          src={news.image} 
          className="w-full h-full object-cover" 
          alt={news.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition z-20"
        >
          <ArrowLeft size={24} />
        </button>
        
        <button 
          onClick={() => setIsShareModalOpen(true)} 
          className="absolute top-6 right-6 bg-white/20 hover:bg-indigo-600 backdrop-blur text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-colors z-20 shadow-sm"
        >
          <Share2 size={18} /> <span className="hidden sm:inline">Compartilhar</span>
        </button>
        
        <div className="absolute bottom-0 left-0 p-8 max-w-4xl z-10">
          <div className="flex flex-col items-start gap-2 mb-3">
             <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm">
               {news.category}
             </span>
             {news.subcategory && (
               <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                 {news.subcategory}
               </span>
             )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {news.title}
          </h1>
          
          <div className="flex items-center gap-6 text-slate-300 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Calendar size={16}/> {new Date(news.date).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-2">
              <User size={16}/> {news.author}
            </span>
          </div>
        </div>
      </div>

      {/* CORPO DA NOTÍCIA */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100">
          
          {news.summary && (
            <p className="text-xl text-slate-600 font-medium italic mb-8 border-l-4 border-blue-600 pl-4 leading-relaxed">
              {news.summary}
            </p>
          )}

          <div className="space-y-6 text-lg text-slate-800 leading-relaxed">
            {news.content && news.content.map((block, index) => {
              if (block.type === 'paragraph') {
                return <p key={index} className="whitespace-pre-wrap">{block.value}</p>;
              }
              if (block.type === 'subtitle') {
                return <h3 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{block.value}</h3>;
              }
              if (block.type === 'image') {
                const imagesArray = Array.isArray(block.value) ? block.value : (block.value ? [block.value] : []);
                return <ImageCarousel key={index} images={imagesArray} caption={block.caption} />;
              }
              return null;
            })}
          </div>

          {news.tags && (
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
              {news.tags.split(',').map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={12}/> {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* INTERAÇÕES (CURTIR, COMENTAR E COMPARTILHAR) */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">O que você achou desta matéria?</h3>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-6">
                <button 
                  onClick={handleLike} 
                  className={`flex items-center gap-2 text-lg font-bold transition ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                >
                  <Heart size={24} className={`transition-transform active:scale-75 ${isLiked ? 'fill-red-500' : ''}`}/> 
                  <span>{likes.length} Curtidas</span>
                </button>
                <div className="flex items-center gap-2 text-lg font-bold text-slate-500">
                  <MessageCircle size={24} />
                  <span>{comments.length} Comentários</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsShareModalOpen(true)} 
                className="flex items-center gap-2 text-slate-600 font-bold bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 px-4 py-2.5 rounded-xl transition"
              >
                <Share2 size={20} /> Compartilhar
              </button>
            </div>

            {/* LISTA DE COMENTÁRIOS */}
            <div className="space-y-4 mb-8">
              {comments.map((c, idx) => (
                <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {c.userName[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block text-sm">{c.userName}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(c.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-slate-400 italic text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </p>
              )}
            </div>

            {/* FORMULÁRIO DE COMENTÁRIO */}
            <form 
              onSubmit={handleComment} 
              className="flex gap-4 items-start bg-white border border-slate-200 p-2 pl-4 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
            >
              <textarea 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
                placeholder={user ? "Escreva sua opinião..." : "Faça login para deixar um comentário..."} 
                disabled={!user} 
                className="flex-1 bg-transparent py-3 text-sm outline-none resize-none min-h-[50px] custom-scrollbar" 
                rows="2" 
              />
              <button 
                disabled={!commentText.trim() || !user} 
                className="mt-1 bg-indigo-600 disabled:bg-slate-200 text-white p-3 rounded-xl hover:bg-indigo-700 transition"
              >
                <Send size={18}/>
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}