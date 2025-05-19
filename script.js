async function loadModule(name) {
  const response = await fetch(`data/${name}.md`);
  const text = await response.text();
  document.getElementById('content').innerHTML = marked.parse(text); // using marked.js
}
