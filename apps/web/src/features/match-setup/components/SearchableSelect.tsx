import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { type PlayerSelection } from '../types';

interface SearchableSelectProps {
  label: string;
  placeholder?: string;
  options: PlayerSelection[];
  value: PlayerSelection | null;
  onChange: (value: PlayerSelection) => void;
  disabledOptions?: string[]; // IDs of players to disable
  placement?: 'top' | 'bottom';
}

export default function SearchableSelect({
  label,
  placeholder = 'Select player...',
  options,
  value,
  onChange,
  disabledOptions = [],
  placement = 'bottom',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-primary/50 transition-colors"
      >
        <span className={`capitalize ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
          {value ? value.name : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden`}>
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              className="w-full p-2 bg-transparent outline-none text-sm text-slate-900 dark:text-white"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">
                No players found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isDisabled = disabledOptions.includes(option.id);
                const isSelected = value?.id === option.id;
                
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-sm text-left transition-colors capitalize ${
                      isDisabled 
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50' 
                        : isSelected
                          ? 'bg-brand-primary/10 text-brand-primary font-medium'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{option.name} {isDisabled && '(Selected)'}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
