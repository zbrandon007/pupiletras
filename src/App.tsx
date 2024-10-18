import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import WordSearch from './components/WordSearch';
import { generateWordSearch, fetchWordsFromWikipedia } from './utils/wordSearchUtils';

function App() {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [words, setWords] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const fetchedWords = await fetchWordsFromWikipedia();
      setWords(fetchedWords);
    } catch (error) {
      console.error('Error al encontrar palabras:', error);
    }
    setLoading(false);
  };

  const handleGenerate = () => {
    if (words.length < 20) {
      alert('No hay suficientes palabras. Por favor inténtalo de nuevo.');
      return;
    }
    const generatedPuzzle = generateWordSearch(rows, cols, words);
    setPuzzle(generatedPuzzle);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Generador de pupiletras</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="border p-2 rounded"
            placeholder="Rows"
          />
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="border p-2 rounded"
            placeholder="Columns"
          />
          <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            disabled={loading}
          >
            <Search className="mr-2" />
            Generate
          </button>
        </div>
        {loading ? (
          <p>Cargando palabras...</p>
        ) : (
          <WordSearch puzzle={puzzle} words={words} />
        )}
      </div>
    </div>
  );
}

export default App;