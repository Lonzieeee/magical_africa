

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/faq.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('faq.items.whatIs.question'),
      answer: t('faq.items.whatIs.answer')
    },
    {
      question: t('faq.items.contribute.question'),
      answer: t('faq.items.contribute.answer')
    },
    {
      question: t('faq.items.authentic.question'),
      answer: t('faq.items.authentic.answer')
    },
    {
      question: t('faq.items.learnLanguage.question'),
      answer: t('faq.items.learnLanguage.answer')
    },
    {
      question: t('faq.items.purchase.question'),
      answer: t('faq.items.purchase.answer')
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="FAQ" >
     {/*  <h1>{t('faq.title')}</h1>*/}

     <h1>{t('faq.title')} <span>{t('faq.titlespan')}</span></h1>

     <p>{t('faq.subtitle2')}</p>

      <div className="questions-section">
        {faqData.map((item, index) => (
          <div className="question" key={index}>
            <div className="question1" onClick={() => toggleQuestion(index)}>
              <span>{item.question}</span>
              <i 
                className="fa-solid fa-chevron-down"
                style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
              ></i>
            </div>
            <div 
              className="answer1"
              style={{ display: openIndex === index ? 'block' : 'none' }}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;