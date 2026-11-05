import React, { useState, useRef, useEffect } from 'react';
import { runVoiceTriage, runPrescriptionOCR, transcribeAudio } from '../services/api';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface VoiceTriageSectionProps {
  onReferralCreated: (referralData: any) => void;
}

const PRESETS_BY_LANGUAGE: Record<string, { label: string; text: string; icon: string }[]> = {
  hi: [
    {
      label: 'छाती में तेज़ दर्द व पसीना (Heart Attack)',
      text: 'मरीज़ को सुबह से छाती में तेज़ दर्द है, पसीना आ रहा है और सांस लेने में दिक्कत है। BP 168/104 है, पल्स 112 है। सुबह 10:15 बजे Sorbitrate 5mg और Aspirin 300mg दे दी गई है।',
      icon: '🚨'
    },
    {
      label: 'सांस फूलना व कम SpO2 (Severe Asthma)',
      text: 'मरीज़ को सांस लेने में बहुत दिक्कत हो रही है, घरघराहट है, SpO2 86% है और BP 150/95 है। 1 घंटे से हालत गंभीर है।',
      icon: '⚠️'
    },
    {
      label: 'दुर्घटना व फ्रैक्चर (Major Trauma)',
      text: 'मोटरसाइकिल दुर्घटना, मरीज के दाहिने पैर में फ्रैक्चर है और बहुत खून बह रहा है। BP 90/60 है, नब्ज़ 120 है।',
      icon: '🩸'
    }
  ],
  mr: [
    {
      label: 'छातीत तीव्र वेदना व घाम (ACS/हार्ट अटॅक)',
      text: 'रुग्णाला सकाळपासून छातीत तीव्र कळ येते आहे, खूप घाम सुटला आहे आणि श्वास घेण्यास त्रास होत आहे. रक्तदाब १६८/१०४ आहे, नाडी ११० आहे. सॉर्बिट्रेट ५ मिलीग्रॅम दिली आहे.',
      icon: '🚨'
    },
    {
      label: 'दम लागणे व ऑक्सिजन कमी (श्वसन विकार)',
      text: 'रुग्णाला तीव्र दम लागला आहे, घरघर ऐकू येतेय, SpO2 ८८% आहे आणि रक्तदाब १५०/९५ आहे. ताबडतोब ऑक्सिजनची गरज आहे.',
      icon: '⚠️'
    },
    {
      label: 'रस्ता अपघात व फ्रॅक्चर (Emergency Trauma)',
      text: 'रस्ता अपघात झाला आहे, उजव्या पायाचे हाड मोडले असून रक्तस्त्राव होत आहे, BP ९०/६० आहे, नाडी १२० आहे.',
      icon: '🩸'
    }
  ],
  bn: [
    {
      label: 'বুকে তীব্র ব্যথা ও ঘাম (Heart Attack)',
      text: 'রোগীর সকাল থেকে বুকে প্রচণ্ড ব্যথা, শরীর ঘেমে যাচ্ছে এবং শ্বাস নিতে কষ্ট হচ্ছে। বিপি ১৭০/১০৫, পালস ১১০। সকাল ১০টায় অ্যাসপিরিন দেওয়া হয়েছে।',
      icon: '🚨'
    },
    {
      label: 'শ্বাসকষ্ট ও কম অক্সিজেন (Severe Asthma)',
      text: 'শ্বাস নিতে ভীষণ কষ্ট হচ্ছে, বুকের মধ্যে সাঁই সাঁই শব্দ হচ্ছে, SpO2 ৮৭% নেমে গেছে এবং রক্তচাপ ১৫০/৯৫।',
      icon: '⚠️'
    },
    {
      label: 'দুর্ঘটনা ও ফ্র্যাকচার (Major Trauma)',
      text: 'বাইক দুর্ঘটনা, রোগীর ডান পায়ে ফ্র্যাকচার হয়েছে এবং প্রচুর রক্তপাত হচ্ছে। বিপি ৯০/৬০, পালস ১২০।',
      icon: '🩸'
    }
  ],
  te: [
    {
      label: 'గుండెల్లో తీవ్ర నొప్పి (Heart Attack)',
      text: 'రోగికి ఉదయం నుండి గుండెల్లో తీవ్రమైన నొప్పి వస్తోంది, విపరీతమైన చెమటలు పడుతున్నాయి, శ్వాస తీసుకోవడం కష్టంగా ఉంది. BP 170/100, పల్స్ 110.',
      icon: '🚨'
    },
    {
      label: 'శ్వాస ఆడకపోవడం (Asthma Crisis)',
      text: 'రోగికి శ్వాస అందడం లేదు, ఆయాసంగా ఉంది, SpO2 88% కి పడిపోయింది, BP 150/95.',
      icon: '⚠️'
    },
    {
      label: 'రోడ్డు ప్రమాదం (Major Trauma)',
      text: 'రోడ్డు ప్రమాదం జరిగింది, కుడి కాలు విరిగింది మరియు తీవ్ర రక్తస్రావం అవుతోంది. BP 90/60, పల్స్ 120.',
      icon: '🩸'
    }
  ],
  ta: [
    {
      label: 'மாரடைப்பு நெஞ்சு வலி (Heart Attack)',
      text: 'நோயாளிக்கு கடுமையான மார்பு வலி உள்ளது, அதிக வியர்வை வெளியேறுகிறது, மூச்சு விடுவதில் சிரமம். இரத்த அழுத்தம் 165/102, நாடித்துடிப்பு 112.',
      icon: '🚨'
    },
    {
      label: 'மூச்சுத்திணறல் (Severe Asthma)',
      text: 'நோயாளிக்கு கடுமையான மூச்சுத்திணறல் ஏற்பட்டுள்ளது, ஆக்சிஜன் SpO2 87% ஆக குறைந்துள்ளது, BP 150/95.',
      icon: '⚠️'
    },
    {
      label: 'விபத்து & எலும்பு முறிவு (Trauma)',
      text: 'வாகன விபத்து, வலது காலில் முறிவு ஏற்பட்டு அதிக ரத்தப்போக்கு உள்ளது. BP 90/60, நாடித்துடிப்பு 120.',
      icon: '🩸'
    }
  ],
  gu: [
    {
      label: 'છાતીમાં સખત દુખાવો (Heart Attack)',
      text: 'દર્દીને સવારથી છાતીમાં સખત દુખાવો થાય છે, ખૂબ પરસેવો વળે છે અને શ્વાસ લેવામાં તકલીફ થાય છે. BP 168/104 છે, પલ્સ 112 છે.',
      icon: '🚨'
    },
    {
      label: 'શ્વાસ લેવામાં તકલીફ (Asthma Emergency)',
      text: 'દર્દીને શ્વાસ ચઢે છે, છાતીમાં ઘરઘરાટી બોલે છે, SpO2 87% છે અને BP 150/95 છે.',
      icon: '⚠️'
    },
    {
      label: 'અકસ્માત અને ફ્રેક્ચર (Major Trauma)',
      text: 'બાઇક અકસ્માત, જમણા પગમાં ફ્રેક્ચર છે અને ઘણું લોહી વહી રહ્યું છે. BP 90/60, પલ્સ 120 છે.',
      icon: '🩸'
    }
  ],
  kn: [
    {
      label: 'ಎದೆ ನೋವು ಮತ್ತು ಬೆವರು (Heart Attack)',
      text: 'ರೋಗಿಗೆ ಎದೆಯಲ್ಲಿ ತೀವ್ರ ನೋವು ಕಾಣಿಸಿಕೊಂಡಿದೆ, ಬೆವರು ಬರುತ್ತಿದೆ ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆಯಾಗಿದೆ. ಬಿಪಿ 168/104 ಇದೆ, ನಾಡಿಮಿಡಿತ 112 ಇದೆ.',
      icon: '🚨'
    },
    {
      label: 'ಉಸಿರಾಟದ ತೊಂದರೆ (Severe Asthma)',
      text: 'ರೋಗಿಗೆ ಉಸಿರಾಡಲು ತುಂಬಾ ಕಷ್ಟವಾಗುತ್ತಿದೆ, ಆಮ್ಲಜನಕದ ಮಟ್ಟ SpO2 88% ಗೆ ಇಳಿದಿದೆ, ಬಿಪಿ 150/95.',
      icon: '⚠️'
    },
    {
      label: 'ಅಪಘಾತ ಮತ್ತು ಮುರಿತ (Major Trauma)',
      text: 'ರಸ್ತೆ ಅಪಘಾತ, ಬಲಗಾಲಿನಲ್ಲಿ ಮೂಳೆ ಮುರಿತವಾಗಿದ್ದು ರಕ್ತಸ್ರಾವವಾಗುತ್ತಿದೆ. ಬಿಪಿ 90/60, ನಾಡಿ 120.',
      icon: '🩸'
    }
  ],
  ml: [
    {
      label: 'നെഞ്ചുവേദനയും അസ്വസ്ഥതയും (Heart Attack)',
      text: 'രോഗിക്ക് കടുത്ത നെഞ്ചുവേദനയും അമിതമായ വിയർപ്പും ശ്വാസതടസ്സവുമുണ്ട്. ബിപി 170/100, പൾസ് 110. സോർബിട്രേറ്റ് നൽകി.',
      icon: '🚨'
    },
    {
      label: 'ശ്വാസംമുട്ടൽ (Severe Asthma)',
      text: 'രോഗിക്ക് കടുത്ത ശ്വാസംമുട്ടൽ അനുഭവപ്പെടുന്നു, ഓക്സിജൻ നില SpO2 87% ആയി കുറഞ്ഞു, ബിപി 150/95.',
      icon: '⚠️'
    },
    {
      label: 'അപകടം & പരിക്ക് (Emergency Trauma)',
      text: 'വാഹനാപകടം, വലതുകാലിൽ ഒടിവുണ്ടായി കടുത്ത രക്തസ്രാവമുണ്ട്. ബിപി 90/60, പൾസ് 120.',
      icon: '🩸'
    }
  ],
  pa: [
    {
      label: 'ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ (Heart Attack)',
      text: 'ਮਰੀਜ਼ ਨੂੰ ਛਾਤੀ ਵਿੱਚ ਬਹੁਤ ਤੇਜ਼ ਦਰਦ ਹੋ ਰਿਹਾ ਹੈ, ਪਸੀਨਾ ਆ ਰਿਹਾ ਹੈ ਅਤੇ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼ ਹੈ। BP 170/100 ਹੈ, ਨਬਜ਼ 112 ਹੈ।',
      icon: '🚨'
    },
    {
      label: 'ਸਾਹ ਚੜ੍ਹਨਾ (Severe Asthma)',
      text: 'ਮਰੀਜ਼ ਦਾ ਸਾਹ ਬਹੁਤ ਜ਼ਿਆਦਾ ਫੁੱਲ ਰਿਹਾ ਹੈ, SpO2 88% ਰਹਿ ਗਿਆ ਹੈ, BP 150/95 ਹੈ।',
      icon: '⚠️'
    },
    {
      label: 'ਹਾਦਸਾ ਤੇ ਫਰੈਕਚਰ (Major Trauma)',
      text: 'ਸੜਕ ਹਾਦਸਾ, ਸੱਜੀ ਲੱਤ ਵਿੱਚ ਫਰੈਕਚਰ ਹੈ ਅਤੇ ਖੂਨ ਬਹੁਤ ਵਹਿ ਰਿਹਾ ਹੈ। BP 90/60, ਨਬਜ਼ 120.',
      icon: '🩸'
    }
  ],
  or: [
    {
      label: 'ଛାତି ଯନ୍ତ୍ରଣା ଓ ଝାଳ (Heart Attack)',
      text: 'ରୋଗୀଙ୍କର ସକାଳୁ ଛାତିରେ ପ୍ରବଳ ଯନ୍ତ୍ରଣା ହେଉଛି, ପ୍ରବଳ ଝାଳ ବୋହୁଛି ଓ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି। BP 168/104 ଅଛି, ନାଡ଼ି ୧୧୨।',
      icon: '🚨'
    },
    {
      label: 'ଶ୍ୱାସକଷ୍ଟ (Severe Asthma)',
      text: 'ନିଶ୍ୱାସ ନେବାରେ ବହୁତ ଅସୁବିଧା ହେଉଛି, SpO2 87% କୁ ଖସି ଆସିଛି, BP 150/95.',
      icon: '⚠️'
    },
    {
      label: 'ଦୁର୍ଘଟଣା (Major Trauma)',
      text: 'ସଡ଼କ ଦୁର୍ଘଟଣା, ଡାହାଣ ଗୋଡ଼ରେ ଫ୍ରାକଚର ହୋଇଛି ଏବଂ ପ୍ରଚୁର ରକ୍ତସ୍ରାବ ହେଉଛି। BP 90/60, ନାଡ଼ି ୧୨୦।',
      icon: '🩸'
    }
  ],
  ur: [
    {
      label: 'سینے میں شدید درد (Heart Attack)',
      text: 'مریض کے سینے میں صبح سے شدید درد ہے، بہت پسینہ آ رہا ہے اور سانس لینے میں دشواری ہو رہی ہے۔ بی پی 168/104 ہے اور نبض 112 ہے۔',
      icon: '🚨'
    },
    {
      label: 'سانس کی شدید تکلیف (Severe Asthma)',
      text: 'مریض کو سانس لینے میں سخت دشواری پیش آ رہی ہے، آکسیجن SpO2 87 فیصد تک گر گیا ہے، بی پی 150/95 ہے۔',
      icon: '⚠️'
    },
    {
      label: 'حادثہ اور فریکچر (Major Trauma)',
      text: 'روڈ ایکسیڈنٹ، دائیں ٹانگ میں فریکچر ہے اور بہت خون بہہ رہا ہے۔ بی پی 90/60 اور نبض 120 ہے۔',
      icon: '🩸'
    }
  ],
  en: [
    {
      label: 'Chest Pain & Sweating (Acute Coronary Syndrome)',
      text: 'Patient has severe retrosternal chest pain radiating to left shoulder, profuse cold diaphoresis, and acute shortness of breath. BP is 168/104 mmHg, pulse 112 bpm. Sublingual Sorbitrate 5mg and Aspirin 300mg administered at 10:15 AM.',
      icon: '🚨'
    },
    {
      label: 'Acute Wheezing & Hypoxia (Status Asthmaticus)',
      text: 'Patient in acute respiratory distress with loud expiratory wheezing, severe dyspnea, and SpO2 86% on room air. Tachycardic at 116 bpm, BP 152/96 mmHg.',
      icon: '⚠️'
    },
    {
      label: 'Major Polytrauma (Compound Fracture)',
      text: 'Motorcycle collision trauma, open compound fracture of right tibia with active hemorrhage. BP 90/60 mmHg, heart rate 124 bpm, pale and cold extremities.',
      icon: '🩸'
    }
  ]
};

