import React, { createContext, useContext, useState } from 'react';

export interface LanguageOption {
  code: string;
  speechCode: string;
  name: string;
  nativeName: string;
  region: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', speechCode: 'en-IN', name: 'English', nativeName: 'English', region: 'Pan-India / Global', flag: '🌐' },
  { code: 'hi', speechCode: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', region: 'North & Central India', flag: '🇮🇳' },
  { code: 'mr', speechCode: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra (Melghat Corridor)', flag: '🇮🇳' },
  { code: 'bn', speechCode: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal & Eastern India', flag: '🇮🇳' },
  { code: 'te', speechCode: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh & Telangana', flag: '🇮🇳' },
  { code: 'ta', speechCode: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & South India', flag: '🇮🇳' },
  { code: 'gu', speechCode: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat & Western India', flag: '🇮🇳' },
  { code: 'kn', speechCode: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka & South India', flag: '🇮🇳' },
  { code: 'ml', speechCode: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala & South India', flag: '🇮🇳' },
  { code: 'pa', speechCode: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab & North India', flag: '🇮🇳' },
  { code: 'or', speechCode: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha & Eastern India', flag: '🇮🇳' },
  { code: 'ur', speechCode: 'ur-IN', name: 'Urdu', nativeName: 'اردو', region: 'Pan-India & South Asia', flag: '🇮🇳' }
];

export interface Translations {
  [key: string]: { [lang: string]: string };
}

export const TRANSLATIONS: Translations = {
  nationalNetwork: {
    en: 'National Rural Health Referral Network',
    hi: 'राष्ट्रीय ग्रामीण स्वास्थ्य रेफरल नेटवर्क',
    mr: 'राष्ट्रीय ग्रामीण आरोग्य रेफरल नेटवर्क',
    bn: 'জাতীয় গ্রামীণ স্বাস্থ্য রেফারেল নেটওয়ার্ক',
    te: 'జాతీయ గ్రామీణ ఆరోగ్య రిఫరల్ నెట్‌వర్క్',
    ta: 'தேசிய கிராமப்புற சுகாதார பரிந்துரை வலையமைப்பு',
    gu: 'રાષ્ટ્રીય ગ્રામીણ આરોગ્ય રેફરલ નેટવર્ક',
    kn: 'ರಾಷ್ಟ್ರೀಯ ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಉಲ್ಲೇಖ ಜಾಲ',
    ml: 'ദേശീയ ഗ്രാമീണ ആരോഗ്യ റഫറൽ ശൃംഖല',
    pa: 'ਕੌਮੀ ਪੇਂਡੂ ਸਿਹਤ ਰੈਫਰਲ ਨੈੱਟਵਰਕ',
    or: 'ଜାତୀୟ ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ନେଟୱାର୍କ',
    ur: 'قومی دیہی صحت ریفرل نیٹ ورک'
  },
  emergencyHotline: {
    en: 'Emergency 108 Toll-Free',
    hi: 'आपातकालीन 108 टोल-फ्री',
    mr: 'तातडीची १०८ मोफत रुग्णवाहिका',
    bn: 'জরুরি ১০৮ টোল-ফ্রি',
    te: 'అత్యవసర 108 ఉచితం',
    ta: 'அவசர 108 கட்டணமில்லா',
    gu: 'ઇમરજન્સી ૧૦૮ ટોલ-ફ્રી',
    kn: 'ತುರ್ತು 108 ಉಚಿತ',
    ml: 'അടിയന്തര 108 ടോൾ ഫ്രീ',
    pa: 'ਐਮਰਜੈਂਸੀ 108 ਟੋਲ-ਫ੍ਰੀ',
    or: 'ଜରୁରୀକାଳୀନ ୧୦୮ ଟୋଲ-ମୁକ୍ତ',
    ur: 'ایمرجنسی 108 ٹول فری'
  },
  patientPortal: {
    en: 'Patient & Family Portal',
    hi: 'मरीज़ व परिवार पोर्टल',
    mr: 'रुग्ण व कुटुंब पोर्टल',
    bn: 'রোগী ও পরিবার পোর্টাল',
    te: 'రోగి & కుటుంబ పోర్టల్',
    ta: 'நோயாளி & குடும்ப போர்டல்',
    gu: 'દર્દી અને પરિવાર પોર્ટલ',
    kn: 'ರೋಗಿ ಮತ್ತು ಕುಟುಂಬ ಪೋರ್ಟಲ್',
    ml: 'രോഗി & കുടുംബ പോർട്ടൽ',
    pa: 'ਮਰੀਜ਼ ਅਤੇ ਪਰਿਵਾਰ ਪੋਰਟਲ',
    or: 'ରୋଗୀ ଓ ପରିବାର ପୋର୍ଟାଲ୍',
    ur: 'مریض اور خاندانی پورٹل'
  },
  staffPortal: {
    en: 'ASHA & Medical Staff',
    hi: 'आशा व चिकित्सा कर्मी पोर्टल',
    mr: 'आशा व आरोग्य कर्मचारी पोर्टल',
    bn: 'আশা ও স্বাস্থ্যকর্মী পোর্টাল',
    te: 'ఆశా & వైద్య సిబ్బంది పోర్టల్',
    ta: 'ஆஷா & மருத்துவ பணியாளர்',
    gu: 'આશા અને તબીબી સ્ટાફ પોર્ટલ',
    kn: 'ಆಶಾ ಮತ್ತು ವೈದ್ಯಕೀಯ ಸಿಬ್ಬಂದಿ',
    ml: 'ആശ & മെഡിക്കൽ സ്റ്റാഫ്',
    pa: 'ਆਸ਼ਾ ਅਤੇ ਮੈਡੀਕਲ ਸਟਾਫ',
    or: 'ଆଶା ଓ ଚିକିତ୍ସା କର୍ମଚାରୀ',
    ur: 'آشا اور طبی عملہ'
  },
  voiceIntake: {
    en: 'Voice & Intake',
    hi: 'आवाज़ व लक्षण दाखिला',
    mr: 'आवाज व लक्षण नोंदणी',
    bn: 'ভয়েস ও লক্ষণ গ্রহণ',
    te: 'వాయిస్ & రోగ లక్షణాలు',
    ta: 'குரல் & அறிகுறி பதிவு',
    gu: 'વોઇસ અને લક્ષણો',
    kn: 'ಧ್ವನಿ ಮತ್ತು ರೋಗಲಕ್ಷಣ',
    ml: 'ശബ്ദ പരിശോധന',
    pa: 'ਆਵਾਜ਼ ਅਤੇ ਲੱਛਣ',
    or: 'ଭଏସ୍ ଓ ଲକ୍ଷଣ',
    ur: 'آواز اور علامات'
  },
  careTransit: {
    en: 'Care & Transit',
    hi: 'एम्बुलेंस व लाइव ट्रैकिंग',
    mr: 'रुग्णवाहिका ट्रॅकिंग व मार्ग',
    bn: 'অ্যাম্বুলেন্স ও ট্র্যাকিং',
    te: 'అంబులెన్స్ & రవాణా',
    ta: 'ஆம்புலன்ஸ் & கண்காணிப்பு',
    gu: 'એમ્બ્યુલન્સ અને ટ્રાન્ઝિટ',
    kn: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್',
    ml: 'ആംബുലൻസ് ട്രാക്കിംഗ്',
    pa: 'ਐਂਬੂਲੈਂਸ ਤੇ ਟ੍ਰਾਂਜ਼ਿਟ',
    or: 'ଆମ୍ବୁଲାନ୍ସ ଓ ଟ୍ରାଞ୍ଜିଟ୍',
    ur: 'ایمبولینس اور ٹریکنگ'
  },
  hospitalHandover: {
    en: 'Hospital Handover',
    hi: 'अस्पताल हैंडओवर व डिस्चार्ज',
    mr: 'रुग्णालय हँडओव्हर व डिस्चार्ज',
    bn: 'হাসপাতাল হ্যান্ডওভার',
    te: 'హాస్పిటల్ హ్యాండ్‌ఓవర్',
    ta: 'மருத்துவமனை ஒப்படைப்பு',
    gu: 'હોસ્પિટલ હેન્ડઓવર',
    kn: 'ಆಸ್ಪತ್ರೆ ಹಸ್ತಾಂತರ',
    ml: 'ആശുപത്രി ഹാൻഡ് ഓവർ',
    pa: 'ਹਸਪਤਾਲ ਹੈਂਡਓਵਰ',
    or: 'ଡାକ୍ତରଖାନା ହସ୍ତାନ୍ତର',
    ur: 'ہسپتال ہینڈ اوور'
  },
  districtRadar: {
    en: 'DHO Radar',
    hi: 'जिला सांख्यिकी रडार',
    mr: 'जिल्हा आरोग्य रडार',
    bn: 'জেলা স্বাস্থ্য রাডার',
    te: 'జిల్లా హెల్త్ రాడార్',
    ta: 'மாவட்ட சுகாதார ரேடார்',
    gu: 'જિલ્લા આરોગ્ય રડાર',
    kn: 'ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ರಾಡಾರ್',
    ml: 'ജില്ലാ ആരോഗ്യ റഡാർ',
    pa: 'ਜ਼ਿਲ੍ਹਾ ਸਿਹਤ ਰਡਾਰ',
    or: 'ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ରାଡାର',
    ur: 'ضلعی ہیلتھ راڈار'
  },
  familyVault: {
    en: 'Family Health Vault',
    hi: 'परिवार स्वास्थ्य खाता',
    mr: 'कुटुंब आरोग्य खाते',
    bn: 'পারিবারিক স্বাস্থ্য ভল্ট',
    te: 'కుటుంబ ఆరోగ్య వాల్ట్',
    ta: 'குடும்ப சுகாதார பெட்டகம்',
    gu: 'પરિવાર આરોગ્ય વૉલ્ટ',
    kn: 'ಕುಟುಂಬ ಆರೋಗ್ಯ ವಾಲ್ಟ್',
    ml: 'കുടുംബ ആരോഗ്യ നിലവറ',
    pa: 'ਪਰਿਵਾਰਕ ਸਿਹਤ ਖਾਤਾ',
    or: 'ପାରିବାରିକ ସ୍ୱାସ୍ଥ୍ୟ ଭଲ୍ଟ',
    ur: 'خاندانی صحت والٹ'
  },
  selectLanguage: {
    en: 'Select Language / भाषा चुनें',
    hi: 'भाषा चुनें / Select Language',
    mr: 'भाषा निवडा / Select Language',
    bn: 'ভাষা নির্বাচন করুন',
    te: 'భాషను ఎంచుకోండి',
    ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    gu: 'ભાષા પસંદ કરો',
    kn: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    pa: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    or: 'ଭାଷା ଚୟନ କରନ୍ତୁ',
    ur: 'زبان منتخب کریں'
  }
};

interface LanguageContextType {
  currentLanguage: LanguageOption;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  isModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(() => {
    try {
      const saved = localStorage.getItem('ilaaj_lang');
      if (saved) {
        const found = SUPPORTED_LANGUAGES.find(l => l.code === saved);
        if (found) return found;
      }
    } catch {}
    return SUPPORTED_LANGUAGES[0]; // English by default
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const setLanguage = (code: string) => {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (found) {
      setCurrentLanguage(found);
      try {
        localStorage.setItem('ilaaj_lang', code);
      } catch {}
    }
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[currentLanguage.code] || entry['en'] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        isModalOpen,
        openLanguageModal: () => setIsModalOpen(true),
        closeLanguageModal: () => setIsModalOpen(false)
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
