import SearchBar from "./components/SearchBar";
import WatchList from "./components/WatchList/WatchList";
import { Columns } from "./components/WatchList/Columns";
import { WatchListProvider } from "./WatchList.context";
import "./App.css";

function App() {
  return (
    <WatchListProvider>
      <SearchBar />
      <div className="container mx-auto py-10">
        <WatchList columns={Columns} />
      </div>
    </WatchListProvider>
  );
}

export default App;
