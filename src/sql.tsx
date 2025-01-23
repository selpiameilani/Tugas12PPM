import SQLite from 'react-native-sqlite-storage';  

// Membuka atau membuat database  
const db = SQLite.openDatabase(  
  {  
    name: 'Notes.db',  
    location: 'default',  
  },  
  () => {  
    console.log('Database connected!');  
    createTables(); // Buat tabel setelah database terhubung  
  },  
  error => console.error('Database connection failed:', error)  
);  

// Membuat tabel jika belum ada  
export const createTables = () => {  
  db.transaction(tx => {  
    tx.executeSql(  
      `CREATE TABLE IF NOT EXISTS Notes (  
        id INTEGER PRIMARY KEY AUTOINCREMENT,  
        title TEXT NOT NULL,  
        content TEXT,  
        created_at TEXT DEFAULT CURRENT_TIMESTAMP  
      );`,  
      [],  
      () => console.log('Table created!'),  
      error => console.error('Table creation failed:', error)  
    );  
  });  
};  

// Menambahkan catatan  
export const addNote = (title: string, content: string) => {  
  db.transaction(tx => {  
    tx.executeSql(  
      'INSERT INTO Notes (title, content) VALUES (?, ?)',  
      [title, content],  
      () => console.log('Note added!'),  
      error => console.error('Failed to add note:', error)  
    );  
  });  
};  

// Mengambil semua catatan  
export const getNotes = (callback: (notes: any[]) => void) => {  
  db.transaction(tx => {  
    tx.executeSql(  
      'SELECT * FROM Notes',  
      [],  
      (tx, results) => {  
        const notes: any[] = [];  
        for (let i = 0; i < results.rows.length; i++) {  
          notes.push(results.rows.item(i));  
        }  
        callback(notes);  
      },  
      error => console.error('Failed to fetch notes:', error)  
    );  
  });  
};  

// Mendapatkan instance database  
export const getDB = () => db;