import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import OnTopBar from "./components/TopBar";
import ThemeToggle from "./components/ThemeToggle";

function App() {
	return (
		<div className="min-h-screen bg-white">
			<Header />
			<Home />
			<Footer />
			<OnTopBar />
			<ThemeToggle />
		</div>
	);
}
export default App;
