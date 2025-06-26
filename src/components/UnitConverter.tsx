import React, { useState, useCallback } from 'react';
import { ArrowUpDown } from 'lucide-react';

const UnitConverter: React.FC = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');

  const units = {
    length: {
      meter: { name: 'Meter', factor: 1 },
      foot: { name: 'Foot', factor: 3.28084 },
      inch: { name: 'Inch', factor: 39.3701 },
      centimeter: { name: 'Centimeter', factor: 100 },
      kilometer: { name: 'Kilometer', factor: 0.001 },
      mile: { name: 'Mile', factor: 0.000621371 },
    },
    weight: {
      kilogram: { name: 'Kilogram', factor: 1 },
      pound: { name: 'Pound', factor: 2.20462 },
      gram: { name: 'Gram', factor: 1000 },
      ounce: { name: 'Ounce', factor: 35.274 },
      ton: { name: 'Ton', factor: 0.001 },
    },
    temperature: {
      celsius: { name: 'Celsius', factor: 1 },
      fahrenheit: { name: 'Fahrenheit', factor: 1 },
      kelvin: { name: 'Kelvin', factor: 1 },
    },
    volume: {
      liter: { name: 'Liter', factor: 1 },
      gallon: { name: 'Gallon', factor: 0.264172 },
      milliliter: { name: 'Milliliter', factor: 1000 },
      cup: { name: 'Cup', factor: 4.22675 },
      pint: { name: 'Pint', factor: 2.11338 },
    },
  };

  const convert = useCallback((value: string, from: string, to: string, cat: string) => {
    if (!value || isNaN(parseFloat(value))) return '';
    
    const numValue = parseFloat(value);
    const categoryUnits = units[cat as keyof typeof units];
    
    if (cat === 'temperature') {
      // Special handling for temperature
      let celsius: number;
      
      // Convert to Celsius first
      switch (from) {
        case 'fahrenheit':
          celsius = (numValue - 32) * 5/9;
          break;
        case 'kelvin':
          celsius = numValue - 273.15;
          break;
        default:
          celsius = numValue;
      }
      
      // Convert from Celsius to target
      switch (to) {
        case 'fahrenheit':
          return ((celsius * 9/5) + 32).toFixed(4);
        case 'kelvin':
          return (celsius + 273.15).toFixed(4);
        default:
          return celsius.toFixed(4);
      }
    } else {
      // Standard unit conversion
      const fromFactor = categoryUnits[from as keyof typeof categoryUnits]?.factor || 1;
      const toFactor = categoryUnits[to as keyof typeof categoryUnits]?.factor || 1;
      
      // Convert to base unit, then to target unit
      const baseValue = numValue / fromFactor;
      const convertedValue = baseValue * toFactor;
      
      return convertedValue.toFixed(4);
    }
  }, []);

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    const converted = convert(value, fromUnit, toUnit, category);
    setToValue(converted);
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);
    const converted = convert(value, toUnit, fromUnit, category);
    setFromValue(converted);
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const categoryUnits = units[newCategory as keyof typeof units];
    const unitKeys = Object.keys(categoryUnits);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setFromValue('');
    setToValue('');
  };

  const currentUnits = units[category as keyof typeof units];

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 focus:border-white/40 focus:outline-none backdrop-blur-sm"
      >
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
        <option value="volume">Volume</option>
      </select>

      {/* From Unit */}
      <div className="space-y-2">
        <select
          value={fromUnit}
          onChange={(e) => {
            setFromUnit(e.target.value);
            if (fromValue) {
              const converted = convert(fromValue, e.target.value, toUnit, category);
              setToValue(converted);
            }
          }}
          className="w-full bg-white/10 text-white rounded-xl p-2 border border-white/20 focus:border-white/40 focus:outline-none backdrop-blur-sm text-sm"
        >
          {Object.entries(currentUnits).map(([key, unit]) => (
            <option key={key} value={key}>
              {unit.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={fromValue}
          onChange={(e) => handleFromValueChange(e.target.value)}
          placeholder="Enter value"
          className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 focus:border-white/40 focus:outline-none backdrop-blur-sm placeholder-white/50"
        />
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <button
          onClick={swapUnits}
          className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* To Unit */}
      <div className="space-y-2">
        <select
          value={toUnit}
          onChange={(e) => {
            setToUnit(e.target.value);
            if (fromValue) {
              const converted = convert(fromValue, fromUnit, e.target.value, category);
              setToValue(converted);
            }
          }}
          className="w-full bg-white/10 text-white rounded-xl p-2 border border-white/20 focus:border-white/40 focus:outline-none backdrop-blur-sm text-sm"
        >
          {Object.entries(currentUnits).map(([key, unit]) => (
            <option key={key} value={key}>
              {unit.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={toValue}
          onChange={(e) => handleToValueChange(e.target.value)}
          placeholder="Result"
          className="w-full bg-white/10 text-white rounded-xl p-3 border border-white/20 focus:border-white/40 focus:outline-none backdrop-blur-sm placeholder-white/50"
        />
      </div>
    </div>
  );
};

export default UnitConverter;