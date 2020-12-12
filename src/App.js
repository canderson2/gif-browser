import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [queriedSearchTerm, setQueriedSearchTerm] = useState('');

  const [results, setResults] = useState([]);

  const handleSubmit = (e) => {
    // console.log('submitting search request...');

    e.preventDefault();
    setQueriedSearchTerm(searchTerm);
  }

  const fetchTrendingResults = () => {
    return axios({
      method: 'GET',
      url: 'https://api.giphy.com/v1/gifs/trending',
      params: {
        api_key: process.env.REACT_APP_GIPHY_API_KEY, // required param
        limit: 25, // defaults to 25 per API docs
        offset: 0 // defaults to 0 per API docs
      }
    })
  }

  const fetchSearchResults = (query) => {
    return axios({
      method: 'GET',
      url: 'https://api.giphy.com/v1/gifs/search',
      params: {
        api_key: process.env.REACT_APP_GIPHY_API_KEY, // required param
        q: query, // required param
        limit: 25, // defaults to 25 per API docs
        offset: 0 // defaults to 0 per API docs
      }
    })
  }

  useEffect(() => {
    // fetchTrendingResults().then(res => {
    //   const fetchedData = res.data.data;
    //   // console.log('fetched data', fetchedData);
    //
    //   setResults(fetchedData);
    // })

    fetchSearchResults(queriedSearchTerm).then(res => {
      console.log('search results', res)

      setResults(res.data.data)
    })
  }, [queriedSearchTerm])


  return (
    <>
      <header>
        <div className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <a href="/" className="navbar-brand d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="me-2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <strong>GIF Browser</strong>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="py-5 text-center container">
          <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="input-group mb-3">
                  <input className="form-control" type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </form>
            </div>
          </div>
        </section>

        <div className="album py-5 bg-light">
          <div className="container">

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

              {results.map(result => {
                const { id, slug, title, images } = result;
                const { original: { url } } = images;
                const { fixed_width: { url: fixedWithUrl } } = images;
                const { fixed_height: { url: fixedHeightUrl } } = images;

                return (
                  <div key={id} className="col">
                    <div className="card shadow-sm">

                      <img src={url} alt={title}/>
                      <div className="card-body">
                        <p className="card-text">{title}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
