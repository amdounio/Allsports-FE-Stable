import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { FR, GB, ES } from 'country-flag-icons/react/3x2';

interface Message {
  text: string;
  isUser: boolean;
}

type Language = 'fr' | 'en' | 'es';

interface TopicText {
  fr: string;
  en: string;
  es: string;
}

interface Topic {
  id: string;
  text: TopicText;
  response: TopicText;
  link: string;
}

const topics: Topic[] = [
  {
    id: 'subscription',
    text: {
      fr: "Comment changer d'abonnement ?",
      en: "How to change subscription?",
      es: "¿Cómo cambiar la suscripción?"
    },
    response: {
      fr: "Pour changer d'abonnement, rendez-vous dans votre profil et cliquez sur 'Changer d'abonnement'. Vous pourrez alors choisir parmi nos différentes formules. \n\nCliquez ici pour voir nos plans : [Voir les plans](/pricing)",
      en: "To change your subscription, go to your profile and click on 'Change subscription'. You can then choose from our different plans. \n\nClick here to see our plans: [See plans](/pricing)",
      es: "Para cambiar su suscripción, vaya a su perfil y haga clic en 'Cambiar suscripción'. Luego puede elegir entre nuestros diferentes planes. \n\nHaga clic aquí para ver nuestros planes: [Ver planes](/pricing)"
    },
    link: '/pricing'
  },
  {
    id: 'visual',
    text: {
      fr: "Comment créer un visuel ?",
      en: "How to create a visual?",
      es: "¿Cómo crear un visual?"
    },
    response: {
      fr: "Pour créer un visuel, cliquez sur 'Créer' dans le menu, choisissez votre sport et votre compétition, puis sélectionnez le match pour lequel vous souhaitez créer un visuel. \n\nCliquez ici pour commencer : [Créer un visuel](/create)",
      en: "To create a visual, click on 'Create' in the menu, choose your sport and competition, then select the match for which you want to create a visual. \n\nClick here to start: [Create a visual](/create)",
      es: "Para crear un visual, haga clic en 'Crear' en el menú, elija su deporte y competición, luego seleccione el partido para el que desea crear un visual. \n\nHaga clic aquí para comenzar: [Crear un visual](/create)"
    },
    link: '/create'
  },
  {
    id: 'export',
    text: {
      fr: "Comment exporter mes visuels ?",
      en: "How to export my visuals?",
      es: "¿Cómo exportar mis visuales?"
    },
    response: {
      fr: "Une fois votre visuel créé, rendez-vous dans la médiathèque. Vous pourrez alors télécharger vos visuels aux formats Story ou Carré en cliquant sur les boutons de téléchargement. \n\nAccéder à la médiathèque : [Médiathèque](/mediatheque)",
      en: "Once your visual is created, go to the media library. You can then download your visuals in Story or Square format by clicking on the download buttons. \n\nAccess media library: [Media Library](/mediatheque)",
      es: "Una vez creado su visual, vaya a la biblioteca multimedia. Luego puede descargar sus visuales en formato Story o Cuadrado haciendo clic en los botones de descarga. \n\nAcceder a la biblioteca multimedia: [Biblioteca multimedia](/mediatheque)"
    },
    link: '/mediatheque'
  }
];

const ChatBot: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    // Add user message
    setMessages(prev => [...prev, { text, isUser: true }]);

    // Find matching topic
    const topic = topics.find(t => 
      Object.values(t.text).some(translation => translation === text)
    );

    if (topic) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: topic.response[currentLang], 
          isUser: false 
        }]);
      }, 500);
    }

    setCurrentMessage('');
  };

  const renderMessageText = (message: Message) => {
    if (!message.isUser) {
      // Replace markdown-style links with actual links
      return message.text.split('\n').map((line, i) => {
        const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [fullMatch, text, url] = linkMatch;
          return (
            <span key={i} className="block">
              {line.substring(0, linkMatch.index)}
              <button
                onClick={() => navigate(url)}
                className="text-blue-500 hover:underline"
              >
                {text}
              </button>
              {line.substring(linkMatch.index! + fullMatch.length)}
            </span>
          );
        }
        return <span key={i} className="block">{line}</span>;
      });
    }
    return message.text;
  };

  const LanguageFlag = ({ lang, onClick }: { lang: Language, onClick: () => void }) => {
    const Flag = lang === 'fr' ? FR : lang === 'en' ? GB : ES;
    return (
      <button
        onClick={onClick}
        className="w-6 h-6 rounded overflow-hidden hover:opacity-80 transition-opacity"
      >
        <Flag />
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className={`w-96 rounded-2xl shadow-xl overflow-hidden ${
          isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'
        }`}>
          {/* Header */}
          <div className={`px-4 py-3 flex justify-between items-center border-b ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageFlag lang="fr" onClick={() => setCurrentLang('fr')} />
              <LanguageFlag lang="en" onClick={() => setCurrentLang('en')} />
              <LanguageFlag lang="es" onClick={() => setCurrentLang('es')} />
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-full transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.isUser
                      ? isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDark
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-100 text-black'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    {renderMessageText(message)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Topics */}
          <div className={`px-4 py-2 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <p className="text-sm text-zinc-500 mb-2">Questions fréquentes :</p>
            <div className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSendMessage(topic.text[currentLang])}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    isDark
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                      : 'bg-zinc-100 text-black hover:bg-zinc-200'
                  }`}
                >
                  {topic.text[currentLang]}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && currentMessage.trim()) {
                    handleSendMessage(currentMessage.trim());
                  }
                }}
                placeholder="Écrivez votre message..."
                className={`flex-1 px-4 py-2 rounded-full ${
                  isDark
                    ? 'bg-zinc-800 text-white placeholder-zinc-500'
                    : 'bg-zinc-100 text-black placeholder-zinc-400'
                } focus:outline-none`}
              />
              <button
                onClick={() => {
                  if (currentMessage.trim()) {
                    handleSendMessage(currentMessage.trim());
                  }
                }}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`p-4 rounded-full shadow-lg transition-colors ${
            isDark ? 'bg-black text-white hover:bg-zinc-900' : 'bg-white text-black hover:bg-zinc-50'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;