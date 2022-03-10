const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: "",
    alertaAtivo: false,
    carrinhoAtivo: false,
  },
  filters: {
    formataPreco(valor) {
      return valor.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    async fetchProducts() {
      const response = await fetch("./api/produtos.json");
      const json = await response.json();
      this.produtos = json;
    },
    async fetchProduct(id) {
      const response = await fetch(`./api/produtos/${id}/dados.json`);
      const json = await response.json();
      this.produto = json;
    },
    openModal(id) {
      this.fetchProduct(id);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    closeModal({ target, currentTarget }) {
      if (target === currentTarget) {
        this.produto = false;
        this.carrinhoAtivo = false;
      }
    },
    addItemCart() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.alert(`${nome} adicionado ao carrinho`);
    },
    removeItemCart(index) {
      this.carrinho.splice(index, 1);
    },
    checkLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    compareStock() {
      const items = this.carrinho.filter(({ id }) => id === this.produto.id);
      this.produto.estoque -= items.length;
    },
    alert(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 2000);
    },
    router() {
      const hash = document.location.hash;
      if (hash) this.fetchProduct(hash.replace("#", ""));
    },
  },
  watch: {
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      this.compareStock();
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
  },
  created() {
    this.fetchProducts();
    this.router();
    this.checkLocalStorage();
  },
});
