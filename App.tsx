
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, ClipboardCheck, History, User, ChevronRight, X, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { ConstitutionType, AIAnalysisResult, ScoreMap } from './types';
import { CONSTITUTIONS, QUESTIONS } from './constants';
import { analyzeFace } from './geminiService';

// --- Sub-components ---

const Header = () => (
  <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="bg-emerald-600 p-2 rounded-lg">
        <Sparkles className="text-white w-5 h-5" />
      </div>
      <h1 className="text-xl font-bold text-gray-800 serif-font tracking-wider">中医体质智辩</h1>
    </div>
    <div className="flex gap-4">
      <User className="text-gray-400 w-6 h-6" />
    </div>
  </header>
);

const Banner = () => (
  <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-700 h-48 flex items-center px-8 text-white">
    <div className="z-10 max-w-xs">
      <h2 className="text-2xl font-bold mb-2 serif-font">寻源生命，智辩体质</h2>
      <p className="text-emerald-100 text-sm opacity-90 leading-relaxed">基于AI面部识别与中华中医药学会标准，为您量身定制健康调养方案。</p>
    </div>
    <div className="absolute -right-4 -bottom-8 opacity-20 transform rotate-12">
      <Sparkles size={180} />
    </div>
  </div>
);

// --- Main Views ---

