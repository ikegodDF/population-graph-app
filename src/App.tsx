import Page from "./pages/page";
import "./App.css";

function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        都道府県別人口推移グラフ
      </h1>
      <Page />
    </div>
  );
}

export default App;
