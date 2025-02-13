import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./auth/firebase"; // Import your Firebase auth configuration
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Login from "./pages/Login";
import About from "./pages/About";
import Header from "./components/Header";
import SubNav from "./components/SubNav";
import ResidentailRental from "./pages/properties/ResidentailRental";
import CommercialRental from "./pages/properties/CommercialRental";
import Clothing from "./pages/clothing/Clothing-Accessoiers";
import MenWear from "./pages/clothing/MensWear";
import WomensWear from "./pages/clothing/WomensWear";
import KidsWear from "./pages/clothing/KidsWear";
import Shoes from "./pages/clothing/Shoes";
import Bags from "./pages/clothing/Bags";
import PartyCostumes from "./pages/clothing/PartyCostumes";
import Accessories from "./pages/clothing/Accessories";
import Tools_Equipments from "./pages/tools/Tools&Equipments";
import Powertools from "./pages/tools/Powertools";
import Buildertools from "./pages/tools/Buildertools";
import Gardentools from "./pages/tools/Gardentools";
import Partydecorations from "./pages/outdoors/Partydecorations";
import Campaigngear from "./pages/outdoors/Campaigngear";
import Outdoor_Advendure from "./pages/outdoors/Outdoor&Advendture";
import Marquee from "./pages/outdoors/Marquee";
import Bouncycastle from "./pages/outdoors/Bouncycastle";
import GardenFurniture from "./pages/outdoors/GardenFurniture";
import Bicycles from "./pages/outdoors/Bicycles";
import Boats from "./pages/outdoors/Boats";
import Barbecue from "./pages/outdoors/Barbecue";
import Vehicles from "./pages/vehicles/Vehicles";
import Cars from "./pages/vehicles/Cars";
import Vans from "./pages/vehicles/Vans";
import Caravans from "./pages/vehicles/Caravans";
import Motorbikes from "./pages/vehicles/Motorbikes";
import Scooter from "./pages/vehicles/Scooter";
import EBikes from "./pages/vehicles/EBikes";
import Properties from "./pages/properties/Properties";
import Electronics from "./pages/electronics/Electronics";
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
import HomeFurniture from "./pages/home-furniture/Home&Furniture";
import Furniture from "./pages/home-furniture/Furniture";
import KitchenApp from "./pages/home-furniture/KitchenApp";
import Miscelleneous from "./pages/miscellaneous/Miscellaneous";
import Events from "./pages/miscellaneous/Events";
import Community from "./pages/miscellaneous/Community";
import Jobs from "./pages/miscellaneous/Jobs";
import Freebies from "./pages/miscellaneous/Freebies";
import Services from "./pages/miscellaneous/Services";
import Footer from "./components/Footer";
import Ads from "./pages/manage/Ads";

const App = () => {
  const [user, setUser] = useState(null); // Global user state

  // Monitor authentication state on page load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the authenticated user
      } else {
        setUser(null); // User is signed out
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <BrowserRouter>
      {/* Pass user and setUser to Header */}
      <Header user={user} setUser={setUser} />
      <SubNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />{" "}
        {/* Pass setUser */}
        <Route path="/manage-ads" element={<Ads user={user} />} />
        <Route path="/about" element={<About />} />
        {/** Add subcategory routes */}
        <Route path="/properties" element={<Properties />}></Route>
        <Route
          path="/properties/residential-rentals"
          element={<ResidentailRental />}
        />
        <Route
          path="/properties/commercial-rentals"
          element={<CommercialRental />}
        />
        <Route path="/clothing-accessories" element={<Clothing />} />
        <Route path="/clothing-accessories/mens-wear" element={<MenWear />} />
        <Route
          path="/clothing-accessories/womens-wear"
          element={<WomensWear />}
        />
        <Route path="/clothing-accessories/kids-wear" element={<KidsWear />} />
        <Route path="/clothing-accessories/shoes" element={<Shoes />} />
        <Route path="/clothing-accessories/bags" element={<Bags />} />
        <Route
          path="/clothing-accessories/party-costumes"
          element={<PartyCostumes />}
        />
        <Route
          path="/clothing-accessories/accessories"
          element={<Accessories />}
        />
        <Route path="/tools-equipments" element={<Tools_Equipments />} />
        <Route path="/tools-equipments/power-tools" element={<Powertools />} />
        <Route
          path="/tools-equipments/builder-tools"
          element={<Buildertools />}
        />
        <Route
          path="/tools-equipments/garden-tools"
          element={<Gardentools />}
        />
        <Route path="/outdoor-adventure" element={<Outdoor_Advendure />} />
        <Route
          path="/outdoor-adventure/party-decoration"
          element={<Partydecorations />}
        />
        <Route
          path="/outdoor-adventure/camping-gear"
          element={<Campaigngear />}
        />
        <Route path="/outdoor-adventure/marquee" element={<Marquee />} />
        <Route
          path="/outdoor-adventure/bouncy-castle"
          element={<Bouncycastle />}
        />
        <Route
          path="/outdoor-adventure/garden-furniture"
          element={<GardenFurniture />}
        />
        <Route path="/outdoor-adventure/bicycles" element={<Bicycles />} />
        <Route path="/outdoor-adventure/boats" element={<Boats />} />
        <Route
          path="/outdoor-adventure/barbecue-grills"
          element={<Barbecue />}
        />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/cars" element={<Cars />} />
        <Route path="/vehicles/van" element={<Vans />} />
        <Route path="/vehicles/caravan" element={<Caravans />} />
        <Route path="/vehicles/motorbikes" element={<Motorbikes />} />
        <Route path="/vehicles/scooters" element={<Scooter />} />
        <Route path="/vehicles/e-bikes" element={<EBikes />} />
        <Route path="/electronics-gadgets" element={<Electronics />} />
        <Route path="/electronics-gadgets/cameras" element={<Camera />} />
        <Route path="/electronics-gadgets/camcorders" element={<Camcorder />} />
        <Route
          path="/electronics-gadgets/studio-equipments"
          element={<Studio />}
        />
        <Route
          path="/electronics-gadgets/sound-system"
          element={<SoundSystem />}
        />
        <Route
          path="/electronics-gadgets/party-lightings"
          element={<Lightings />}
        />
        <Route
          path="/electronics-gadgets/instruments"
          element={<Instruments />}
        />
        <Route
          path="/electronics-gadgets/game-consoles"
          element={<GameConsole />}
        />
        <Route path="/electronics-gadgets/projectors" element={<Projector />} />
        <Route path="/electronics-gadgets/laptops" element={<Laptops />} />
        <Route path="/electronics-gadgets/mobile-&-tab" element={<Mobile />} />
        <Route path="/home-furniture" element={<HomeFurniture />} />
        <Route path="/home-furniture/furniture" element={<Furniture />} />
        <Route
          path="/home-furniture/kitchen-appliances"
          element={<KitchenApp />}
        />
        <Route path="miscellaneous" element={<Miscelleneous />} />
        <Route path="/miscellaneous/events" element={<Events />} />
        <Route path="/miscellaneous/community" element={<Community />} />
        <Route path="/miscellaneous/services" element={<Services />} />
        <Route path="/miscellaneous/jobs" element={<Jobs />} />
        <Route path="/miscellaneous/freebies" element={<Freebies />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
