// Italian Tombola Bingo utilities

export interface Ticket {
  id: string;
  numbers: (number | null)[][]; // 3 rows x 9 columns, null = empty cell
  flatNumbers: number[]; // flat array of 15 numbers
}

export interface Song {
  title: string;
  artist: string;
}

export interface CustomPlaylist {
  [number: number]: Song;
}

export interface Game {
  id: string;
  name: string;
  status: 'setup' | 'active' | 'finished';
  hostId: string;
  createdAt: Date;
  totalTickets: number;
  ticketSize: 5 | 10 | 15; // Размер билета: 5, 10 или 15 цифр
  currentNumber: number | null;
  currentSong: string | null;
  drawnNumbers: number[];
  tickets: Ticket[];
  winnerId: string | null;
  customPlaylist?: CustomPlaylist;
}

// Italian songs associated with numbers 1-90 (classic Tombola Napoletana style)
export const SONGS_BY_NUMBER: Record<number, { title: string; artist: string }> = {
  1: { title: "Nel blu dipinto di blu (Volare)", artist: "Domenico Modugno" },
  2: { title: "Con te partirò", artist: "Andrea Bocelli" },
  3: { title: "Bella ciao", artist: "Tradizionale" },
  4: { title: "Tu vuò fà l'americano", artist: "Renato Carosone" },
  5: { title: "Gloria", artist: "Umberto Tozzi" },
  6: { title: "Felicità", artist: "Al Bano e Romina" },
  7: { title: "L'italiano", artist: "Toto Cutugno" },
  8: { title: "Sarà perché ti amo", artist: "Ricchi e Poveri" },
  9: { title: "Sapore di sale", artist: "Gino Paoli" },
  10: { title: "Azzurro", artist: "Adriano Celentano" },
  11: { title: "Il mondo", artist: "Jimmy Fontana" },
  12: { title: "Marina", artist: "Rocco Granata" },
  13: { title: "Quando quando quando", artist: "Tony Renis" },
  14: { title: "Ti amo", artist: "Umberto Tozzi" },
  15: { title: "Caruso", artist: "Lucio Dalla" },
  16: { title: "La solitudine", artist: "Laura Pausini" },
  17: { title: "Almeno tu nell'universo", artist: "Mia Martini" },
  18: { title: "E penso a te", artist: "Lucio Battisti" },
  19: { title: "La donna cannone", artist: "Francesco De Gregori" },
  20: { title: "Roma nun fa' la stupida stasera", artist: "Lando Fiorini" },
  21: { title: "Figli delle stelle", artist: "Alan Sorrenti" },
  22: { title: "Margherita", artist: "Riccardo Cocciante" },
  23: { title: "Io che non vivo", artist: "Pino Donaggio" },
  24: { title: "La canzone del sole", artist: "Lucio Battisti" },
  25: { title: "Perdere l'amore", artist: "Massimo Ranieri" },
  26: { title: "Un'estate italiana", artist: "Gianna Nannini" },
  27: { title: "Grande grande grande", artist: "Mina" },
  28: { title: "Se telefonando", artist: "Mina" },
  29: { title: "Insieme", artist: "Toto Cutugno" },
  30: { title: "Parole parole", artist: "Mina e Alberto Lupo" },
  31: { title: "Io vagabondo", artist: "Nomadi" },
  32: { title: "Gianna", artist: "Rino Gaetano" },
  33: { title: "Ma che bello questo amore", artist: "Gianluca Grignani" },
  34: { title: "Senza una donna", artist: "Zucchero" },
  35: { title: "Amore bello", artist: "Claudio Baglioni" },
  36: { title: "E tu", artist: "Claudio Baglioni" },
  37: { title: "Solo noi", artist: "Toto Cutugno" },
  38: { title: "Anna", artist: "Lucio Battisti" },
  39: { title: "Minuetto", artist: "Mia Martini" },
  40: { title: "Splendido splendente", artist: "Donatella Rettore" },
  41: { title: "Più bella cosa", artist: "Eros Ramazzotti" },
  42: { title: "La notte", artist: "Arisa" },
  43: { title: "Terra promessa", artist: "Eros Ramazzotti" },
  44: { title: "Il cielo in una stanza", artist: "Gino Paoli" },
  45: { title: "Mamma Maria", artist: "Ricchi e Poveri" },
  46: { title: "La mia storia tra le dita", artist: "Gianluca Grignani" },
  47: { title: "Controvento", artist: "Arisa" },
  48: { title: "Questo piccolo grande amore", artist: "Claudio Baglioni" },
  49: { title: "Pensiero stupendo", artist: "Patty Pravo" },
  50: { title: "Vita spericolata", artist: "Vasco Rossi" },
  51: { title: "Albachiara", artist: "Vasco Rossi" },
  52: { title: "Sally", artist: "Vasco Rossi" },
  53: { title: "Generale", artist: "Francesco De Gregori" },
  54: { title: "Rimmel", artist: "Francesco De Gregori" },
  55: { title: "Un senso", artist: "Vasco Rossi" },
  56: { title: "La cura", artist: "Franco Battiato" },
  57: { title: "Centro di gravità permanente", artist: "Franco Battiato" },
  58: { title: "Maledetta primavera", artist: "Loretta Goggi" },
  59: { title: "Destinazione paradiso", artist: "Gianluca Grignani" },
  60: { title: "Nessun dorma", artist: "Luciano Pavarotti" },
  61: { title: "O sole mio", artist: "Tradizionale" },
  62: { title: "Funiculì funiculà", artist: "Tradizionale" },
  63: { title: "Torna a Surriento", artist: "Tradizionale" },
  64: { title: "Santa Lucia", artist: "Tradizionale" },
  65: { title: "Con te", artist: "Paolo Conte" },
  66: { title: "Messaggio in una bottiglia", artist: "Vinicio Capossela" },
  67: { title: "Hanno ucciso l'uomo ragno", artist: "883" },
  68: { title: "Come mai", artist: "883" },
  69: { title: "Nord sud ovest est", artist: "883" },
  70: { title: "Gli anni", artist: "883" },
  71: { title: "Una canzone per te", artist: "Vasco Rossi" },
  72: { title: "Questo bel Natale", artist: "Tradizionale" },
  73: { title: "W la mamma", artist: "Edoardo Bennato" },
  74: { title: "Il paradiso", artist: "Patty Pravo" },
  75: { title: "Ancora", artist: "Eduardo De Crescenzo" },
  76: { title: "I migliori anni", artist: "Renato Zero" },
  77: { title: "Triangolo", artist: "Renato Zero" },
  78: { title: "Il cielo", artist: "Renato Zero" },
  79: { title: "Cercami", artist: "Renato Zero" },
  80: { title: "Ti lascerò", artist: "Fausto Leali" },
  81: { title: "Che sarà", artist: "Ricchi e Poveri" },
  82: { title: "Donne", artist: "Zucchero" },
  83: { title: "Il mare calmo della sera", artist: "Andrea Bocelli" },
  84: { title: "L'emozione non ha voce", artist: "Adriano Celentano" },
  85: { title: "Per sempre", artist: "Adriano Celentano" },
  86: { title: "24000 baci", artist: "Adriano Celentano" },
  87: { title: "Il ragazzo della via Gluck", artist: "Adriano Celentano" },
  88: { title: "Prisencolinensinainciusol", artist: "Adriano Celentano" },
  89: { title: "Crescendo", artist: "Adriano Celentano" },
  90: { title: "La fine", artist: "Tiziano Ferro" },
};

