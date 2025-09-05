import { RecoilRoot, useRecoilState } from 'recoil';
import './App.css'
import { Navbar } from './components/Navbar'
import { Pricebar } from './components/Pricebar';
import { Sidebar } from './components/Sidebar'
import { useEffect, useState } from 'react'
import { assetPriceAtom } from './store/atoms';
import { MiddleSection } from './components/MiddleSection';

function App() {
  let [showPriceBar, setShowPriceBar] = useState<boolean>(true);
  let [price, setPrice] = useState(0);
  let [assetPrice, setAssetPrice] = useRecoilState(assetPriceAtom);

  useEffect(() => {
    const wsClient = new WebSocket("ws://localhost:8081");

    wsClient.onopen = () => {
      console.log("Established Frontend <> Price Relayer socket");
    };

    wsClient.onmessage = (event) => {
      let priceData = JSON.parse(event.data);
      setAssetPrice(priceData);
    }
  }, []);

  return <div style={{height: "100vh", width: "100vw", display: "flex", flexDirection: "column", backgroundColor: "#141d22"}}>
      <Navbar/>
      <button style={{height: "30px"}}
        onClick={() => {
          let num = Math.random();
          setPrice(num * 1000);
      }}>Generate</button>
      <div style={{flex: "1", display: "grid", gridTemplateColumns: showPriceBar ? "0.25fr 2fr 4fr 1.7fr" : "0.16666fr 4fr 1.7fr"}} className="greyBorder">
        <Sidebar onClick={setShowPriceBar}/>
        {
          showPriceBar && 
          <Pricebar value={assetPrice.btc}/>
        }
        <MiddleSection/>
        
        <div style={{borderStyle: "solid", borderWidth: "2px", borderColor: "#3f474b"}} className="gridContent">Grid 4</div>
      </div>
  </div>
}

export default App
