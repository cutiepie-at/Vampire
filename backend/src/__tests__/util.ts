export const dbConfig = {
  use: 'sqlite',
  sqlite: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: ':memory:',
    },
  },
};