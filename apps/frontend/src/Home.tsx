import { RecoilRoot } from "recoil"
import App from "./App"

function Home() {
    return <div style={{height: "100%", width: "100%"}}>
        <RecoilRoot>
            <App/>
        </RecoilRoot>
    </div>
}

export default Home