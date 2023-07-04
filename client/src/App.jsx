import { useState, useEffect  } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';


// Main app
function App() {
	
	const [data, setData] = useState(null);

    // Auto run on startup
    useEffect(() => {
        // Fetch data from api
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data.hello));
    }, []); // empty array -> never run again

    return (
        <div className="App">
        </div>
    );
}

export default App;
