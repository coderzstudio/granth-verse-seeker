
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, RotateCcw } from 'lucide-react';
import NaamJaapSettings from '@/components/NaamJaapSettings';

const NaamJaap = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isTargetReached, setIsTargetReached] = useState(false);

  useEffect(() => {
    if (target && count >= target) {
      setIsTargetReached(true);
    } else {
      setIsTargetReached(false);
    }
  }, [count, target]);

  const incrementCount = () => {
    if (!isTargetReached) {
      setCount(prev => prev + 1);
    }
  };

  const resetCounter = () => {
    setCount(0);
    setIsTargetReached(false);
  };

  const handleTargetChange = (newTarget: number | null) => {
    setTarget(newTarget);
    setIsTargetReached(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50 relative overflow-hidden">
      <Navbar />
      
      {/* Subtle Om Symbol Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="text-9xl font-serif text-orange-600">ॐ</div>
      </div>

      {/* Mandala Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          background: 'radial-gradient(circle, transparent, rgba(254, 215, 170, 0.5), transparent)'
        }}></div>
      </div>

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              नाम जप
            </h1>
            <p className="text-lg text-gray-600 font-medium">Naam Jaap Counter</p>
            {target && (
              <p className="text-sm text-orange-600 mt-2">Target: {target}</p>
            )}
          </div>

          {/* Main Counter Card */}
          <Card className={`mb-8 border-2 transition-all duration-300 ${
            isTargetReached 
              ? 'border-amber-400 shadow-2xl shadow-amber-200/50 animate-pulse' 
              : 'border-orange-200 shadow-xl'
          }`}>
            <CardContent className="p-12">
              {/* Counter Display */}
              <div className="mb-8">
                <div className={`text-8xl font-bold transition-all duration-300 ${
                  isTargetReached 
                    ? 'text-amber-600 drop-shadow-lg' 
                    : 'text-orange-600'
                }`}>
                  {count.toLocaleString()}
                </div>
                {isTargetReached && (
                  <div className="mt-4 text-xl text-amber-600 font-semibold animate-fade-in">
                    🎉 Target Achieved! 🎉
                  </div>
                )}
              </div>

              {/* Increment Button */}
              <div className="mb-8">
                <Button
                  onClick={incrementCount}
                  disabled={isTargetReached}
                  className={`w-32 h-32 rounded-full text-2xl font-bold transition-all duration-200 ${
                    isTargetReached
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                  }`}
                >
                  {isTargetReached ? '✓' : '+1'}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={resetCounter}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Spiritual Quote */}
          <div className="text-center opacity-75">
            <p className="text-sm text-gray-600 italic font-medium">
              "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।<br />
              हरे राम हरे राम राम राम हरे हरे॥"
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <NaamJaapSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentTarget={target}
        onTargetChange={handleTargetChange}
      />
    </div>
  );
};

export default NaamJaap;
