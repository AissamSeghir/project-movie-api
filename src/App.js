import React, { useState, useEffect } from 'react';
import './App.css';
import Notfound from './component/Notfound';

export default function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState(false);
  const [page, setPage] = useState([]);
  const [nbrpage, setNbrpage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (search.trim() === '') {
      const urlRated = `https://api.themoviedb.org/3/discover/tv?api_key=fef55a6754f2f6d00a0038388915039c&include_adult=false&page=${nbrpage}`;
      setLoading(true);
      fetch(urlRated)
        .then(res => res.json())
        .then(dt => {
          setData(dt.results);
          setPage(Array(dt.total_pages).fill().map((_, i) => i + 1));
        })
        .catch(err => {
          console.error('Failed to fetch:', err);
        }).finally(()=>{
          setTimeout(() => {
            setLoading(false)
          }, 3000);
        });
    }
  }, [nbrpage]);

  const getdata = (page) => {
    const url = `https://api.themoviedb.org/3/search/tv?api_key=fef55a6754f2f6d00a0038388915039c&include_adult=false&query=${search}&page=${page}`;
    fetch(url)
      .then(res => res.json())
      .then(dt => {
        setData(dt.results);
        setPage(Array(dt.total_pages).fill().map((_, i) => i + 1));
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
      }).finally(()=>{
        setTimeout(() => {
          setLoading(false)
        }, 1000);
      })
  };

  useEffect(() => {
    if (search.trim() !== '') {
      getdata(1);
      setNbrpage(1);
      setAction(true);
    }
  }, [search]);

  const btnclick = () => {
    getdata(1);
    setNbrpage(1);
    setAction(true);
  };

  const pgclick = (pageNum) => {
    getdata(pageNum);
    setNbrpage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`App ${loading ? "loading" :""}`}>
      <nav>
        <div className="logo">
          <a href="https://aissamseghir.github.io/project-movie-api/"><h2>Movies<span>SGH</span></h2></a>
        </div>
        <div className="search">
          <input type='text' onChange={e => setSearch(e.target.value)} placeholder='Search movie' />
          <button onClick={btnclick}><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
      </nav>

      {search.trim() !== '' && action && data.length===0 &&
        <div className="nfound">{`this movie " ${search}" not found `} 
          <div >
            <Notfound/>
          </div>
        </div>
      }

      {loading &&<div data-spinner="" className={`spinner-three-bounce `}>
    <div data-bounce1=""></div>
    <div data-bounce2=""></div>
    <div data-bounce3=""></div>
</div> }

      {!action &&
        <div className="top-rated">
          Top Rated Movies
        </div>
      }

      {action && data.length > 0 && data[0]?.poster_path  && !loading && (
        <section>
          <img src={`https://image.tmdb.org/t/p/w1280${data[0].backdrop_path}`} alt="" />
          <div className="info">
            <h2>{data[0].original_name}</h2>
            <p>{data[0].first_air_date}</p>
            <p>{data[0].overview}</p>
            <div className="rate">
              <i className="fa-solid fa-star"></i>
              <span>{data[0].vote_average.toFixed(1)}/10</span>
            </div>
            <div className="btns-info">
            <button>
              <i className="fa-solid fa-play"></i>
              <p>Play Now</p>
            </button>
            <button>
              <i className="fa-solid fa-circle-info"></i>
              <p>more info</p>
            </button>
            </div>
          </div>
        </section>
      )}

      <div className="movies">
        {data.map((e, index) => (
          <div key={index} className="card">
            <img src={e.poster_path ? `https://image.tmdb.org/t/p/w1280${e.poster_path}` : "https://ih1.redbubble.net/image.1861329650.2941/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"} alt="" />
            <h2>{e.original_name}</h2>
          </div>
        ))}
      </div>

      {page.length > 1 &&
        <div className="switchpg">
          <button onClick={() => pgclick(nbrpage + 1)} disabled={nbrpage >= page.length} className={nbrpage >= page.length ? 'disabl' : ""}>Next page</button>
          <p>{`Page ${nbrpage} of ${page.length}`}</p>
        </div>
      }

      <footer>
        <h4>
          <div className="right">© Movies<span style={{ color: 'antiquewhite' }}>SGH</span></div> ALL RIGHTS RESERVED
        </h4>
      </footer>
    </div>
  );
}
