// app.js
// Importa o framework Express para criar a API.
import express from 'express';
// Importa a lista de produtos e o contador do próximo ID disponível.
import { produtos, proximoId } from './produtos.js';

// Cria a aplicação Express.
const app = express();
// Define a porta em que o servidor será executado.
const PORT = 3000;

// Middleware fundamental para ler o JSON enviado no corpo da requisição.
// Permite que o servidor entenda os dados enviados em formato JSON pelo cliente.
app.use(express.json());

// --- ROTAS GET  ---
// Rota GET para listar todos os produtos cadastrados.
app.get('/produtos', (req, res) => {
    // Envia a resposta com status 200 (OK) e o array de produtos em JSON.
    res.status(200).json(produtos);
});

// Rota GET para buscar os produtos por categoria.
app.get('/produtos/categoria/:categoria', (req, res) => {
    // Obtém a categoria informada na URL e remove espaços do início e do fim.
    const categoria = req.params.categoria.trim();
    // Busca todos os produtos que pertencem à categoria informada.
    const produtosCategoria = produtos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());

    // Se existir pelo menos um produto nessa categoria, retorna a lista.
    if (produtosCategoria.length > 0) {
        res.status(200).json(produtosCategoria);
    } else {
        // Se não houver produtos, retorna erro 404.
        res.status(404).json({ mensagem: `Nenhum produto encontrado na categoria ${categoria}` });
    }
});

// Rota GET para buscar um produto pelo ID.
app.get('/produtos/:id', (req, res) => {
    // Converte o parâmetro da URL (string) para número inteiro.
    const id = parseInt(req.params.id);
    // Procura um produto no array cujo id seja igual ao informado na URL.
    const produto = produtos.find(p => p.id === id);

    // Se o produto foi encontrado, retorna ele.
    if (produto) {
        res.status(200).json(produto);
    } else {
        // Se não foi encontrado, retorna erro 404 com mensagem.
        res.status(404).json({ mensagem: `Produto ${id} não encontrado` });
    }
});

// --- NOVA ROTA POST: CRIAR PRODUTO ---
// Rota POST para criar um novo produto no array em memória.
app.post('/produtos', (req, res) => {
    // Desestruturação dos dados recebidos no corpo da requisição (req.body).
    // Extrai nome, preco, estoque e categoria do objeto enviado pelo cliente.
    const { nome, preco, estoque, categoria } = req.body;

    // Validação simples dos campos obrigatórios.
    // Se algum campo estiver vazio ou ausente, retorna erro 400.
    if (!nome || preco === undefined || estoque === undefined || !categoria) {
        return res.status(400).json({
            mensagem: 'Todos os campos (nome, preco, estoque, categoria) são obrigatórios.'
        });
    }

    // Criação do novo objeto com a sintaxe reduzida do ES6 (Property Shorthand).
    const novoProduto = {
        // Usa o valor atual de proximoId e depois incrementa para garantir IDs únicos.
        id: proximoId++,
        // Copia os valores recebidos para o objeto do produto.
        nome,
        // Converte o preço para número decimal.
        preco: parseFloat(preco),
        // Converte o estoque para número inteiro.
        estoque: parseInt(estoque),
        categoria
    };

    // Adiciona o novo produto ao array em memória.
    produtos.push(novoProduto);

    // Retorna o produto criado com o código HTTP 201 (Created).
    res.status(201).json(novoProduto);
});

// ==========================================
// 4. UPDATE (PUT) - Atualizar produto por ID
// ==========================================
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, preco, estoque, categoria } = req.body;

    // Localiza o índice do elemento no array
    const index = produtos.findIndex(p => p.id === id);

    // Se o item não for localizado, retorna 404
    if (index === -1) {
        return res.status(404).json({ mensagem: `Produto com ID ${id} não encontrado para atualização.` });
    }

    // Validação simples dos dados recebidos
    if (!nome || preco === undefined || estoque === undefined || !categoria) {
        return res.status(400).json({
            mensagem: 'Todos os campos (nome, preco, estoque, categoria) devem ser informados.'
        });
    }

    // Substitui os dados mantendo o ID original intacto
    produtos[index] = {
        id,
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoria
    };

    res.status(200).json(produtos[index]);
});

// ==========================================
// 5. DELETE (DELETE) - Remover produto por ID
// ==========================================
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Localiza o índice do elemento no array
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: `Produto com ID ${id} não encontrado para exclusão.` });
    }

    // Remove 1 elemento a partir da posição encontrada usando splice
    const [produtoRemovido] = produtos.splice(index, 1);

    // Retorna confirmação e o objeto excluído
    res.status(200).json({
        mensagem: `Produto com ID ${id} removido com sucesso.`,
        produto: produtoRemovido
    });
});

// Inicialização do servidor.
// Quando o servidor iniciar, imprime no terminal a URL de acesso.
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});