import React, { useState, useEffect, useRef } from 'react';
import { MissionType, MissionData, MissionCodingGame, MissionLogicPuzzle, MissionFillInTheBlanks, MissionJigsawPuzzle } from '../types';
import { CheckCircleIcon, GripVerticalIcon, TerminalIcon, CheckIcon, RefreshIcon, LoaderIcon } from './Icons';
import { hapticService } from '../services/hapticService';

interface MissionViewProps {
  missionType: MissionType;
  missionData: MissionData;
  onSolve: () => void;
  reviewMode: boolean;
}

const MissionView: React.FC<MissionViewProps> = ({ missionType, missionData, onSolve, reviewMode }) => {
  const renderMissionContent = () => {
    switch (missionType) {
      case 'info':
        return <InfoMission mission={missionData as any} />;
      case 'quiz':
        return <QuizMission mission={missionData as any} onSolve={onSolve} reviewMode={reviewMode} />;
      case 'q_and_a':
          return <QnAMission mission={missionData as any} onSolve={onSolve} reviewMode={reviewMode} />;
      case 'drag_drop_order':
          return <DragDropOrderMission mission={missionData as any} onSolve={onSolve} reviewMode={reviewMode} />;
      case 'coding_game':
          return <CodingGameMission mission={missionData as MissionCodingGame} onSolve={onSolve} reviewMode={reviewMode} />;
      case 'logic_puzzle':
          return <LogicPuzzleMission mission={missionData as MissionLogicPuzzle} onSolve={onSolve} reviewMode={reviewMode} />;
      case 'jigsaw_puzzle':
        return <JigsawPuzzleMission mission={missionData as MissionJigsawPuzzle} onSolve={onSolve} reviewMode={reviewMode} />;
      case 'fill_in_the_blanks':
        return <FillInTheBlanksMission mission={missionData as MissionFillInTheBlanks} onSolve={onSolve} reviewMode={reviewMode} />;
      default:
        return <p>This mission is under construction!</p>;
    }
  };

  return <div className="mission-content-wrapper">{renderMissionContent()}</div>;
};

const InfoMission: React.FC<{mission: {text: string}}> = ({ mission }) => {
    return (
        <div>
            <h2 className="text-slate-800 font-bold text-lg mb-4">Information</h2>
            <p className="text-slate-600 text-lg">{mission.text}</p>
        </div>
    );
}

