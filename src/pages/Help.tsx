import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const faqData = [
  {
    category: "Account",
    questions: [
      {
        q: "How do I modify my profile information?",
        a: "Access your profile by clicking on the profile icon in the sidebar menu. You can modify your information by clicking directly on the fields you wish to update. [Go to Profile](/profile)"
      },
      {
        q: "How do I change my password?",
        a: "In your profile settings, click on 'Security' then 'Change Password'. Follow the instructions to set a new password. [Go to Profile](/profile)"
      }
    ]
  },
  {
    category: "Visuals",
    questions: [
      {
        q: "How do I create my first visual?",
        a: "Click on 'Create' in the menu, select your sport, choose your competition, then select the match for which you want to create a visual. [Start Creating](/create)"
      },
      {
        q: "Can I customize my visuals?",
        a: "Yes, you can customize your visuals by modifying the background, typography, and other elements through the options available in the editor. [Go to Media Library](/mediatheque)"
      },
      {
        q: "What visual formats are available?",
        a: "We offer two main formats: Story (vertical format for Instagram/Facebook Stories) and Square (ideal for Instagram and Facebook posts). [Create New Visual](/create)"
      }
    ]
  },
  {
    category: "Subscription",
    questions: [
      {
        q: "What are the differences between plans?",
        a: `We offer four distinct plans:

1. Free Plan:
- 3 visuals per month
- 25 backgrounds
- 5 font choices
- No commitment

2. Basic Plan (70€/month):
- Unlimited visuals
- Complete background catalog
- All typography options
- No commitment
- Monthly billing

3. Premium Plan (60€/month):
- All Basic plan features
- 15% discount vs Basic plan
- 12-month commitment
- Monthly billing
- Priority support

4. Business Plan (598€/year):
- All Premium plan features
- 30% discount vs Basic plan
- One-time annual payment
- Dedicated support
- Advanced analytics

[View Plans](/pricing)`
      },
      {
        q: "How do I change my plan?",
        a: "Access your account settings, 'Subscription' section, then click 'Change Plan' to see available options. [Change Plan](/pricing?upgrade=true)"
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "Which browsers are supported?",
        a: "All Sports is compatible with the latest versions of Chrome, Firefox, Safari, and Edge."
      },
      {
        q: "How do I export my visuals?",
        a: "Once your visual is created, click 'Download' and choose your preferred export format (JPG or PNG). You can find all your saved visuals in the Media Library. [Go to Media Library](/mediatheque)"
      },
      {
        q: "How do I save my visuals?",
        a: "After generating your visuals, click 'Save to Library'. You can access all your saved visuals in the Media Library section. [Go to Media Library](/mediatheque)"
      }
    ]
  },
  {
    category: "Support",
    questions: [
      {
        q: "How can I get help?",
        a: "Our support team is available through multiple channels:\n\n1. Email: support@allsports.co\n2. Live Chat: Available during business hours\n3. FAQ: Browse through our frequently asked questions\n\n[Contact Support](/help)"
      },
      {
        q: "What are your business hours?",
        a: "Our support team is available Monday through Friday, 9:00 AM to 6:00 PM (CET)."
      }
    ]
  }
];

const Help = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const renderText = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [_, text, url] = linkMatch;
        return (
          <button
            key={index}
            onClick={() => navigate(url)}
            className="text-blue-500 hover:underline"
          >
            {text}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const filteredFaq = useMemo(() => {
    if (!searchQuery) return faqData;

    const query = searchQuery.toLowerCase();
    return faqData.map(category => ({
      ...category,
      questions: category.questions.filter(
        q => q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query)
      )
    })).filter(category => category.questions.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className={`text-2xl font-light tracking-widest mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            HELP CENTER
          </h1>
          <p className="text-sm text-zinc-400 tracking-wider">
            QUICKLY FIND ANSWERS TO YOUR QUESTIONS
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-12 py-4 rounded-xl ${
              isDark 
                ? 'bg-zinc-900/30 text-white placeholder-zinc-500' 
                : 'bg-white text-zinc-900 placeholder-zinc-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-zinc-500' : 'text-zinc-400'
          }`} />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredFaq.map((category) => (
            <div
              key={category.category}
              className={`rounded-xl overflow-hidden ${
                isDark ? 'bg-zinc-900/30' : 'bg-white'
              }`}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.category)}
                className={`w-full px-6 py-4 flex items-center justify-between ${
                  isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'
                } transition-colors`}
              >
                <h2 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {category.category}
                </h2>
                {expandedCategories.includes(category.category) 
                  ? <ChevronUp className="w-5 h-5" /> 
                  : <ChevronDown className="w-5 h-5" />
                }
              </button>

              {/* Questions */}
              {expandedCategories.includes(category.category) && (
                <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  {category.questions.map((item, index) => (
                    <div key={item.q}>
                      <button
                        onClick={() => toggleQuestion(item.q)}
                        className={`w-full px-6 py-4 flex items-center justify-between ${
                          isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-50'
                        } transition-colors`}
                      >
                        <span className={`text-left ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                          {item.q}
                        </span>
                        {expandedQuestions.includes(item.q)
                          ? <ChevronUp className="w-4 h-4 flex-shrink-0" />
                          : <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        }
                      </button>
                      
                      {expandedQuestions.includes(item.q) && (
                        <div className={`px-6 py-4 text-sm whitespace-pre-line ${
                          isDark ? 'text-zinc-400' : 'text-zinc-600'
                        } ${isDark ? 'bg-zinc-800/30' : 'bg-zinc-50'}`}>
                          {renderText(item.a)}
                        </div>
                      )}
                      
                      {index < category.questions.length - 1 && (
                        <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaq.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;