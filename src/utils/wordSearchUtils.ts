import axios from 'axios';

export const fetchWordsFromWikipedia = async (): Promise<string[]> => {
  try {
    const response = await axios.get(
      'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=&explaintext=&titles=Word_search&origin=*'
    );
    const pageId = Object.keys(response.data.query.pages)[0];
    const content = response.data.query.pages[pageId].extract;
    const words = (content.match(/\b\w{3,}\b/g) as string[]) || [];
    return [...new Set(words.map((word: string) => word.toUpperCase()))].slice(0, 30);
  } catch (error) {
    console.error('Error al extraer palabras de Wikipedia:', error);
    return [];
  }
};

export const generateWordSearch = (rows: number, cols: number, words: string[]): string[][] => {
  const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
  const directions = [
    [0, 1],   // derecha
    [1, 0],   // abajo
    [1, 1],   // diagonal abajo-derecha
    [-1, 1],  // diagonal arriba-derecha
  ];

  const placeWord = (word: string): boolean => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const [dx, dy] = direction;
      const startX = Math.floor(Math.random() * rows);
      const startY = Math.floor(Math.random() * cols);

      if (canPlaceWord(word, startX, startY, dx, dy)) {
        for (let i = 0; i < word.length; i++) {
          grid[startX + i * dx][startY + i * dy] = word[i];
        }
        return true;
      }
    }
    return false;
  };

  const canPlaceWord = (word: string, startX: number, startY: number, dx: number, dy: number): boolean => {
    if (
      startX + (word.length - 1) * dx < 0 ||
      startX + (word.length - 1) * dx >= rows ||
      startY + (word.length - 1) * dy < 0 ||
      startY + (word.length - 1) * dy >= cols
    ) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const cell = grid[startX + i * dx][startY + i * dy];
      if (cell !== '' && cell !== word[i]) {
        return false;
      }
    }

    return true;
  };

  // poner palabras
  for (const word of words.slice(0, 20)) {
    if (!placeWord(word)) {
      console.warn(`Could not place word: ${word}`);
    }
  }

  // rellenar con letras aleatorias
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
};