export const VoiceTriageSection: React.FC<VoiceTriageSectionProps> = ({ onReferralCreated }) => {
  const { currentLanguage, setLanguage, openLanguageModal } = useLanguage();
  const [spokenText, setSpokenText] = useState(
    'मरीज़ को सुबह से छाती में तेज़ दर्द है, पसीना आ रहा है और सांस लेने में दिक्कत है। BP 168/104 है, पल्स 112 है। सुबह 10:15 बजे Sorbitrate 5mg और Aspirin 300mg दे दी गई है...'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [micStatus, setMicStatus] = useState<string>('Ready • Tap mic to speak');
  const [loading, setLoading] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
    };
  }, []);

  const stopAllRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
    setMicStatus('Recording finished • Ready');
  };

  const startMediaRecorderFallback = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (audioChunksRef.current.length > 0) {
          setMicStatus(`Transcribing via Groq Whisper Large v3 (${currentLanguage.name})...`);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const res = await transcribeAudio(audioBlob, currentLanguage.code);
          if (res && res.text) {
            setSpokenText(res.text);
            setMicStatus(`Transcribed via Groq Whisper (${currentLanguage.nativeName})`);
          } else {
            setMicStatus('Could not transcribe audio');
          }
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setMicStatus(`Listening via Mic (Groq Whisper: ${currentLanguage.name})... Tap mic to stop`);
    } catch (err: any) {
      console.warn('Microphone permission or access error:', err);
      setMicStatus('Microphone blocked by browser. Please enable mic access.');
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopAllRecording();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      startMediaRecorderFallback();
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage.speechCode;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setMicStatus(`Listening (${currentLanguage.nativeName} • ${currentLanguage.speechCode})... Speak into microphone`);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript + ' ';
        }
        if (transcript.trim()) {
          setSpokenText(transcript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicStatus('Mic blocked. Please allow microphone in browser URL bar.');
          setIsRecording(false);
        } else if (event.error === 'no-speech') {
          setMicStatus('No voice detected. Tap mic to retry.');
        } else {
          stopAllRecording();
          startMediaRecorderFallback();
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setMicStatus('Mic stopped • Tap to speak again');
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition start failed, falling back to Groq Whisper:', err);
      startMediaRecorderFallback();
    }
  };

  const handleRunTriage = async () => {
    if (!spokenText.trim()) return;
    setLoading(true);
    try {
      const res = await runVoiceTriage(spokenText, currentLanguage.code);
      if (res && res.result) {
        setTriageResult(res.result);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await runPrescriptionOCR(file);
      if (res && res.result) {
        const triageRes = await runVoiceTriage(res.result.prescribedMedicines.join(', '), currentLanguage.code);
        setTriageResult(triageRes.result);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndDispatch = () => {
    setDispatched(true);
    confetti({ particleCount: 75, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => {
      onReferralCreated({
        patientName: 'Ramesh K. Gurjar',
        age: 52,
        gender: 'Male',
        village: 'Rampur Village (Ward 4)',
        ashaWorker: 'Sunita Devi (ASHA-902)',
        presentingSymptoms: spokenText,
        vitals: triageResult?.extractedVitals || { bp: '168/104 mmHg', pulse: '112 bpm', spo2: '91%', bloodSugar: '210 mg/dL' },
        cdssSeverity: triageResult?.cdssSeverity || 'RED',
        suspectedCondition: triageResult?.suspectedCondition || 'Acute Coronary Syndrome / STEMI',
        requiredSpecialty: triageResult?.requiredSpecialty || 'Cardiology',
        intakeLanguage: currentLanguage.name,
        careBundle: triageResult?.suggestedCareBundle || {
          consultation: 'Dr. Vikram Sen (Cardiologist on Duty)',
          diagnosticSlots: ['12-Lead ECG', 'Cardiac Troponin-I', 'Bedside 2D Echo'],
          transitToken: 'Ambulance #KA-04-E-108 (ALS)'
        },
        destinationFacilityId: 'fac-dh-amravati'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb & Field Context Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Ilaaj Track Official Emblem"
            className="w-10 h-10 rounded-xl object-contain shadow-xs border border-teal-100 bg-white"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Emergency Patient Triage & Intake
            </h1>
            <p className="text-xs text-slate-500">
              Sub-Center Rampur • Attending ASHA Worker: Sunita Devi (#ASHA-902)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            District Hospital Gateway Connected
          </span>
        </div>
      </div>

      {/* Patient Header & Vitals Card (High-Contrast Daylight Friendly) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Patient Identity Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wide border border-rose-200">
                <span className="material-symbols-outlined text-sm">priority_high</span>
                Urgent Referral • Priority 1
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                ABHA ID: 8921-4410-09
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900">Ramesh K. Gurjar</h2>
                <span className="text-base font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  52 yrs, Male
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-slate-400">home_pin</span>
                Rampur Village (Ward 4) • <strong className="text-slate-700 font-semibold">38 km to District Hospital</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                <span className="material-symbols-outlined text-sm text-amber-700">report</span>
                Reported Symptoms:
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Severe chest pain radiating to left shoulder and jaw, profuse cold sweating, difficulty breathing. Started ~95 minutes ago.
              </p>
            </div>
          </div>

          {/* Key Vitals Display (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Vital 1: BP */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Blood Pressure</span>
                  <span className="material-symbols-outlined text-rose-600 text-lg">monitor_heart</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">168/104</span>
                  <span className="text-xs font-medium text-slate-500 block">mmHg</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 w-fit">
                  High
                </span>
              </div>

              {/* Vital 2: Pulse */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Pulse / Heart</span>
                  <span className="material-symbols-outlined text-amber-600 text-lg">favorite</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">112</span>
                  <span className="text-xs font-medium text-slate-500 block">bpm</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 w-fit">
                  Fast
                </span>
              </div>

              {/* Vital 3: SpO2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Oxygen SpO2</span>
                  <span className="material-symbols-outlined text-rose-600 text-lg">air</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">91%</span>
                  <span className="text-xs font-medium text-slate-500 block">Room Air</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 w-fit">
                  Low
                </span>
              </div>

              {/* Vital 4: Blood Sugar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Blood Sugar</span>
                  <span className="material-symbols-outlined text-amber-600 text-lg">bloodtype</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">210</span>
                  <span className="text-xs font-medium text-slate-500 block">mg/dL</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 w-fit">
                  Elevated
                </span>
              </div>

            </div>

            {/* Golden Hour Warning Strip */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900">
                <span className="material-symbols-outlined text-emerald-700 text-xl">timer</span>
                <span className="text-xs font-bold">Optimal Transfer Window (Golden Hour):</span>
                <span className="text-xs font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  54 mins remaining
                </span>
              </div>
              <span className="text-xs font-medium text-emerald-800">Oxygen Cylinder Ready on site</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Operational Modules: Voice Intake & Prescription Digitizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Module 1: Friendly Voice Dictation & Symptom Extraction (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* Card Header with Language Selector & Mic Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">mic</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Voice Symptom Intake</h3>
                  <p className="text-xs text-slate-500">Live AI Speech Recognition + Groq Whisper Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Vernacular Language Selector Dropdown & Modal Trigger */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <span className="text-base pl-1 shrink-0">{currentLanguage.flag}</span>
                  <select
                    value={currentLanguage.code}
                    onChange={(e) => {
                      const code = e.target.value;
                      setLanguage(code);
                      const sel = SUPPORTED_LANGUAGES.find(l => l.code === code);
                      if (sel) {
                        setMicStatus(`Voice intake language set to ${sel.nativeName} (${sel.name})`);
                        const presets = PRESETS_BY_LANGUAGE[sel.code] || PRESETS_BY_LANGUAGE['en'];
                        if (presets && presets[0]) {
                          setSpokenText(presets[0].text);
                        }
                      }
                    }}
                    className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1 py-0.5"
                    aria-label="Select voice and intake language"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={openLanguageModal}
                    title="Open all 12 Indian regional languages"
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white text-teal-800 border border-slate-200 shadow-2xs hover:bg-teal-50 cursor-pointer flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-xs">translate</span>
                    <span>More</span>
                  </button>
                </div>

                {isRecording ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                    Recording
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Mic Ready
                  </span>
                )}
              </div>
            </div>

            {/* Voice Dictation Interactive Strip */}
            <div className={`p-4 rounded-xl border transition space-y-3 ${
              isRecording ? 'bg-rose-50/40 border-rose-200 shadow-sm' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`w-13 h-13 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse hover:bg-rose-700 ring-4 ring-rose-200'
                        : 'bg-teal-700 text-white hover:bg-teal-800 hover:scale-105'
                    }`}
                    title={isRecording ? 'Click to stop recording' : 'Click to start speaking'}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {isRecording ? 'stop' : 'mic'}
                    </span>
                  </button>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      {isRecording ? 'Microphone Active — Speak Now' : 'Voice Assistant Ready'}
                    </span>
                    <span className={`text-xs ${isRecording ? 'text-rose-700 font-semibold' : 'text-slate-500'}`}>
                      {micStatus}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold ${
                  isRecording ? 'bg-rose-100 border-rose-300 text-rose-800 animate-pulse' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  {isRecording ? 'REC • LIVE' : 'STANDBY'}
                </span>
              </div>

              {/* Calm Animated Waveform Graphic */}
              <div className="h-8 w-full flex items-center justify-between gap-1 px-3 bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-500 animate-bounce h-5' : 'bg-teal-400 h-2'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-600 animate-pulse h-7' : 'bg-teal-600 h-4'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-700 animate-bounce h-6' : 'bg-teal-700 h-6'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-500 animate-pulse h-4' : 'bg-teal-500 h-3'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-700 animate-bounce h-7' : 'bg-teal-700 h-7'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-600 animate-pulse h-5' : 'bg-teal-500 h-4'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-700 animate-bounce h-6' : 'bg-teal-700 h-5'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-500 animate-pulse h-4' : 'bg-teal-600 h-6'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-600 animate-bounce h-7' : 'bg-teal-400 h-3'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-700 animate-pulse h-5' : 'bg-teal-700 h-7'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-500 animate-bounce h-6' : 'bg-teal-600 h-5'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-600 animate-pulse h-4' : 'bg-teal-500 h-4'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-700 animate-bounce h-7' : 'bg-teal-700 h-6'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-500 animate-pulse h-3' : 'bg-teal-600 h-3'}`}></div>
                <div className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-rose-600 animate-bounce h-5' : 'bg-teal-400 h-2'}`}></div>
              </div>
            </div>

            {/* Spoken Audio Transcript */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Spoken Audio Transcript
                </label>
                <button
                  type="button"
                  onClick={() => setSpokenText('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear text
                </button>
              </div>
              <textarea
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                rows={3}
                placeholder="Speak into microphone or select a symptom preset below..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed font-normal focus:outline-none focus:border-teal-700 focus:bg-white transition resize-none"
              />

              {/* Dynamic Instant Multilingual Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>{currentLanguage.flag}</span>
                  <span>{currentLanguage.nativeName} Presets:</span>
                </span>
                {(PRESETS_BY_LANGUAGE[currentLanguage.code] || PRESETS_BY_LANGUAGE['en']).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSpokenText(preset.text);
                      setMicStatus(`Loaded ${currentLanguage.name}: ${preset.label}`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      idx === 0 
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                        : idx === 1
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Identified Clinical Findings */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Identified Clinical Findings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-900">
                  <span className="material-symbols-outlined text-rose-600 text-xl shrink-0">emergency</span>
                  <div>
                    <span className="text-xs font-bold block">Suspected Heart Attack (STEMI)</span>
                    <span className="text-[11px] text-rose-700">Severe chest pain radiating to arm</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
                  <span className="material-symbols-outlined text-amber-600 text-xl shrink-0">air</span>
                  <div>
                    <span className="text-xs font-bold block">Low Oxygen Warning (91%)</span>
                    <span className="text-[11px] text-amber-800">Supportive Oxygen initiated in clinic</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-900 sm:col-span-2">
                  <span className="material-symbols-outlined text-emerald-600 text-xl shrink-0">medication</span>
                  <div>
                    <span className="text-xs font-bold block">First-Aid Given: Aspirin 300mg + Sorbitrate 5mg</span>
                    <span className="text-[11px] text-emerald-700">Given at 10:15 AM by ASHA • Confirmed recorded</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Micro-Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Protocol Matched: <strong className="text-teal-800 font-semibold">Tier-1 Cardiac Fast-Track</strong></span>
            <button
              onClick={handleRunTriage}
              disabled={loading}
              className="text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              {loading ? 'AI Analyzing...' : 'Re-analyze with Gemini'}
            </button>
          </div>
        </div>

        {/* Module 2: Prescription Slip Optical Scanner (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">document_scanner</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Doctor Prescription Slip</h3>
                  <p className="text-xs text-slate-500">Gemini Vision OCR Digitized</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                OCR Scanned
              </span>
            </div>

            {/* Scanned Slip Photo Card */}
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
              <img
                alt="Doctor prescription slip with scanned medicines"
                className="w-full h-44 object-cover"
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
              />
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 hover:bg-white text-xs font-bold shadow-md flex items-center gap-1 border border-slate-200 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  Upload Slip
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Scanned Medications List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Recognized Medicines from Slip
              </span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Tab. Clopidogrel 300mg</span>
                    <span className="text-[11px] text-slate-500">Blood thinner loading dose • Confirmed</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-600 text-lg">schedule</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Inj. Fondaparinux 2.5mg SC</span>
                    <span className="text-[11px] text-slate-500">Anticoagulant injection • Hospital will administer</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                  Reserved
                </span>
              </div>
            </div>

            {/* Pre-Ordered Tests Pill tags */}
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200">
              <span className="text-[11px] font-bold uppercase text-teal-900 block mb-1.5">
                Pre-Ordered Tests at Hospital:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded bg-white border border-teal-200 text-teal-800 text-xs font-semibold">
                  12-Lead ECG
                </span>
                <span className="px-2 py-1 rounded bg-white border border-teal-200 text-teal-800 text-xs font-semibold">
                  Cardiac Troponin-I
                </span>
                <span className="px-2 py-1 rounded bg-white border border-teal-200 text-teal-800 text-xs font-semibold">
                  Bedside 2D Echo
                </span>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Prescription digitized accurately</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span> Verified by ASHA
            </span>
          </div>
        </div>

      </div>

      {/* Module 3: 'One-Trip Care Bundle' Package Card (Clean Daylight Medical Card) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">bookmark_added</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                One-Trip Care Package (Pre-Arrival Token)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                TOKEN #OTB-8834
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              All 4 critical hospital resources are pre-locked so the patient receives immediate treatment upon arrival with zero waiting time.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">verified</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-900">All 4 Care Nodes Verified</span>
              <span className="text-[11px] text-emerald-700">District Trauma Center Ready</span>
            </div>
          </div>
        </div>

        {/* 4 Step-by-Step Verified Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 1: Specialist */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">1. Cardiologist</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">check</span> Reserved
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Dr. Vikram Sen</h4>
              <p className="text-xs text-teal-700 font-semibold">Chief Cardiologist on Duty</p>
              <p className="text-[11px] text-slate-500 mt-1">Cath Lab Standby for 11:45 AM</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">notifications_active</span> Patient profile sent to doctor
            </div>
          </div>

          {/* Step 2: Diagnostics */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">2. Rapid Lab Slot</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">check</span> Ready
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Lab Bay C-04</h4>
              <p className="text-xs text-teal-700 font-semibold">ECG & Troponin-I Kit</p>
              <p className="text-[11px] text-slate-500 mt-1">Pre-calibrated testing kit ready</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> 0-minute test queue
            </div>
          </div>

          {/* Step 3: Bed */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">3. Emergency Bed</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">check</span> Locked
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">CCU Bed #07 (Tower B)</h4>
              <p className="text-xs text-teal-700 font-semibold">Equipped with Oxygen & NIV</p>
              <p className="text-[11px] text-slate-500 mt-1">Reserved for next 2 hours</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">lock</span> Guaranteed admission
            </div>
          </div>

          {/* Step 4: Ambulance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">4. Ambulance (ALS)</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">near_me</span> En Route
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ambulance #KA-04-E-108</h4>
              <p className="text-xs text-teal-700 font-semibold">Paramedic: Devraj Singh</p>
              <p className="text-[11px] text-slate-500 mt-1">Reaching Rampur in 7 minutes</p>
            </div>
            <div className="text-[11px] font-medium text-teal-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">cell_tower</span> Live GPS tracking active
            </div>
          </div>

        </div>

        {/* Green Corridor Route Strip */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">route</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Green Corridor Clearance Active</h4>
              <p className="text-xs text-slate-500">Highway NH-48 toll gate alerted for priority ambulance pass</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
            <span>Rampur Sub-Center</span>
            <span className="material-symbols-outlined text-teal-600 text-sm">arrow_forward</span>
            <span>Toll Plaza 4</span>
            <span className="material-symbols-outlined text-teal-600 text-sm">arrow_forward</span>
            <span className="text-teal-800 font-bold">District Trauma Hospital</span>
            <span className="px-2 py-1 rounded bg-teal-100 text-teal-900 font-bold ml-2">~32 mins transit</span>
          </div>
        </div>

        {/* Primary Dispatch Action & Support Banner */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-emerald-600 text-lg">verified_user</span>
            <span>Government Cashless Treatment (Ayushman Bharat / PM-JAY Covered)</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print Slip
            </button>
            <button
              onClick={handleConfirmAndDispatch}
              disabled={dispatched}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                dispatched
                  ? 'bg-emerald-700 text-white'
                  : 'bg-teal-700 hover:bg-teal-800 active:scale-95 text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">
                {dispatched ? 'check_circle' : 'ambulance'}
              </span>
              <span>
                {dispatched
                  ? 'Dispatched! Proceeding to Live Tracking...'
                  : 'Confirm Readiness & Dispatch Ambulance'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Quick Rural Safety Context Footnote Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <span className="material-symbols-outlined text-lg">sms</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Family Notified via SMS</span>
            <span className="text-[11px] text-slate-500">Saroj Gurjar (Wife) • +91 98210-XXXXX</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-lg">health_and_safety</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">100% Cashless Transfer</span>
            <span className="text-[11px] text-slate-500">Ayushman Card #PMJAY-6632 Pre-cleared</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <span className="material-symbols-outlined text-lg">schedule</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Estimated Arrival Window</span>
            <span className="text-[11px] text-slate-500">Expected at Cath Lab by 11:42 AM</span>
          </div>
        </div>
      </div>

    </div>
  );
};
