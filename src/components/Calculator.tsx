import React, { useState, useEffect, useCallback } from 'react';
import { Calculator as CalcIcon, History as HistoryIcon, Sun, Moon, Copy, Trash2, Palette, RotateCcw } from 'lucide-react';
import Display from './Display';
import Button from './Button';
import History from './History';
import UnitConverter from './UnitConverter';
import { evaluate, formatNumber } from '../utils/calculator';

export interface CalculatorHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface CalculatorMemory {
  value: number;
}

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<CalculatorHistory[]>([]);
  const [memory, setMemory] = useState<CalculatorMemory>({ value: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isScientific, setIsScientific] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isNewNumber, setIsNewNumber] = useState(true);

  const themes = {
    default: 'from-blue-600 to-purple-600',
    sunset: 'from-orange-500 to-pink-500',
    ocean: 'from-cyan-500 to-blue-500',
    forest: 'from-green-500 to-teal-500',
    royal: 'from-purple-600 to-indigo-600',
  };

  const themeNames = {
    default: 'Ocean Blue',
    sunset: 'Sunset Orange',
    ocean: 'Deep Ocean',
    forest: 'Forest Green',
    royal: 'Royal Purple',
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      if (key >= '0' && key <= '9') {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === '.') {
        handleDecimal();
      } else if (key === '(' || key === ')') {
        handleParentheses(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [expression, display]);

  const handleNumber = useCallback((num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setExpression(num);
      setIsNewNumber(false);
    } else {
      setDisplay(prev => prev === '0' ? num : prev + num);
      setExpression(prev => prev + num);
    }
  }, [isNewNumber]);

  const handleOperator = useCallback((op: string) => {
    setExpression(prev => prev + ` ${op} `);
    setIsNewNumber(true);
  }, []);

  const handleEquals = useCallback(() => {
    try {
      const result = evaluate(expression);
      const formattedResult = formatNumber(result);
      
      const historyItem: CalculatorHistory = {
        id: Date.now().toString(),
        expression,
        result: formattedResult,
        timestamp: new Date(),
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 99)]);
      setDisplay(formattedResult);
      setExpression(formattedResult);
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  }, [expression]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setIsNewNumber(true);
  }, []);

  const handleBackspace = useCallback(() => {
    if (expression.length <= 1) {
      handleClear();
    } else {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      setDisplay(newExpression.split(/[\+\-\*\/]/).pop() || '0');
    }
  }, [expression, handleClear]);

  const handleDecimal = useCallback(() => {
    const lastNumber = expression.split(/[\+\-\*\/]/).pop() || '';
    if (!lastNumber.includes('.')) {
      const newValue = isNewNumber ? '0.' : expression + '.';
      setExpression(newValue);
      setDisplay(newValue.split(/[\+\-\*\/]/).pop() || '0.');
      setIsNewNumber(false);
    }
  }, [expression, isNewNumber]);

  const handleParentheses = useCallback((paren: string) => {
    setExpression(prev => prev + paren);
    setIsNewNumber(paren === '(');
  }, []);

  const handleFunction = useCallback((func: string) => {
    try {
      let result: number;
      const currentValue = parseFloat(display) || 0;
      
      switch (func) {
        case 'sin':
          result = Math.sin(currentValue * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(currentValue * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(currentValue * Math.PI / 180);
          break;
        case 'log':
          result = Math.log10(currentValue);
          break;
        case 'ln':
          result = Math.log(currentValue);
          break;
        case 'sqrt':
          result = Math.sqrt(currentValue);
          break;
        case 'square':
          result = currentValue * currentValue;
          break;
        case 'inverse':
          result = 1 / currentValue;
          break;
        case 'factorial':
          result = factorial(Math.floor(currentValue));
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          return;
      }
      
      const formattedResult = formatNumber(result);
      setDisplay(formattedResult);
      setExpression(formattedResult);
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  }, [display]);

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const handleMemory = useCallback((action: string) => {
    const currentValue = parseFloat(display) || 0;
    
    switch (action) {
      case 'MS':
        setMemory({ value: currentValue });
        break;
      case 'MR':
        setDisplay(formatNumber(memory.value));
        setExpression(formatNumber(memory.value));
        setIsNewNumber(true);
        break;
      case 'M+':
        setMemory(prev => ({ value: prev.value + currentValue }));
        break;
      case 'M-':
        setMemory(prev => ({ value: prev.value - currentValue }));
        break;
      case 'MC':
        setMemory({ value: 0 });
        break;
    }
  }, [display, memory.value]);

  const handlePercentage = useCallback(() => {
    const currentValue = parseFloat(display) || 0;
    const result = currentValue / 100;
    const formattedResult = formatNumber(result);
    setDisplay(formattedResult);
    setExpression(prev => prev.replace(/[\d.]+$/, formattedResult));
  }, [display]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme as keyof typeof themes]} ${isDarkMode ? 'from-gray-900 to-gray-800' : ''} p-2 sm:p-4 transition-all duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <CalcIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">ProCalc</h1>
              <p className="text-white/70 text-sm sm:text-base">Professional Calculator</p>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowConverter(!showConverter)}
              className={`w-12 h-12 flex items-center justify-center ${showConverter ? 'bg-white/30' : 'bg-white/20'} backdrop-blur-sm text-white rounded-2xl hover:bg-white/40 transition-all duration-200 border border-white/10`}
              title="Unit Converter"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`w-12 h-12 flex items-center justify-center ${showHistory ? 'bg-white/30' : 'bg-white/20'} backdrop-blur-sm text-white rounded-2xl hover:bg-white/40 transition-all duration-200 border border-white/10`}
              title="History"
            >
              <HistoryIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/40 transition-all duration-200 border border-white/10"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/40 transition-all duration-200 border border-white/10"
                title="Choose Theme"
              >
                <Palette className="w-5 h-5" />
              </button>
              
              {showThemeSelector && (
                <>
                  <div className="absolute right-0 top-14 bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 z-50 min-w-48">
                    <h4 className="text-white font-semibold mb-3 text-sm">Choose Theme</h4>
                    <div className="space-y-2">
                      {Object.entries(themes).map(([key, gradient]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setCurrentTheme(key);
                            setShowThemeSelector(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 ${
                            currentTheme === key ? 'bg-white/20' : 'hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${gradient}`} />
                          <span className="text-white text-sm">
                            {themeNames[key as keyof typeof themeNames]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowThemeSelector(false)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20">
              {/* Display */}
              <Display
                display={display}
                expression={expression}
                memory={memory.value}
                isDarkMode={isDarkMode}
              />
              
              {/* Mode Toggle */}
              <div className="flex mb-4">
                <button
                  onClick={() => setIsScientific(false)}
                  className={`flex-1 py-3 text-sm font-semibold ${!isScientific ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm text-white rounded-l-2xl hover:bg-white/40 transition-all duration-200 border border-white/10`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setIsScientific(true)}
                  className={`flex-1 py-3 text-sm font-semibold ${isScientific ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm text-white rounded-r-2xl hover:bg-white/40 transition-all duration-200 border border-white/10`}
                >
                  Scientific
                </button>
              </div>

              {/* Buttons Grid */}
              <div className={`grid gap-2 sm:gap-3 ${isScientific ? 'grid-cols-5' : 'grid-cols-4'}`}>
                {isScientific && (
                  <>
                    {/* Scientific Functions */}
                    <Button value="sin" onClick={() => handleFunction('sin')} type="function" />
                    <Button value="cos" onClick={() => handleFunction('cos')} type="function" />
                    <Button value="tan" onClick={() => handleFunction('tan')} type="function" />
                    <Button value="log" onClick={() => handleFunction('log')} type="function" />
                    <Button value="ln" onClick={() => handleFunction('ln')} type="function" />
                    
                    <Button value="√" onClick={() => handleFunction('sqrt')} type="function" />
                    <Button value="x²" onClick={() => handleFunction('square')} type="function" />
                    <Button value="1/x" onClick={() => handleFunction('inverse')} type="function" />
                    <Button value="π" onClick={() => handleFunction('pi')} type="constant" />
                    <Button value="e" onClick={() => handleFunction('e')} type="constant" />
                    
                    <Button value="(" onClick={() => handleParentheses('(')} type="operator" />
                    <Button value=")" onClick={() => handleParentheses(')')} type="operator" />
                    <Button value="n!" onClick={() => handleFunction('factorial')} type="function" />
                    <Button value="MC" onClick={() => handleMemory('MC')} type="memory" />
                    <Button value="MR" onClick={() => handleMemory('MR')} type="memory" />
                  </>
                )}

                {/* Memory Functions for Basic Mode */}
                {!isScientific && (
                  <>
                    <Button value="MC" onClick={() => handleMemory('MC')} type="memory" />
                    <Button value="MR" onClick={() => handleMemory('MR')} type="memory" />
                    <Button value="M+" onClick={() => handleMemory('M+')} type="memory" />
                    <Button value="M-" onClick={() => handleMemory('M-')} type="memory" />
                  </>
                )}

                {/* Main Calculator Grid */}
                <Button value="C" onClick={handleClear} type="clear" />
                <Button value="⌫" onClick={handleBackspace} type="clear" />
                <Button value="%" onClick={handlePercentage} type="operator" />
                <Button value="÷" onClick={() => handleOperator('/')} type="operator" />
                {isScientific && <Button value="M+" onClick={() => handleMemory('M+')} type="memory" />}

                <Button value="7" onClick={() => handleNumber('7')} type="number" />
                <Button value="8" onClick={() => handleNumber('8')} type="number" />
                <Button value="9" onClick={() => handleNumber('9')} type="number" />
                <Button value="×" onClick={() => handleOperator('*')} type="operator" />
                {isScientific && <Button value="M-" onClick={() => handleMemory('M-')} type="memory" />}

                <Button value="4" onClick={() => handleNumber('4')} type="number" />
                <Button value="5" onClick={() => handleNumber('5')} type="number" />
                <Button value="6" onClick={() => handleNumber('6')} type="number" />
                <Button value="−" onClick={() => handleOperator('-')} type="operator" />
                {isScientific && <Button value="MS" onClick={() => handleMemory('MS')} type="memory" />}

                <Button value="1" onClick={() => handleNumber('1')} type="number" />
                <Button value="2" onClick={() => handleNumber('2')} type="number" />
                <Button value="3" onClick={() => handleNumber('3')} type="number" />
                <Button value="+" onClick={() => handleOperator('+')} type="operator" />
                {isScientific && <div></div>}

                <Button value="0" onClick={() => handleNumber('0')} type="number" className={isScientific ? "" : "col-span-2"} />
                {isScientific && <Button value="00" onClick={() => handleNumber('00')} type="number" />}
                <Button value="." onClick={handleDecimal} type="number" />
                <Button value="=" onClick={handleEquals} type="equals" />
                {isScientific && <div></div>}
              </div>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">History</h3>
                  <button
                    onClick={clearHistory}
                    className="p-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                    title="Clear History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <History
                  history={history}
                  onCopy={copyToClipboard}
                  onUse={(expression) => {
                    setExpression(expression);
                    setDisplay(expression);
                    setIsNewNumber(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* Unit Converter */}
          {showConverter && (
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Unit Converter</h3>
                <UnitConverter />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;