// Shuffle array using Fisher-Yates
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get random integer between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get ranges and max number based on ticket size
function getRangesAndMax(ticketSize: 5 | 10 | 15): { ranges: [number, number][]; maxNumber: number } {
  if (ticketSize === 5) {
    // For 5 numbers: use range 1-29, distribute across 3 columns
    return {
      ranges: [
        [1, 10], [11, 20], [21, 29], [1, 29], [1, 29],
        [1, 29], [1, 29], [1, 29], [1, 29]
      ],
      maxNumber: 29
    };
  } else if (ticketSize === 10) {
    // For 10 numbers: use range 1-69, distribute across 6 columns
    return {
      ranges: [
        [1, 12], [13, 24], [25, 36], [37, 48], [49, 57],
        [58, 69], [1, 69], [1, 69], [1, 69]
      ],
      maxNumber: 69
    };
  } else {
    // For 15 numbers: classic Tombola ranges 1-90
    return {
      ranges: [
        [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
        [50, 59], [60, 69], [70, 79], [80, 90]
      ],
      maxNumber: 90
    };
  }
}

// Generate a single tombola ticket
export function generateTicket(id: string, ticketSize: 5 | 10 | 15 = 15): Ticket {
  const { ranges, maxNumber } = getRangesAndMax(ticketSize);
  
  // Create empty 3x9 grid
  const grid: (number | null)[][] = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ];
  
  const usedNumbers = new Set<number>();
  
  // Generate unique random numbers in the range
  const allNumbers: number[] = [];
  while (allNumbers.length < ticketSize) {
    const num = randomInt(1, maxNumber);
    if (!usedNumbers.has(num)) {
      usedNumbers.add(num);
      allNumbers.push(num);
    }
  }
  allNumbers.sort((a, b) => a - b);
  
  // Distribute numbers across the grid
  if (ticketSize === 15) {
    // Classic Tombola: 5 numbers per row
    const rowColumns = [
      shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 5),
      shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 5),
      shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 5)
    ];
    
    let numIdx = 0;
    for (let row = 0; row < 3; row++) {
      for (const col of rowColumns[row]) {
        const num = allNumbers[numIdx++];
        grid[row][col] = num;
      }
    }
  } else if (ticketSize === 10) {
    // 10 numbers: distribute approximately 3-4-3 or 4-3-3
    const distribution = [3, 4, 3];
    let numIdx = 0;
    
    for (let row = 0; row < 3; row++) {
      const cols = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, distribution[row]);
      for (const col of cols) {
        const num = allNumbers[numIdx++];
        grid[row][col] = num;
      }
    }
  } else {
    // 5 numbers: distribute approximately 2-2-1 or 2-1-2
    const distribution = [2, 2, 1];
    let numIdx = 0;
    
    for (let row = 0; row < 3; row++) {
      const cols = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, distribution[row]);
      for (const col of cols) {
        const num = allNumbers[numIdx++];
        grid[row][col] = num;
      }
    }
  }
  
  // Sort numbers within each column
  for (let col = 0; col < 9; col++) {
    const colNums = grid.map(row => row[col]).filter(n => n !== null) as number[];
    if (colNums.length > 0) {
      colNums.sort((a, b) => a - b);
      let idx = 0;
      for (let row = 0; row < 3; row++) {
        if (grid[row][col] !== null) {
          grid[row][col] = colNums[idx++];
        }
      }
    }
  }
  
  return {
    id,
    numbers: grid,
    flatNumbers: allNumbers,
  };
}

