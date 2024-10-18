import React, { useState, useEffect } from 'react';

interface WordSearchProps {
  puzzle: string[][];
  words: string[];
}

const WordSearch: React.FC<WordSearchProps> = ({ puzzle, words }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<number[][]>([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [animatedWord, setAnimatedWord] = useState(''); // Para la animación letra por letra

  // Función para seleccionar una nueva palabra aleatoria
  const selectRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSelectedWord(randomWord);

    const wordLocation = findWordInSolution(randomWord, puzzle);
    if (!wordLocation) {
      console.error('Palabra no encontrada en la solución');
      return;
    }

    const { startRow, startCol, direction } = wordLocation;
    const newHighlightedCells = [];

    for (let i = 0; i < randomWord.length; i++) {
      const row = startRow + direction[0] * i;
      const col = startCol + direction[1] * i;
      newHighlightedCells.push([row, col]);
    }

    setHighlightedCells(newHighlightedCells);
  };

  useEffect(() => {
    if (puzzle.length > 0 && words.length > 0) {
      selectRandomWord();
    }
  }, [puzzle, words]);

  useEffect(() => {
    // Animar palabra letra por letra
    if (selectedWord) {
      let currentWord = '';
      let index = 0;
      const interval = setInterval(() => {
        currentWord += selectedWord[index];
        setAnimatedWord(currentWord);
        index++;
        if (index === selectedWord.length) {
          clearInterval(interval);
        }
      }, 150); // Intervalo de tiempo entre cada letra
      return () => clearInterval(interval);
    }
  }, [selectedWord]);

  const findWordInSolution = (word: string, grid: string[][]) => {
    const directions = [
      [0, 1],   // derecha
      [1, 0],   // abajo
      [1, 1],   // diagonal abajo-derecha
      [-1, 1],  // diagonal arriba-derecha
    ];

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        for (const direction of directions) {
          if (checkWord(word, grid, row, col, direction)) {
            return { startRow: row, startCol: col, direction };
          }
        }
      }
    }
    return null;
  };

  const checkWord = (word: string, grid: string[][], row: number, col: number, direction: number[]) => {
    if (
      row + word.length * direction[0] < 0 ||
      row + word.length * direction[0] >= grid.length ||
      col + word.length * direction[1] < 0 ||
      col + word.length * direction[1] >= grid[0].length
    ) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      if (grid[row + i * direction[0]][col + i * direction[1]] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const isHighlighted = (row: number, col: number) => {
    return highlightedCells.some(([r, c]) => r === row && c === col);
  };

  const handleShowSolution = () => {
    setShowSolution(!showSolution);
    if (!showSolution) {
      selectRandomWord(); // Seleccionar otra palabra cada vez que se muestra la solución
    }
  };

  return (
    <div className="mt-4">
      {puzzle.length > 0 ? (
        <div className="flex flex-col">
          <div className="flex mb-4">
            <div className="mr-4">
              <table className="border-collapse">
                <tbody>
                  {puzzle.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border border-gray-300 w-8 h-8 text-center ${isHighlighted(i, j) ? 'text-green-500 font-bold' : ''}`}
                          style={isHighlighted(i, j) ? { backgroundColor: 'black', color: 'green' } : {}}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-bold mb-2">Palabras para encontrar:</h3>
              <ul className="list-disc pl-5">
                {words.slice(0, 20).map((word, index) => (
                  <li key={index}>{word}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={handleShowSolution}
            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-500 self-start"
          >
            {showSolution ? 'Ocultar Solución' : 'Mostrar Solución'}
          </button>
          {showSolution && (
            <h3 className="font-bold mt-4 text-green-500">
              Palabra resaltada: <span className="text-green-300">{animatedWord}</span>
            </h3>
          )}
        </div>
      ) : (
        <p>Escoja un número para generar su pupiletras</p>
      )}
    </div>
  );
};

export default WordSearch;
