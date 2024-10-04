import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Login from "./pages/Login";
import About from "./pages/About";
import Header from "./components/Header";
import SubNav from "./components/SubNav";
import ResidentailRental from "./pages/properties/ResidentailRental";
import CommercialRental from "./pages/properties/CommercialRental";
import MenWear from "./pages/clothing/MensWear";
import WomensWear from "./pages/clothing/WomensWear";
import KidsWear from "./pages/clothing/KidsWear";
import Shoes from "./pages/clothing/Shoes";
import Bags from "./pages/clothing/Bags";
import PartyCostumes from "./pages/clothing/PartyCostumes";
import Accessories from "./pages/clothing/Accessories";
import Powertools from "./pages/tools/Powertools";
import Buildertools from "./pages/tools/Buildertools";
import Gardentools from "./pages/tools/Gardentools";
import Partydecorations from "./pages/outdoors/Partydecorations";
import Campaigngear from "./pages/outdoors/Campaigngear";
import Marquee from "./pages/outdoors/Marquee";
import Bouncycastle from "./pages/outdoors/Bouncycastle";
import GardenFurniture from "./pages/outdoors/GardenFurniture";
import Bicycles from "./pages/outdoors/Bicycles";
import Boats from "./pages/outdoors/Boats";
import Barbecue from "./pages/outdoors/Barbecue";
import Cars from "./pages/vehicles/Cars";
import Vans from "./pages/vehicles/Vans";
import Caravans from "./pages/vehicles/Caravans";
import Motorbikes from "./pages/vehicles/Motorbikes";
import Scooter from "./pages/vehicles/Scooter";
import EBikes from "./pages/vehicles/EBikes";
import Properties from "./pages/properties/Properties";
import Camera from "./pages/electronics/Camera";
import Camcorder from "./pages/electronics/Camcorder";
import Studio from "./pages/electronics/Studio";
import SoundSystem from "./pages/electronics/SoundSystem";
import Lightings from "./pages/electronics/Lightings";
import Instruments from "./pages/electronics/Instruments";
import GameConsole from "./pages/electronics/GameConsole";
import Projector from "./pages/electronics/Projector";
import Laptops from "./pages/electronics/Laptops";
import Mobile from "./pages/electronics/Mobile";
import Furniture from "./pages/home-furniture/Furniture";
import KitchenApp from "./pages/home-furniture/KitchenApp";
import Events from "./pages/miscellaneous/Events";
import Community from "./pages/miscellaneous/Community";
import Jobs from "./pages/miscellaneous/Jobs";
import Freebies from "./pages/miscellaneous/Freebies";
import Services from "./pages/miscellaneous/Services";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <SubNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        {/**Add sub category routes */}
        <Route path="/properties" element={<Properties />}></Route>
        <Route path="/residential-rentals" element={<ResidentailRental />} />
        <Route path="/commercial-rentals" element={<CommercialRental />} />

        <Route path="/mens-wear" element={<MenWear />} />
        <Route path="/womens-wear" element={<WomensWear />} />
        <Route path="/kids-wear" element={<KidsWear />} />
        <Route path="/shoes" element={<Shoes />} />
        <Route path="/bags" element={<Bags />} />
        <Route path="/party-costumes" element={<PartyCostumes />} />
        <Route path="/accessories" element={<Accessories />} />

        <Route path="/power-tools" element={<Powertools />} />
        <Route path="/builder-tools" element={<Buildertools />} />
        <Route path="/gardening" element={<Gardentools />} />

        <Route path="/party-decoration" element={<Partydecorations />} />
        <Route path="/camping-gear" element={<Campaigngear />} />
        <Route path="/marquee" element={<Marquee />} />
        <Route path="/bouncy-castle" element={<Bouncycastle />} />
        <Route path="/garden-furniture" element={<GardenFurniture />} />
        <Route path="/bicycles" element={<Bicycles />} />
        <Route path="/boats" element={<Boats />} />
        <Route path="/barbecue-grills" element={<Barbecue />} />

        <Route path="/cars" element={<Cars />} />
        <Route path="/van" element={<Vans />} />
        <Route path="/caravan" element={<Caravans />} />
        <Route path="/motorbikes" element={<Motorbikes />} />
        <Route path="/scooters" element={<Scooter />} />
        <Route path="/e-bikes" element={<EBikes />} />

        <Route path="/cameras" element={<Camera />} />
        <Route path="/camcorders" element={<Camcorder />} />
        <Route path="/studio-equipments" element={<Studio />} />
        <Route path="/sound-system" element={<SoundSystem />} />
        <Route path="/party-lightings" element={<Lightings />} />
        <Route path="/instruments" element={<Instruments />} />
        <Route path="/game-consoles" element={<GameConsole />} />
        <Route path="/projectors" element={<Projector />} />
        <Route path="/laptops" element={<Laptops />} />
        <Route path="/mobile-&-tab" element={<Mobile />} />

        <Route path="/furniture" element={<Furniture />} />
        <Route path="/kitchen-appliances" element={<KitchenApp />} />

        <Route path="/events" element={<Events />} />
        <Route path="/community" element={<Community />} />
        <Route path="/services" element={<Services />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/freebies" element={<Freebies />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
