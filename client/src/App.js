
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import config from './config.js';
// MUI
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// Components
import Gallery from './Components/Gallery.js';
import Logo from './logo.png';


function App() {
  // Hooks
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(2);
  const [haveSearched, setHaveSearched] = useState(false)
  const loader = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [photos, setPhotos] = useState([])

  // When scrolled to bottom Set page # to next, triggering fetch for endless scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);
  // 
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const handleSearch = async () => {
    console.log('Search triggered');
    try {
      await setLoading(true)
      fetch(`${config.apiUrl.url}/${query}/1/` )
      .then(res => res.json())
      .then(data => {
        console.dir(data.urls);
        // if no data returned or error returned, set error
        if (data.urls === [] || data.urls === '' || data.error) {
          setError(true)
          setLoading(false)
        }
        setPhotos(data.urls);
        setHaveSearched(true);
      });
    } catch (err) {
      setError(err)
      setLoading(false)
      throw new Error(err)
    }
  }
  // fetches new data for endless scroll feature
  const handleFetch = useCallback(async() => {
    console.log('Querying page: ' + page);
    try {
        await setLoading(true)
        await setError(false)
        fetch(`${config.apiUrl.url}/${query}/${page}/`, )
        .then(res => res.json())
        .then(data => {
          console.log(data.urls);
          if (data.error) {
            setError(true)
            setLoading(false)
          }
          setPhotos((prev) => [...prev, ...data.urls])
        });
        setLoading(false)
    } catch (err) {
        setError(err)
        setLoading(false)
    }
  }, [query, page]);

    
  //On a new search, enable scroll fetching
  useEffect(() => {
    if (haveSearched === true) {
      handleFetch(query)
    }
  }, [query, page, haveSearched]);


  const handleRandomSrch = async () => {
    setQuery('random');
    try {
      await setLoading(true)
      fetch(`${config.apiUrl.url}/random/1/` )
      .then(res => res.json())
      .then(data => {
        console.dir(data.urls);
        if (data.urls === [] || data.urls === '' || data.error) setError(true)
        setPhotos(data.urls);
        setHaveSearched(true);
      });
    } catch (err) {
      setError(err)
      throw new Error(err)
    }
}

  const handleInputChange = e => {
    setQuery(e.target.value)
    // stop fetching when input has changed
    setHaveSearched(false)
    setPage(2) // scroll fetching start on page 2
    setError(false)
  }

  return (
    <div className="App">
        <a href='/'><img src={Logo} style={{borderRadius: 10}} alt="AppStem"/></a>

        <div className='inputDiv'>
              <TextField
                value={query}
                onChange={ handleInputChange }
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                id="outlined-basic"
                variant="outlined"
                fullWidth
                label="Search for Photos"
            />

          <div className='inputBtns' style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Button variant="contained" style={{marginLeft:10}} onClick={ handleSearch }>Search</Button>
          <Button variant="outlined" style={{marginLeft:10}} onClick={ handleRandomSrch }>Random</Button>
          </div>
        </div>

        {/* Pass photo data to gallery component */}
        <Gallery data={photos}/>

        {/* Show loading until results */}
        {loading &&  <h2>Loading ...</h2>}
        {loading &&     <Box sx={{ display: 'flex' }} style={{justifyContent: 'center', fontSize: '3em'}}>
                          <CircularProgress />
                        </Box>}

        {/* Display error message if present */}
        {error && <h4 style={{color:'red'}}>Error with your request!</h4>}

        <br/>
        <br/>

        {/* Div To identify when user has scrolled to bottom to trigger fetch */}
        <div ref={loader} />

     </div>
  );
}

export default App;

