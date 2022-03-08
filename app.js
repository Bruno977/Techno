const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
  },
  filters: {
    formataPreco(valor) {
      return valor.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
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
  },
  created() {
    this.fetchProducts();
  },
});
