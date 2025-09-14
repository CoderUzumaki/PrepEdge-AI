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
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This will render the current page */}
      </main>
      <Footer />
    </div>
  );

}

export default App;