const QuizMission: React.FC<{mission: {question: string, options: string[], correctAnswerIndex: number}, onSolve: () => void, reviewMode: boolean}> = ({ mission, onSolve, reviewMode }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(reviewMode ? mission.correctAnswerIndex : null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(reviewMode ? true : null);

    const handleSelect = (index: number) => {
        if (selectedAnswer !== null || reviewMode) return;
        hapticService.click();
        setSelectedAnswer(index);
        const correct = index === mission.correctAnswerIndex;
        setIsCorrect(correct);
        if (correct) {
            hapticService.success();
            onSolve();
        }
    };

    const handleRetry = () => {
        hapticService.click();
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    return (
        <div>
            <style>{`
              @keyframes check-in {
                0% { transform: scale(0.5) rotate(-30deg); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
              .animate-check-in {
                animation: check-in 0.3s ease-out forwards;
              }
            `}</style>
            <h2 className="text-slate-800 font-bold text-lg mb-4">{mission.question}</h2>
            <div className="space-y-3">
                {mission.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-semibold flex items-center justify-between relative overflow-hidden ${
                            selectedAnswer === index
                                ? (isCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800')
                                : 'bg-slate-100 border-slate-200 hover:bg-indigo-100 hover:border-indigo-400'
                        } ${ (reviewMode || selectedAnswer !== null) ? 'cursor-not-allowed' : ''}`}
                        disabled={reviewMode || selectedAnswer !== null}
                    >
                        <span>{option}</span>
                        {selectedAnswer === index && isCorrect && (
                            <CheckIcon className="w-6 h-6 text-green-600 animate-check-in" />
                        )}
                    </button>
                ))}
            </div>
            {isCorrect && !reviewMode && (
                <div className="relative mt-4 text-center">
                    <p className="text-green-600 font-bold animate-pop-in">That's right! Great job!</p>
                </div>
            )}
            {selectedAnswer !== null && !isCorrect && !reviewMode && (
                 <div className="mt-4 text-center">
                    <p className="text-red-600 font-bold mb-2">Not quite! Give it another shot.</p>
                    <button
                        onClick={handleRetry}
                        className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 transition flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshIcon className="w-5 h-5" />
                        Retry Mission
                    </button>
                </div>
            )}
        </div>
    );
};

const QnAMission: React.FC<{mission: {question: string, keywords: string[], placeholder?: string}, onSolve: () => void, reviewMode: boolean}> = ({ mission, onSolve, reviewMode }) => {
    const [answer, setAnswer] = useState(reviewMode ? mission.keywords[0] || 'Correct answer' : '');
    const [isLoading, setIsLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(reviewMode ? true : null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!answer.trim()) {
            setError("Oops! You can't submit an empty answer. Give it a try!");
            hapticService.vibrate(100);
            return;
        }
        
        if (reviewMode || isLoading || isCorrect === true) return;
        
        setError(null);
        setIsLoading(true);
        hapticService.click();

        setTimeout(() => {
            const solved = mission.keywords.some(keyword => answer.trim().toLowerCase().includes(keyword.toLowerCase()));
            setIsCorrect(solved);
            if (solved) {
                onSolve();
            }
            setIsLoading(false);
        }, 1000); // Simulate 1 second delay
    };

    const handleRetry = () => {
        hapticService.click();
        setAnswer('');
        setIsCorrect(null);
        setError(null);
    };

    return (
        <div>
            <h2 id="qna-title" className="text-slate-800 font-bold text-lg mb-4 block">{mission.question}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        id="qna-input"
                        aria-labelledby="qna-title"
                        type="text"
                        value={answer}
                        onChange={(e) => {
                            setAnswer(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder={mission.placeholder || "Type your answer here..."}
                        disabled={reviewMode || isLoading || isCorrect === true}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg shadow-inner focus:ring-4 focus:outline-none transition ${
                            isCorrect === true ? 'border-green-500 bg-green-50 focus:ring-green-300' 
                            : isCorrect === false ? 'border-red-500 bg-red-50 focus:ring-red-300' 
                            : error ? 'border-red-500 bg-red-50 focus:ring-red-300'
                            : 'border-slate-300 focus:ring-indigo-300 focus:border-indigo-500'
                        } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                        aria-invalid={!!error}
                        aria-describedby={error ? "qna-error" : undefined}
                    />
                    {error && <p id="qna-error" className="text-red-600 font-semibold text-sm mt-2">{error}</p>}
                </div>
                
                {!reviewMode && isCorrect !== true && (
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center h-[52px] disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoaderIcon className="w-6 h-6 animate-spin" /> : 'Check Answer'}
                    </button>
                )}
            </form>
            {isCorrect === true && !reviewMode && (
                <div className="relative mt-4 text-center">
                    <p className="text-green-600 font-bold animate-pop-in">Correct! Well done!</p>
                </div>
            )}
            {isCorrect === false && (
                <div className="mt-4 text-center">
                    <p className="text-red-600 font-bold mb-2">That's not quite right. Give it another go!</p>
                    <button
                        onClick={handleRetry}
                        className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 transition flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshIcon className="w-5 h-5" />
                        Try Again
                    </button>
                </div>
            )}
            {reviewMode && <p className="text-sm text-slate-500 mt-2">Mission completed!</p>}
        </div>
    );
}

const DragDropOrderMission: React.FC<{mission: {prompt: string, items: {id: string, content: string}[], correctOrder: string[]}, onSolve: () => void, reviewMode: boolean}> = ({ mission, onSolve, reviewMode }) => {
    const getCorrectItems = () => mission.correctOrder.map(id => mission.items.find(item => item.id === id)!);
    const [items, setItems] = useState(reviewMode ? getCorrectItems() : [...mission.items].sort(() => Math.random() - 0.5));
    const [isCorrect, setIsCorrect] = useState(reviewMode);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, items.length);
    }, [items.length]);

    const checkOrder = (currentItems: typeof items) => {
        if(reviewMode) return;
        const currentOrder = currentItems.map(item => item.id);
        const correct = JSON.stringify(currentOrder) === JSON.stringify(mission.correctOrder);
        if (correct) {
            setIsCorrect(true);
            onSolve();
        }
    };
    
    const handleDragEnd = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;

        const newItems = [...items];
        const draggedItemContent = newItems.splice(dragItem.current, 1)[0];
        newItems.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setItems(newItems);
        checkOrder(newItems);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (reviewMode || isCorrect) return;

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const newItems = [...items];
            const targetIndex = e.key === 'ArrowUp' ? index - 1 : index + 1;

            if (targetIndex >= 0 && targetIndex < items.length) {
                [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
                setItems(newItems);
                checkOrder(newItems);
                
                setTimeout(() => {
                    itemRefs.current[targetIndex]?.focus();
                }, 0);
            }
        }
    };

    return (
         <div>
            <h2 className="text-slate-800 font-bold text-lg mb-4">{mission.prompt}</h2>
            <div className="space-y-2" role="list">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        ref={el => { itemRefs.current[index] = el; }}
                        role="listitem"
                        tabIndex={isCorrect || reviewMode ? -1 : 0}
                        onKeyDown={e => handleKeyDown(e, index)}
                        draggable={!isCorrect && !reviewMode}
                        onDragStart={() => dragItem.current = index}
                        onDragEnter={() => dragOverItem.current = index}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`p-3 rounded-lg flex items-center gap-3 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isCorrect ? 'bg-green-100 border-2 border-green-500 cursor-default' : 'bg-slate-100 border-2 border-slate-200 cursor-grab active:cursor-grabbing'
                        }`}
                        aria-label={`${item.content}, position ${index + 1} of ${items.length}. Use arrow keys to reorder.`}
                    >
                       {!isCorrect && <GripVerticalIcon className="w-5 h-5 text-slate-400" />}
                       {isCorrect && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                       <span className="font-mono font-semibold text-slate-700">{item.content}</span>
                    </div>
                ))}
            </div>
             {isCorrect && (
                <div className="relative mt-4 text-center">
                    <p className={`text-green-600 font-bold ${!reviewMode ? 'animate-pop-in' : ''}`}>You got the sequence right!</p>
                </div>
            )}
        </div>
    );
}

const CodingGameMission: React.FC<{ mission: MissionCodingGame, onSolve: () => void, reviewMode: boolean }> = ({ mission, onSolve, reviewMode }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(reviewMode ? mission.correctAnswerIndex : null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(reviewMode ? true : null);

    const handleSelect = (index: number) => {
        if (selectedAnswer !== null || reviewMode) return;
        hapticService.click();
        setSelectedAnswer(index);
        const correct = index === mission.correctAnswerIndex;
        setIsCorrect(correct);
        if (correct) {
            onSolve();
        }
    };

    const handleRetry = () => {
        hapticService.click();
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    return (
        <div>
            <style>{`
              @keyframes check-in {
                0% { transform: scale(0.5) rotate(-30deg); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
              .animate-check-in {
                animation: check-in 0.3s ease-out forwards;
              }
            `}</style>
            <h2 className="text-slate-800 font-bold text-lg mb-4">{mission.prompt}</h2>
            <div className="bg-slate-800 text-white font-mono p-4 rounded-lg mb-4 text-left">
                <code>{mission.codeBefore}</code>
                <span className="bg-slate-600 rounded px-2 py-1 mx-1 text-slate-300">
                    {selectedAnswer !== null ? mission.options[selectedAnswer] : '...'}
                </span>
                <code>{mission.codeAfter}</code>
            </div>
             <div className="space-y-3">
                {mission.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 font-mono flex items-center justify-between ${
                            selectedAnswer === index
                                ? (isCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800')
                                : 'bg-slate-100 border-slate-200 hover:bg-indigo-100 hover:border-indigo-400'
                        } ${(reviewMode || selectedAnswer !== null) ? 'cursor-not-allowed' : ''}`}
                        disabled={reviewMode || selectedAnswer !== null}
                    >
                       <span className="flex items-center"><TerminalIcon className="w-5 h-5 inline-block mr-2" /> {option}</span>
                       {selectedAnswer === index && isCorrect && (
                            <CheckIcon className="w-6 h-6 text-green-600 animate-check-in" />
                        )}
                    </button>
                ))}
            </div>
            {isCorrect && !reviewMode && (
                <div className="relative mt-4 text-center">
                    <p className="text-green-600 font-bold animate-pop-in">Correct! Code complete!</p>
                </div>
            )}
            {selectedAnswer !== null && !isCorrect && !reviewMode && (
                <div className="mt-4 text-center">
                    <p className="text-red-600 font-bold mb-2">That's not the right block. Try again!</p>
                    <button
                        onClick={handleRetry}
                        className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 transition flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshIcon className="w-5 h-5" />
                        Retry Mission
                    </button>
                </div>
            )}
        </div>
    );
};

const LogicPuzzleMission: React.FC<{ mission: MissionLogicPuzzle, onSolve: () => void, reviewMode: boolean }> = ({ mission, onSolve, reviewMode }) => {
    const [answer, setAnswer] = useState(reviewMode ? mission.correctAnswer : '');
    const [isCorrect, setIsCorrect] = useState(reviewMode);

    useEffect(() => {
        if (reviewMode || isCorrect) return;
        const solved = answer.trim().toLowerCase() === mission.correctAnswer.toLowerCase();
        if (solved) {
            setIsCorrect(true);
            onSolve();
        }
    }, [answer, mission.correctAnswer, onSolve, reviewMode, isCorrect]);

    return (
        <div>
            <h2 id="puzzle-title" className="text-slate-800 font-bold text-lg mb-4 block italic">"{mission.puzzle}"</h2>
            <input
                id="puzzle-input"
                aria-labelledby="puzzle-title"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={mission.placeholder || "What's the answer?"}
                disabled={reviewMode || isCorrect}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg shadow-inner focus:ring-4 focus:outline-none transition ${
                    isCorrect ? 'border-green-500 bg-green-50 focus:ring-green-300' : 'border-slate-300 focus:ring-indigo-300 focus:border-indigo-500'
                } disabled:bg-slate-100`}
            />
            {isCorrect && (
                <div className="relative mt-4 text-center">
                    <p className={`text-green-600 font-bold ${!reviewMode ? 'animate-pop-in' : ''}`}>You solved the puzzle!</p>
                </div>
            )}
        </div>
    );
}

const JigsawPuzzleMission: React.FC<{ mission: MissionJigsawPuzzle, onSolve: () => void, reviewMode: boolean }> = ({ mission, onSolve, reviewMode }) => {
    const [isCorrect, setIsCorrect] = useState(reviewMode);
    
    useEffect(() => {
        if(isCorrect) onSolve();
    }, [isCorrect, onSolve]);

    return (
        <div>
            <DragDropOrderMission 
                mission={{
                    prompt: mission.prompt,
                    items: mission.pieces,
                    correctOrder: mission.correctOrder
                }} 
                onSolve={() => setIsCorrect(true)} 
                reviewMode={reviewMode} 
            />
        </div>
    );
};

const FillInTheBlanksMission: React.FC<{ mission: MissionFillInTheBlanks, onSolve: () => void, reviewMode: boolean }> = ({ mission, onSolve, reviewMode }) => {
  const [blanks, setBlanks] = useState<{ [key: string]: string | null }>({});
  const [isCorrect, setIsCorrect] = useState(reviewMode);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [heldOption, setHeldOption] = useState<string | null>(null);

  useEffect(() => {
    if (reviewMode) {
      const initialBlanks: { [key: string]: string } = {};
      mission.parts.forEach(part => {
        if (typeof part !== 'string') {
          initialBlanks[part.id] = part.correctValue;
        }
      });
      setBlanks(initialBlanks);
    }
  }, [reviewMode, mission.parts]);

  const checkSolution = (currentBlanks: { [key: string]: string | null }) => {
    const blankParts = mission.parts.filter(p => typeof p !== 'string') as { id: string, correctValue: string }[];
    if (Object.values(currentBlanks).filter(Boolean).length !== blankParts.length) return;

    const correct = blankParts.every(part => currentBlanks[part.id] === part.correctValue);
    if (correct) {
      setIsCorrect(true);
      onSolve();
    }
  };

  const handleDrop = (blankId: string) => {
    if (!draggedItem || reviewMode || isCorrect) return;
    const newBlanks = { ...blanks, [blankId]: draggedItem };
    setBlanks(newBlanks);
    setDraggedItem(null);
    checkSolution(newBlanks);
  };
  
  const handleBlankClick = (blankId: string) => {
    if (reviewMode || isCorrect || !blanks[blankId]) return;
    const newBlanks = { ...blanks };
    delete newBlanks[blankId];
    setBlanks(newBlanks);
  }

  const handleOptionKeyDown = (e: React.KeyboardEvent, option: string) => {
    if (reviewMode || isCorrect) return;
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setHeldOption(current => current === option ? null : option);
        hapticService.click();
    }
  };

  const handleBlankKeyDown = (e: React.KeyboardEvent, blankId: string) => {
    if (reviewMode || isCorrect) return;
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hapticService.click();
        if (heldOption && !blanks[blankId]) {
            const newBlanks = { ...blanks, [blankId]: heldOption };
            setBlanks(newBlanks);
            setHeldOption(null);
            checkSolution(newBlanks);
        } else if (blanks[blankId]) {
            handleBlankClick(blankId);
        }
    }
  };

  const availableOptions = mission.options.filter(opt => !Object.values(blanks).includes(opt));
  
  return (
    <div>
      <h2 className="text-slate-800 font-bold text-lg mb-4">{mission.prompt}</h2>
      <p className="sr-only">Keyboard users: Use Tab to navigate. Press Space or Enter to select a word, then navigate to a blank and press Space or Enter again to place it.</p>
      <div className="bg-slate-100 p-4 rounded-lg mb-4 text-lg leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-2">
        {mission.parts.map((part, index) => {
          if (typeof part === 'string') {
            return <span key={index}>{part}</span>;
          }
          const filledValue = blanks[part.id];
          return (
            <div
              key={part.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(part.id)}
              onClick={() => handleBlankClick(part.id)}
              tabIndex={reviewMode || isCorrect ? -1 : 0}
              onKeyDown={e => handleBlankKeyDown(e, part.id)}
              role="button"
              aria-label={filledValue ? `Blank filled with ${filledValue}. Press Space to remove.` : `Blank, position ${index + 1}. Press Space to fill.`}
              className={`inline-block px-3 py-1 rounded-md min-w-[100px] text-center transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                filledValue ? 'bg-indigo-200 border-indigo-400 text-indigo-800 font-semibold cursor-pointer' : 'bg-slate-200 border-dashed border-slate-400'
              }`}
            >
              {filledValue || '...'}
            </div>
          );
        })}
      </div>
      {!isCorrect && !reviewMode && (
        <div className="flex flex-wrap gap-2 justify-center p-2 border-t mt-4 min-h-[50px]">
          {availableOptions.map(option => (
            <div
              key={option}
              draggable
              onDragStart={() => setDraggedItem(option)}
              tabIndex={reviewMode || isCorrect ? -1 : 0}
              role="button"
              onKeyDown={e => handleOptionKeyDown(e, option)}
              aria-pressed={heldOption === option}
              aria-label={`Option: ${option}. Press Space to select.`}
              className={`bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 ${heldOption === option ? 'ring-2 ring-offset-2 ring-sky-600' : ''}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
       {isCorrect && (
            <div className="relative mt-4 text-center">
                <p className={`text-green-600 font-bold ${!reviewMode ? 'animate-pop-in' : ''}`}>Correct! Fantastic work!</p>
            </div>
        )}
    </div>
  );
};


export default MissionView;