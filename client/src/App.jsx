// import Header from "./components/Header";
// import Home from "./pages/Home";
// import Footer from "./components/Footer";

// function App() {
// 	return (
// 		<div className="min-h-screen bg-white">
// 			<Header />
// 			<Home />
// 			<Footer />
// 		</div>
// 	);
// }
// export default App;
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";


function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-grow focus:outline-none">
        <Outlet /> {/* This will render the current page */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
