

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/language.css';

const Languages = () => {
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useTranslation();

  const languages = [
    { name: t('languages.items.swahili.name'), tooltip: t('languages.items.swahili.tooltip') },
    { name: t('languages.items.kikuyu.name'), tooltip: t('languages.items.kikuyu.tooltip') },
    { name: t('languages.items.luo.name'), tooltip: t('languages.items.luo.tooltip') },
    { name: t('languages.items.kalenjin.name'), tooltip: t('languages.items.kalenjin.tooltip') },
    { name: t('languages.items.luhya.name'), tooltip: t('languages.items.luhya.tooltip') },
    { name: t('languages.items.kamba.name'), tooltip: t('languages.items.kamba.tooltip') },
    { name: t('languages.items.sukuma.name'), tooltip: t('languages.items.sukuma.tooltip') },
    { name: t('languages.items.maasai.name'), tooltip: t('languages.items.maasai.tooltip') },
    { name: t('languages.items.meru.name'), tooltip: t('languages.items.meru.tooltip') },
    { name: t('languages.items.somali.name'), tooltip: t('languages.items.somali.tooltip') },
    { name: t('languages.items.turkana.name'), tooltip: t('languages.items.turkana.tooltip') },
   
  ];

  return (
    <section className="languages-section">
      <h2>{t('languages.title')}</h2>
      <p className="p">{t('languages.description')}</p>

      <div className="carousel-container">



{/* 
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

*/}


<div 
  className={`languages ${isPaused ? 'paused' : ''}`}
  id="languageCarousel"
>
  {[...languages, ...languages].map((lang, index) => (
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