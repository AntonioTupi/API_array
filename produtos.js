// produtos.js
export const produtos = [
    { id: 1, nome: 'Notebook', preco: 3500.00, estoque: 10, categoria: 'Informatica' },
    { id: 2, nome: 'Mouse Gamer', preco: 150.00, estoque: 50, categoria: 'Informatica' },
    { id: 3, nome: 'Teclado Mecânico', preco: 450.00, estoque: 30, categoria: 'Informatica' }
];

// Contador global para simular o auto-incremento do banco de dados
export let proximoId = produtos.length + 1;