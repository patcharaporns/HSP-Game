import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from './services/geminiService';
import { Question, FlowerType, GameState, PlantedFlower } from './types';
import { FLOWERS } from './constants';
import { Garden } from './components/Garden';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [selectedFlower, setSelectedFlower] = useState<FlowerType>('sunflower');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [plantedFlowers, setPlantedFlowers] = useState<PlantedFlower[]>([]);
  const [score, setScore] = useState(0);
  const [isPlanting, setIsPlanting] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = async () => {
    setIsLoading(true);
    setGameState('loading');
    
    const fetchedQuestions = await generateQuizQuestions();
    setQuestions(fetchedQuestions);
    setScore(0);
    setPlantedFlowers([]);
    setCurrentQuestionIndex(0);
    
    setIsLoading(false);
    setGameState('playing');
  };

  const handleAnswer = (optionIndex: number) => {
    if (feedback) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;

    setFeedback({
      isCorrect,
      text: isCorrect ? "ถูกต้องครับ! ต้นไม้ของคุณกำลังเติบโต!" : `ยังไม่ใช่นะครับ! คำตอบที่ถูกคือ: ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`
    });

    if (isCorrect) {
      setIsPlanting(true);
      setScore(prev => prev + 1);
      
      const newFlower: PlantedFlower = {
        id: Date.now(),
        type: selectedFlower,
        x: Math.random() * 80 + 10, // Keep away from extreme edges (10-90%)
        y: Math.random() * 80 + 10  // Keep away from extreme edges (10-90%)
      };
      
      setTimeout(() => {
        setPlantedFlowers(prev => [...prev, newFlower]);
      }, 500);
    }
  };

  const handleNextQuestion = () => {
    setIsPlanting(false);
    setFeedback(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('completed');
    }
  };

  // --- SCREENS ---

  const renderSetup = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in text-center relative z-10">
      <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[3rem] border-4 border-white shadow-2xl max-w-5xl w-full">
        <h1 className="text-5xl md:text-7xl text-green-600 mb-2 drop-shadow-md font-disney stroke-white">
          🌿 Ethics Garden 🌸
        </h1>
        <p className="text-xl text-green-800 mb-10 font-bold bg-white/60 inline-block px-6 py-2 rounded-full shadow-sm">
          เกมทดสอบความรู้จริยธรรมการวิจัย
        </p>
        
        <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl w-full border-4 border-green-100">
          <h2 className="text-3xl font-disney text-gray-700 mb-8">
            เลือกเมล็ดพันธุ์ของคุณ
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {FLOWERS.map((flower) => (
              <button
                key={flower.id}
                onClick={() => setSelectedFlower(flower.id)}
                className={`
                  relative p-6 rounded-3xl transition-all duration-300 border-b-8 group
                  ${selectedFlower === flower.id 
                    ? 'bg-green-100 border-green-400 -translate-y-2 shadow-xl ring-4 ring-green-300' 
                    : 'bg-white border-gray-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg'}
                `}
              >
                <div className="text-6xl mb-4 transform transition-transform group-hover:scale-110 drop-shadow-md">{flower.emoji}</div>
                <div className="font-bold text-gray-700 font-disney text-lg">{flower.name}</div>
                {selectedFlower === flower.id && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-lg animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-blue-50/80 rounded-3xl p-6 mb-8 border-2 border-blue-100 text-left relative overflow-hidden">
             <div className="absolute -right-4 -top-4 text-8xl opacity-10 rotate-12">📜</div>
             <h3 className="font-disney text-2xl text-blue-600 mb-3">ภารกิจของคุณ:</h3>
             <ul className="space-y-3 text-blue-800 font-medium text-lg">
               <li className="flex items-center"><span className="mr-2">🎯</span> ตอบคำถาม 15 ข้อ ให้ถูกต้อง</li>
               <li className="flex items-center"><span className="mr-2">🌱</span> 1 คะแนน = ต้นไม้ 1 ต้น</li>
               <li className="flex items-center"><span className="mr-2">✨</span> สร้างสวนที่สวยที่สุดในโลก!</li>
             </ul>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full md:w-auto px-16 py-5 bg-gradient-to-b from-green-400 to-green-600 text-white text-2xl font-disney rounded-full shadow-[0_10px_20px_rgba(34,197,94,0.4)] border-b-[6px] border-green-800 btn-disney hover:brightness-110"
          >
            เริ่มปลูกต้นไม้เลย! 🚀
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
      <div className="bg-white/90 p-12 rounded-[3rem] shadow-2xl text-center border-4 border-green-200 animate-pulse">
        <div className="text-8xl mb-6 animate-bounce">🧑‍🌾</div>
        <h2 className="text-3xl font-disney text-green-600 mb-2">กำลังเตรียมแปลงปลูก...</h2>
        <p className="text-gray-500 font-bold">รอสักครู่นะครับ AI กำลังคัดเลือกคำถาม...</p>
      </div>
    </div>
  );

  const renderPlaying = () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return <div>Error loading question</div>;

    return (
      <div className="min-h-screen p-4 flex flex-col items-center max-w-6xl mx-auto relative z-10 pt-8">
        
        {/* Header Bar */}
        <div className="w-full flex justify-between items-center mb-6 px-8 py-4 bg-white/90 backdrop-blur rounded-full shadow-lg border-b-4 border-gray-200">
          <div className="flex items-center space-x-3 bg-green-100 px-4 py-1 rounded-full border border-green-200">
            <span className="text-3xl">🌻</span>
            <span className="font-disney text-green-700 text-2xl">
              {plantedFlowers.length}
            </span>
          </div>
          <div className="font-disney text-xl text-gray-500 bg-gray-100 px-6 py-2 rounded-full">
            ข้อที่ <span className="text-blue-500 text-2xl">{currentQuestionIndex + 1}</span> / {questions.length}
          </div>
        </div>

        {/* Garden Visualizer */}
        <div className="w-full mb-8 transform transition-all duration-500 hover:scale-[1.01]">
          <Garden 
            plantedFlowers={plantedFlowers} 
            selectedFlowerType={selectedFlower}
            isPlanting={isPlanting}
          />
        </div>

        {/* Question Card */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 md:p-10 relative overflow-hidden border-4 border-white ring-4 ring-black/5">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 leading-relaxed font-fredoka">
            {currentQ.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentQ.options.map((option, idx) => {
              // Styling logic for feedback state
              let btnClass = "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300";
              if (feedback) {
                if (idx === currentQ.correctAnswerIndex) {
                   btnClass = "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-200 scale-[1.02] shadow-md";
                } else if (idx === feedback && !feedback.isCorrect) { // This assumes logic handled visually as we don't store selected index in state for simplicity, but we can infer or just grey out
                   btnClass = "bg-gray-50 border-gray-200 opacity-50"; 
                } else {
                   btnClass = "bg-gray-50 border-gray-100 opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`
                    p-5 rounded-2xl text-left transition-all duration-200 border-b-[6px] border-2 font-bold text-lg relative
                    btn-disney ${btnClass}
                  `}
                >
                  <div className="flex items-center">
                    <span className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl shadow-inner
                      ${feedback && idx === currentQ.correctAnswerIndex ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}
                    `}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback Modal / Overlay */}
          {feedback && (
            <div className={`mt-8 p-6 rounded-3xl animate-pop-in relative overflow-hidden ${feedback.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              {/* Confetti or Warning Background Effect */}
              <div className="absolute -right-10 -bottom-10 text-9xl opacity-10 rotate-12">
                {feedback.isCorrect ? '🎉' : '⚠️'}
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                <div className={`text-6xl md:text-7xl ${feedback.isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
                  {feedback.isCorrect ? '🌟' : '😅'}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className={`text-3xl font-disney mb-2 ${feedback.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {feedback.isCorrect ? 'ถูกต้องนะคร้าบ!' : 'โอ๊ะโอ.. ผิดพลาดเล็กน้อย'}
                  </h3>
                  <p className="text-xl text-gray-700 font-bold mb-3">{feedback.text}</p>
                  <div className="bg-white/60 p-4 rounded-xl border border-gray-200">
                    <p className="text-md text-gray-600">
                      <span className="font-bold mr-2">💡 ความรู้เพิ่มเติม:</span> 
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center md:justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-disney rounded-full shadow-xl border-b-[6px] border-blue-800 btn-disney hover:brightness-110 flex items-center gap-3"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'ไปข้อต่อไป ➡️' : 'สรุปผลคะแนน 🏆'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCompleted = () => (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center animate-fade-in relative z-10">
      <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 max-w-5xl w-full text-center border-8 border-yellow-300 relative overflow-hidden">
        {/* Background Confetti Static */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFD700 20%, transparent 20%)', backgroundSize: '30px 30px' }}></div>
        
        <h1 className="text-5xl md:text-6xl font-disney text-green-600 mb-2 drop-shadow-sm">
          🎉 ยินดีด้วยครับ!
        </h1>
        <h2 className="text-2xl text-gray-600 mb-8 font-bold">
          คุณสร้างสวนจริยธรรมที่สวยงามมาก
        </h2>

        <div className="flex justify-center items-center gap-6 mb-8">
           <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-gray-200">
             <span className="block text-gray-500 text-lg font-bold">คะแนนรวม</span>
             <span className="block text-6xl font-disney text-blue-500">{score}</span>
             <span className="block text-gray-400">/ {questions.length}</span>
           </div>
           <div className="text-8xl animate-bounce">
             {score > 10 ? '🏆' : score > 5 ? '🎖️' : '🌱'}
           </div>
        </div>

        <div className="mb-10 transform hover:scale-105 transition-transform duration-500 border-4 border-white rounded-[2.2rem] shadow-lg">
          <Garden 
            plantedFlowers={plantedFlowers} 
            selectedFlowerType={selectedFlower} 
            isPlanting={false}
          />
        </div>

        <button
          onClick={() => {
            setGameState('setup');
            setScore(0);
            setPlantedFlowers([]);
            setCurrentQuestionIndex(0);
            setFeedback(null);
          }}
          className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-disney rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.4)] border-b-[6px] border-purple-800 btn-disney hover:brightness-110"
        >
          เล่นใหม่อีกครั้ง 🔄
        </button>
      </div>
    </div>
  );

  return (
    <div className="garden-bg min-h-screen text-gray-800 selection:bg-green-200 font-nunito overflow-x-hidden">
       {/* Global Background Particles / Magic */}
       <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
       </div>

      {gameState === 'setup' && renderSetup()}
      {gameState === 'loading' && renderLoading()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'completed' && renderCompleted()}
    </div>
  );
};

export default App;
