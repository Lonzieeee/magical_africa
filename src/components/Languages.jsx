{/* 

import { useState } from 'react';
import '../styles/language.css';

const languages = [
  { name: 'Swahili', tooltip: "A common greeting is 'Habari?', meaning 'How are you?'" },
  { name: 'Zulu', tooltip: "A common greeting is 'Sawubona', meaning 'I see you.'" },
  { name: 'Yoruba', tooltip: "'Báwo ni?' is a common Yoruba greeting meaning 'How are you?'" },
  { name: 'Kikuyu', tooltip: "A common greeting is 'Jambo', meaning 'Hello'" },
  { name: 'Hausa', tooltip: "'Akkam?' means 'How are you?' in Hausa." },
  { name: 'Shona', tooltip: "'Mhoro' is a common Shona greeting meaning 'Hello.'" },
  { name: 'Sukuma', tooltip: "A common greeting is 'Moro', meaning 'Hello'" },
  { name: 'Xhosa', tooltip: "'Molo' is a common Xhosa greeting meaning 'Hello.'" },
  { name: 'Maasai', tooltip: "A common greeting is 'Sanu', meaning 'Hello'" },
  { name: 'Igbo', tooltip: "A common greeting is 'Kedu?', meaning 'How are you?'" },
  { name: 'Lingala', tooltip: "A common greeting is 'Mbote', meaning 'Hello'" },
  { name: 'Tsonga', tooltip: "A common greeting is 'Avuxeni', meaning 'Good morning'" },
  { name: 'Setswana', tooltip: "A common greeting is 'Dumela', meaning 'Hello'" },
  { name: 'Chichewa', tooltip: "A common greeting is 'Moni', meaning 'Hello'" }
];

const Languages = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="languages-section">
      <h2>Get to Learn Some of Our Languages</h2>
      <p className="p">
        Africa is home to thousands of languages, each carrying history,
        identity, and culture. Explore common greetings and words from
        different African communities and connect with the continent
        through language.
      </p>

      <div className="carousel-container">
        <div 
          className={`languages ${isPaused ? 'paused' : ''}`}
          id="languageCarousel"
        >
          {languages.map((lang, index) => (
            <span 
              key={index}
              data-tooltip={lang.tooltip}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {lang.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Languages;
*/}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/language.css';

const Languages = () => {
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useTranslation();

  const languages = [
    { name: t('languages.items.swahili.name'), tooltip: t('languages.items.swahili.tooltip') },
    { name: t('languages.items.zulu.name'), tooltip: t('languages.items.zulu.tooltip') },
    { name: t('languages.items.yoruba.name'), tooltip: t('languages.items.yoruba.tooltip') },
    { name: t('languages.items.kikuyu.name'), tooltip: t('languages.items.kikuyu.tooltip') },
    { name: t('languages.items.hausa.name'), tooltip: t('languages.items.hausa.tooltip') },
    { name: t('languages.items.shona.name'), tooltip: t('languages.items.shona.tooltip') },
    { name: t('languages.items.sukuma.name'), tooltip: t('languages.items.sukuma.tooltip') },
    { name: t('languages.items.xhosa.name'), tooltip: t('languages.items.xhosa.tooltip') },
    { name: t('languages.items.maasai.name'), tooltip: t('languages.items.maasai.tooltip') },
    { name: t('languages.items.igbo.name'), tooltip: t('languages.items.igbo.tooltip') },
    { name: t('languages.items.lingala.name'), tooltip: t('languages.items.lingala.tooltip') },
    { name: t('languages.items.tsonga.name'), tooltip: t('languages.items.tsonga.tooltip') },
    { name: t('languages.items.setswana.name'), tooltip: t('languages.items.setswana.tooltip') },
    { name: t('languages.items.chichewa.name'), tooltip: t('languages.items.chichewa.tooltip') }
  ];

  return (
    <section className="languages-section">
      <h2>{t('languages.title')}</h2>
      <p className="p">{t('languages.description')}</p>

      <div className="carousel-container">
        <div 
          className={`languages ${isPaused ? 'paused' : ''}`}
          id="languageCarousel"
        >
          {languages.map((lang, index) => (
            <span 
              key={index}
              data-tooltip={lang.tooltip}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {lang.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Languages;