const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ To-Do App server running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/tasks`);
});
