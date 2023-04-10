// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// here we import our Hello42 component
// and then use it in this very small
// App

import React from 'react';
import Hello42 from './components/hello42';

const App = () => {
  return (
    <div>
      {/* <h1>Hello World 42, first API</h1> */}
      <Hello42 />
    </div>
  );
};

export default App;
