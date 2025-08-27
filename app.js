(function () {
  const input = document.getElementById('searchInput');
  const container = document.getElementById('results');
  const select = document.getElementById('filterCategory');
  let data = [];

  function normalize(s) {
    return (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  function render(matches) {
    container.innerHTML = '';
    if (!matches.length) {
      container.innerHTML = '<p class="empty">Nenhum resultado encontrado.</p>';
      return;
    }
    for (const row of matches) {
      const html = `
        <article class="card">
          <h3>${row.medicamento}</h3>
          <p><strong>Categoria:</strong> <span class="badge">${row.categoria}</span></p>
          <p><strong>Observação:</strong> ${row.observacao || '-'}</p>
        </article>
      `;
      container.insertAdjacentHTML('beforeend', html);
    }
  }

  function onSearch() {
    const q = normalize(input.value);
    const cat = select.value;
    let matches = data.filter(row => {
      return (!q || normalize(row.medicamento).includes(q)) &&
             (!cat || row.categoria === cat);
    });
    render(matches);
  }

  function init(dataset) {
    data = dataset;
    // Preencher filtro de categorias
    const cats = [...new Set(data.map(r => r.categoria))].sort();
    for (const c of cats) {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    }
    input.addEventListener('input', onSearch);
    select.addEventListener('change', onSearch);
  }

  Papa.parse('data/remume2025.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      init(results.data);
      render(results.data);
    },
    error: function () {
      container.innerHTML = '<p class="empty">Erro ao carregar a base de dados.</p>';
    }
  });
})();