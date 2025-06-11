
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NaamJaapSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: number | null;
  onTargetChange: (target: number | null) => void;
}

const NaamJaapSettings: React.FC<NaamJaapSettingsProps> = ({
  isOpen,
  onClose,
  currentTarget,
  onTargetChange
}) => {
  const [customTarget, setCustomTarget] = useState<string>('');

  const handlePresetTarget = (target: number) => {
    onTargetChange(target);
    onClose();
  };

  const handleCustomTarget = () => {
    const target = parseInt(customTarget);
    if (target > 0) {
      onTargetChange(target);
      onClose();
    }
  };

  const handleNoTarget = () => {
    onTargetChange(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-orange-600">
            Set Jaap Target
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Preset Targets */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Traditional Counts
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handlePresetTarget(21)}
                variant={currentTarget === 21 ? "default" : "outline"}
                className="h-12 text-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              >
                21
              </Button>
              <Button
                onClick={() => handlePresetTarget(108)}
                variant={currentTarget === 108 ? "default" : "outline"}
                className="h-12 text-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              >
                108
              </Button>
            </div>
          </div>

          {/* Custom Target */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Custom Target
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter custom count"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                className="flex-1"
                min="1"
              />
              <Button
                onClick={handleCustomTarget}
                disabled={!customTarget || parseInt(customTarget) <= 0}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Set
              </Button>
            </div>
          </div>

          {/* No Target Option */}
          <div>
            <Button
              onClick={handleNoTarget}
              variant="outline"
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              No Target (Continuous Count)
            </Button>
          </div>

          {/* Current Setting Display */}
          {currentTarget && (
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700">
                Current Target: <span className="font-bold">{currentTarget}</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NaamJaapSettings;
