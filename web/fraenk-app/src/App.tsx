import './App.css'
import { observer } from 'mobx-react-lite';
import { rootStore } from './stores/RootStore.tsx';

import Footer from './components/Footer.tsx'
import Header from './components/Header.tsx'
import Page from './components/Page.tsx'

function App() {
    const contentStore = rootStore.contentStore;

    contentStore.loadJson("/fraenk.json");
    const rootNode = contentStore.root;

    return  (
        <div>
            <Header/>
            <Page node={rootNode | {"props": {"value":""}}} />
            <Footer/>
        </div>
        );
}

export default observer(App)
