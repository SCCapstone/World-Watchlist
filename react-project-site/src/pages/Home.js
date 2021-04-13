import appInfo from '../data/appInfo.js';

function Home() {
    return <div>
        <h2>{appInfo["WhatIs"]["header"]}</h2>
        <p>{appInfo["WhatIs"]["body"]}</p>
        <h2>{appInfo["WhatFor"]["header"]}</h2>
        <p>{appInfo["WhatFor"]["body"]}</p>
    </div>
}
export default Home;