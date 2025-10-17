import React, { useState, useEffect } from 'react';
import './App.css';

// Karakter setlerini tanımlayalım
const numbers = '0123456789';
const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const specialCharacters = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

function App() {
  // --- STATE'LER ---
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [strength, setStrength] = useState(0);

  // --- ŞİFRE OLUŞTURMA MANTIĞI ---
  const handleGeneratePassword = () => {
    let characterList = '';
    if (includeLowercase) characterList += lowerCaseLetters;
    if (includeUppercase) characterList += upperCaseLetters;
    if (includeNumbers) characterList += numbers;
    if (includeSymbols) characterList += specialCharacters;

    if (characterList === '') {
      setPassword('Lütfen bir seçenek seçin!');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characterList.length);
      generatedPassword += characterList.charAt(characterIndex);
    }
    setPassword(generatedPassword);
    setCopyMessage(''); // Yeni şifre oluşturulduğunda kopyalama mesajını temizle
  };

  // --- KOPYALAMA MANTIĞI ---
  const handleCopyPassword = () => {
    if (password && !password.includes('Lütfen')) {
      navigator.clipboard.writeText(password);
      setCopyMessage('Kopyalandı!');
      setTimeout(() => {
        setCopyMessage('');
      }, 2000); // 2 saniye sonra mesajı kaldır
    }
  };

  // --- GÜÇ HESAPLAMA (GÜNCELLENDİ) ---
  useEffect(() => {
    let score = 0;
    if (passwordLength >= 8) score++;
    if (passwordLength >= 12) score++;
    if (includeUppercase) score++;
    if (includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    
    // 4 seviyeli yeni güç belirleme
    let calculatedStrength = 0;
    if (score <= 2) calculatedStrength = 1; // Zayıf
    else if (score <= 3) calculatedStrength = 2; // Orta
    else if (score <= 4) calculatedStrength = 3; // Güçlü
    else if (score > 4) calculatedStrength = 4; // Çok Güçlü
    
    setStrength(calculatedStrength);
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);
  
  // Uygulama ilk açıldığında bir şifre oluştur
  useEffect(() => {
    handleGeneratePassword();
  }, []);

  return (
    <div className="app-container">
      <h1 className="main-title">Güvenli Şifre Oluşturucu</h1>
      
      <div className="password-display-container">
        <input 
          type="text" 
          className="password-display" 
          value={password}
          readOnly 
        />
        <div className="copy-section">
          {copyMessage && <span className="copy-message">{copyMessage}</span>}
          <button className="copy-btn" title="Panoya Kopyala" onClick={handleCopyPassword}>
            <svg width="21" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M20.341 3.091 17.909.659A2.25 2.25 0 0 0 16.319 0H8.25A2.25 2.25 0 0 0 6 2.25V4.5H2.25A2.25 2.25 0 0 0 0 6.75v15A2.25 2.25 0 0 0 2.25 24h10.5A2.25 2.25 0 0 0 15 21.75V19.5h3.75A2.25 2.25 0 0 0 21 17.25V4.682a2.25 2.25 0 0 0-.659-1.591ZM12.75 21.75H2.25V6.75H6V17.25a3.75 3.75 0 0 0 3.75 3.75h3ZM18.75 17.25h-3.75V4.5h1.5V6a.75.75 0 0 0 .75.75h3v10.5Z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="setting">
          <label>Şifre Uzunluğu</label>
          <span className="length-display">{passwordLength}</span>
        </div>
        <input type="range" min="6" max="20" value={passwordLength} className="slider" onChange={(e) => setPasswordLength(e.target.value)} />

        <div className="options-group">
          <label className="option">
            <input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} />
            Büyük Harf İçer (A-Z)
          </label>
          <label className="option">
            <input type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} />
            Küçük Harf İçer (a-z)
          </label>
          <label className="option">
            <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
            Rakam İçer (0-9)
          </label>
          <label className="option">
            <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
            Sembol İçer (!-$^+...)
          </label>
        </div>

        <div className="strength-indicator">
          <span className="strength-label">GÜÇ</span>
          <div className="strength-bars">
             <div className={`strength-bar ${strength >= 1 ? 'filled weak' : ''}`}></div>
             <div className={`strength-bar ${strength >= 2 ? 'filled medium' : ''}`}></div>
             <div className={`strength-bar ${strength >= 3 ? 'filled strong' : ''}`}></div>
             <div className={`strength-bar ${strength >= 4 ? 'filled very-strong' : ''}`}></div>
          </div>
        </div>

        <button className="generate-btn" onClick={handleGeneratePassword}>YENİ ŞİFRE OLUŞTUR</button>
      </div>
    </div>
  );
}

export default App;

