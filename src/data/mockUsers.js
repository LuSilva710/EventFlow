/**
 * MOCK USERS — Usuários simulados para apresentação do trabalho de IHC.
 * Sem persistência em banco de dados, apenas vetores em memória.
 *
 * Cada usuário possui:
 *   - id, name, email, password (para login)
 *   - phone, document (dados de perfil)
 *   - memberSince (data de cadastro fictícia)
 *   - tickets[] (ingressos pré-existentes vinculados ao usuário)
 */

const MOCK_USERS = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    password: '1234',
    phone: '(31) 98490-2872',
    document: '056.874.891-21',
    memberSince: '12/2023',
    tickets: [
      {
        id: 'T-100234',
        eventId: 4,
        category: 'vip',
        seats: ['A5', 'A6'],
        date: '2026-03-10T21:00:00',
        purchaseDate: '2026-02-15'
      },
      {
        id: 'T-100590',
        eventId: 5,
        category: 'normal',
        seats: [],
        date: '2026-01-20T18:00:00',
        purchaseDate: '2025-12-01'
      },
      {
        id: 'T-200781',
        eventId: 2,
        category: 'vip',
        seats: ['B3'],
        date: '2026-05-02T19:30:00',
        purchaseDate: '2026-04-10'
      },
      {
        id: 'T-200902',
        eventId: 1,
        category: 'premium',
        seats: ['C12', 'C13'],
        date: '2026-05-15T20:00:00',
        purchaseDate: '2026-04-22'
      }
    ]
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    password: '1234',
    phone: '(11) 98877-3321',
    document: '289.456.123-90',
    memberSince: '03/2024',
    tickets: [
      {
        id: 'T-300112',
        eventId: 1,
        category: 'vip',
        seats: ['D7', 'D8'],
        date: '2026-05-15T20:00:00',
        purchaseDate: '2026-03-20'
      },
      {
        id: 'T-300445',
        eventId: 3,
        category: 'normal',
        seats: [],
        date: '2026-06-10T22:00:00',
        purchaseDate: '2026-04-05'
      }
    ]
  },
  {
    id: 3,
    name: 'Carlos Mendes',
    email: 'carlos@email.com',
    password: '1234',
    phone: '(21) 97654-1122',
    document: '456.789.012-34',
    memberSince: '08/2024',
    tickets: [
      {
        id: 'T-400678',
        eventId: 2,
        category: 'normal',
        seats: ['E1'],
        date: '2026-05-02T19:30:00',
        purchaseDate: '2026-04-15'
      }
    ]
  },
  {
    id: 4,
    name: 'Ana Beatriz Costa',
    email: 'ana@email.com',
    password: '1234',
    phone: '(41) 99988-7766',
    document: '321.654.987-65',
    memberSince: '01/2025',
    tickets: [
      {
        id: 'T-500321',
        eventId: 1,
        category: 'premium',
        seats: ['F1', 'F2', 'F3'],
        date: '2026-05-15T20:00:00',
        purchaseDate: '2026-04-28'
      },
      {
        id: 'T-500455',
        eventId: 3,
        category: 'normal',
        seats: [],
        date: '2026-06-10T22:00:00',
        purchaseDate: '2026-04-28'
      },
      {
        id: 'T-500600',
        eventId: 4,
        category: 'normal',
        seats: ['G10'],
        date: '2026-03-10T21:00:00',
        purchaseDate: '2026-02-28'
      }
    ]
  },
  {
    id: 5,
    name: 'Lucas Ferreira',
    email: 'lucas@email.com',
    password: '1234',
    phone: '(62) 99123-4567',
    document: '654.321.098-76',
    memberSince: '04/2025',
    tickets: []
  }
];

/**
 * Autentica um usuário pelo email e senha.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export function authenticateUser(email, password) {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: 'E-mail ou senha inválidos.' };
  }

  // Retorna os dados do usuário SEM a senha
  const { password: _, ...safeUser } = user;
  return { success: true, user: safeUser };
}

/**
 * Registra um novo usuário (adiciona ao vetor em memória).
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export function registerUser({ name, email, password }) {
  const exists = MOCK_USERS.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return { success: false, error: 'Este e-mail já está cadastrado.' };
  }

  const newUser = {
    id: MOCK_USERS.length + 1,
    name,
    email,
    password,
    phone: '',
    document: '',
    memberSince: new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }),
    tickets: []
  };

  MOCK_USERS.push(newUser);

  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

/**
 * Retorna lista resumida dos usuários para exibir como dica no Login.
 * Ideal para a apresentação — mostra email e senha de cada mock.
 */
export function getLoginHints() {
  return MOCK_USERS.map((u) => ({
    name: u.name,
    email: u.email,
    password: u.password
  }));
}

export default MOCK_USERS;
