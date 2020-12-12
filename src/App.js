import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

const App = () => {
  const PER_PAGE_LIMIT = 24; // a number divisible by 3 (3 GIFs per row)

  const [searchTerm, setSearchTerm] = useState('');
  const [queriedSearchTerm, setQueriedSearchTerm] = useState('');

  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);

  const shouldDisplayTrendingResults = () => queriedSearchTerm.trim() === '';

  const handleSubmit = (e) => {
    e.preventDefault();

    setResults([]);
    setHasMoreResults(true);
    setOffset(0);
    setQueriedSearchTerm(searchTerm);
  }

  const fetchTrendingResults = (offset) => {
    return axios({
      method: 'GET',
      url: 'https://api.giphy.com/v1/gifs/trending',
      params: {
        api_key: process.env.REACT_APP_GIPHY_API_KEY, // required param
        limit: PER_PAGE_LIMIT, // defaults to 25 per API docs
        offset: offset // defaults to 0 per API docs
      }
    })
  }

  const fetchSearchResults = (query, offset) => {
    return axios({
      method: 'GET',
      url: 'https://api.giphy.com/v1/gifs/search',
      params: {
        api_key: process.env.REACT_APP_GIPHY_API_KEY, // required param
        q: query, // required param
        limit: PER_PAGE_LIMIT, // defaults to 25 per API docs
        offset: offset // defaults to 0 per API docs
      }
    })
  }

  const fetchResults = (query, offset) => {
    if (shouldDisplayTrendingResults()) {
      return fetchTrendingResults(offset);
    }

    return fetchSearchResults(query, offset);
  }

  useEffect(() => {
    setLoading(true);

    fetchResults(queriedSearchTerm, offset).then(res => {
      const fetchedResults = res.data.data;

      if (fetchedResults.length === 0) {
        setHasMoreResults(false);
      } else {
        setResults(prevResults => _.uniqBy([...prevResults, ...fetchedResults], 'id'));
      }

      setLoading(false);
    })
  }, [queriedSearchTerm, offset])

  useEffect(() => {
    const target = document.querySelector('#load-more-results');

    const observer = new IntersectionObserver((entries) => {
      if (loading || results.length === 0) return;

      if (entries[0].isIntersecting && hasMoreResults) {
        setOffset(prevOffset => prevOffset + PER_PAGE_LIMIT)
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [loading, hasMoreResults, results])

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
              <div id="load-more-results"></div>
            </div>
            {loading && (<div>Loading results...</div>)}
            {!loading && !hasMoreResults && results.length > 0 && (<div>No more results.</div>)}
            {!loading && !hasMoreResults && results.length === 0 && (<div>No results found.</div>)}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