export default function App() {
  const [view, setView] = useState<'home' | 'camera' | 'questionnaire' | 'result'>('home');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [testResult, setTestResult] = useState<ConstitutionType | null>(null);
  const [scores, setScores] = useState<ScoreMap>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize scores
  useEffect(() => {
    const initialScores: ScoreMap = {};
    Object.values(ConstitutionType).forEach(type => {
      initialScores[type] = 0;
    });
    setScores(initialScores);
  }, []);

  // --- Handlers ---

  const startCamera = async () => {
    setView('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("无法访问摄像头，请检查权限。");
      setView('home');
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setLoading(true);
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageBase64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
      
      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());

      try {
        const result = await analyzeFace(imageBase64);
        setAiResult(result);
        setView('result');
      } catch (err) {
        alert("识别失败：" + (err as Error).message);
        setView('home');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnswer = (val: number) => {
    const question = QUESTIONS[currentQuestionIdx];
    const newScores = { ...scores, [question.category]: (scores[question.category] || 0) + val };
    setScores(newScores);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate final result from questionnaire
      let topType = ConstitutionType.PEACEFUL;
      let maxScore = -1;
      
      // Fix: Cast the results of Object.entries to ensure 'score' is treated as a number
      (Object.entries(newScores) as [string, number][]).forEach(([type, score]) => {
        if (score > maxScore) {
          maxScore = score;
          topType = type as ConstitutionType;
        }
      });
      
      setTestResult(topType);
      setView('result');
    }
  };

  const reset = () => {
    setView('home');
    setAiResult(null);
    setTestResult(null);
    setCurrentQuestionIdx(0);
    const initialScores: ScoreMap = {};
    Object.values(ConstitutionType).forEach(type => initialScores[type] = 0);
    setScores(initialScores);
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="flex flex-col gap-6 p-6 animate-fadeIn">
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={startCamera}
          className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center gap-3 transition-transform active:scale-95 shadow-sm"
        >
          <div className="bg-emerald-600 p-3 rounded-full">
            <Camera className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-emerald-900 serif-font">AI 拍照测算</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full">秒出结果</span>
        </button>
        
        <button 
          onClick={() => setView('questionnaire')}
          className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center gap-3 transition-transform active:scale-95 shadow-sm"
        >
          <div className="bg-orange-500 p-3 rounded-full">
            <ClipboardCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-orange-900 serif-font">标准量表自测</span>
          <span className="text-[10px] text-orange-600 bg-orange-100/50 px-2 py-0.5 rounded-full">权威标准</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            最近记录
          </h3>
          <span className="text-xs text-gray-400">查看全部</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <div className="text-sm font-medium text-gray-700">平和质 (AI 识别)</div>
              <div className="text-[11px] text-gray-400">2023-10-24 14:30</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <div className="text-sm font-medium text-gray-700">气虚质 (问卷自测)</div>
              <div className="text-[11px] text-gray-400">2023-10-20 09:15</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-emerald-900/5 rounded-2xl p-5">
        <h4 className="text-emerald-900 font-bold mb-2 flex items-center gap-2">💡 科普小常识</h4>
        <p className="text-emerald-800/70 text-sm leading-relaxed">
          中医体质分为九种，每个人可能不仅包含一种体质，往往是多重体质兼夹。通过调节饮食和作息，体质是可以转化的。
        </p>
      </div>
    </div>
  );

  const renderCamera = () => (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="relative flex-1 overflow-hidden bg-gray-900">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 pointer-events-none border-[40px] border-black/30">
          <div className="w-full h-full border-2 border-white/50 rounded-3xl relative">
             <div className="absolute inset-0 border-[2px] border-dashed border-emerald-400/50 m-12 rounded-full"></div>
             <p className="absolute bottom-10 left-0 right-0 text-center text-white/80 text-sm">请将面部对准圆框</p>
          </div>
        </div>
        <button 
          onClick={() => setView('home')}
          className="absolute top-6 left-6 p-2 bg-black/40 rounded-full text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="bg-black py-10 flex justify-center items-center gap-10">
        <div className="w-16 h-16 rounded-full border-4 border-white/30 p-1">
          <button 
            onClick={captureAndAnalyze}
            disabled={loading}
            className="w-full h-full bg-white rounded-full transition-transform active:scale-90 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /> : null}
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const renderQuestionnaire = () => {
    const progress = Math.round(((currentQuestionIdx + 1) / QUESTIONS.length) * 100);
    const q = QUESTIONS[currentQuestionIdx];

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6 animate-slideIn">
        <div className="mb-8">
          <button onClick={() => setView('home')} className="flex items-center gap-1 text-gray-500 mb-6">
            <ArrowLeft size={18} /> 返回主页
          </button>
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-xl font-bold text-gray-800 serif-font">体质自测</h3>
             <span className="text-emerald-600 font-medium">{currentQuestionIdx + 1} / {QUESTIONS.length}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm flex-1 flex flex-col justify-center gap-10 mb-20">
          <h2 className="text-2xl font-bold text-gray-800 text-center leading-relaxed serif-font">
            {q.text}
          </h2>
          
          <div className="flex flex-col gap-4">
            {[
              { label: '没有', val: 1 },
              { label: '很少', val: 2 },
              { label: '有时', val: 3 },
              { label: '经常', val: 4 },
              { label: '总是', val: 5 }
            ].map(btn => (
              <button
                key={btn.label}
                onClick={() => handleAnswer(btn.val)}
                className="w-full py-4 px-6 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 font-medium transition-all active:scale-98 text-lg"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const finalType = aiResult?.constitution || testResult || ConstitutionType.PEACEFUL;
    const detail = CONSTITUTIONS[finalType];

    return (
      <div className="flex flex-col min-h-screen bg-[#f8f5f0] animate-fadeIn">
        <div className="bg-emerald-800 text-white p-8 pt-12 rounded-b-[40px] relative overflow-hidden">
          <button onClick={reset} className="absolute top-6 left-6 p-2 bg-white/10 rounded-full">
            <X size={20} />
          </button>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-md">
              <Sparkles className="w-10 h-10 text-emerald-200" />
            </div>
            <div className="text-center">
              <p className="text-emerald-200 text-sm mb-1">{aiResult ? 'AI 智能辨识结果' : '问卷自测结果'}</p>
              <h2 className="text-4xl font-bold serif-font">{finalType}</h2>
            </div>
          </div>
          
          {aiResult && (
            <div className="mt-6 bg-white/10 rounded-2xl p-4 text-xs backdrop-blur-sm border border-white/5">
              <p className="opacity-80 leading-relaxed"><span className="font-bold">面部特征：</span>{aiResult.keyFeatures.join('、')}</p>
              <p className="mt-2 opacity-80 leading-relaxed"><span className="font-bold">专家点评：</span>{aiResult.reasoning}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-8 flex flex-col gap-8">
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
              体质特点
            </h3>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100/30">
              <p className="text-gray-600 leading-relaxed mb-4">{detail.description}</p>
              <div className="flex flex-wrap gap-2">
                {detail.features.map(f => (
                  <span key={f} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">{f}</span>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
              调养建议
            </h3>
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100/30 flex gap-4">
                <div className="bg-orange-50 p-3 rounded-xl h-fit">
                  <span className="text-xl">🥗</span>
                </div>
                <div>
                  <h4 className="font-bold text-orange-900 mb-1">饮食调养</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{detail.diet}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100/30 flex gap-4">
                <div className="bg-blue-50 p-3 rounded-xl h-fit">
                  <span className="text-xl">🧘‍♂️</span>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">运动调教</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{detail.exercise}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100/30 flex gap-4">
                <div className="bg-purple-50 p-3 rounded-xl h-fit">
                  <span className="text-xl">🧠</span>
                </div>
                <div>
                  <h4 className="font-bold text-purple-900 mb-1">情志调节</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{detail.emotion}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex gap-4">
            <button 
              onClick={reset}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/20 transition-transform active:scale-95"
            >
              完成诊断
            </button>
            <button 
              className="px-6 border border-emerald-600 text-emerald-600 rounded-2xl font-bold transition-transform active:scale-95"
              onClick={() => window.print()}
            >
              保存报告
            </button>
          </div>
          
          <p className="text-[10px] text-gray-400 text-center px-4">
            免责声明：本工具仅供健康自测参考，不能替代专业医疗诊断。如有不适请及时前往医疗机构就诊。
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-gray-50 overflow-x-hidden">
      {view === 'home' && (
        <>
          <Header />
          <Banner />
          {renderHome()}
        </>
      )}
      {view === 'camera' && renderCamera()}
      {view === 'questionnaire' && renderQuestionnaire()}
      {view === 'result' && renderResult()}
      
      {loading && view !== 'camera' && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-emerald-900 font-medium animate-pulse">正在进行AI望诊...</p>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