// Generate multiple unique tickets
export function generateTickets(count: number, ticketSize: 5 | 10 | 15 = 15): Ticket[] {
  const tickets: Ticket[] = [];
  
  for (let i = 0; i < count; i++) {
    tickets.push(generateTicket(`ticket-${i + 1}`, ticketSize));
  }
  
  return tickets;
}

// Draw a random number that hasn't been drawn yet
export function drawNumber(drawnNumbers: number[], maxNumber: number = 90): number | null {
  const available = Array.from({ length: maxNumber }, (_, i) => i + 1)
    .filter(n => !drawnNumbers.includes(n));
  
  if (available.length === 0) return null;
  
  return available[Math.floor(Math.random() * available.length)];
}

// Check if a ticket has won (all numbers marked)
export function checkWinner(ticket: Ticket, drawnNumbers: number[]): boolean {
  return ticket.flatNumbers.every(num => drawnNumbers.includes(num));
}

// Get song for a number (with optional custom playlist)
export function getSongForNumber(num: number, customPlaylist?: CustomPlaylist): Song | null {
  if (customPlaylist && customPlaylist[num]) {
    return customPlaylist[num];
  }
  return SONGS_BY_NUMBER[num] || null;
}

// Generate a short game code
export function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Create a new game
export function createGame(name: string, ticketCount: number, ticketSize: 5 | 10 | 15 = 15, customPlaylist?: CustomPlaylist): Game {
  const gameId = generateGameCode();
  
  return {
    id: gameId,
    name,
    status: 'setup',
    hostId: `host-${Date.now()}`,
    createdAt: new Date(),
    totalTickets: ticketCount,
    ticketSize,
    currentNumber: null,
    currentSong: null,
    drawnNumbers: [],
    tickets: generateTickets(ticketCount, ticketSize),
    winnerId: null,
    customPlaylist,
  };
}

// Get max number for a ticket size
export function getMaxNumberForTicketSize(ticketSize: 5 | 10 | 15): number {
  if (ticketSize === 5) return 29;
  if (ticketSize === 10) return 69;
  return 90;
}
