import React, { useState, useEffect, useCallback } from 'react';
import { ProductionData, AppStep, INITIAL_DATA } from './types';
import { StepIndicator } from './components/StepIndicator';
import { Step1Setup } from './components/Step1Setup';
import { Step2Order } from './components/Step2Order';
import { Step3Timer } from './components/Step3Timer';
import { Step4Summary } from './components/Step4Summary';
import { Step5Success } from './components/Step5Success';
import { saveCurrentState, getCurrentState, clearCurrentState } from './services/dbService';
import { AlertCircle, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SETUP);
  const [data, setData] = useState<ProductionData>(INITIAL_DATA);
  const [isRestored, setIsRestored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      const savedState = await getCurrentState();
      if (savedState) {
        // Only restore if we are past the first step or have meaningful data
        if (savedState.step > 1 || (savedState.data.operador && savedState.data.maquina)) {
          setData(savedState.data);
          setStep(savedState.step);
          setIsRestored(true);
        }
      }
      setIsLoading(false);
    };
    loadState();
  }, []);

  // Save state on change
  useEffect(() => {
    if (!isLoading && step !== AppStep.SUCCESS) {
      saveCurrentState({ step, data, isRestored: false });
    }
  }, [step, data, isLoading]);

  const updateData = useCallback((updates: Partial<ProductionData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleReset = async () => {
    await clearCurrentState();
    setData(INITIAL_DATA);
    setStep(AppStep.SETUP);
    setIsRestored(false);
  };

  const handleDiscardSession = async () => {
    await handleReset();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 md:p-8 relative">
        
        {/* Restore Banner */}
        {isRestored && (
          <div className="absolute -top-16 left-0 right-0 mx-auto w-full max-w-md bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm flex items-start justify-between">
             <div className="flex gap-3">
               <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
               <div>
                 <p className="text-sm font-semibold text-amber-800">Sessão Restaurada</p>
                 <p className="text-xs text-amber-700">Recuperamos onde você parou.</p>
               </div>
             </div>
             <button 
                onClick={handleDiscardSession}
                className="text-xs font-medium text-amber-600 hover:text-amber-800 underline flex items-center gap-1"
             >
                <RotateCcw className="w-3 h-3" /> Descartar
             </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Registro de Produção</h1>
          <p className="text-sm text-gray-400 mt-1">Apontamento Digital</p>
        </div>

        {/* Progress */}
        <StepIndicator currentStep={step} />

        {/* Steps */}
        <div className="mt-4">
          {step === AppStep.SETUP && (
            <Step1Setup 
              data={data} 
              updateData={updateData} 
              onNext={() => setStep(AppStep.ORDER)} 
            />
          )}
          
          {step === AppStep.ORDER && (
            <Step2Order 
              data={data} 
              updateData={updateData} 
              onNext={() => setStep(AppStep.TIMER)}
              onBack={() => setStep(AppStep.SETUP)}
            />
          )}

          {step === AppStep.TIMER && (
            <Step3Timer 
              data={data} 
              updateData={updateData} 
              onNext={() => setStep(AppStep.SUMMARY)} 
            />
          )}

          {step === AppStep.SUMMARY && (
            <Step4Summary 
              data={data} 
              updateData={updateData} 
              onNext={() => setStep(AppStep.SUCCESS)}
              onBack={() => setStep(AppStep.TIMER)}
            />
          )}

          {step === AppStep.SUCCESS && (
            <Step5Success onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;