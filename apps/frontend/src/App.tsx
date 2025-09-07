import { useRecoilState } from 'recoil';
import './App.css'
import { Navbar } from './components/Navbar'
import { Pricebar } from './components/Pricebar';
import { Sidebar } from './components/Sidebar'
import { useEffect, useState } from 'react'
import { assetPricesAtom } from './store/atoms';
import { MiddleSection } from './components/MiddleSection';
import { OrderPlaceTab } from './components/OrderPlaceTab';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  let [showPriceBar, setShowPriceBar] = useState<boolean>(true);
  let [assetPrices, setAssetPrices] = useRecoilState(assetPricesAtom);

  useEffect(() => {
    const wsClient = new WebSocket("ws://localhost:8081");

    wsClient.onopen = () => {
      console.log("Established Frontend <> Price Relayer socket");
    };

    wsClient.onmessage = (event) => {
      let priceData = JSON.parse(event.data);
      setAssetPrices(priceData);
    }
  }, []);

  return <div style={{height: "100vh", width: "100vw", display: "flex", flexDirection: "column", backgroundColor: "#141d22"}}>
      <Navbar/>
      <button style={{height: "30px"}}
        onClick={() => {
    //       toast.error(
    //     <div>
    //         User Id Does not exist
    //     </div>,
    //     { 
    //         duration: 5000, 
    //         style: {
    //         borderRadius: "5px",
    //         background: "#595E63",
    //         color: "#fff"
    //     }}
    // );  
      }}>Generate</button>
      <div style={{flex: "1", display: "grid", gridTemplateColumns: showPriceBar ? "0.25fr 2fr 4fr 1.7fr" : "0.16666fr 4fr 1.7fr"}} className="greyBorder">
        <Sidebar onClick={setShowPriceBar}/>
        {
          showPriceBar && 
          <Pricebar assetPrices={assetPrices}/>
        }
        <MiddleSection/>
        <OrderPlaceTab/>
      </div>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
  </div>
}

export default App
