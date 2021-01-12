import React, {useEffect, useState} from 'react';
import {createWorker, createScheduler} from 'tesseract.js';
import './App.css';
import {parse} from 'mrz';

import getMrz from './getMrz';
import {Image} from 'image-js';


// import test from './testImages/mrzOnly.jpg';
// import test from './testImages/download.jpg';
// import test from './testImages/images.jpg';
// import test from './testImages/images1.jpg';
import test from './testImages/nir.jpg';
// import test from './testImages/testIM.png';
// import test from './testImages/gallery-5c47db59cede8.jpg';
//  import test from './testImages/lkhasgd.png';


// const scheduler = createScheduler();

//langPath: 'https://cdn.jsdelivr.net/gh/uwolfer/tesseract-mrz@master/lang'
function App() {
    const [ocr, setOcr] = useState('waiting for your click...');
    const [parsedData, setParsedData] = useState({});
    const worker = createWorker({
        langPath: 'https://cdn.jsdelivr.net/gh/uwolfer/tesseract-mrz@master/lang,',
        // gzip: false,
        // logger: m => console.log(m)
    });
    const mrzDetection = async () => {
        // let image = await Image.load('nir.jpg');
        let image1 = await Image.load(test);
        const detecion = getMrz(image1);
        document.getElementById('result').src = detecion.toDataURL();
    };

    // useEffect(() => {
    //     (async () => {
    //         console.log('Initializing Tesseract.js');
    //         for (let i = 0; i < 4; i++) {
    //             const workerForScheduler = createWorker({langPath: 'https://cdn.jsdelivr.net/gh/uwolfer/tesseract-mrz@master/lang'});
    //             await workerForScheduler.load();
    //             await workerForScheduler.loadLanguage('OCRB');
    //             await workerForScheduler.initialize('OCRB');
    //             scheduler.addWorker(workerForScheduler);
    //         }
    //         console.log('Initialized Tesseract.js');
    //     })();
    // }, []);
    // const runScheduler = async () => {
    //     const {data: {text}} = await scheduler.addJob('recognize', test);
    //     setTextToShow(text);
    // };
    const renderedList = Object.keys(parsedData).map((value, index) => {
            return <h4>{value}:{parsedData[value]}</h4>;
        }
    );

    const doOCR = async () => {
        setOcr('detecting...');
        await worker.load();
        await worker.loadLanguage('OCRB');
        await worker.initialize('OCRB');
        const {data: {lines, text}} = await worker.recognize(document.getElementById('result'));
        let mrz = [];
        lines.forEach(line => {
            mrz.push(line.text.replace(/ |\r\n|\r|\n/g, ""));
        });
        // const result = parse(mrz);
        setOcr('raw data found:    ' + text);
        // setParsedData(result.fields);
        await worker.terminate();
    };
    return (
        <div className="App">
            <img id='main-image' src={test} width={'250px'}/>
            <p>
                <button onClick={() => {
                    mrzDetection();
                }}>Test Detection only
                </button>
            </p>
            <p>
                <button onClick={() => {
                    doOCR();
                }}>Click me to detect
                </button>
            </p>

            <p>{ocr}</p>
            {renderedList}
            <img id="result" width={'250px'}/>
            {/*<button onClick={() => {*/}
            {/*    runScheduler();*/}
            {/*}}>Press here to detect using 4 workers*/}
            {/*</button>*/}
            {/*<p>{textToShow}</p>*/}
        </div>
    );
}

export default App;
