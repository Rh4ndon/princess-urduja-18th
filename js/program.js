(function () {
  const PROGRAM_URL = CONFIG.PROGRAM_URL;

  if (!PROGRAM_URL || PROGRAM_URL.includes('YOUR_PROGRAM')) {
    document.getElementById('program-section').hidden = true;
    document.getElementById('tables-section').hidden = true;
    return;
  }

  fetch(PROGRAM_URL + '?action=getProgram')
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (!res.success || !res.data.length) {
        document.getElementById('program-section').hidden = true;
        document.getElementById('tables-section').hidden = true;
        return;
      }

      renderProgram(res.data);
      renderTables(res.data);
    })
    .catch(function () {
      document.getElementById('program-section').hidden = true;
      document.getElementById('tables-section').hidden = true;
    });

  function renderProgram(rows) {
    var list = document.getElementById('program-timeline');
    rows.forEach(function (row, i) {
      var label = row['Program Flow'];
      if (!label) return;
      var li = document.createElement('li');
      li.className = 'program-item';
      li.innerHTML =
        '<span class="program-num">' + (i + 1) + '</span>' +
        '<span class="program-label">' + escapeHtml(label) + '</span>';
      list.appendChild(li);
    });
  }

  function renderTables(rows) {
    var grid = document.getElementById('tables-grid');
    var categories = ['18 Roses', '18 Candles', '18 Treasures', '18 Blue Bills', '18 Gifts', '18th Shots'];

    categories.forEach(function (cat) {
      var names = rows.map(function (r) { return r[cat]; }).filter(function (n) { return n; });
      if (!names.length) return;

      var card = document.createElement('div');
      card.className = 'table-card';

      var h3 = document.createElement('h3');
      h3.className = 'script table-card-title';
      h3.textContent = cat;
      card.appendChild(h3);

      var ul = document.createElement('ul');
      ul.className = 'table-names';
      names.forEach(function (name) {
        var li = document.createElement('li');
        li.textContent = name;
        ul.appendChild(li);
      });
      card.appendChild(ul);
      grid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
